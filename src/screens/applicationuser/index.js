import React, { useState, useEffect } from "react";
import { CircularProgress, Grid, Button, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../store/action/applicationUserManageAction";
import * as userActionCreator from "../../store/action/userManageAction";
import {
   apiRouter, displayText, sessionStorageKey, initialPageLimit, initialPage, stringManipulationCheck
} from "../../constant";
import AppUserTable from "./applicationusertable";
import AddModal from "./addapplicationusertmodel";
import SearchField from "../../components/shared/searchField";
import Pagination from "../../components/shared/pagination";
import SwitchComponent from "../../components/shared/switch";
import {
   decryptData, preferenceIsActive, preferenceIsAsc, splitString
} from "../../components/shared/helper";
import { applicationAdmin, gridWidth } from "../../gridconstants";
import { arrayConstants } from "../../arrayconstants";

const useStyles = makeStyles((theme) => ({
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
   switch: {
      float: "inherit",
      marginTop: "1%"
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
   },
   spinnerStyle: {
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
      margin: "auto"
   },
   h_auto: {
      height: "auto !important"
   }
}));

export default function ApplicationUser() {
   const preference = JSON.parse(decryptData(sessionStorageKey.ADMIN_PREF));
   const pageLimit = initialPageLimit;
   const pageNumber = initialPage;
   const dispatch = useDispatch();
   const classes = useStyles();
   const [isAddAppUserOpen, setIsAddAppUserOpen] = useState(false);
   const [isActive, setIsActive] = useState(preferenceIsActive(preference));
   const [searchValue, setSearchValue] = useState(stringManipulationCheck.EMPTY_STRING);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(
      preference && preference.pageSize
         ? JSON.parse(preference.pageSize)
         : pageLimit
   );
   const [totalCount, setTotalCount] = useState(0);
   const order = preference?.orderBy ? splitString(preference.orderBy) : [];
   const [orderBy, setOrderBy] = useState(
      order.length > arrayConstants.nonEmptyArray ? order[arrayConstants.initialOrder] : displayText.USERNAME
   );
   const [isAsc, setIsAsc] = useState(order.length > arrayConstants.nonEmptyArray ? preferenceIsAsc(order[arrayConstants.preferenceOrder]) : true);
   const CountryList = () => {
      const url = `${apiRouter.COUNTRY}`;
      dispatch(userActionCreator.FetchCountryList(url));
   };
   const StateList = () => {
      const url = `${apiRouter.STATE}`;
      dispatch(userActionCreator.FetchStateList(url));
   };

   const { countryList, stateList } = useSelector((state) => state.userManage);
   const { appUserDetails, isAppUserDeleted, isAppUserAdded, isAppUserEdited, applicationuserloader, } = useSelector((state) => state.appUserManage);
   const handleCloseAddAppUserDialog = () => {
      setIsAddAppUserOpen(false);
   };

   useEffect(() => {
      if (countryList == null) CountryList();
      if (stateList == null) StateList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (isAppUserDeleted || isAppUserAdded || isAppUserEdited) {
         (page === initialPage) ? appUserCall() : setPage(initialPage);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isAppUserDeleted, isAppUserAdded, isAppUserEdited]);

   useEffect(() => {
      appUserCall(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isActive, searchValue, page, rowsPerPage, orderBy, isAsc]);

   const handleSwitchChange = (isActive) => {
      setIsActive(isActive);
      setPage(pageNumber);
   };

   const handleSearch = (search) => {
      if (searchValue !== search) {
         setSearchValue(search);
         setPage(pageNumber);
      }
   };

   const handleChangePage = (event, page) => {
      setPage(page);
   };
   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, pageLimit));
      setPage(pageNumber);
   };

   useEffect(() => {
      if (appUserDetails?.data?.__count > arrayConstants.nonEmptyArray) {
         setTotalCount(appUserDetails?.data?.__count);
      }
   }, [appUserDetails]);

   const handleSortTable = (orderby, isAscending) => {
      setIsAsc(isAscending);
      setOrderBy(orderby);
      setPage(pageNumber);
   };

   const appUserCall = (isOrderbyName = false) => {
      if ((isAppUserAdded || isAppUserEdited) && !isOrderbyName) {
         setPage(pageNumber);
      }
      let sortOrder = !isAsc
         ? `${orderBy + displayText.DESC}`
         : `${orderBy + displayText.ASC}`;
      const url = `${apiRouter.USERS}/${apiRouter.GET_APP_ADMIN_USERS}?${apiRouter.PAGE_NUMBER
         }=${page + applicationAdmin.PaginationIncrement}&${apiRouter.PAGE_SIZE}=${rowsPerPage}&${apiRouter.SEARCH_TEXT
         }=${searchValue}&${apiRouter.ORDER_BY}=${sortOrder}&${apiRouter.IS_ACTIVE
         }=${isActive}`;

      dispatch(actionCreator.FetchApplicationUser(url));
   };

   const renderAppUser = (appUserDetails) => {
      if (_.isNull(appUserDetails)) {
         return (<></>);
      }
      else {
         return (
            <Grid item xs={gridWidth.MaxWidth}>
               <AppUserTable
                  appUserDetails={appUserDetails}
                  isActive={isActive}
                  handleSortTable={handleSortTable}
                  isAsc={isAsc}
                  orderBy={orderBy} />
               {appUserDetails?.data?.__count === arrayConstants.nonEmptyArray ? (
                  <Paper className={classes.paper}>
                     {displayText.NO_DATA_FOUND}
                  </Paper>) : (<Pagination
                     page={page}
                     rowsPerPage={rowsPerPage}
                     totalCount={totalCount}
                     handleChangePage={handleChangePage}
                     handleChangeRowsPerPage={handleChangeRowsPerPage} />
               )}
            </Grid>
         );
      }
   }

   return (
      <div>
         <Grid container spacing={applicationAdmin.DefaultSpacing} className={classes.h_auto}>
            <Grid xs={gridWidth.MaxWidth} className={"toggleRightAlign"}>
               <SwitchComponent
                  isActive={isActive}
                  switchClass={classes.switch}
                  handleSwitchChange={handleSwitchChange}
               />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <SearchField handleSearch={handleSearch} />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <Button
                  variant="contained"
                  className={classes.submit}
                  onClick={(e) => {
                     StateList();
                     setIsAddAppUserOpen(true);
                  }}>
                  {displayText.ADD_APP_ADMIN}
               </Button>
            </Grid>
         </Grid>
         {applicationuserloader && (
            <CircularProgress className={classes.spinnerStyle} />
         )}
         {renderAppUser(appUserDetails)}
         <AddModal
            open={isAddAppUserOpen}
            handleClose={handleCloseAddAppUserDialog}
            action={displayText.ADD} />
      </div>
   );
}
