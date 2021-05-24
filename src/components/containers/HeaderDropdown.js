import React, { useState, useEffect } from 'react';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CImg, } from '@coreui/react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, MenuItem, Select, FormControl } from '@material-ui/core';
import { displayText, stringManipulationCheck } from '../../constant';
import { gridWidth } from '../../gridconstants';
import * as actionCreator from '../../store/action/userAction';
import * as dataImportActionCreator from '../../store/action/dataImportAction';
import { apiRouter, sessionStorageKey } from '../../constant';
import userAvatar from '../../assets/images/avatar_img.png';
import { isEmptyNullUndefined, setSessionStorage, decryptData, deleteFile } from '../shared/helper';
import _ from 'lodash';
import ClientChangeModal from './clientChangeModal';
import { arrayConstants } from '../../arrayconstants';

const useStyles = makeStyles((theme) => ({
   header: {
      backgroundColor: '#00648d',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 50,
      fontSize: '1rem',
      padding: '1rem',
      fontWeight: '700'
   },
   footer: {
      display: 'flex',
      paddingRight: '3%',
      justifyContent: 'flex-end',
      marginTop: '0.5rem'
   },
   dropdownRoot: {
      display: 'flex',
      padding: '1.5%',
      width: '100%'
   },
   modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
   },
   root: {
      height: 'auto !important',
      width: '60%',
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      outline: 'none'
   },
   rootBody: {
      backgroundColor: theme.palette.background.paper,
      flexGrow: 1
   },
   formControl: {
      minWidth: '100%'
   }
}));
const HeaderDropdown = () => {
   const history = useHistory();
   const location = useLocation();
   const dispatch = useDispatch();
   const classes = useStyles();
   const [dataImportDialog, setDataImportDialog] = useState(false);
   const [clientsList, setClientsList] = useState([]);
   const [selectedClient, setSelectedClient] = useState(stringManipulationCheck.EMPTY_STRING);
   const [open, setOpen] = useState(false);
   const [selectedClientCache, setSelectedClientCache] = useState(stringManipulationCheck.EMPTY_STRING);
   const { userDetails } = useSelector((state) => state.user);
   const { selectedVendor, selectedOperationalArea, dataSaveCompleted, fileName } = useSelector((state) => state.dataImportManage);
   const [logout, setLogout] = useState(false);

   const handleLogout = async () => {
      if (dataImportScreenCheck()) {
         setDataImportDialog(true);
         setLogout(true);
         return;
      }
      await deleteFile(fileName);
      dispatch(dataImportActionCreator.SetFileName(stringManipulationCheck.EMPTY_STRING));
      triggerRevokeToken();
   };

   const dataImportScreenCheck = () => {
      return (location.pathname === apiRouter.DATA_IMPORT) &&
         ((isEmptyNullUndefined(selectedVendor) && selectedVendor !== displayText.DEFAULT_PARENTID) ||
            (isEmptyNullUndefined(selectedOperationalArea) && selectedOperationalArea !== displayText.DEFAULT_PARENTID))
   };

   const triggerRevokeToken = () => {
      const url = `${apiRouter.USERS}/${apiRouter.REVOKE_TOKEN}`;
      dispatch(actionCreator.RevokeToken(url));
   }

   const handleCloseStateDropDown = () => {
      setOpen(false);
      if (JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientName) {
         setSelectedClient(JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientName);
      }
   };

   const onContinueClick = async () => {
      if (logout) {
         setDataImportDialog(false);
         setLogout(false);
         await deleteFile(fileName);
         dispatch(dataImportActionCreator.SetFileName(stringManipulationCheck.EMPTY_STRING));
         return triggerRevokeToken();
      }
      setSelectedClient(selectedClientCache);
      setDataImportDialog(false);
      deleteFile(fileName);
      dispatch(dataImportActionCreator.SetFileName(stringManipulationCheck.EMPTY_STRING));
      dispatch(dataImportActionCreator.clearSelectedData());
      let selectedClientDetails = _.filter(clientsList, function (client) {
         return client.clientName === selectedClientCache
      });
      userPreferenceCall(selectedClientDetails, displayText.CONTINUE_CLICK);
   };

   const onDecline = () => {
      setDataImportDialog(false);
      setLogout(false);
   }

   const handleOpen = () => {
      setOpen(true);
   };


   const handleSelectClient = (selectedClientOption) => {
      if (!isEmptyNullUndefined(selectedClientOption)) { return; }
      const selectedClientDetails = _.filter(clientsList, function (client) {
         return client.clientName === selectedClientOption
      });
      if (!dataImportScreenCheck()) {
         setSelectedClient(selectedClientOption);
         userPreferenceCall(selectedClientDetails, displayText.SELECT_CLIENT);
         return;
      }
      if (location.pathname === apiRouter.DATA_IMPORT &&
         (selectedVendor || selectedOperationalArea) &&
         !dataSaveCompleted) {
         setDataImportDialog(true);
         setSelectedClientCache(selectedClientOption);
         return;
      }
      deleteFile(fileName);
      dispatch(dataImportActionCreator.SetFileName(stringManipulationCheck.EMPTY_STRING));
      dispatch(dataImportActionCreator.clearSelectedData());
      setSelectedClient(selectedClientOption);
      userPreferenceCall(selectedClientDetails, displayText.SELECT_CLIENT);
   };

   const userPreferenceCall = (selectedClientDetails, type) => {
      setSessionStorage(sessionStorageKey.SELECTED_CLIENT, selectedClientDetails[arrayConstants.initialOrder]?.clientName);
      setSessionStorage(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS, ...selectedClientDetails);
      const url = `${apiRouter.FEATURES}`;
      dispatch(actionCreator.SetUserClientDetails(...selectedClientDetails));
      dispatch(actionCreator.SelectedClientLoaderShow(true));
      dispatch(actionCreator.GetUserFeatures(url));
      if (type === displayText.CONTINUE_CLICK) {
         dispatch(dataImportActionCreator.updateSelectedVendor(null));
         dispatch(dataImportActionCreator.updateSelectedOperationalArea(null));
         dispatch(dataImportActionCreator.clearVendorAndOperationalArea(null));
         dispatch(dataImportActionCreator.clearQCDashboardData());
      }
      const usersGuid = JSON.parse(decryptData(sessionStorageKey.USER_DETAILS))?.usersGuid;
      const prefUrl = `${apiRouter.COMMON}/${apiRouter.COMMON_USER_PREFERENCE}?${displayText.USER_GUID}=${usersGuid}&${displayText.CLIENTSGUID}=${selectedClientDetails[arrayConstants.initialOrder]?.clientsGuid}`;
      dispatch(actionCreator.GetPreference(prefUrl));
      history.push(apiRouter.MY_PROFILE);
   }

   useEffect(() => {
      setClientsList([...JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)).clients]);
      setSelectedClient(JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientName);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [localStorage.USER_DETAILS]);

   return (
      <>
         <div className={classes.dropdownRoot}>
            <Grid item xs={gridWidth.MaxWidth}>
               <div >
                  <FormControl variant="outlined" className={classes.formControl}>
                     <Select
                        open={open}
                        onClose={() => handleCloseStateDropDown()}
                        onOpen={handleOpen}
                        value={selectedClient}
                        onChange={(e) => handleSelectClient(e.target.value)}
                     >
                        {clientsList?.map((client) => (
                           <MenuItem value={client?.clientName}>{client?.clientName}</MenuItem>
                        ))}
                     </Select>
                  </FormControl>
               </div>
            </Grid>
            <CDropdown inNav className="mx-3" direction="down">
               <CDropdownToggle className="c-header-nav-link" caret={false}>
                  <div className="c-avatar">
                     <CImg
                        src={userAvatar}
                        className="c-avatar-img"
                        alt="admin@bootstrapmaster.com"
                     />
                  </div>
               </CDropdownToggle>
               <CDropdownMenu className="pt-0" placement='bottom-end'>
                  <CDropdownItem header tag='div' color='light' className='text-center'>
                     <strong>{displayText.ACCOUNT}</strong>
                  </CDropdownItem>
                  <CDropdownItem >
                     <AccountCircleIcon />
                     <span className='mg-lt-10'>
                        {`${displayText.HI}, ${userDetails?.userName}`}
                     </span>
                  </CDropdownItem>
                  <CDropdownItem onClick={handleLogout}>
                     <ExitToAppIcon />
                     <span className='mg-lt-10'>{displayText.LOGOUT}</span>
                  </CDropdownItem>
               </CDropdownMenu>
            </CDropdown>
            <ClientChangeModal isDialogOpen={dataImportDialog} continueNavigation={onContinueClick} onDeclineNavigation={onDecline}></ClientChangeModal>
         </div >
      </>
   );
};

export default HeaderDropdown;
