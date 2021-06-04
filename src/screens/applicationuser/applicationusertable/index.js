import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem, Dialog,
   DialogTitle, DialogActions, DialogContentText, DialogContent, Divider, TableSortLabel
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import Edit from "@material-ui/icons/Edit";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { displayText, sessionStorageKey, stringManipulationCheck } from "../../../constant";
import { applicationUserTableHeader } from "../../../tableheaderconstant";
import * as actionCreator from "../../../store/action/applicationUserManageAction";
import * as userActionCreator from "../../../store/action/userManageAction";
import { apiRouter } from "../../../constant";
import AddModal from "../addapplicationusertmodel";
import _ from "lodash";
import { isNullUndefined, decryptData, getDirection, isNotNull } from "../../../components/shared/helper";
import CommonStyles from '../../../scss/commonStyles';

const useStyles = makeStyles((theme) => ({
   table: {
      minWidth: 650
   },
   icon: {
      color: "#036290",
      cursor: "pointer"
   },
   menuHeight: {
      maxHeight: '48 * 4.5',
      width: "200px"
   }
}));

export default function ApplicationUserTable(props) {
   const classes = useStyles();
   const dispatch = useDispatch();
   const [dialogOpen, setDialogOpen] = useState(false);
   const [anchorEl, setAnchorEl] = useState(null);
   const [actionAppUser, setActionAppUser] = useState(null);
   const [isAsc, setIsAsc] = useState(props?.isAsc);
   const [orderBy, setOrderBy] = useState(props?.orderBy);
   const [isEditAppUserOpen, setIsEditAppUserOpen] = useState(false);
   const [deleteSuper, setDeleteSuper] = useState(false);
   const { countryList } = useSelector((state) => state?.userManage);
   const open = Boolean(anchorEl);
   const commonClasses = CommonStyles();

   const handleEditAppUser = () => {
      let country = _.find(countryList, (Country) => {
         return Country.name === actionAppUser.country;
      });
      if (isNullUndefined(country)) {
         let url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${country?.countryGuid}`;
         dispatch(userActionCreator.FetchStateList(url));
      }
      setIsEditAppUserOpen(true);
      setAnchorEl(null);
   };

   const handleApplicationUserInvite = (email) => {
      let url = `${apiRouter.USERS}/${apiRouter.USER_ACTIVATION_TOKEN}`;
      let userData = {
         email: email,
      };
      dispatch(actionCreator.UserInvite(url, userData));
   }

   const handleRequestSort = (event, property) => {
      const isAscending = orderBy === property ? !isAsc : true;
      props.handleSortTable(property, isAscending);
      setOrderBy(property);
      setIsAsc(isAscending);
   };

   const handleActionClick = (e, applicationuser) => {
      setDeleteSuper(applicationuser.usersGuid !== JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)).usersGuid);
      setActionAppUser(applicationuser);
      setAnchorEl(e.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const handleCloseEditAppUserDialog = () => {
      setIsEditAppUserOpen(false);
      setActionAppUser(null);
   };

   const handleClickDeleteDialogOpen = () => {
      setDialogOpen(true);
      setAnchorEl(null);
   };

   const handleDialogClose = () => {
      setDialogOpen(false);
   };

   const handleDeleteAppUser = () => {
      setDialogOpen(false);
      let clientsGuid = JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientsGuid;
      const url = `${apiRouter.USERS}?${displayText.USER_GUID}=${actionAppUser?.usersGuid}&${displayText.CLIENTSGUID}=${clientsGuid}`;
      dispatch(actionCreator.DeleteApplicationUser(_.trim(url), null));
   };

   const isSendInvite = (applicationUser) => {
      return (isNotNull(applicationUser?.isUserActivationTokenExpired) && isNotNull(applicationUser?.isUserActivated)
         && (applicationUser?.isUserActivationTokenExpired && !applicationUser?.isUserActivated));
   }

   const sendInvite = (applicationUser) => {
      return (
         isSendInvite(applicationUser) ?
            <TableCell>
               <Button
                  className={commonClasses.inviteButton}
                  onClick={(e) => handleApplicationUserInvite(applicationUser?.email)}>
                  <b>{displayText.INVITE}</b>
               </Button>
            </TableCell>
            : <TableCell></TableCell>)
   }

   const renderTableHeader = () => {
      return (
         <TableHead>
            <TableRow>
               {applicationUserTableHeader.APPLICATION_USER_TABLE.map((uHeader, index) => {
                  return (
                     <TableCell key={uHeader.header + stringManipulationCheck.UNDERSCORE_OPERATOR + displayText.USER_TABLE_HEADER}>
                        <TableSortLabel
                           active={orderBy === uHeader.sort}
                           direction={getDirection(uHeader, orderBy, isAsc)}
                           onClick={(e) => handleRequestSort(e, uHeader.sort)}>
                           {uHeader.header}
                        </TableSortLabel>
                     </TableCell>
                  );
               })}
               <TableCell></TableCell>
               {props.isActive ? <TableCell></TableCell> : stringManipulationCheck.EMPTY_STRING}
            </TableRow>
         </TableHead>
      )
   }

   const renderTableBody = () => {
      return (
         <TableBody>
            {props.appUserDetails?.data?.results?.map((applicationuser) => (
               <TableRow key={applicationuser.usersGuid}>
                  <TableCell>{applicationuser.userName}</TableCell>
                  <TableCell>{applicationuser.email}</TableCell>
                  <TableCell>{applicationuser.address}</TableCell>
                  <TableCell>{applicationuser.city}</TableCell>
                  <TableCell>{applicationuser.state}</TableCell>
                  <TableCell>{applicationuser.country}</TableCell>
                  <TableCell>{applicationuser.postalcode}</TableCell>
                  <TableCell>{applicationuser.phone}</TableCell>
                  {props.isActive ? sendInvite(applicationuser) : stringManipulationCheck.EMPTY_STRING}
                  <TableCell>
                     <IconButton onClick={(e) => handleActionClick(e, applicationuser)}>
                        <MoreVertIcon />
                     </IconButton>
                     <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        PaperProps={{ className: classes.menuHeight }}>
                        <MenuItem onClick={(e) => handleEditAppUser()}>
                           <Edit /> {displayText.EDIT}
                        </MenuItem>
                        {props.isActive && deleteSuper && (
                           <div>
                              <Divider />
                              <MenuItem onClick={(e) => handleClickDeleteDialogOpen()}>
                                 <DeleteOutlineOutlinedIcon /> {displayText.DELETE}
                              </MenuItem>
                           </div>
                        )}
                     </Menu>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      )
   }

   const renderDialog = () => {
      return (
         <Dialog open={dialogOpen} keepMounted maxWidth="lg">
            <DialogTitle className={commonClasses.dialogTitle}>
               {displayText.CONFIRMATION_TEXT}
            </DialogTitle>
            <DialogContent>
               <DialogContentText>
                  {displayText.DELETE_USER_APPLICATION_CONFIRMATION_MESSAGE}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  fullWidth
                  variant="contained"
                  className={commonClasses.submitOk}
                  onClick={(e) => handleDeleteAppUser()}>
                  {displayText.YES}
               </Button>
               <Button
                  fullWidth
                  variant="contained"
                  className={commonClasses.submitNo}
                  onClick={handleDialogClose}>
                  {displayText.NO}
               </Button>
            </DialogActions>
         </Dialog>
      )
   }
   return (
      <div>
         <TableContainer component={Paper}>
            <Table className={classes.table} aria-label={displayText.APPLICATION_USER_TABLE}>
               {renderTableHeader()}
               {renderTableBody()}
            </Table>
         </TableContainer>
         {renderDialog()}
         <AddModal
            open={isEditAppUserOpen}
            isCurrentUser={deleteSuper}
            handleClose={handleCloseEditAppUserDialog}
            appUserDetails={actionAppUser}
            action={displayText.EDIT} />
      </div >
   );
}
