import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Grid, TextField, MenuItem, InputLabel, Select, FormControl,
  Button, OutlinedInput, InputAdornment, IconButton
} from "@material-ui/core";
import { displayText, stringManipulationCheck } from "../../../constant";
import { isNotEmptyNullUndefined, convertToISODate, formatDate, checkFieldLength, isNotNull } from "../../../components/shared/helper";
import { fieldMappingSheetConfig } from "../../../dataimportconstants";
import { dataImportGrid } from "../../../gridconstants";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { updateToolType } from "../../../store/action/dataImportAction";
import DateFnsUtils from "@date-io/date-fns";
import DataEntryStyles from "../../../scss/dataEntryStyles";
import DatePickerDialog from './datepickerdialog';
import EventIcon from '@material-ui/icons/Event';
import moment from "moment";
import { useDispatch } from "react-redux";

const DataEntry = (props, ref) => {
  useImperativeHandle(ref, () => ({
    GetDataEntryValues: () => {
      handleSaveDataEntry();
    },
  }));

  const [showDatePickerDialog, setShowDatePickerDialog] = useState(false);
  const [datePickerDialogTitle, setDatePickerDialogTitle] = useState(null);
  const [datePickerMinDate, setDatePickerMinDate] = useState(null);
  const [currentDateValue, setCurrentDateValue] = useState(null);

  const [versionNumber, setVersionNumber] = useState(null);
  const [projectNumber, setProjectNumber] = useState(null);
  const [comments, setComments] = useState(null);
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportDate, setReportDate] = useState(new Date());
  // const [importDate, setImportDate] = useState(new Date());
  const [selectedToolType, setSelectedToolType] = useState(displayText.DEFAULT_PARENTID);
  const [selectedToolVendor, setSelectedToolVendor] = useState(displayText.DEFAULT_PARENTID);
  const [selectedToolVendorName, setSelectedToolVendorName] = useState(null);
  const [selectedOperationalAreaCl, setSelectedOperationalAreaCl] = useState(displayText.DEFAULT_PARENTID);
  const [iliToolType, setIliToolType] = useState([]);
  const [iliToolVendor, setIliToolVendor] = useState([]);
  const [operationalAreaCl, setOperationalAreaCl] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(displayText.DEFAULT_PARENTID);
  const [iliClusterRule, setIliClusterRule] = useState([]);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const commonClasses = DataEntryStyles();
  const dispatch = useDispatch();

  const formatFieldValues = (value, previousValue) => {
    return checkFieldLength(value.length, fieldMappingSheetConfig.iliDataCommentsLocationLimit) ? previousValue : value;
  };

  const handleInputChange = (type, e) => {
    switch (type) {
      case displayText.BEGIN_DATE: {
        setBeginDate(e);
        setReportDate(e);
        setEndDate(e);
        return;
      }
      case displayText.END_DATE:
        setReportDate(e);
        return setEndDate(e);
      // case displayText.IMPORT_DATE:
      //   return setImportDate(e);
      case displayText.REPORT_DATE:
        return setReportDate(e);
      case displayText.VERSION_NUMBER:
        return setVersionNumber(formatFieldValues(e.target.value, versionNumber));
      case displayText.PROJECT_NUMBER:
        return setProjectNumber(formatFieldValues(e.target.value, projectNumber));
      case displayText.FROM_LOCATION_DESC:
        return setFromLocation(formatFieldValues(e.target.value, fromLocation));
      case displayText.TO_LOCATION_DESC:
        return setToLocation(formatFieldValues(e.target.value, toLocation));
      case displayText.COMMENTS:
        return setComments(formatFieldValues(e.target.value, comments));
      default:
        return "";
    }
  };

  const handleSaveDataEntry = async () => {
    props.summaryDataSave(createSummaryData());
  };

  const createSummaryData = () => {
    return {
      beginDate: convertToISODate(beginDate),
      endDate: convertToISODate(endDate),
      // importDate: convertToISODate(importDate),
      reportDate: convertToISODate(reportDate),
      versionNumber: versionNumber,
      projectNumber: projectNumber,
      toolTypeCl: selectedToolType,
      toolVendorCl: selectedToolVendor,
      toolOperationalAreaCl: selectedOperationalAreaCl,
      comments: comments,
      clusterRuleCl: selectedCluster,
      fromLocationDesc: fromLocation,
      toLocationDesc: toLocation,
      toolVendorName: selectedToolVendorName
    };
  };

  const getSearchSummaryData = () => {
    props.searchVersion(createSummaryData());
  };

  useEffect(() => {
    setIliToolType(props?.summaryData?.iliToolTypeClNames);
    setIliToolVendor(props?.summaryData?.iliToolVendorClNames);
    setOperationalAreaCl(props?.summaryData?.iliToolOperationalAreaNames);
    setIliClusterRule(props?.summaryData?.iliClusterRuleClNames);
  }, [props.summaryData]);

  useEffect(() => {
    setSelectedToolVendor((props?.selectedVendor === selectedToolVendor || selectedToolVendor === displayText.DEFAULT_PARENTID || !isNotNull(selectedToolVendor))
      ? props?.selectedVendor : selectedToolVendor);
    setSelectedOperationalAreaCl((props?.selectedOperationalArea === selectedOperationalAreaCl || selectedOperationalAreaCl === displayText.DEFAULT_PARENTID || !isNotNull(selectedOperationalAreaCl))
      ? props?.selectedOperationalArea : selectedOperationalAreaCl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  useEffect(() => {
    if (isNotEmptyNullUndefined(props.dataSummary)) {
      setComments(props.dataSummary.comments);
      setVersionNumber(props.dataSummary.versionNumber);
      setProjectNumber(props.dataSummary.projectNumber);
      let formattedBeginDate = formatDate(props.dataSummary.beginDate);
      setBeginDate(formattedBeginDate);
      let formattedEndDate = formatDate(props.dataSummary.endDate);
      setEndDate(formattedEndDate);
      // let formattedImportDate = formatDate(props.dataSummary.importDate);
      // setImportDate(formattedImportDate);
      let formattedReportDate = formatDate(props.dataSummary.reportDate);
      setReportDate(formattedReportDate);
      updateToolTypeValue(props.dataSummary.toolTypeCl);
      setSelectedToolVendor(props.dataSummary.toolVendorCl);
      setSelectedOperationalAreaCl(props.dataSummary.toolOperationalAreaCl);
      setSelectedCluster(props.dataSummary.clusterRuleCl);
      setFromLocation(props.dataSummary.fromLocationDesc);
      setToLocation(props.dataSummary.toLocationDesc);
    }
  }, [props.dataSummary]);

  const getToolVendorData = (event) => {
    if (event) {
      setSelectedToolVendor(event.target.value);
      setSelectedToolVendorName(event.nativeEvent.target.innerText);
      return;
    }
    setSelectedToolVendorName(selectedToolVendorName);
    setSelectedToolVendor(selectedToolVendor);
  };

  const handleDatePickerDialogOpen = (title, minimalDate, selectedDate) => {
    setDatePickerDialogTitle(title);
    setDatePickerMinDate(minimalDate);
    setShowDatePickerDialog(true);
    setCurrentDateValue(selectedDate);
  };

  const handleDatePickerDialogClose = () => {
    setShowDatePickerDialog(false);
    setDatePickerDialogTitle(null);
    setDatePickerMinDate(null);
    setCurrentDateValue(null);
  };

  const onSaveDate = (fieldName, dateValue) => {
    handleInputChange(fieldName, dateValue)
    handleDatePickerDialogClose();
  };

  const onCancelDate = () => {
    handleDatePickerDialogClose();
  };

  const convertDate = (date) => {
    return moment(date).format(displayText.DATE_FORMAT);
  };

  const renderDates = () => {
    return (
      <>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <DatePickerDialog
              showDialog={showDatePickerDialog}
              heading={datePickerDialogTitle}
              openDialog={handleDatePickerDialogOpen}
              onSave={onSaveDate}
              onCancel={onCancelDate}
              inputChange={handleInputChange}
              minimalDate={datePickerMinDate}
              dateValue={currentDateValue}
            />
            <FormControl
              variant="outlined"
              className={commonClasses.formControl}
              onClick={(e) => handleDatePickerDialogOpen(displayText.BEGIN_DATE, null, beginDate)}>
              <InputLabel htmlFor="outlined-age-native-simple" className="formControlLabel">
                {displayText.BEGIN_DATE}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                value={convertDate(beginDate)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle Event"
                      edge="end">
                      <EventIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <FormControl
              variant="outlined"
              className={commonClasses.formControl}
              onClick={(e) => handleDatePickerDialogOpen(displayText.END_DATE, beginDate, endDate)}>
              <InputLabel htmlFor="outlined-age-native-simple" className="formControlLabel">
                {displayText.END_DATE}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                value={convertDate(endDate)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle Event"
                      edge="end">
                      <EventIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          {/* <Grid item xs={dataImportGrid.DataEntryColumn}>
            <FormControl
              variant="outlined"
              className={commonClasses.formControl}
              onClick={(e) => handleDatePickerDialogOpen(displayText.IMPORT_DATE, null, importDate)}>
              <InputLabel htmlFor="outlined-age-native-simple" className="formControlLabel">
                {displayText.IMPORT_DATE}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                value={convertDate(importDate)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle Event"
                      edge="end">
                      <EventIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid> */}
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <FormControl
              variant="outlined"
              className={commonClasses.formControl}
              onClick={(e) => handleDatePickerDialogOpen(displayText.REPORT_DATE, null, reportDate)}>
              <InputLabel htmlFor="outlined-age-native-simple" className="formControlLabel">
                {displayText.REPORT_DATE}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                value={convertDate(reportDate)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle Event"
                      edge="end">
                      <EventIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </MuiPickersUtilsProvider>
      </>
    );
  };

  const updateToolTypeValue = (value) => {
    setSelectedToolType(value);
    dispatch(updateToolType(value));
  }

  const renderFormControl = (type) => {
    switch (type) {
      case displayText.TOOL_TYPE_CL:
        return (
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <FormControl
              variant="outlined"
              className={commonClasses.formControl}
            >
              <InputLabel htmlFor="outlined-age-native-simple">
                {displayText.TOOL_TYPE_CL}
              </InputLabel>
              <Select
                value={selectedToolType}
                onChange={(event) => {
                  event
                    ? updateToolTypeValue(event.target.value)
                    : updateToolTypeValue(selectedToolType);
                }}
                MenuProps={{ disableScrollLock: false }}
                label={displayText.TOOL_TYPE_CL}>
                <MenuItem value={displayText.DEFAULT_PARENTID}>
                  {displayText.SELECT}
                </MenuItem>
                {iliToolType?.map((tool) => (
                  <MenuItem value={tool?.iliToolTypeClGuid}>
                    {tool?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );
      case displayText.VENDOR_CL:
        return (
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <FormControl
              variant="outlined"
              className={commonClasses.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">
                {displayText.VENDOR_CL}
              </InputLabel>
              <Select
                value={selectedToolVendor}
                onChange={(event) => { getToolVendorData(event) }}
                MenuProps={{ disableScrollLock: false }}
                label={displayText.VENDOR_CL}>
                <MenuItem value={displayText.DEFAULT_PARENTID}>
                  {displayText.SELECT}
                </MenuItem>
                {iliToolVendor?.map((vendor) => (
                  <MenuItem value={vendor?.iliToolVendorClGuid}>
                    {vendor?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );
      case displayText.TOOL_OPERATIONAL_AREA_CL:
        return (
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <FormControl
              variant="outlined"
              className={commonClasses.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">
                {displayText.TOOL_OPERATIONAL_AREA_CL}
              </InputLabel>
              <Select
                value={selectedOperationalAreaCl}
                onChange={(event) => {
                  event
                    ? setSelectedOperationalAreaCl(event.target.value)
                    : setSelectedOperationalAreaCl(selectedOperationalAreaCl);
                }}
                MenuProps={{ disableScrollLock: false }}
                label={displayText.TOOL_OPERATIONAL_AREA_CL}>
                <MenuItem value={displayText.DEFAULT_PARENTID}>
                  {displayText.SELECT}
                </MenuItem>
                {operationalAreaCl?.map((tool) => (
                  <MenuItem value={tool?.iliToolOperationalareaClGuid}>
                    {tool?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );
      case displayText.CLUSTER_RULE_CL:
        return (
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <FormControl
              variant="outlined"
              className={commonClasses.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">
                {displayText.CLUSTER_RULE_CL}
              </InputLabel>
              <Select
                value={selectedCluster}
                onChange={(event) => {
                  event
                    ? setSelectedCluster(event.target.value)
                    : setSelectedCluster(selectedCluster);
                }}
                MenuProps={{ disableScrollLock: false }}
                label={displayText.CLUSTER_RULE_CL}>
                <MenuItem value={displayText.DEFAULT_PARENTID}>
                  {displayText.SELECT}
                </MenuItem>
                {iliClusterRule?.map((cluster) => (
                  <MenuItem value={cluster?.iliClusterRuleClGuid}>
                    {cluster?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );
      default:
        return stringManipulationCheck.EMPTY_STRING;
    }
  };

  return (
    <div className={"rootDataEntry"}>
      <form>
        <Grid container spacing={dataImportGrid.DefaultSpacing}>
          {renderDates()}
          {renderFormControl(displayText.TOOL_TYPE_CL)}
          {renderFormControl(displayText.VENDOR_CL)}
          {renderFormControl(displayText.TOOL_OPERATIONAL_AREA_CL)}
          {renderFormControl(displayText.CLUSTER_RULE_CL)}
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <TextField
              variant="outlined"
              value={versionNumber}
              onChange={(e) => handleInputChange(displayText.VERSION_NUMBER, e)}
              id="filled-required"
              label={displayText.VERSION_NUMBER}
              fullWidth />
          </Grid>
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <TextField
              variant="outlined"
              value={projectNumber}
              onChange={(e) => handleInputChange(displayText.PROJECT_NUMBER, e)}
              id="filled-required"
              label={displayText.PROJECT_NUMBER}
              fullWidth />
          </Grid>
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <TextField
              variant="outlined"
              value={fromLocation}
              onChange={(e) => handleInputChange(displayText.FROM_LOCATION_DESC, e)}
              id="filled-required"
              label={displayText.FROM_LOCATION_DESC}
              fullWidth />
          </Grid>
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <TextField
              variant="outlined"
              value={toLocation}
              onChange={(e) => handleInputChange(displayText.TO_LOCATION_DESC, e)}
              id="filled-required"
              label={displayText.TO_LOCATION_DESC}
              fullWidth />
          </Grid>
          <Grid item xs={dataImportGrid.DataEntryColumn}>
            <Button
              className={commonClasses.searchButton}
              onClick={(e) => getSearchSummaryData()}>
              {displayText.SEARCH_DATA}
            </Button>
          </Grid>
          <Grid item xs={dataImportGrid.FullWidth}>
            <TextField
              value={comments}
              variant="outlined"
              onChange={(e) => handleInputChange(displayText.COMMENTS, e)}
              id="filled-required"
              label={displayText.COMMENTS}
              className={commonClasses.formControl}
              fullWidth />
          </Grid>

        </Grid>
      </form>
    </div>
  );
};
export default forwardRef(DataEntry);
