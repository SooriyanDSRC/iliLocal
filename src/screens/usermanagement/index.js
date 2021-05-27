/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, CircularProgress, Paper, Typography, Dialog, DialogTitle, DialogActions, DialogContent } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import UserManagementtableTable from "./usermanagementtable";
import SearchField from "../../components/shared/searchField";
import AddModal from "./usermanagementtable/addusermanagementmodel";
import * as actionCreator from "../../store/action/userManageAction";
import SwitchComponent from "../../components/shared/switch";
import Pagination from "../../components/shared/pagination";
import { displayText, apiRouter, sessionStorageKey, initialPageLimit, initialPage, stringManipulationCheck } from "../../constant";
import { preferenceIsActive, preferenceIsAsc, splitString, isNullUndefined, removeDoubleQuotes, findFeaturesRole, setSessionStorage, decryptData, clearStorageItems } from "../../components/shared/helper";
import _ from "lodash";
import { arrayConstants } from "../../arrayconstants";
import { user, initialDataCount, gridWidth } from '../../gridconstants';
import CommonStyles from '../../scss/commonStyles';

const useStyles = makeStyles((theme) => ({
   submit: {
      margin: theme.spacing(3, 0, 2),
      background: "#036290",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#1d79ac",
         color: "#ffffff",
      },
      float: "right"
   },
   clientNameStyle: {
      marginTop: "28px",
      textAlign: "left"
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
   },
   gridPadding: {
      padding: "0px 12px !important"
   },
   alignRight: {
      textAlign: "right",
      height: "50px"
   },
   divHeight: {
      height: "70px !important"
   }
}));

export default function UserManagement() {
   const preference = JSON.parse(decryptData(sessionStorageKey.USER_PREF));
   const dispatch = useDispatch();
   const classes = useStyles();
   const commonClasses = CommonStyles();
   const { isCurrentUser, isUserAdded, isUserEdited, userDetails, usertableLoader, isUserDeleted } = useSelector((state) => state.userManage);
   const { userFeatures } = useSelector((state) => state.user);
   const [clientName, setClientName] = useState(decryptData(sessionStorageKey.SELECTED_CLIENT) ? removeDoubleQuotes(decryptData(sessionStorageKey.SELECTED_CLIENT)) : null);
   const [isAddClientOpen, setIsAddClientOpen] = useState(false);
   const [userRoles, setUserRoles] = useState(null);
   const [page, setPage] = useState(initialPage);
   const [logoutConfirmation, setLogoutConfirmation] = useState(false);
   const [rowsPerPage, setRowsPerPage] = useState(
      preference && preference.pageSize
         ? JSON.parse(preference.pageSize)
         : initialPageLimit
   );
   const [totalCount, setTotalCount] = useState(initialPage);
   const [searchValue, setSearchValue] = useState(stringManipulationCheck.EMPTY_STRING);
   const { clientId } = useParams();
   const order = preference?.orderBy ? splitString(preference.orderBy) : [];
   const [orderBy, setOrderBy] = useState(arrayConstants.nonEmptyArray ? order[arrayConstants.initialOrder] : displayText.USERNAME);
   const [isAsc, setIsAsc] = useState(order?.length > arrayConstants.nonEmptyArray ? preferenceIsAsc(order[arrayConstants.preferenceOrder]) : true);
   const [isActive, setIsActive] = useState(preferenceIsActive(preference));
   const history = useHistory();

   const handleSearch = (search) => {
      if (searchValue !== search) {
         setSearchValue(search);
         setPage(initialPage);
      }
   };

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleLogout = () => {
      clearStorageItems();
      window.location.reload();
      history.push('/login');
   };

   const handleSwitchChange = (isActive) => {
      setIsActive(isActive);
      setPage(initialPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, initialPageLimit));
      setPage(initialPage);
   };

   const handleCloseAddClientDialog = () => {
      setIsAddClientOpen(false);
   };

   const CountryList = () => {
      const url = `${apiRouter.COUNTRY}`;
      dispatch(actionCreator.FetchCountryList(url));
   };

   const StateList = () => {
      const url = `${apiRouter.STATE}`;
      dispatch(actionCreator.FetchStateList(url));
   };

   const RolesList = () => {
      const url = `${apiRouter.ROLES}/${clientId}`;
      dispatch(actionCreator.FetchRolesList(url));
   };

   const userCall = (isOrderbyName = false) => {
      if ((isUserAdded || isUserEdited) && !isOrderbyName) { setPage(initialPage); }
      let sortOrder = !isAsc
         ? `${orderBy + displayText.DESC}`
         : `${orderBy + displayText.ASC}`;
      const url = `${apiRouter.USERS}?${displayText.CLIENTSGUID}=${clientId}&${apiRouter.PAGE_NUMBER
         }=${page + user.PaginationIncrement}&${apiRouter.PAGE_SIZE}=${rowsPerPage}&${apiRouter.SEARCH_TEXT
         }=${searchValue}&${apiRouter.ORDER_BY}=${sortOrder}&${apiRouter.IS_ACTIVE
         }=${isActive}`;
      dispatch(actionCreator.FetchUserDetails(url));
   };

   const handleSortTable = (orderby, isAscending) => {
      setIsAsc(isAscending);
      setOrderBy(orderby);
      setPage(initialPage);
   };

   const handleUserLogoutDialog = () => {
      setIsAddClientOpen(false);
   };

   useEffect(() => {
      if (isUserDeleted || isUserAdded || isUserEdited) {
         (page === initialPage) ? userCall() : setPage(initialPage);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isUserDeleted, isUserAdded, isUserEdited]);

   useEffect(() => {
      userCall(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isActive, searchValue, page, rowsPerPage, orderBy, isAsc]);

   useEffect(() => {
      if (userDetails?.data?.__count > arrayConstants.nonEmptyArray) {
         setTotalCount(userDetails?.data?.__count);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [userDetails]);

   useEffect(() => {
      if (isUserAdded && isCurrentUser) {
         setLogoutConfirmation(true);
         dispatch(actionCreator.AddUserClear());
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isUserAdded, isCurrentUser]);

   const GetUserRoles = () => {
      let user_Roles = stringManipulationCheck.EMPTY_STRING;
      // Route via client management
      let Roles = findFeaturesRole(JSON.parse(decryptData(sessionStorageKey.USER_ROLES)), displayText.CLIENT_MANAGEMENT);
      if (isNullUndefined(Roles)) {
         user_Roles = findFeaturesRole(Roles?.features, displayText.USER_MANAGEMENT);
      }
      // Route via sidenav bar   
      else {
         if (isNullUndefined(userFeatures)) {
            setSessionStorage(sessionStorageKey.SELECTED_CLIENT, JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientName);
            setClientName(removeDoubleQuotes(decryptData(sessionStorageKey.SELECTED_CLIENT)));
            user_Roles = findFeaturesRole(userFeatures, displayText.USER_MANAGEMENT);
         }
      }
      setUserRoles(user_Roles);
   };

   useEffect(() => {
      GetUserRoles();
      CountryList();
      StateList();
      RolesList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const confirmationDialog = () => {
      return (
         <Dialog
            open={logoutConfirmation}
            keepMounted
            maxWidth="md"
            disableBackdropClick={true}>
            <DialogTitle className={commonClasses.dialogTitle}>
               {displayText.LOGOUT_REQUIRED}
            </DialogTitle>
            <DialogContent className={classes.dialogOverflow}>
               <div className={classes.dasboardData}>
                  <Typography className={commonClasses.typographyPadding}>
                     {displayText.PLEASE_LOGOUT_MESSAGE}
                  </Typography>
               </div>
            </DialogContent>
            <DialogActions>
               <div className={classes.afterfooterBtnStyles}>
                  <Button
                     variant="contained"
                     className={commonClasses.submitOk}
                     onClick={(e) => handleLogout()}>
                     {displayText.LOGOUT}
                  </Button>
                  <Button
                     variant="contained"
                     className={commonClasses.submitNo}
                     onClick={(e) => setLogoutConfirmation(false)}>
                     {displayText.CONTINUE}
                  </Button>
               </div>
            </DialogActions>
         </Dialog>
      )
   }

   return (
      <div>
         <Grid container spacing={user.DefaultSpacing} className="h-auto">
            <Grid className={classes.gridPadding} item xl={gridWidth.DefaultWidth} lg={gridWidth.DefaultWidth}
               md={gridWidth.CustomWidth} sm={gridWidth.CustomWidth}>
               <Typography
                  variant="h5"
                  className={classes.clientNameStyle}
                  gutterBottom>
                  {clientName}
               </Typography>
            </Grid>
            <Grid className={classes.gridPadding} item xl={gridWidth.DefaultWidth} lg={gridWidth.DefaultWidth}
               md={gridWidth.DefaultMinWidth} sm={gridWidth.DefaultMinWidth}>
               <SwitchComponent
                  switchClass={commonClasses.switch}
                  handleSwitchChange={handleSwitchChange}
                  isActive={isActive} />
            </Grid>
            <Grid className={classes.gridPadding} item xl={gridWidth.DefaultWidth} lg={gridWidth.DefaultWidth}
               md={gridWidth.MaxWidth} sm={gridWidth.MaxWidth} xs={gridWidth.MaxWidth}>
               <SearchField handleSearch={handleSearch} />
            </Grid>
            <Grid className={classes.gridPadding} item xl={gridWidth.DefaultWidth} lg={gridWidth.DefaultWidth}
               md={gridWidth.MaxWidth} sm={gridWidth.MaxWidth} xs={gridWidth.MaxWidth}>
               {_.find(userRoles?.operations, (operations) => {
                  return operations.name === displayText.ADD_USER;
               }) ? (
                  <Button
                     variant="contained"
                     className={classes.submit}
                     onClick={(e) => {
                        StateList();
                        setIsAddClientOpen(true);
                     }}>
                     {displayText.ADD_USER}
                  </Button>
               ) : (<div className={classes.divHeight}></div>)}
            </Grid>
         </Grid>
         {usertableLoader && <CircularProgress className={commonClasses.spinnerStyle} />}
         {_.isNull(userDetails) ? (
            stringManipulationCheck.EMPTY_STRING
         ) : (
            <Grid item sm={gridWidth.MaxWidth}>
               <UserManagementtableTable
                  userDetails={userDetails}
                  isActive={isActive}
                  handleSortTable={handleSortTable}
                  isAsc={isAsc}
                  orderBy={orderBy}
                  clientId={clientId}
                  userRoles={userRoles} />
               {userDetails?.data?.__count === initialDataCount ? (
                  <Paper className={classes.paper}>{displayText.NO_DATA_FOUND}
                  </Paper>) : (<Pagination
                     page={page}
                     rowsPerPage={rowsPerPage}
                     totalCount={totalCount}
                     handleChangePage={handleChangePage}
                     handleChangeRowsPerPage={handleChangeRowsPerPage} />
               )}
            </Grid>
         )}
         <AddModal
            open={isAddClientOpen}
            handleClose={handleCloseAddClientDialog}
            userLogoutConfirm={handleUserLogoutDialog}
            action={displayText.ADD}
            clientId={clientId} />
         {confirmationDialog()}
      </div>
   );
}
