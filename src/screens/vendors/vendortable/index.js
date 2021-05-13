import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem,
  Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent, Divider, TableSortLabel
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Edit from "@material-ui/icons/Edit";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { displayText, apiRouter, stringManipulationCheck } from "../../../constant";
import { vendorTableHeader } from "../../../tableheaderconstant";
import AddModal from "./addvendormodel";
import * as vendorActionCreator from "../../../store/action/vendorManageAction";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { isNullUndefined, findFeatures, getDirection } from "../../../components/shared/helper";

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
    maxHeight: "70 * 4.5",
    minWidth: "200px"
  }
}));

export default function VendorTable(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);
  const countryList = useSelector((state) => state.vendorManage.countryList);
  const [actionVendor, setActionVendor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isAsc, setIsAsc] = useState(props.isAsc);
  const [orderBy, setOrderBy] = useState(props.orderBy);

  const handleActionClick = (e, vendor) => {
    setActionVendor(vendor);
    setAnchorEl(e.currentTarget);
  };
  const handleCloseEditVendorDialog = () => {
    setIsEditVendorOpen(false);
    setActionVendor(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditVendor = () => {
    var country = _.find(countryList, (Country) => {
      return Country.name === actionVendor?.country;
    });
    if (isNullUndefined(country)) {
      var url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${country?.countryGuid}`;
      dispatch(vendorActionCreator.FetchStateList(url));
    }
    setIsEditVendorOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteClickOpen = () => {
    setDialogOpen(true);
    setAnchorEl(false);
  };

  const handleDeleteVendor = () => {
    setDialogOpen(false);
    if (actionVendor?.vendorsGuid) {
      const url = `${apiRouter.VENDORS}/${actionVendor.vendorsGuid}`;
      dispatch(vendorActionCreator.DeleteVendor(url));
    }
  };

  const handleRequestSort = (event, property) => {
    const isAscending = orderBy === property ? !isAsc : true;
    props.handleSortTable(property, isAscending);
    setOrderBy(property);
    setIsAsc(isAscending);
  };

  const renderVendorDialog = () => {
    return (
      <Dialog open={dialogOpen} keepMounted maxWidth="lg">
        <DialogTitle className={classes.dialogTitle}>
          {displayText.CONFIRMATION_TEXT}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {displayText.DELETE_VENDOR_CONFIRMATION_MESSAGE}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            variant="contained"
            className={classes.submitOk}
            onClick={(e) => handleDeleteVendor()}>
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
        <Table className={classes.table} aria-label={displayText.VENDOR_TABLE}>
          <TableHead>
            <TableRow>
              {vendorTableHeader.VENDOR_TABLE.map((cHeader) => (
                <TableCell key={cHeader.header + displayText.ILI_VENDOR} align="left">
                  <TableSortLabel
                    active={orderBy === cHeader.sort}
                    direction={getDirection(cHeader, orderBy, isAsc)}
                    onClick={(e) => handleRequestSort(e, cHeader.sort)}
                  >
                    {cHeader.header}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {props?.vendorDetail?.data?.results?.map((vendor) => (
              <TableRow key={vendor.vendorsGuid}>
                <TableCell>{vendor.vendorName}</TableCell>
                <TableCell>{vendor.mainContact}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.address}</TableCell>
                <TableCell>{vendor.city}</TableCell>
                <TableCell>{vendor.state}</TableCell>
                <TableCell>{vendor.country}</TableCell>
                <TableCell>{vendor.postalcode}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleActionClick(e, vendor)}>
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
                      findFeatures(props.vendorRoles?.features, displayText.EDIT_VENDOR)
                        ? (
                          <MenuItem onClick={(e) => handleEditVendor()}>
                            <Edit />
                            {displayText.EDIT}
                            <Divider />
                          </MenuItem>
                        ) : (stringManipulationCheck.EMPTY_STRING)
                    }
                    {
                      findFeatures(props.vendorRoles?.features, displayText.DELETE_VENDOR_ROLE)
                        ? props.isActive && (
                          <div>
                            <Divider />
                            <MenuItem onClick={(e) => handleDeleteClickOpen()}>
                              <DeleteOutlineOutlinedIcon />
                              {displayText.DELETE}
                            </MenuItem>
                          </div>
                        )
                        : (stringManipulationCheck.EMPTY_STRING)
                    }
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {renderVendorDialog()}
      <AddModal
        open={isEditVendorOpen}
        handleClose={handleCloseEditVendorDialog}
        vendorDetail={actionVendor}
        action={displayText.EDIT} />
    </div>
  );
}
