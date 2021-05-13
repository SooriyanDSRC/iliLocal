import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
   CSidebar,
   CSidebarBrand,
   CSidebarNav,
   CSidebarMinimizer,
   CSidebarNavItem,
   CImg
} from '@coreui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ILILogo from '../../assets/images/ILI_Logo.png';
import LoadingOverlay from "react-loading-overlay";
import { apiRouter, sessionStorageKey, displayText, stringManipulationCheck, toPath, navIcon } from '../../constant';
import * as actionCreator from '../../store/action/userAction';
import _ from 'lodash';
import * as dataImportActionCreator from '../../store/action/dataImportAction';
import { isNullUndefined, decryptData, deleteFile, findFeaturesRole, isCookieValid } from '../shared/helper';
import ClientChangeModal from './clientChangeModal';
import NavigationMenu from './Nav';
import { updateSideBarVisibility } from '../../store/action/sideBarAction';

const Sidebar = () => {
   const dispatch = useDispatch();
   const [navFeatures, setNavFeatures] = useState([]);
   const history = useHistory();
   const location = useLocation();
   const [dataImportDialog, setDataImportDialog] = useState(false);
   const [navigateTo, setNavigateTo] = useState(null);
   const { userFeatures, isSelectedClientLoader, isLogoutLoading, featuresLoader, myProfileLoader } = useSelector((state) => state.user);
   const { selectedVendor, selectedOperationalArea, fileName, dataSaveCompleted } = useSelector((state) => state.dataImportManage);
   const { showSideBar } = useSelector((state) => state.sideBar);

   useEffect(() => {
      handleResize();
   }, [document.documentElement.clientWidth]);

   const handleResize = () => {
      if (document.documentElement.clientWidth > 743) {
         return dispatch(updateSideBarVisibility(true));
      }
      dispatch(updateSideBarVisibility(false));
   };

   useEffect(() => {
      if (isNullUndefined(userFeatures)) {
         let clientID = JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientsGuid
         let userManagementExist = _.find(userFeatures, (features) => { return features.name === displayText.USER_MANAGEMENT });
         let opsAreaExist = _.find(userFeatures, (features) => { return features.name === displayText.OPERATIONAL_AREA });
         let roleManagementExist = _.find(userFeatures, (features) => { return features.name === displayText.ROLE_MANAGEMENT });

         if (userManagementExist?.name === displayText.USER_MANAGEMENT) {
            let clientUserManagementURL = `${apiRouter.CLIENT_URL_ROLES}${clientID}${apiRouter.USER_MANAGEMENT_URL_FOR_ROLES}`;
            userManagementExist.to = clientUserManagementURL;
         }
         if (opsAreaExist?.name === displayText.OPERATIONAL_AREA) {
            let clientOpsAreaManagementURL = `${apiRouter.CLIENT_URL_ROLES}${clientID}${apiRouter.OPERATIONAL_AREA_URL_FOR_ROLES}`;
            opsAreaExist.to = clientOpsAreaManagementURL;
         }
         if (roleManagementExist?.name === displayText.ROLE_MANAGEMENT) {
            let roleManagementURL = `${apiRouter.CLIENT_URL_ROLES}${clientID}/${apiRouter.ROLE_URL}`;
            roleManagementExist.to = roleManagementURL;
         }
         _.forEach([...userFeatures], function (features, index) {
            let result = findFeaturesRole(NavigationMenu, features?.name);
            if (features?.to) {
               userFeatures[index][navIcon] = result?.icon;
               return;
            }
            userFeatures[index][toPath] = result?.to;
            userFeatures[index][navIcon] = result?.icon
         });
         setNavFeatures(userFeatures);
      }
      else {
         if (isCookieValid()) {
            const url = `${apiRouter.FEATURES}`;
            dispatch(actionCreator.GetUserFeatures(url));
         }
      }
      dispatch(actionCreator.SelectedClientLoaderShow(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [userFeatures]);

   const onContinueClick = () => {
      history.push(navigateTo);
      setDataImportDialog(false);
      dispatch(dataImportActionCreator.clearSelectedData());
      deleteFile(fileName);
      dispatch(dataImportActionCreator.SetFileName(stringManipulationCheck.EMPTY_STRING));
   };

   const onDeclineNavigation = () => {
      setDataImportDialog(false);
   }

   const onNavItemClick = (e, to) => {
      e.preventDefault();
      dispatch(updateSideBarVisibility(false));
      if (location.pathname === apiRouter.DATA_IMPORT && to !== apiRouter.DATA_IMPORT && (selectedVendor || selectedOperationalArea) && !dataSaveCompleted) {
         setDataImportDialog(true);
         setNavigateTo(to);
         return;
      }
      deleteFile(fileName);
      dispatch(dataImportActionCreator.SetFileName(stringManipulationCheck.EMPTY_STRING));
      history.push(to);
   }

   const setSideBar = () => {

   };

   return (
      <>
         <CSidebar className="d-sm-block-none"
         // minimize={true}
         // show={true}
         // show={showSideBar} onShowChange={setSideBar}
         >
            <CSidebarBrand className="d-md-block" to="/">
               <CImg src={ILILogo} className="sidemenuheader" alt={displayText.CENOZON_LOGO} />
            </CSidebarBrand>
            <CSidebarNav>
               <LoadingOverlay className={"loaderLayout"} active={isLogoutLoading} spinner text={displayText.LOGOUT_LOADER}></LoadingOverlay>
               <LoadingOverlay active={isSelectedClientLoader && featuresLoader} spinner text={displayText.CLIENT_SWITCHING}></LoadingOverlay>
               <LoadingOverlay active={!isSelectedClientLoader && featuresLoader} spinner text={displayText.LOADING_MENU}></LoadingOverlay>
               <LoadingOverlay active={!featuresLoader && myProfileLoader} spinner text={displayText.LOADING_PROFILE}></LoadingOverlay>
               {navFeatures?.map((menuItem, index) => (
                  <CSidebarNavItem
                     to={menuItem.to}
                     key={index}
                     name={menuItem.name}
                     icon={menuItem.icon}
                     onClick={(e) => onNavItemClick(e, menuItem.to)} />
               ))}
            </CSidebarNav>
            <CSidebarMinimizer breakpoint='md' />
         </CSidebar>

         <ClientChangeModal
            isDialogOpen={dataImportDialog}
            continueNavigation={onContinueClick}
            onDeclineNavigation={onDeclineNavigation}>
         </ClientChangeModal>
      </>
   );
};

export default React.memo(Sidebar);