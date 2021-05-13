import React, { useState, useEffect } from "react";
import {
   Typography, Grid, Button, Dialog, DialogTitle, DialogActions, DialogContentText,
   DialogContent, AppBar, Toolbar, IconButton, InputBase, CircularProgress,
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import _ from "lodash";
import { displayText, apiRouter, indeterminateLabel, isActiveLabel, stringManipulationCheck } from "../../../constant";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreator from "../../../store/action/roleManageAction";
import FeaturesWorkflowTreeView from "../featuresworkflow";
import { makeStyles } from "@material-ui/core/styles";
import serviceCall from "../../../store/serviceCall";
import { initialDataCount, gridWidth } from "../../../gridconstants";
import { removeMultipleSpace, findFeatures } from '../../../components/shared/helper'
import CommonStyles from "../../../scss/commonStyles";

const useStyles = makeStyles((theme) => ({
   root: {
      width: "100%",
      marginBottom: "2%"
   },
   featuresButton: {
      marginRight: theme.spacing(2)
   },
   title: {
      flexGrow: 1
   },
   submit: {
      margin: theme.spacing(3, 0, 2),
      background: "#036290",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#1d79ac",
         color: "#ffffff"
      },
      float: "right"
   },
   searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
   },
   inputRoot: {
      color: "inherit"
   },
   input: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
         width: "20ch"
      }
   },
   loaderStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%"
   },
   saveWorkflowButton: {
      background: "#d96c2c",
      borderRadius: 8,
      color: "#ffffff",
      float: "right",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#1d79ac",
         color: "#ffffff",
      }
   },
   floatRight: {
      float: "right"
   },
   submitOk: {
      margin: theme.spacing(3, 0, 2),
      background: "#00648d",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   },
   dialogTitle: {
      background: "#00648d",
      color: "#ffffff"
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
   },
}));

export default function FeaturesWorkflowViewer(props) {
   const classes = useStyles();
   const commonClasses = CommonStyles();
   const dispatch = useDispatch();
   const [roleName, setRoleName] = useState(props.selectedRoleName);
   const [role, setRole] = useState(null);
   const { rolesLoader } = useSelector((state) => state.roleManage);
   const [dialogOpen, setDialogOpen] = useState(false);
   const [isRoleEditable, setIsRoleEditable] = useState(false);

   useEffect(() => {
      setRole(props.role);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props.role]);

   async function handleSave() {
      let isRoleExists = await checkRoleNameExist();
      let isAllowedToSave = true;
      if (isRoleExists?.data) {
         isAllowedToSave = false;
         setDialogOpen(true);
      }
      if (props.action === displayText.EDIT && isAllowedToSave) {
         const url = `${apiRouter.ROLE}/${apiRouter.ROLE_UPDATE}?${apiRouter.CLIENT_GUID}=${props?.clientId}`;
         let saveRole = {
            rolesGuid: props.rolesGuid ? props.rolesGuid : stringManipulationCheck.EMPTY_STRING,
            roleName: roleName,
            operations: role ? role : [],
         };
         await createRoleFeatures(url, saveRole);
      } else if (isAllowedToSave) {
         const url = `${apiRouter.ROLE}/${apiRouter.ADD_ROLE}?${apiRouter.CLIENT_GUID}=${props?.clientId
            }`;
         let saveRole = {
            roleName: roleName,
            operations: role ? role : [],
         };
         await createRoleFeatures(url, saveRole);
      }
   }

   async function createRoleFeatures(url, roleDetail) {
      serviceCall.postData(url, roleDetail).then((result) => {
         dispatch(actionCreator.DispatchRole(result));
         props.handleBackFeatures(false);
      });
   }

   async function checkRoleNameExist() {
      let roleGuid = (props.action === displayText.ADD) ? displayText.DEFAULT_PARENTID : props?.rolesGuid;
      return serviceCall.getAllData(`${apiRouter.ROLE}/${apiRouter.CHECK_ROLE_NAME_EXISTS}/${roleName}/${roleGuid}/${props?.clientId}`);
   }

   const handleFeaturesCheck = (e, content, index, parent, parentIndex) => {
      let copyFeatures = Object.assign([], role); // copy without reference
      const wfIndex = copyFeatures.findIndex((operations) => {
         return operations?.featuresGuid === content?.featuresGuid;
      });
      if (copyFeatures[wfIndex]) {
         copyFeatures[wfIndex][isActiveLabel] = !content.isActive;
         copyFeatures[wfIndex][indeterminateLabel] = false;
      }
      checkFeaturesForSubFeatures(e, content, index, copyFeatures, parent, parentIndex);
   };

   const setFeatures = (copyFeatures, parentIndex) => {
      let operationsLength = copyFeatures[parentIndex].operations.length;
      let count = 0;
      let checkedCount = 0;
      if (operationsLength > initialDataCount) {
         copyFeatures[parentIndex].operations.forEach((operations) => {
            if (!operations.isActive) {
               count++;
            } else checkedCount++;
         });
         if (count > initialDataCount && count !== operationsLength) {
            copyFeatures[parentIndex][indeterminateLabel] = true;
            copyFeatures[parentIndex][isActiveLabel] = true;
         }
         else if (checkedCount === operationsLength) {
            copyFeatures[parentIndex][isActiveLabel] = true;
            copyFeatures[parentIndex][indeterminateLabel] = false;
         } else if (count === operationsLength) {
            copyFeatures[parentIndex][isActiveLabel] = false;
            copyFeatures[parentIndex][indeterminateLabel] = false;
         }
      }
   }

   function checkFeaturesForSubFeatures(e, content, index, copyFeatures, parent, parentIndex) {
      if (index >= 0) {
         if (copyFeatures[parentIndex]) {
            copyFeatures[parentIndex].operations[index].isActive = !content.isActive;
         }
         setFeatures(copyFeatures, parentIndex);
      } else {
         const wfIndex = copyFeatures.findIndex((features) => {
            return features?.featuresGuid === content.featuresGuid;
         });
         if (copyFeatures[wfIndex].operations && copyFeatures[wfIndex].operations.length > initialDataCount) {
            copyFeatures[wfIndex].operations.map((features) => {
               return (features.isActive = content.isActive);
            });
         }
      }
      setRole(copyFeatures);
   }

   const handleRoleNameChange = (event) => {
      if (props?.IsRoleNameEdit) {
         let roleName = removeMultipleSpace(event.target.value);
         return setRoleName(roleName);
      }
      setRoleName(roleName);
   }

   useEffect(() => {
      if (findFeatures(props?.userRoles?.operations, displayText.EDIT_ROLE)) {
         setIsRoleEditable(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props?.userRoles])

   return (
      <div className={classes.root}>
         <div className={classes.title}>
            <Grid item xs={gridWidth.MaxWidth} className={classes.floatRight}></Grid>
            <AppBar position="static" className={"appBar-color"}>
               <Toolbar>
                  <IconButton
                     edge="start"
                     className={classes.featuresButton}
                     color="inherit"
                     aria-label="go back"
                     onClick={(e) => props.handleBackFeatures(true)}>
                     <ArrowBackIosIcon className={"clr-white"} />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                     {props.action} Role
            </Typography>

                  <div className={classes.search} >
                     <InputBase
                        placeholder={displayText.ENTER_ROLENAME}
                        classes={{
                           root: classes.inputRoot,
                           input: classes.input,
                        }}
                        inputProps={{ "aria-label": "role name" }}
                        value={roleName}
                        onChange={(e) => handleRoleNameChange(e)}
                     />
                  </div>
                  <Button
                     variant="contained"
                     className={classes.saveWorkflowButton}
                     disabled={roleName.trim().length === 0 || (!isRoleEditable && props.action === displayText.EDIT)}
                     onClick={(e) => {
                        handleSave();
                     }}>
                     {displayText.SAVE}
                  </Button>
               </Toolbar>
            </AppBar>
         </div>
         {rolesLoader && <CircularProgress className={commonClasses.spinnerStyle} />}
         {_.isNull(role) ? (stringManipulationCheck.EMPTY_STRING) : (
            <FeaturesWorkflowTreeView
               content={role}
               handleFeaturesCheck={handleFeaturesCheck}
               roleName={roleName}
               userRoles={props?.userRoles}
            />
         )}
         <Dialog
            open={dialogOpen}
            keepMounted
            onClose={(e) => setDialogOpen(false)}
            maxWidth="lg"
         >
            <DialogTitle className={classes.dialogTitle}>
               {displayText.ALERT}
            </DialogTitle>
            <DialogContent>
               <DialogContentText>
                  {displayText.ROLE_ALREADY_EXIST}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  fullWidth
                  variant="contained"
                  className={classes.close_btn}
                  onClick={(e) => setDialogOpen(false)}>
                  {displayText.CLOSE}
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
