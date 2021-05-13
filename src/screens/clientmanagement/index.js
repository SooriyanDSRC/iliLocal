import React, { useState, useEffect } from "react";
import { Grid, Button, Paper, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ClientTable from "./clientmanagementtable";
import AddModal from "./clientmanagementtable/clientamanagementmodel";
import { displayText, apiRouter, sessionStorageKey, initialPageLimit, initialPage, stringManipulationCheck } from "../../constant";
import SwitchComponent from "../../components/shared/switch";
import Pagination from "../../components/shared/pagination";
import SearchField from "../../components/shared/searchField";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../store/action/clientManageAction";
import { decryptData, preferenceIsActive, preferenceIsAsc, splitString } from "../../components/shared/helper";
import _ from "lodash";
import { client, initialDataCount, gridWidth } from '../../gridconstants';
import { arrayConstants } from "../../arrayconstants";
import CommonStyles from '../../scss/commonStyles';

const useStyles = makeStyles((theme) => ({
   submit: {
      margin: theme.spacing(3, 0, 2),
      background: "#036290",
      opacity: 1,
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#1d79ac",
         color: "#ffffff"
      },
      float: "right"
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
   },
   toggleRightAlign: {
      textAlign: "right",
      height: "50px"
   }
}));

export default function Clients() {
   const preference = JSON.parse(decryptData(sessionStorageKey.CLIENT_PREF));
   const classes = useStyles();
   const commonClasses = CommonStyles();
   const dispatch = useDispatch();
   const { clientDetails, isClientDeleted, isClientAdded, isClientEdited, loader } = useSelector((state) => state.clientManage);
   const [isActive, setIsActive] = useState(preferenceIsActive(preference));
   const [isAddClientOpen, setIsAddClientOpen] = useState(false);
   const [clientRoles, setClientRoles] = useState(null);
   const handleCloseAddClientDialog = () => { setIsAddClientOpen(false); };
   const pageLimit = initialPageLimit;
   const pageNumber = initialPage;
   const [searchValue, setSearchValue] = useState(stringManipulationCheck.EMPTY_STRING);
   const [page, setPage] = useState(pageNumber);
   const [rowsPerPage, setRowsPerPage] = useState(
      preference && preference.pageSize
         ? JSON.parse(preference.pageSize)
         : pageLimit
   );
   const [totalCount, setTotalCount] = useState(initialPage);
   const order = preference?.orderBy ? splitString(preference.orderBy) : [];
   const [orderBy, setOrderBy] = useState(arrayConstants.nonEmptyArray ? order[arrayConstants.initialOrder] : displayText.NAME);
   const [isAsc, setIsAsc] = useState(order?.length > arrayConstants.nonEmptyArray ? preferenceIsAsc(order[arrayConstants.preferenceOrder]) : true);
   const CountryList = () => {
      const url = `${apiRouter.COUNTRY}`;
      dispatch(actionCreator.FetchCountryList(url));
   };

   const StateList = () => {
      const url = `${apiRouter.STATE}`;
      dispatch(actionCreator.FetchStateList(url));
   };

   const handleSearch = (search) => {
      if (searchValue !== search) {
         setSearchValue(search);
         setPage(initialPage);
      }
   };

   const clientCall = (isOrderbyName = false) => {
      if ((isClientAdded || isClientEdited) && !isOrderbyName) { setPage(initialPage); }
      let sortOrder = !isAsc
         ? `${orderBy + displayText.DESC}`
         : `${orderBy + displayText.ASC}`;
      const url = `${apiRouter.CLIENT}?${apiRouter.PAGE_NUMBER}=${page + client.PaginationIncrement}&${apiRouter.PAGE_SIZE
         }=${rowsPerPage}&${apiRouter.SEARCH_TEXT}=${searchValue}&${apiRouter.IS_ACTIVE
         }=${isActive}&${apiRouter.ORDER_BY}=${sortOrder}`;
      dispatch(actionCreator.FetchClient(url));
   };

   useEffect(() => {
      if (clientDetails?.data?.__count > arrayConstants.nonEmptyArray) {
         setTotalCount(clientDetails?.data?.__count);
      }
   }, [clientDetails]);

   useEffect(() => {
      if (isClientDeleted || isClientAdded || isClientEdited) {
         (page === initialPage) ? clientCall() : setPage(initialPage);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isClientDeleted, isClientAdded, isClientEdited]);

   useEffect(() => {
      clientCall(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isActive, searchValue, page, rowsPerPage, orderBy, isAsc]);

   const handleSortTable = (orderby, isAscending) => {
      setIsAsc(isAscending);
      setOrderBy(orderby);
      setPage(initialPage);
   };

   const handleChangePage = (event, page) => {
      setPage(page);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, initialPageLimit));
      setPage(initialPage);
   };

   const handleSwitchChange = (isActive) => {
      setIsActive(isActive);
      setPage(initialPage);
   };

   const GetClientRoles = () => {
      let client_Roles = _.find(
         JSON.parse(decryptData(sessionStorageKey.USER_ROLES)),
         (clientRole) => {
            return clientRole.name === displayText.CLIENT_MANAGEMENT;
         }
      );
      setClientRoles(client_Roles);
   };

   useEffect(() => {
      CountryList();
      StateList();
      GetClientRoles();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const renderClientTable = () => {
      return (
         _.isNull(clientDetails) ? (stringManipulationCheck.EMPTY_STRING) : (
            <Grid item xs={gridWidth.MaxWidth}>
               <ClientTable
                  clientDetails={clientDetails}
                  isActive={isActive}
                  handleSortTable={handleSortTable}
                  isAsc={isAsc}
                  orderBy={orderBy}
                  clientRoles={clientRoles}
               />
               {clientDetails?.data?.__count === initialDataCount ? (
                  <Paper className={classes.paper}>{displayText.NO_DATA_FOUND}</Paper>
               ) : (
                  <Pagination
                     page={page}
                     rowsPerPage={rowsPerPage}
                     totalCount={totalCount}
                     handleChangePage={handleChangePage}
                     handleChangeRowsPerPage={handleChangeRowsPerPage} />
               )}
            </Grid>
         )
      )
   }

   const renderClientHeader = () => {
      return (
         <Grid container spacing={client.DefaultSpacing} className="h-auto">
            <Grid xs={gridWidth.MaxWidth} className="toggleRightAlign">
               <SwitchComponent
                  switchClass={commonClasses.switch}
                  handleSwitchChange={handleSwitchChange}
                  isActive={isActive} />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <SearchField handleSearch={handleSearch} />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               {_.find(clientRoles?.features, (features) => {
                  return features.name === displayText.ADD_CLIENT;
               }) ? (
                  <Button
                     variant="contained"
                     className={classes.submit}
                     onClick={(e) => {
                        StateList();
                        setIsAddClientOpen(true);
                     }}>
                     {displayText.ADD_CLIENT}
                  </Button>
               ) : (stringManipulationCheck.EMPTY_STRING)
               }
            </Grid>
         </Grid>
      )
   }

   return (
      <div>
         {renderClientHeader()}
         {loader && <CircularProgress className={commonClasses.spinnerStyle} />}
         {renderClientTable()}
         <AddModal
            open={isAddClientOpen}
            handleClose={handleCloseAddClientDialog}
            action={displayText.ADD} />
      </div>
   );
}
