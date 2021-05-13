import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { apiRouter, displayText, errorMessage, stringManipulationCheck } from "../../../constant";
import {
  Typography, Dialog, DialogTitle, DialogActions, DialogContent, Box, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton, Checkbox,
  Grid, InputLabel, Select, FormControl, MenuItem
} from "@material-ui/core";
import CommonStyles from "../../../scss/commonStyles";
import { formatDate } from "../../../components/shared/helper";
import { fieldMappingSheetConfig } from "../../../dataimportconstants";
import { dataImportGrid, gridWidth } from "../../../gridconstants";
import { arrayConstants } from "../../../arrayconstants";

const useRowStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const Versioning = (props, ref) => {
  useImperativeHandle(ref, () => ({
    getSearchedData: () => {
      selectedVersion();
    },
  }));
  const classes = useRowStyles();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [version, setVersion] = React.useState([]);
  const commonClasses = CommonStyles();
  const [iliInspectionList, setIliInspectionList] = React.useState([]);
  const [selectedInspectionId, setSelectedInspectionId] = React.useState(stringManipulationCheck.EMPTY_STRING);
  const [openInspection, setOpenInspection] = React.useState(false);

  useEffect(() => {
    if (props?.versionList) {
      setVersion(props?.versionList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.versionList]);

  const selectedVersion = () => {
    let selectedVersionList = [];
    version.forEach((data) => {
      if (data.isActive)
        selectedVersionList.push(data);
    });
    let distinctVersions = new Set(selectedVersionList.map((element) => element.iliInspectionGuid));
    let result = [];
    distinctVersions.forEach((element) => {
      result.push({
        id: element,
        name: selectedVersionList.find((s) => s.iliInspectionGuid === element).inspectionNumber,
      });
    });
    setIliInspectionList(result);
    if (result.length > fieldMappingSheetConfig.versionDropdownLimit) {
      setDialogOpen(true);
      setSelectedInspectionId(displayText.DEFAULT_PARENTID);
      return;
    }
    let versions = [];
    version.forEach((element) => {
      if (element.iliInspectionGuid === selectedVersionList[arrayConstants.initialOrder]?.iliInspectionGuid) {
        versions.push(element);
      }
    });
    props.savedVersions(versions);
  };

  const checkVersion = (row, index) => {
    let versionReference = Object.assign([], version); // copy without reference
    if (versionReference[index]) {
      versionReference[index][apiRouter.IS_ACTIVE] = !row.isActive;
    }
    setVersion(versionReference);
  };

  const handleOpenInspection = (value) => {
    setOpenInspection(value);
  };

  const selectedInspectionList = () => {
    let versions = [];
    version.forEach((element) => {
      if (element.iliInspectionGuid === selectedInspectionId) {
        versions.push(element);
      }
    });
    props.savedVersions(versions);
    setDialogOpen(false);
  };

  const renderVersionHeader = () => {
    return (
      <TableHead>
        <TableRow className="version-header">
          <TableCell></TableCell>
          <TableCell>{displayText.INSPECTION_ID}</TableCell>
          <TableCell>{displayText.VERSION_ID}</TableCell>
          <TableCell>{displayText.PROJECT_NO}</TableCell>
          <TableCell>{displayText.FROM_LOC}</TableCell>
          <TableCell>{displayText.TO_LOC}</TableCell>
          <TableCell>{displayText.VENDOR_CL}</TableCell>
          <TableCell>{displayText.TOOL_TYPE} </TableCell>
          <TableCell>{displayText.REPORT_DATE}</TableCell>
          <TableCell>{displayText.BEGIN_DATE}</TableCell>
          <TableCell>{displayText.END_DATE}</TableCell>
          <TableCell>{displayText.IMPORT_DATE}</TableCell>
          <TableCell>{displayText.STATUS}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const renderDialog = () => {
    return (
      <Dialog
        open={dialogOpen}
        keepMounted
        onClose={(e) => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth={true}
        disableBackdropClick={true}>
        <DialogTitle className={commonClasses.dialogTitle}>
          {displayText.CHOOSE_INSPECTION}
        </DialogTitle>
        <DialogContent className={classes.dialogOverflow}>
          <div className={commonClasses.modelDropdownPadding}>
            <div className={"margin-bottom-20"}>
              <b>{errorMessage.PLEASE_SELECT_ONE_VERSION}</b>
            </div>
            <Grid
              container
              spacing={dataImportGrid.DefaultSpacing}
              className={commonClasses.modelDropdownHeight}>
              <Grid item xs={gridWidth.MaxWidth}>
                <FormControl
                  variant="outlined"
                  className={commonClasses.dropdownWidth}>
                  <InputLabel htmlFor="outlined-age-native-simple">
                    {displayText.SELECT_INSPECTION}
                  </InputLabel>
                  <Select
                    open={openInspection}
                    onClose={() => handleOpenInspection(false)}
                    onOpen={() => handleOpenInspection(true)}
                    value={selectedInspectionId}
                    onChange={(event) => { setSelectedInspectionId(event.target.value); }}
                    MenuProps={{ disableScrollLock: false }}
                    label={displayText.SELECT_INSPECTION}>
                    <MenuItem value={displayText.DEFAULT_PARENTID}>
                      {displayText.SELECT}
                    </MenuItem>
                    {iliInspectionList?.map((inspection, idx) => (
                      <MenuItem key={idx} value={inspection.id}>
                        {inspection.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            variant="contained"
            className={commonClasses.inspectionBtnWidth}
            onClick={(e) => selectedInspectionList()}>
            {displayText.OK}
          </Button>
          <Button
            className={commonClasses.cancelBtn}
            onClick={(e) => setDialogOpen(false)}>
            {displayText.CANCEL}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  function Row(rowProps) {
    const { row } = rowProps;
    const index = rowProps.index;
    const [open, setOpen] = React.useState(false);
    return (
      <React.Fragment>
        <TableRow className={(classes.root, commonClasses.panelBackground)}>
          <TableCell component="th" scope="row">
            <Checkbox
              name="checkedB"
              color="primary"
              onChange={() => checkVersion(row, index)}
              checked={row.isActive} />
          </TableCell>
          <TableCell>{row.inspectionNumber}</TableCell>
          <TableCell>{row.versionId}</TableCell>
          <TableCell>{row.projectNumber}</TableCell>
          <TableCell>{row.fromLocationDesc}</TableCell>
          <TableCell>{row.toLocationDesc}</TableCell>
          <TableCell>{row.toolVendorDescription}</TableCell>
          <TableCell>{row.toolTypeClDescription}</TableCell>
          <TableCell>{formatDate(row.reportDate)}</TableCell>
          <TableCell>{formatDate(row.beginDate)}</TableCell>
          <TableCell>{formatDate(row.endDate)}</TableCell>
          <TableCell>{formatDate(row.importDate)}</TableCell>
          <TableCell>{row.status}</TableCell>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            className={commonClasses.paddingCell}
            colSpan={fieldMappingSheetConfig.versionNotesColumnSplit}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box
                margin={fieldMappingSheetConfig.versionNotesBoxMargin}
                className="version-notes">
                <Typography variant="h6" gutterBottom component="div">
                  <b>{displayText.NOTES}:</b>
                  <div>{row.versionNotes}</div>
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          {renderVersionHeader()}
          <TableBody>
            {version.length > fieldMappingSheetConfig.fieldMapLengthCheck && version?.map((row, index) => (
              <Row key={row.name} index={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {renderDialog()}
    </>
  );
};

export default forwardRef(Versioning);
