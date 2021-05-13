/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
   Table, TableBody, TableCell, TableContainer, TableHead, TableSortLabel, TableRow, Paper, IconButton,
   Menu, MenuItem, Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent, Divider,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Edit from "@material-ui/icons/Edit";
import { useDispatch, useSelector } from "react-redux";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import * as actionCreator from "../../../store/action/userManageAction";
import { displayText, apiRouter, sessionStorageKey, stringManipulationCheck } from "../../../constant";
import { userTableHeader } from "../../../tableheaderconstant";
import AddModal from "./addusermanagementmodel";
import _ from "lodash";
import { isNullUndefined, isUndefined, isEmptyNullUndefined, findFeatures, findFeaturesRole, decryptData, getDirection } from "../../../components/shared/helper";

const useStyles = makeStyles((theme) => ({
   table: {
      minWidth: 650
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
   submitNo: {
      margin: theme.spacing(3, 0, 2),
      background: "#ffffff",
      borderRadius: 8,
      color: "#00648d",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#ffffff",
         color: "#00648d"
      }
   },
   dialogTitle: {
      background: "#00648d",
      color: "#ffffff"
   },
   menuHeight: {
      maxHeight: '70 * 4.5',
      width: "200px"
   },
   enableActionIcon: {
      color: "#00648d !important",
      cursor: "pointer !important"
   },
   disableActionIcon: {
      cursor: "not-allowed !important",
      color: "#7d8182 !important"
   },
   disable: {
      disable: "disable"
   }
}));

export default function UserManagementTable(props) {
   const classes = useStyles();
   const dispatch = useDispatch();
   const [dialogOpen, setDialogOpen] = useState(false);
   const [isEditUserOpen, setIsEditUserOpen] = useState(false);
   const { countryList } = useSelector((state) => state.userManage);
   const [isAsc, setIsAsc] = useState(props.isAsc);
   const [orderBy, setOrderBy] = useState(props.orderBy);
   const [userDetail, setUserDetail] = useState(null);
   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);
   const [currentUserFlag, setCurrentUserFlag] = useState(null);
   const [isAdminUserRole, setIsAdminUserRole] = useState(null);
   const [showSubFeatures, setShowSubFeatures] = useState(false);

   const handleActionClick = (e, user) => {
      if (!handleUserActionRole(user)) {
         return e.stopPropagation();
      }
      setUserDetail(user);
      setAnchorEl(e.currentTarget);
   };

   const handleCloseEditUserDialog = () => {
      setAnchorEl(null);
      setIsEditUserOpen(false);
      setUserDetail(null);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const handleEditUser = () => {
      const country = _.find(countryList, (Country) => {
         return Country.name === userDetail.country;
      });
      if (isNullUndefined(country)) {
         const url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${country?.countryGuid}`;
         dispatch(actionCreator.FetchStateList(url));
      }
      setCurrentUserFlag(
         userDetail.usersGuid === JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)).usersGuid
      );
      setIsAdminUserRole(
         isUndefined(_.find(JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS)).roles, { roleName: displayText.APP_ADMIN }))
      );
      setIsEditUserOpen(true);
      setAnchorEl(null);
   };

   const handleRequestSort = (event, property) => {
      const isAscending = orderBy === property ? !isAsc : true;
      props.handleSortTable(property, isAscending);
      setOrderBy(property);
      setIsAsc(isAscending);
   };

   const handleDeleteClickOpen = () => {
      setDialogOpen(true);
      setAnchorEl(false);
   };

   const handleDeleteUser = () => {
      setDialogOpen(false);
      const url = `${apiRouter.USERS}?${displayText.USER_GUID}=${userDetail?.usersGuid}&${displayText.CLIENTSGUID}=${props?.clientId}`;
      dispatch(actionCreator.DeleteUser(url, null));
   };

   const renderDelete = (props) => {
      let features = findFeaturesRole(props.userRoles?.operations, displayText.DELETE_USER_ROLE);
      if (isEmptyNullUndefined(features) && userDetail?.email !== JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)).email) {
         return (
            props.isActive && (
               <div>
                  <Divider />
                  <MenuItem onClick={handleDeleteClickOpen}>
                     <DeleteOutlineOutlinedIcon />
                     {displayText.DELETE}
                  </MenuItem>
               </div>
            )
         )
      }

      if (isUndefined(_.find(JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS)).roles, { roleName: displayText.APP_ADMIN }))) {
         return (props.isActive && (
            <div>
               <Divider />
               <MenuItem onClick={handleDeleteClickOpen}>
                  <DeleteOutlineOutlinedIcon />
                  {displayText.DELETE}
               </MenuItem>
            </div>
         ))
      }
   }

   function handleUserActionRole(userDetail) {
      let isUserEditRole = findFeaturesRole(props.userRoles?.operations, displayText.EDIT_USER);
      let isUserDeleteRole = findFeaturesRole(props.userRoles?.operations, displayText.DELETE_USER_ROLE);
      if (!props.isActive) {
         return isEmptyNullUndefined(isUserEditRole);
      }
      if (userDetail?.email === JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)).email) {
         return isEmptyNullUndefined(isUserEditRole);
      }
      return (isEmptyNullUndefined(isUserEditRole) || isEmptyNullUndefined(isUserDeleteRole));
   }

   useEffect(() => {
      if (props.userRoles) {
         const operations = _.find(props.userRoles?.operations, (operations) => {
            return (operations.name === displayText.EDIT_USER || operations.name === displayText.DELETE_USER_ROLE);
         });
         isEmptyNullUndefined(operations) ? setShowSubFeatures(true) : setShowSubFeatures(false);
      }
   }, [props.userRoles]);

   const renderTableHeader = () => {
      return (
         <TableHead>
            <TableRow>
               {userTableHeader.USER_TABLE.map((uHeader) => (
                  <TableCell key={uHeader.header + stringManipulationCheck.UNDERSCORE_OPERATOR + displayText.USER_TABLE_HEADER}>
                     <TableSortLabel
                        active={orderBy === uHeader.sort}
                        direction={getDirection(uHeader, orderBy, isAsc)}
                        onClick={(e) => handleRequestSort(e, uHeader.sort)}>
                        {uHeader.header}
                     </TableSortLabel>
                  </TableCell>
               ))}
               <TableCell />
            </TableRow>
         </TableHead>
      )
   }

   const renderTableBody = () => {
      return (
         <TableBody>
            {props.userDetails?.data?.results?.map((user) =>
            (<TableRow key={user.usersGuid}>
               <TableCell>{user.userName}</TableCell>
               <TableCell>{user.email}</TableCell>
               <TableCell>{user.address}</TableCell>
               <TableCell>{user.city}</TableCell>
               <TableCell>{user.state}</TableCell>
               <TableCell>{user.country}</TableCell>
               <TableCell>{user.postalcode}</TableCell>
               <TableCell>{user.phone}</TableCell>
               <TableCell>
                  <IconButton className={handleUserActionRole(user) ? classes.enableActionIcon : classes.disableActionIcon} onClick={(e) => handleActionClick(e, user)}>
                     <MoreVertIcon ></MoreVertIcon>
                  </IconButton>
                  {showSubFeatures &&
                     <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        PaperProps={{ className: classes.menuHeight }}>
                        {findFeatures(props.userRoles?.operations, displayText.EDIT_USER)
                           ? (
                              <MenuItem onClick={handleEditUser}>
                                 <Edit />
                                 {displayText.EDIT}
                              </MenuItem>
                           ) : (<></>)}
                        {renderDelete(props)}
                     </Menu>
                  }
               </TableCell>
            </TableRow>
            )
            )}
         </TableBody>
      )
   }

   const renderUserDialog = () => {
      return (
         <Dialog open={dialogOpen} keepMounted maxWidth="lg">
            <DialogTitle className={classes.dialogTitle}>
               {displayText.CONFIRMATION_TEXT}
            </DialogTitle>
            <DialogContent>
               <DialogContentText>
                  {displayText.DELETE_USER_CONFIRMATION_MESSAGE}
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  fullWidth
                  variant="contained"
                  className={classes.submitOk}
                  onClick={(e) => handleDeleteUser()}>
                  {displayText.YES}
               </Button>
               <Button
                  fullWidth
                  variant="contained"
                  className={classes.submitNo}
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
            <Table className={classes.table} aria-label="User table">
               {renderTableHeader()}
               {renderTableBody()}
            </Table>
         </TableContainer>
         { renderUserDialog()}
         <AddModal
            open={isEditUserOpen}
            handleClose={handleCloseEditUserDialog}
            currentUser={currentUserFlag}
            isAdminUser={isAdminUserRole}
            userDetail={userDetail}
            action={displayText.EDIT}
            clientId={props?.clientId} />
      </div >
   );
}
