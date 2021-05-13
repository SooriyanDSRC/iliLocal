import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import FolderOpen from '../../assets/images/FolderOpen.png'
import FolderClose from '../../assets/images/FolderClose.png'
import { Collapse, FormControlLabel, CircularProgress } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as actionCreator from '../../store/action/operationalAreaAction';
import { apiRouter, displayText, sessionStorageKey, stringManipulationCheck } from '../../constant';
import { gridWidth } from '../../gridconstants';
import { arrayConstants } from "../../arrayconstants";
import AddModal from '../../screens/operationalarea/addoperationalareamodel';
import { Grid, Typography, AppBar, Toolbar, Button, Paper } from '@material-ui/core';
import { DialogContentText, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { isNotNull, isNullUndefined, findFeatures, findFeaturesRole, setSessionStorage, decryptData, removeDoubleQuotes } from '../../components/shared/helper';

function MinusSquare(props) {
   return (
      <SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
         {/* tslint:disable-next-line: max-line-length */}
         <path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z' />
      </SvgIcon>
   );
}

function PlusSquare(props) {
   return (
      <SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
         {/* tslint:disable-next-line: max-line-length */}
         <path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z' />
      </SvgIcon>
   );
}

function TransitionComponent(props) {
   return (
      <Collapse {...props} />
   );
}

TransitionComponent.propTypes = {
   in: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
   cardHeader: {
      backgroundColor: ' #036290',
      color: '#ffffff'
   },
   dialogtitle: {
      background: '#00648d',
      color: '#ffffff',
   },
   savebtn: {
      margin: theme.spacing(3, 0, 2),
      background: '#036290',
      borderRadius: 8,
      height: '40px',
      width: 'fit-content',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      textTransform: 'none',
      '&:hover': {
         backgroundColor: '#1d79ac',
         color: '#ffffff',
      },
   },
   title: {
      flexGrow: 1,
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
   },
   imagePadding: {
      padding: '7px'
   },
   labelStyle: {
      marginBottom: '-5px !important',
      marginLeft: '0px !important'
   },
   editIconSize: {
      padding: '6px !important',
      fontSize: '20px !important'
   },
   btn_align: {
      width: 'fit-content !important',
      float: 'right !important'
   },
   spinnerStyle: {
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      margin: 'auto',
   },
   gridPadding: {
      padding: '0px 12px !important'
   },
   tableHeader: {
      marginTop: '20px',
      backgroundColor: ' #036290',
      color: '#ffffff'
   },
   submitOk: {
      margin: theme.spacing(3, 0, 2),
      background: '#036290',
      borderRadius: 8,
      color: '#ffffff',
      textTransform: 'none',
      '&:hover': {
         backgroundColor: '#1d79ac',
         color: '#ffffff',
      },
   },
   submitNo: {
      margin: theme.spacing(3, 0, 2),
      background: '#ffffff',
      borderRadius: 8,
      color: '#808080',
      textTransform: 'none',
      '&:hover': {
         backgroundColor: '#fffff',
         color: '#000000',
      },
   },
   clientNameStyle: {
      marginTop: '0px',
      textAlign: 'left',
      marginBottom: '0.5em !important;'
   }
}));


export default function OperationalAreaTreeView() {
   const classes = useStyles();
   const dispatch = useDispatch();
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const { operationalAreaDetails, opsAreaLoader, isOperationalAreaAdded,
      isOperationalAreaEdited, isOperationalAreaDeleted } = useSelector((state) => state.opsAreaManage);
   const { userFeatures } = useSelector((user) => user.user);
   const [expanded, setExpanded] = useState([]);
   const [isOpen, setIsOpen] = useState(false);
   const [action, setAction] = useState(stringManipulationCheck.EMPTY_STRING);
   const [editValue, setEditValue] = useState(stringManipulationCheck.EMPTY_STRING);
   const { clientId } = useParams();
   const [renderTreeData, setRenderTreeData] = useState({});
   const [selectedNode, setSelectedNode] = useState(null);
   const [showAddButton, setShowAddButton] = useState(false);
   const [operationalAreaRoles, setOperationalAreaRoles] = useState(null);
   const [clientName, setClientName] = useState(decryptData(sessionStorageKey.SELECTED_CLIENT) ? removeDoubleQuotes(decryptData(sessionStorageKey.SELECTED_CLIENT)) : null);
   let editedOperationalArea = null;
   let newOperationalArea = null;
   let getNodeIds = [];

   const handleAddOperationalArea = () => {
      setSelectedNode(null);
      dispatch(actionCreator.DialogAction(displayText.ADD));
      setIsOpen(true);
      setAction(displayText.ADD);
   }
   const handleEditOperationalArea = () => {
      dispatch(actionCreator.DialogAction(displayText.EDIT));
      getTreeValue(renderTreeData);
      setIsOpen(true);
      setAction(displayText.EDIT);
   }
   const handleDeleteOperationalArea = () => {
      setDeleteDialogOpen(true);
   }
   const handleCloseDialog = () => {
      setIsOpen(false);
      setAction(stringManipulationCheck.EMPTY_STRING);
   };

   const getOperationalArea = () => {
      const url = `${apiRouter.GET_OPERATIONAL_AREA}?${displayText.CLIENTSGUID}=${clientId}`;
      dispatch(actionCreator.GetOperationalArea(url));
   }


   const onNodeToggle = (event, nodes) => {
      setExpanded(nodes);
   };
   const onNodeSelect = (event, nodes) => {
      setSelectedNode(nodes);
   };

   const getAddValue = (newOpsArea) => {
      newOperationalArea = newOpsArea;
      const url = `${apiRouter.GET_OPERATIONAL_AREA}`;
      let data = {
         clientOperationalAreaGuid: displayText.DEFAULT_PARENTID,
         name: newOperationalArea,
         clientsGuid: clientId,
         parentClientOperationalAreaGuid: isNotNull(selectedNode) ? selectedNode : displayText.DEFAULT_PARENTID,
         childOperationalArea: [null]
      }
      dispatch(actionCreator.SaveOperationalArea(url, data));
   }

   const deleteOperationalArea = () => {
      getDeleteTreeValue(renderTreeData);
      setDeleteDialogOpen(false);
      const url = `${apiRouter.GET_OPERATIONAL_AREA}?${apiRouter.OPERATIONAL_AREA_GUID}=${selectedNode}`;
      dispatch(actionCreator.DeleteOperationalArea(url));
   }

   const getEditValue = (editedOpsArea) => {
      editedOperationalArea = editedOpsArea;
      getEditedTreeValue(renderTreeData);
      const url = `${apiRouter.GET_OPERATIONAL_AREA}`;
      let data = {
         clientOperationalAreaGuid: isNotNull(selectedNode) ? selectedNode : displayText.DEFAULT_PARENTID,
         name: editedOperationalArea,
         clientsGuid: clientId
      }
      dispatch(actionCreator.UpdateOperationalArea(url, data));
   }
   const getTreeValue = (node) => {
      if (node?.clientOperationalAreaGuid === selectedNode) {
         let result = node?.name;
         setEditValue(result);
         return
      }
      return Array.isArray(node.childOperationalArea)
         ? node.childOperationalArea.map((nodeItem) => getTreeValue(nodeItem))
         : null
   }

   const getAllNodeIds = (node) => {
      if (isNotNull(node?.clientOperationalAreaGuid) && node?.childOperationalArea?.length > arrayConstants.nonEmptyArray) {
         getNodeIds.push(node?.clientOperationalAreaGuid)
      }

      return Array.isArray(node?.childOperationalArea)
         ? node?.childOperationalArea.map((nodeItem) => getAllNodeIds(nodeItem))
         : null
   }

   const getEditedTreeValue = (node) => {
      if (node.clientOperationalAreaGuid === selectedNode) {
         node.name = isNotNull(editedOperationalArea) ? editedOperationalArea : stringManipulationCheck.EMPTY_STRING;
      }
      return Array.isArray(node.childOperationalArea)
         ? node.childOperationalArea.map((nodeItem) => getEditedTreeValue(nodeItem))
         : null
   }

   const getDeleteTreeValue = (node) => {
      _.remove(node.childOperationalArea, function (value) {
         if (value.clientOperationalAreaGuid === selectedNode) {
            // change tree icon while delete child node
            setExpanded(expanded.slice(1));
         }
         return value.clientOperationalAreaGuid === selectedNode;
      });
      return Array.isArray(node.childOperationalArea)
         ? node.childOperationalArea.map((nodeItem) => getDeleteTreeValue(nodeItem))
         : null
   }

   const GetOperationalAreaRoles = () => {
      let OperationalArea_Roles = stringManipulationCheck.EMPTY_STRING;
      // Route via client management
      let Roles = findFeaturesRole(JSON.parse(decryptData(sessionStorageKey.USER_ROLES)), displayText.CLIENT_MANAGEMENT);
      if (isNullUndefined(Roles)) {
         OperationalArea_Roles = findFeaturesRole(Roles?.features, displayText.OPERATIONAL_AREA);
      }
      // Route via sidenav bar
      else if (isNullUndefined(userFeatures)) {
         setSessionStorage(sessionStorageKey.SELECTED_CLIENT, JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientName);
         setClientName(removeDoubleQuotes(decryptData(sessionStorageKey.SELECTED_CLIENT)));
         OperationalArea_Roles = findFeaturesRole(userFeatures, displayText.OPERATIONAL_AREA);
      }
      setOperationalAreaRoles(OperationalArea_Roles);
   };

   useEffect(() => {
      dispatch(actionCreator.GetOperationalAreaReload());
      getOperationalArea();
      GetOperationalAreaRoles();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (isNotNull(operationalAreaDetails) && operationalAreaDetails?.length > arrayConstants.nonEmptyArray) {
         setShowAddButton(false);
         setRenderTreeData(_.cloneDeep(operationalAreaDetails[0]));
         getAllNodeIds(_.cloneDeep(operationalAreaDetails[0]));
         setExpanded(getNodeIds);
         return;
      }
      if (isNotNull(operationalAreaDetails)) {
         setShowAddButton(true);
      }
      setRenderTreeData(null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [operationalAreaDetails]);

   useEffect(() => {
      if (isOperationalAreaAdded || isOperationalAreaEdited || isOperationalAreaDeleted) {
         getOperationalArea();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isOperationalAreaAdded, isOperationalAreaEdited, isOperationalAreaDeleted]);

   const renderTreeView = () => {
      return (
         <div className={'MuiTreeView_root'}>
            {(isNotNull(operationalAreaDetails) && operationalAreaDetails?.length > arrayConstants.nonEmptyArray)
               ? (
                  <TreeView
                     aria-label="rich object"
                     className={classes.root}
                     defaultExpandIcon={<PlusSquare />}
                     defaultCollapseIcon={<MinusSquare />}
                     defaultEndIcon
                     expanded={expanded}
                     onNodeSelect={(e, nodes) => onNodeSelect(e, nodes)}
                     onNodeToggle={(e, nodes) => onNodeToggle(e, nodes)}>
                     {renderTree(renderTreeData)}
                  </TreeView>) :
               (<Paper className={classes.paper}>
                  {displayText.NO_DATA_FOUND}
               </Paper>
               )}
         </div>
      )
   }
   const renderTree = (nodes) => (
      <TreeItem key={nodes?.clientOperationalAreaGuid}
         nodeId={nodes?.clientOperationalAreaGuid}
         label={
            <FormControlLabel
               key={nodes?.clientOperationalAreaGuid}
               control={
                  _.includes(expanded, nodes?.clientOperationalAreaGuid) ?
                     <img
                        className={classes.imagePadding}
                        src={FolderClose} alt="folderClose" /> :
                     <img
                        className={classes.imagePadding}
                        src={FolderOpen} alt="FolderOpen" />
               }
               label={
                  (selectedNode === nodes?.clientOperationalAreaGuid) ?
                     <FormControlLabel
                        className={classes.labelStyle}
                        key={nodes?.clientOperationalAreaGuid}
                        control={<> </>}
                        label={
                           <>
                              <span > {nodes?.name}</span>
                              {findFeatures(operationalAreaRoles?.operations, displayText.ADD_OPERATIONALAREA_ROLE) ?
                                 <span className={'ml_7 pointer'}>
                                    <AddIcon className={classes.editIconSize} onClick={() => handleAddOperationalArea()} />
                                 </span > : (stringManipulationCheck.EMPTY_STRING)
                              }
                              {findFeatures(operationalAreaRoles?.operations, displayText.EDIT_OPERATIONALAREA_ROLE) ?
                                 <span className={'ml_7 pointer'}>
                                    <EditIcon className={classes.editIconSize} onClick={() => handleEditOperationalArea()} />
                                 </span >
                                 : (stringManipulationCheck.EMPTY_STRING)}
                              {findFeatures(operationalAreaRoles?.operations, displayText.DELETE_OPERATIONALAREA_ROLE) ?
                                 <span className={'ml_7 pointer'} >
                                    <DeleteIcon className={classes.editIconSize} onClick={() => handleDeleteOperationalArea()} />
                                 </span>
                                 : (stringManipulationCheck.EMPTY_STRING)}
                           </>
                        }
                     /> : nodes?.name
               }
            />
         }>
         {Array.isArray(nodes?.childOperationalArea)
            ? nodes?.childOperationalArea.map((node) => renderTree(node))
            : null}
      </TreeItem>
   );
   return (
      <>
         <Grid className={classes.gridPadding} item xl={gridWidth.DefaultWidth} lg={gridWidth.DefaultWidth} md={gridWidth.CustomWidth} sm={gridWidth.CustomWidth} >
            <Typography variant='h5' className={classes.clientNameStyle} gutterBottom >
               {clientName}
            </Typography>
         </Grid>

         {showAddButton && findFeatures(operationalAreaRoles?.operations, displayText.ADD_OPERATIONALAREA_ROLE) ?
            <Grid xl={gridWidth.MaxWidth} lg={gridWidth.MaxWidth} md={gridWidth.MaxWidth} sm={gridWidth.MaxWidth} className={classes.btn_align}>
               <Button variant='contained' className={classes.savebtn}
                  onClick={(e) => handleAddOperationalArea()}
               > {`${displayText.ADD} ${displayText.OPERATIONAL_AREA}`}</Button>
            </Grid> : <></>
         }

         <AppBar position='static' className={classes.dialogtitle} >
            <Toolbar>
               <Typography variant='h5' className={classes.title}>
                  {displayText.OPERATIONAL_AREA}
               </Typography>
            </Toolbar>
         </AppBar>
         {opsAreaLoader && <CircularProgress className={classes.spinnerStyle} />}
         {_.isNull(renderTreeData?.length > arrayConstants.nonEmptyArray) ? (stringManipulationCheck.EMPTY_STRING)
            : (renderTreeView())}
         <Dialog open={deleteDialogOpen} keepMounted maxWidth='lg'>
            <DialogTitle className={classes.dialogtitle}>
               {displayText.CONFIRMATION_TEXT}
            </DialogTitle>
            <DialogContent>
               <DialogContentText>
                  {displayText.DELETE_OPERATIONAL_AREA_CONFIRMATION_MESSAGE}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  fullWidth
                  variant='contained'
                  className={classes.submitOk}
                  onClick={(e) => deleteOperationalArea()}>
                  {displayText.YES}
               </Button>
               <Button fullWidth variant='contained' className={classes.submitNo}
                  onClick={() => setDeleteDialogOpen(false)}>
                  {displayText.NO}
               </Button>
            </DialogActions>
         </Dialog>
         <AddModal
            open={isOpen}
            action={action}
            editValue={editValue}
            getAddValue={getAddValue}
            getEditValue={getEditValue}
            handleClose={handleCloseDialog}
            selectedNode={selectedNode}
            operationalArea={renderTreeData}
         />
      </>
   );
}



