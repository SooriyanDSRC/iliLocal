import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import FeaturesWorkflowViewer from "./featuresworkflowviewer";
import RoleList from "./rolelist";
import { Grid, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as actionCreator from "../../store/action/roleManageAction";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { displayText, sessionStorageKey, apiRouter, stringManipulationCheck, indeterminateLabel } from "../../constant";
import { roleManagementGrid, initialDataCount, gridWidth } from "../../gridconstants";
import { arrayConstants } from "../../arrayconstants";
import serviceCall from "../../store/serviceCall";
import { isUndefined, isNullUndefined, setSessionStorage, findFeatures, findFeaturesRole, isNotNull, decryptData, removeDoubleQuotes } from "../../components/shared/helper";

const useStyles = makeStyles((theme) => ({
   addWorkflowStyle: {
      margin: "42px 10px 16px;",
      background: "#036290",
      borderRadius: 8,
      color: "#ffffff",
      float: "right",
      width: "21%",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#1d79ac",
         color: "#ffffff"
      }
   },
   spinnerStyle: {
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
      margin: "auto"
   },
   switch: {
      float: "right",
      marginTop: "1%"
   },
   clientNameStyle: {
      marginTop: "28px",
      textAlign: "left"
   },
   gridPadding: {
      padding: '0px 12px !important'
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
   },
   buttonStyle: {
      background: "#036290",
      borderRadius: 8,
      color: "#ffffff",
      width: "100%",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#1d79ac",
         color: "#ffffff"
      }
   }
}));

export default function RoleManage() {
   const classes = useStyles();
   const history = useHistory();
   const dispatch = useDispatch();
   const [rolesGuid, setRolesGuid] = useState(stringManipulationCheck.EMPTY_STRING);
   const [modifyFeatures, SetModifyFeatures] = useState(false);
   const [selectedRoleName, setSelectedRoleName] = useState(stringManipulationCheck.EMPTY_STRING);
   const [action, setAction] = useState();
   const [featuresDetails, setFeaturesDetails] = useState();
   const [updatedRoles, setUpdatedRoles] = useState([]);
   const { clientId } = useParams();
   const [isEdited, setIsEdited] = useState(false);
   const [isAdded, setIsAdded] = useState(false);
   const [isRoleNameEdit, setIsRoleNameEdit] = useState(false);
   const [clientName, setClientName] = useState(decryptData(sessionStorageKey.SELECTED_CLIENT) ? removeDoubleQuotes(decryptData(sessionStorageKey.SELECTED_CLIENT)) : null);
   const clientDetails = JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS));
   const [userRoles, setUserRoles] = useState(stringManipulationCheck.EMPTY_STRING);
   const { roleDetails, featuresDetail, selectedRoleFeatures, isRoleDeleted, } = useSelector((state) => state.roleManage);
   const { userFeatures } = useSelector((state) => state.user);

   useEffect(() => {
      setSelectedRoleName(stringManipulationCheck.EMPTY_STRING);
      RoleCall();
      GetUserRoles();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (userFeatures) {
         if (!isUndefined(_.find(userFeatures, { name: displayText.ROLE_MANAGEMENT })) && !isUndefined(_.find(userFeatures, function (userOperations) {
            return _.find(userOperations.features, { name: displayText.ROLE_MANAGEMENT });
         }))) {
            history.push('/my-profile');
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [userFeatures]);

   const getRoles = async () => {
      const url = `${apiRouter.ROLE}/${apiRouter.GET_ROLE_FEATURES}/${clientId ?? clientDetails.clientsGuid}`;
      return await serviceCall.getAllData(url);
   };

   const GetUserRoles = () => {
      var user_Roles = stringManipulationCheck.EMPTY_STRING;
      // Route via client management
      var Roles = findFeaturesRole(JSON.parse(decryptData(sessionStorageKey.USER_ROLES)), displayText.CLIENT_MANAGEMENT);
      if (isNullUndefined(Roles)) {
         user_Roles = findFeaturesRole(Roles?.features, displayText.ROLE_MANAGEMENT);
      }
      // Route via sidenav bar
      else {
         if (isNullUndefined(userFeatures)) {
            setSessionStorage(sessionStorageKey.SELECTED_CLIENT, JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientName);
            setClientName(removeDoubleQuotes(decryptData(sessionStorageKey.SELECTED_CLIENT)));
            user_Roles = findFeaturesRole(userFeatures, displayText.ROLE_MANAGEMENT);
         }
      }
      setUserRoles(user_Roles);
   };

   const renderGrid = (modifyFeatures) => {
      return !modifyFeatures && findFeatures(userRoles?.operations, displayText.ADD_ROLE) ? (
         <Grid item xl={gridWidth.DefaultMinWidth}
            lg={gridWidth.DefaultMinWidth}
            md={gridWidth.DefaultMinWidth}
            sm={gridWidth.DefaultMinWidth}
            xs={gridWidth.DefaultWidth}>
            <Button
               variant="contained"
               className={classes.buttonStyle}
               onClick={(e) => {
                  handleAddRole(true);
               }}>
               {displayText.ADD_ROLE}
            </Button>
         </Grid>
      ) : (stringManipulationCheck.EMPTY_STRING)
   }

   useEffect(() => {
      if (isNotNull(roleDetails) || isRoleDeleted) {
         (async () => {
            var result = await getRoles();
            setUpdatedRoles(result?.data);
         })();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [roleDetails, isRoleDeleted]);

   useEffect(() => {
      if (selectedRoleFeatures && isEdited) {
         setRolesGuid(selectedRoleFeatures.rolesGuid);
         setSelectedRoleName(selectedRoleFeatures.roleName);
         selectedRoleFeatures.operations.forEach((operations) => {
            let operationsLength = operations.operations.length;
            var count = 0;
            if (operationsLength > initialDataCount) {
               operations.operations.find((item) => {
                  if (!item.isActive) {
                     count++;
                  }
                  return null;
               });
            }
            if (count > arrayConstants.nonEmptyArray && count !== operationsLength) {
               operations[indeterminateLabel] = true;
            }
         });
         setFeaturesDetails(selectedRoleFeatures.operations);
         SetModifyFeatures(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedRoleFeatures]);

   useEffect(() => {
      if (featuresDetail?.length > arrayConstants.nonEmptyArray && isAdded) {
         SetModifyFeatures(true);
         setFeaturesDetails(featuresDetail);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [featuresDetail]);

   async function fetchFeaturesList(role) {
      if (isNotNull(role) && role && role.operations) {
         setFeaturesDetails(role.operations);
         setSelectedRoleName(role.roleName);
         setRolesGuid(role.rolesGuid);
         return;
      }
      const url = `${apiRouter.FEATURES}/${apiRouter.GET_ALL_FEATURES}`;
      dispatch(actionCreator.FetchFeatures(url));
   }

   const handleDeleteRole = (role) => {
      const url = `${apiRouter.ROLE}/${apiRouter.DELETE_ROLE}/${role?.rolesGuid}/${clientId ?? clientDetails.clientsGuid}`;
      dispatch(actionCreator.DeleteRole(url));
   };

   const handleAddRole = (flag) => {
      setAction(displayText.ADD);
      setSelectedRoleName(stringManipulationCheck.EMPTY_STRING);
      fetchFeaturesList(null);
      setFeaturesDetails(featuresDetail);
      setIsAdded(true);
      SetModifyFeatures(flag);
      setIsRoleNameEdit(true);
   };

   const handleBackFeatures = (isActive) => {
      setSelectedRoleName(stringManipulationCheck.EMPTY_STRING);
      SetModifyFeatures(false);
      RoleCall();
      setFeaturesDetails([]);
   };

   const renderFeaturesWorkFlowView = (modifyFeatures) => {
      return modifyFeatures ? (
         <FeaturesWorkflowViewer
            role={featuresDetails}
            rolesGuid={rolesGuid}
            handleBackFeatures={handleBackFeatures}
            selectedRoleName={selectedRoleName}
            action={action}
            IsRoleNameEdit={isRoleNameEdit}
            clientId={clientId ?? clientDetails.clientsGuid}
            roleList={updatedRoles}
            userRoles={userRoles} />
      ) : (
         <RoleList
            handleEditRole={handleEditRole}
            roleList={updatedRoles}
            handleDeleteRole={handleDeleteRole}
            userRoles={userRoles} />
      )
   }

   async function FetchRoleDetail(role) {
      const url = `${apiRouter.ROLE}/${apiRouter.GET_ROLE_BY_ID}/${role.rolesGuid}/${clientId ?? clientDetails.clientsGuid}`;
      dispatch(actionCreator.FetchRoleById(url));
   }

   async function handleEditRole(role) {
      setAction(displayText.EDIT);
      setIsEdited(true);
      setIsRoleNameEdit(role?.isEdit)
      await FetchRoleDetail(role);
   }

   const RoleCall = () => {
      const url = `${apiRouter.ROLE}/${apiRouter.GET_ROLE_FEATURES}/${clientId ?? clientDetails.clientsGuid}`;
      dispatch(actionCreator.FetchRole(url));
   };

   return (
      <div>
         <Grid item md={gridWidth.MaxWidth} className={"psn-relative"} >
            <Grid
               container
               spacing={roleManagementGrid.DefaultSpacing}
               direction="row"
               justify="space-between"
               alignItems="center">
               <Grid item xl={gridWidth.MaxWidth} lg={gridWidth.MaxWidth} md={gridWidth.MaxWidth} sm={gridWidth.MaxWidth} xs={gridWidth.MaxWidth} />
               <Grid className={classes.gridPadding} item xl={gridWidth.DefaultWidth}
                  lg={gridWidth.DefaultWidth}
                  md={gridWidth.CustomWidth}
                  sm={gridWidth.CustomWidth}>
                  <Typography variant='h5' className={classes.clientNameStyle} gutterBottom >
                     {clientName}
                  </Typography>
               </Grid>
               {renderGrid(modifyFeatures)}
            </Grid>
         </Grid>
         {renderFeaturesWorkFlowView(modifyFeatures)}
      </div>
   );
}
