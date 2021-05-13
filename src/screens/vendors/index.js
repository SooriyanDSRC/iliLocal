import React, { useState, useEffect } from "react";
import { Grid, Button, Paper, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VendorTable from "./vendortable";
import AddModal from "./vendortable/addvendormodel";
import { displayText, sessionStorageKey, apiRouter, initialPageLimit, initialPage, stringManipulationCheck } from "../../constant";
import SwitchComponent from "../../components/shared/switch";
import Pagination from "../../components/shared/pagination";
import SearchField from "../../components/shared/searchField";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../store/action/vendorManageAction";
import { preferenceIsActive, preferenceIsAsc, splitString, findFeatures, decryptData } from "../../components/shared/helper";
import _ from "lodash";
import CommonStyles from '../../scss/commonStyles';
import { arrayConstants } from "../../arrayconstants";
import { vendor, gridWidth } from '../../gridconstants';

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
   paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
   }
}));

export default function Vendors() {
   const commonClasses = CommonStyles();
   const classes = useStyles();
   const dispatch = useDispatch();
   const vendorPref = JSON.parse(decryptData(sessionStorageKey.VENDOR_PREF));
   const {
      vendorDetail,
      isVendorDeleted,
      isVendorAdded,
      isVendorEdited,
      vendortableLoader,
   } = useSelector((state) => state.vendorManage);
   const [isAddVendorOpen, setisAddVendorOpen] = useState(false);
   const [vendorRoles, setVendorRoles] = useState(null);
   const handleCloseAddVendorDialog = () => { setisAddVendorOpen(false); };
   const pageLimit = initialPageLimit;
   const pageNumber = initialPage;
   const [isActive, setIsActive] = useState(preferenceIsActive(vendorPref));
   const [searchValue, setSearchValue] = useState(stringManipulationCheck.EMPTY_STRING);
   const [page, setPage] = useState(pageNumber);
   const [rowsPerPage, setRowsPerPage] = useState(
      vendorPref && vendorPref.pageSize
         ? JSON.parse(vendorPref.pageSize)
         : pageLimit
   );
   const [totalCount, setTotalCount] = useState(initialPage);
   const order = vendorPref?.orderBy ? splitString(vendorPref.orderBy) : [];
   const [orderBy, setOrderBy] = useState(arrayConstants.nonEmptyArray ? order[arrayConstants.initialOrder] : apiRouter.VENDOR_NAME);
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

   const vendorCall = (isOrderbyName = false) => {
      if ((isVendorAdded || isVendorEdited) && !isOrderbyName) {
         setPage(initialPage);
      }
      let sortOrder = !isAsc
         ? `${orderBy + displayText.DESC}`
         : `${orderBy + displayText.ASC}`;
      const url = `${apiRouter.VENDORS}?${apiRouter.PAGE_NUMBER}=${page + vendor.PaginationIncrement}&${apiRouter.PAGE_SIZE
         }=${rowsPerPage}&${apiRouter.SEARCH_TEXT}=${searchValue}&${apiRouter.IS_ACTIVE
         }=${isActive}&${apiRouter.ORDER_BY}=${sortOrder}`;
      dispatch(actionCreator.FetchVendor(url));
   };

   useEffect(() => {
      if (vendorDetail?.data?.__count) {
         setTotalCount(vendorDetail?.data?.__count);
      }
   }, [vendorDetail]);

   useEffect(() => {
      if (isVendorDeleted || isVendorAdded || isVendorEdited) {
         (page === initialPage) ? vendorCall() : setPage(initialPage);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isVendorDeleted, isVendorAdded, isVendorEdited]);

   useEffect(() => {
      vendorCall(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isActive, searchValue, page, rowsPerPage, orderBy, isAsc]);

   const handleSortTable = (orderby, isAscending) => {
      setOrderBy(orderby);
      setIsAsc(isAscending);
      setPage(initialPage);
   };

   const handleChangePage = (event, page) => {
      setPage(page);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, pageLimit));
      setPage(initialPage);
   };

   const handleSwitchChange = (isActive) => {
      setIsActive(isActive);
      setPage(initialPage);
   };

   const GetVendorRoles = () => {
      let vendor_Roles = _.find(
         JSON.parse(decryptData(sessionStorageKey.USER_ROLES)),
         (vendorRole) => {
            return vendorRole.name === displayText.VENDOR_MANAGEMENT;
         }
      );
      setVendorRoles(vendor_Roles);
   };

   useEffect(() => {
      CountryList();
      StateList();
      GetVendorRoles();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <div>
         <Grid container spacing={vendor.DefaultSpacing} className="h-auto">
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
               {findFeatures(vendorRoles?.features, displayText.ADD_VENDOR) ?
                  (<Button
                     variant="contained"
                     className={classes.submit}
                     onClick={(e) => {
                        StateList();
                        setisAddVendorOpen(true);
                     }}>
                     {displayText.ADD_VENDOR}
                  </Button>
                  ) : (stringManipulationCheck.EMPTY_STRING)
               }
            </Grid>
         </Grid>
         {vendortableLoader && (
            <CircularProgress className={commonClasses.spinnerStyle} />
         )}
         {_.isNull(vendorDetail) ? (stringManipulationCheck.EMPTY_STRING) : (
            <Grid item xs={gridWidth.MaxWidth}>
               <VendorTable
                  vendorDetail={vendorDetail}
                  isActive={isActive}
                  handleSortTable={handleSortTable}
                  isAsc={isAsc}
                  orderBy={orderBy}
                  vendorRoles={vendorRoles} />
               {vendorDetail?.data?.__count === arrayConstants.nonEmptyArray ? (
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
            open={isAddVendorOpen}
            handleClose={handleCloseAddVendorDialog}
            action={displayText.ADD} />
      </div>
   );
}
