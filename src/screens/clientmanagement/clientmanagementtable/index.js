import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import {
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem, Dialog, DialogTitle,
   DialogActions, DialogContentText, DialogContent, Divider, TableSortLabel
} from "@material-ui/core";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import LocationOn from "@material-ui/icons/LocationOn";
import Edit from "@material-ui/icons/Edit";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { displayText, apiRouter, sessionStorageKey, stringManipulationCheck } from "../../../constant";
import { clientTableHeader } from "../../../tableheaderconstant";
import AddModal from "./clientamanagementmodel";
import * as clientActionCreator from "../../../store/action/clientManageAction";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import CommonStyles from '../../../scss/commonStyles';
import { isNullUndefined, setSessionStorage, findFeatures, getDirection } from "../../../components/shared/helper";

const useStyles = makeStyles((theme) => ({
   table: {
      minWidth: 650
   },
   submitOk: {
      margin: theme.spacing(3, 0, 2),
      background: "#ffffff",
      borderRadius: 8,
      color: "#808080",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#fffff",
         color: "#000000"
      }
   },
   dialogTitle: {
      background: "#00648d",
      color: "#ffffff"
   },
   menuHeight: {
      maxHeight: '70 * 4.5',
      width: "300px !important"
   }
}));

export default function ClientTable(props) {
   const dispatch = useDispatch();
   const classes = useStyles();
   const history = useHistory();
   const commonClasses = CommonStyles();
   const [dialogOpen, setDialogOpen] = useState(false);
   const countryList = useSelector((state) => state.clientManage.countryList);
   const [isEditClientOpen, setIsEditClientOpen] = useState(false);
   const [actionClient, setActionClient] = useState(null);
   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);
   const [isAsc, setIsAsc] = useState(props.isAsc);
   const [orderBy, setOrderBy] = useState(props.orderBy);

   const handleActionClick = (e, client) => {
      setSessionStorage(sessionStorageKey.SELECTED_CLIENT, client?.name);
      setActionClient(client);
      setAnchorEl(e.currentTarget);
   };

   const handleCloseEditClientDialog = () => {
      setIsEditClientOpen(false);
      setActionClient(null);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const handleEditClient = () => {
      var country = _.find(countryList, (Country) => {
         return Country.name === actionClient.country;
      });
      if (isNullUndefined(country)) {
         var url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${country?.countryGuid}`;
         dispatch(clientActionCreator.FetchStateList(url));
      }
      setIsEditClientOpen(true);
      setAnchorEl(null);
   };

   const handleDeleteClickOpen = (client) => {
      setDialogOpen(true);
      setAnchorEl(false);
   };

   const handleDeleteClient = () => {
      setDialogOpen(false);
      if (actionClient?.clientsGuid) {
         const url = `${apiRouter.CLIENT}/${actionClient.clientsGuid}`;
         dispatch(clientActionCreator.DeleteClient(url));
      }
   };

   const handleRequestSort = (event, property) => {
      const isAscending = orderBy === property ? !isAsc : true;
      props.handleSortTable(property, isAscending);
      setOrderBy(property);
      setIsAsc(isAscending);
   };

   const handleModuleManagement = (type) => {
      switch (type) {
         case displayText.OPERATIONAL_AREA_MANAGEMENT: {
            history.push({
               pathname: `client/${actionClient.clientsGuid}/operational-area`,
            });
            return setAnchorEl(null);
         }
         case displayText.USER_MANAGEMENT: {
            history.push({
               pathname: `client/${actionClient.clientsGuid}/user-management`,
            });
            return setAnchorEl(null);
         }
         case displayText.ROLE_MANAGEMENT: {
            history.push({
               pathname: `client/${actionClient.clientsGuid}/role-management`,
            });
            return setAnchorEl(null);
         }
         default:
            return stringManipulationCheck.EMPTY_STRING;
      }
   };

   const renderClientDialog = () => {
      return (
         <Dialog open={dialogOpen} keepMounted maxWidth="lg">
            <DialogTitle className={classes.dialogTitle}>
               {displayText.CONFIRMATION_TEXT}
            </DialogTitle>
            <DialogContent>
               <DialogContentText>
                  {displayText.DELETE_CLIENT_CONFIRMATION_MESSAGE}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  fullWidth
                  variant="contained"
                  className={commonClasses.submitOk}
                  onClick={(e) => handleDeleteClient()}>
                  {displayText.YES}
               </Button>
               <Button
                  fullWidth
                  variant="contained"
                  className={commonClasses.submitNo}
                  onClick={(e) => setDialogOpen(false)}>
                  {displayText.NO}
               </Button>
            </DialogActions>
         </Dialog>
      )
   }

   return (
      <div>
         <TableContainer component={Paper}>
            <Table className={classes.table} aria-label={displayText.CLIENT_TABLE}>
               <TableHead>
                  <TableRow>
                     {clientTableHeader.CLIENT_TABLE.map((cHeader) => (
                        <TableCell key={cHeader.header + stringManipulationCheck.UNDERSCORE_OPERATOR + displayText.CLIENT_TABLE_HEADER}>
                           <TableSortLabel
                              active={orderBy === cHeader.sort}
                              direction={getDirection(cHeader, orderBy, isAsc)}
                              onClick={(e) => handleRequestSort(e, cHeader.sort)}>
                              {cHeader.header}
                           </TableSortLabel>
                        </TableCell>
                     ))}
                     <TableCell />
                  </TableRow>
               </TableHead>
               <TableBody>
                  {props?.clientDetails?.data?.results?.map((client) => (
                     <TableRow key={client.clientId}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.address}</TableCell>
                        <TableCell>{client.city}</TableCell>
                        <TableCell>{client.state}</TableCell>
                        <TableCell>{client.country}</TableCell>
                        <TableCell>{client.postal}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.mainContact}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>
                           <IconButton onClick={(e) => handleActionClick(e, client)}>
                              <MoreVertIcon />
                           </IconButton>
                           <Menu
                              id="long-menu"
                              anchorEl={anchorEl}
                              keepMounted
                              open={open}
                              onClose={handleClose}
                              PaperProps={{ className: classes.menuHeight }}>
                              {
                                 findFeatures(props.clientRoles?.features, displayText.OPERATIONAL_AREA)
                                    ? props.isActive && (
                                       <div>
                                          <MenuItem
                                             onClick={(e) => handleModuleManagement(displayText.OPERATIONAL_AREA_MANAGEMENT)}>
                                             <LocationOn />{`${displayText.OPERATIONAL_AREA_MANAGEMENT}`}
                                          </MenuItem>
                                          <Divider />
                                       </div>
                                    ) : (stringManipulationCheck.EMPTY_STRING)
                              }

                              {
                                 findFeatures(props.clientRoles?.features, displayText.USER_MANAGEMENT)
                                    ? props.isActive && (
                                       <div>
                                          <MenuItem
                                             onClick={(e) => handleModuleManagement(displayText.USER_MANAGEMENT)}>
                                             <VerifiedUser />
                                             {displayText.USER_MANAGEMENT}
                                          </MenuItem>
                                          <Divider />
                                       </div>
                                    ) : (stringManipulationCheck.EMPTY_STRING)
                              }
                              {
                                 findFeatures(props.clientRoles?.features, displayText.ROLE_MANAGEMENT)
                                    ? props.isActive && (
                                       <div>
                                          <MenuItem
                                             onClick={(e) => handleModuleManagement(displayText.ROLE_MANAGEMENT)}>
                                             <ContactMailIcon /> {displayText.ROLE_MANAGEMENT}
                                          </MenuItem>
                                          <Divider />
                                       </div>
                                    ) : (stringManipulationCheck.EMPTY_STRING)
                              }

                              {
                                 findFeatures(props.clientRoles?.features, displayText.EDIT_CLIENT)
                                    ? (
                                       <MenuItem onClick={(e) => handleEditClient()}>
                                          <Edit />
                                          {displayText.EDIT}
                                       </MenuItem>
                                    ) : (stringManipulationCheck.EMPTY_STRING)
                              }

                              <Divider />
                              {
                                 findFeatures(props.clientRoles?.features, displayText.DELETE_CLIENT_ROLE)
                                    ? props.isActive && (
                                       <div>
                                          <MenuItem onClick={(e) => handleDeleteClickOpen()}>
                                             <DeleteOutlineOutlinedIcon />
                                             {displayText.DELETE}
                                          </MenuItem>
                                       </div>
                                    ) : (stringManipulationCheck.EMPTY_STRING)
                              }
                           </Menu>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
         {renderClientDialog()}
         <AddModal
            open={isEditClientOpen}
            handleClose={handleCloseEditClientDialog}
            clientDetails={actionClient}
            action={displayText.EDIT} />
      </div>
   );
}
