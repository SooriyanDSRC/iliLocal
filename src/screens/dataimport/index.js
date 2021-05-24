import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import LoadingOverlay from "react-loading-overlay";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
   FormControl, Typography, InputLabel, CircularProgress, TextField, Dialog, DialogTitle,
   DialogActions, DialogContent, MenuItem, Box, AppBar, Tabs, Tab, RadioGroup,
   FormControlLabel, Radio, Grid, Checkbox, Accordion, AccordionSummary, AccordionDetails
} from "@material-ui/core";
import 'react-data-grid/dist/react-data-grid.css';
import DataGrid from 'react-data-grid';
import { useDispatch, useSelector } from "react-redux";
import Select from "@material-ui/core/Select";
import * as snackbarActionCreator from "../../store/action/snackbarAction";
import * as dataImportActionCreator from "../../store/action/dataImportAction";
import SheetTabs from "./dataimporttab";
import _ from "lodash";
import {
   apiRouter, sessionStorageKey, displayText, errorMessage,
   formDataInput, stringManipulationCheck, index, regularExpression,
   initialCharacterIndex
} from "../../constant";
import { dataImportGrid, gridWidth } from "../../gridconstants";
import { fieldMappingSheetConfig, fieldCheck } from "../../dataimportconstants";
import "react-data-grid/dist/react-data-grid.css";
import Fieldmapping from "./fieldmapping";
import {
   isEmpty, isNotEmptyNullUndefined, getSteps, convertToValidPrecisionNumber,
   removeSpecialCharacter, isUndefined, deleteFile, fetchUnitConversion,
   decryptData, removeCharacter, isNotNull, encryptData
} from "../../components/shared/helper";
import * as actionCreator from "../../store/action/dataImportAction";
import DataEntry from "./dataentry";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import { ProgressBar, Jumbotron, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import serviceCall from "../../store/serviceCall";
import QcDashboard from "./qcdashboard";
import CommonStyles from '../../scss/commonStyles';
import Versioning from './versioning';
import { arrayConstants } from '../../arrayconstants';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import ClientChangeModal from '../../components/containers/clientChangeModal';

const useStyles = makeStyles((theme) => ({
   root: {
      width: "100%",
      backgroundColor: "#f9fafa !important"
   },
   errorMessageStyle: {
      color: "red",
      marginLeft: "5%"
   },
   infoMessageStyle: {
      color: "#808080",
      marginLeft: "5%"
   },
   splitPane: {
      height: "20vh"
   },
   alignCenter: {
      width: "45%",
      paddingTop: "5%",
      marginRight: "auto",
      marginLeft: "auto"
   },
   backButton: {
      margin: "0px 0px 16px",
      marginRight: "auto",
      marginleft: "12px",
      width: "97px",
      background: "#00648d",
      borderRadius: 8,
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#c6c6c6",
         color: "#000000"
      },
      height: "46px",
      color: "#ffffff"
   },
   restartButton: {
      margin: "0px 8px 16px",
      marginRight: "auto",
      marginleft: "12px",
      width: "100px",
      background: "#00648d",
      borderRadius: 8,
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#c6c6c6",
         color: "#000000"
      },
      height: "53px",
      color: "#ffffff"
   },
   formControl: {
      minWidth: "100%"
   },
   chooseFileAlignCenter: {
      width: "45%",
      paddingTop: "5%",
      marginRight: "auto",
      marginLeft: "auto"
   },
   chooseFileAlignCenterRestart: {
      width: "45%",
      paddingTop: "5%",
      marginRight: "auto",
      marginLeft: "auto"
   },
   qcPopUp: {
      marginRight: "auto",
      marginLeft: "auto",
      paddingBottom: "25px"
   },
   afterFooterBtnStyles: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      marginTop: "auto",
      height: "50px",
      alignItems: "center",
      position: "relative",
      justifyContent: "space-between",
      bottom: "5px"
   },
   marginCenter: {
      marginLeft: "auto",
      marginRight: "auto"
   },
   spinnerStyle: {
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
      marginLeft: "auto",
      marginRight: "auto"
   },
   dashboardData: {
      padding: "20px 35px 12px 35px"
   },
   qcSubmitOk: {
      width: "15% !important",
      margin: theme.spacing(0, 1, 2),
      background: "#00648d",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   },
   qcsubmitOk: {
      width: "15% !important",
      margin: theme.spacing(0, 1, 2),
      background: "#ffffff",
      borderRadius: 8,
      color: "#808080",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#fffff",
         color: "#000000"
      }
   },
   errorValidationOk: {
      margin: theme.spacing(3, 3, 2),
      background: "#00648d",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   },
   redirectOk: {
      margin: theme.spacing(3, 1, 2),
      background: "#00648d",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   },
   versionModel: {
      height: "100% !important",
      marginTop: "-8px !important"
   },
   savebtn: {
      margin: theme.spacing(3, 0, 2),
      background: "#00648d",
      borderRadius: 8,
      height: "40px",
      width: "100px",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   },
   dataSummary: {
      paddingTop: 10,
      paddingBottom: 10,
      height: "70vh"
   },
   fileDetails: {
      paddingTop: "10px",
      height: "auto"
   },
   labelStyle: {
      color: "#00648d",
      textAlign: "left",
      width: "100%"
   },
   dialogOverflow: {
      overflowY: "hidden"
   },
   labelPadding: {
      marginTop: "15px"
   },
   noDataStyling: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "16px"
   },
   infoCheckBoxColor: {
      color: "#2eb85c !important",
      padding: "10px 0px"
   },
   textFieldPadding: {
      paddingTop: '10px'
   },
   cancelbtn: {
      margin: theme.spacing(3, 2, 2),
      background: "#b6b6b6",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#c6c6c6",
         color: "#000000"
      }
   },
   userInfoImage: {
      padding: "10px !important",
      width: "50px !important",
      height: "50px !important"
   },
   UnitOfMeasureOk: {
      width: "15% !important",
      margin: theme.spacing(2, 1, 2),
      background: "#00648d",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   },
   unitsDropdown: {
      width: "100%"
   },
   unitImg: {
      backgroundColor: "#00648d",
      color: "#ffffff",
      borderRadius: "4px",
      fontSize: "32px",
      marginTop: "30px"
   },
   errorList: {
      paddingInlineStart: "15px !important",
      marginBottom: "0px !important"
   }
}));

const chunkSize = 1048576 * 3; //its 3MB, increase the number measure in mb

export default function DataImport() {
   const classes = useStyles();
   const dispatch = useDispatch();
   const {
      vendorsList, summaryList, masterList, showOverlayLoader, showOverlayLoaderMessage,
      isVendorOperationalAdded, fieldMappingErrorValidation, fieldMappingErrorValidationValue,
      matchingDetailUpdate, revertCompleted, dataSummaryVendor, dataSummaryOperationalArea,
      operationalList, excelData, matchingDetails, loader, unitList, versionList,
      quantityList, dataSaveCompleted, selectedIliSummarySheetData, featureTypes, isSummaryLoading,
      isVendorLoading, isOperationalAreaLoading
   } = useSelector((state) => state.dataImportManage);
   const [activeStep, setActiveStep] = useState(0);
   const [selectedVendor, setSelectedVendor] = useState(displayText.DEFAULT_PARENTID);
   const [selectedOperationalArea, setSelectedOperationalArea] = useState(displayText.DEFAULT_PARENTID);
   const [open, setOpen] = useState(false);
   const [vendorOpen, setVendorOpen] = useState(false);
   const [maximumOperatingPressure, setMaximumOperatingPressure] = useState(stringManipulationCheck.EMPTY_STRING);
   const [maximumYieldStrength, setMaximumYieldStrength] = useState(stringManipulationCheck.EMPTY_STRING);
   const [outerDiameter, setOuterDiameter] = useState(stringManipulationCheck.EMPTY_STRING);
   const [dashboardFieldDialog, setDashboardFieldDialogOpen] = useState(false);
   const [file, setFile] = useState({
      fileObj: stringManipulationCheck.EMPTY_STRING,
      fileName: stringManipulationCheck.EMPTY_STRING,
   });
   const [isShowError, setIsShowError] = useState(false);
   const steps = getSteps();
   const clientDetails = JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS));
   const [MOP, setMOP] = useState(false);
   const [SMYS, setSMYS] = useState(false);
   const [OD, setOD] = useState(false);
   const childRef = useRef();
   const versionChildRef = useRef();
   const [iliDataSummary, setIliDataSummary] = useState(stringManipulationCheck.EMPTY_STRING);
   const [fieldMappingData, setFieldMappingData] = useState([]);
   const [isExcelReady, setIsExcelReady] = useState(false);
   const [fieldMappingFieldsData, setFieldMappingFieldsData] = useState([]);
   const [fileToBeUpload, setFileToBeUpload] = useState({});
   const [beginningOfTheChunk, setBeginningOfTheChunk] = useState(0);
   const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize);
   const [progress, setProgress] = useState(0);
   const [fileGuid, setFileGuid] = useState(stringManipulationCheck.EMPTY_STRING);
   const [fileSize, setFileSize] = useState(0);
   const [chunkCount, setChunkCount] = useState(0);
   const [showProgress, setShowProgress] = useState(false);
   const [counter, setCounter] = useState(1);
   const [fileName, setFileName] = useState(stringManipulationCheck.EMPTY_STRING);
   const [enableRestart, setEnableRestart] = useState(false);
   const [enableCancel, setEnableCancel] = useState(true);
   const [confirmCancel, setConfirmCancel] = useState(false);
   const [vendorLabel, setVendorLabel] = useState(stringManipulationCheck.EMPTY_STRING);
   const [operationalAreaLabel, setOperationalAreaLabel] = useState(stringManipulationCheck.EMPTY_STRING);
   const [overlayText, setOverlayText] = useState(stringManipulationCheck.EMPTY_STRING);
   const [isOuterDiameterError, setIsOuterDiameterError] = useState(false);
   const [isMaxPressureError, setIsMaxPressureError] = useState(false);
   const [isMaxPressureNegative, setIsMaxPressureNegative] = useState(false);
   const [isOuterDiameterNegative, setIsOuterDiameterNegative] = useState(false);
   const [isMinimumYieldStrengthNegative, setIsMinimumYieldStrengthNegative] = useState(false);
   const [tabValue, setTabValue] = useState(0);
   const commonClasses = CommonStyles();
   const [showVersion, setShowVersion] = useState(false);
   const [openDialog, setOpenDialog] = useState(false);
   const [version, setVersion] = useState([]);
   const [selectedVersions, setSelectedVersions] = useState([]);
   const [mopOptionValue, setMOPOptionValue] = useState(fieldMappingSheetConfig.defaultQcInputRadioValue);
   const [mysOptionValue, setMYSOptionValue] = useState(fieldMappingSheetConfig.defaultQcInputRadioValue);
   const [odOptionValue, setODOptionValue] = useState(fieldMappingSheetConfig.defaultQcInputRadioValue);
   const [showMOPOption, setShowMOPOption] = useState(false);
   const [showMYSOption, setShowMYSOption] = useState(false);
   const [showODOption, setShowODOption] = useState(false);
   const [checkMOP, setCheckMOP] = useState(false);
   const [checkMYS, setCheckMYS] = useState(false);
   const [checkOD, setcheckOD] = useState(false);
   const [redirectWarningDialog, setRedirectWarningDialog] = useState(false);
   const [unitOfMeasureDialog, setUnitOfMeasureDialog] = useState(false);
   const [openUnits, setOpenUnits] = useState(false);
   const [openSubUnits, setOpenSubUnits] = useState(false);
   const [selectedUnit, setSelectedUnit] = useState(displayText.DEFAULT_PARENTID);
   const [selectedSubUnit, setSelectedSubUnit] = useState(displayText.DEFAULT_PARENTID);
   const [selectedSubUnitAbbr, setSelectedSubUnitAbbr] = useState(displayText.DEFAULT_PARENTID);
   const [unitQuantityList, setUnitQuantityList] = useState([]);
   const [maopUnit, setMaopUnit] = useState(null);
   const [maopSubUnit, setMaopSubUnit] = useState(null);
   const [maopAbbr, setMaopAbbr] = useState(null);

   const [smysUnit, setSmysUnit] = useState(null);
   const [smysSubUnit, setSmysSubUnit] = useState(null);
   const [smysAbbr, setSmysAbbr] = useState(null);

   const [odUnit, setOdUnit] = useState(null);
   const [odSubUnit, setOdSubUnit] = useState(null);
   const [odAbbr, setOdAbbr] = useState(null);

   const [featureTypeRow, setFeatureTypeRow] = useState(false);
   const [featureTypeDropDown, setFeatureTypeDropDown] = useState(false);
   const [featureTypeDropDownOpen, setFeatureTypeDropDownOpen] = useState(false);
   const [selectedFeatureType, setSelectedFeatureType] = useState(displayText.DEFAULT_PARENTID);

   const [selectedAccordion, setSelectedAccordion] = useState(null);

   const [currentSelectedUnit, setCurrentSelectedUnit] = useState(null);
   const [maximumOperatingPressureConvertedValue, setMaximumOperatingPressureConvertedValue] = useState(null);
   const [smysConvertedValue, setSmysConvertedValue] = useState(null);
   const [odConvertedValue, setOdConvertedValue] = useState(null);
   const progressInstance = (<ProgressBar animated now={_.round(progress)} label={`${_.round(progress.toFixed(1))}%`} />);
   const [dataImportDialog, setDataImportDialog] = useState(false);

   const [isVendorOperationalSave, setIsVendorOperationalSave] = useState(false);

   const fieldMappingInitialData = () => {
      setMOP(false);
      setSMYS(false);
      setOD(false);
      setShowMOPOption(false);
      setShowMYSOption(false);
      setShowODOption(false);
      setcheckOD(false);
      setShowODOption(false);
      setCheckMOP(false);
      setShowMYSOption(false);
      setCheckMYS(false);
      setMOPOptionValue(fieldMappingSheetConfig.defaultQcInputRadioValue);
      setMYSOptionValue(fieldMappingSheetConfig.defaultQcInputRadioValue);
   };

   const checkFeatureTypes = (defaultValue = null) => {
      if (defaultValue) {
         setSelectedFeatureType(defaultValue);
      }
      if (featureTypes.length === fieldMappingSheetConfig.singleObjectArrayLength) {
         setSelectedFeatureType(_.head(featureTypes)?.iliAnomalyTypeClGuid);
      }
   }

   const checkDashboardFields = () => {
      if (fieldMappingData) {
         fieldMappingInitialData();
         setODOptionValue(fieldMappingSheetConfig.defaultQcInputRadioValue);
         let fieldMappingFiltered = fieldMappingDataFilter(fieldMappingData);
         if (_.find(fieldMappingFiltered, (field) => { return field.tableColumn === `${displayText.ILI_DATA_TABLE}.${displayText.MAOP_COLUMN}` })) {
            setMOP(true);
            setMOPOptionValue(fieldMappingSheetConfig.fieldMapRadioValue);
            setShowMOPOption(true);
            setCheckMOP(true);
         }
         if (_.find(fieldMappingFiltered, (field) => { return field.tableColumn === `${displayText.ILI_DATA_TABLE}.${displayText.SMYS_COLUMN}` })) {
            setSMYS(true);
            setShowMYSOption(true);
            setCheckMYS(true);
            setMYSOptionValue(fieldMappingSheetConfig.fieldMapRadioValue);
         }
         if (_.find(fieldMappingFiltered, (field) => { return field.tableColumn === `${displayText.ILI_DATA_TABLE}.${displayText.OD_COLUMN}` })) {
            setOD(true);
            setODOptionValue(fieldMappingSheetConfig.fieldMapRadioValue);
            setcheckOD(true);
            setShowODOption(true);
         }
         let isFeatureTypeMapped = isNotEmptyNullUndefined(
            _.find(fieldMappingFiltered, (field) => {
               return field.tableColumn === `${displayText.ILI_DATA_TABLE}.${displayText.FEATURE_TYPE_COLUMN}`
            })
         );
            setFeatureTypeRow(isFeatureTypeMapped);
            setFeatureTypeDropDown(isFeatureTypeMapped);
            isFeatureTypeMapped ? checkFeatureTypes() : checkFeatureTypes(displayText.DEFAULT_PARENTID);
         let maopColumnField = _.find(fieldMappingFiltered, { tableColumn: `${displayText.ILI_DATA_TABLE}.${displayText.MAOP_COLUMN}` });
         let smysColumnField = _.find(fieldMappingFiltered, { tableColumn: `${displayText.ILI_DATA_TABLE}.${displayText.SMYS_COLUMN}` });
         let odColumnField = _.find(fieldMappingFiltered, { tableColumn: `${displayText.ILI_DATA_TABLE}.${displayText.OD_COLUMN}` });
         if (isNotEmptyNullUndefined(maopColumnField?.unitType)) {
            setMaopUnit(maopColumnField?.unitType);
            setMaopSubUnit(maopColumnField?.excelUnitName);
            setMaopAbbr(maopColumnField?.excelUnit);
         }
         if (isNotEmptyNullUndefined(smysColumnField?.unitType)) {
            setSmysUnit(smysColumnField?.unitType);
            setSmysSubUnit(smysColumnField?.excelUnitName);
            setSmysAbbr(smysColumnField?.excelUnit);
         }
         if (isNotEmptyNullUndefined(odColumnField?.unitType)) {
            setOdUnit(odColumnField?.unitType);
            setOdSubUnit(odColumnField?.excelUnitName);
            setOdAbbr(odColumnField?.excelUnit);
         }
         setDashboardFieldDialogOpen(true);
      }
   };

   useEffect(() => {
      if (activeStep === fieldMappingSheetConfig.qcDashboardScreen) {
         checkDashboardFields();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [fieldMappingData]);

   useEffect(() => {
      if (activeStep === fieldMappingSheetConfig.iliDataSummaryScreen) {
         setEnableCancel(true)
      }
   }, [activeStep]);

   const fieldMappingDataFilter = (fieldMappedData) => {
      let selectedSheetIndex = _.map(selectedIliSummarySheetData, index);
      return _.filter(fieldMappedData, function (currentObject) {
         return currentObject.tableColumn !== displayText.DEFAULT_PARENTID && _.includes(selectedSheetIndex, currentObject.sheetIndex);
      });
   };

   const handleNext = () => {
      const { fileObj } = file;
      if (activeStep === fieldMappingSheetConfig.dataImportScreen && (isEmpty(fileObj) || selectedVendor === displayText.DEFAULT_PARENTID || !confirmCancel)) {
         if (selectedVendor === displayText.DEFAULT_PARENTID) {
            setIsShowError(true);
            return;
         }
         if (!confirmCancel && fileObj !== stringManipulationCheck.EMPTY_STRING) {
            dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.PLEASE_WAIT_UNTIL_UPLOAD));
            return;
         }
         dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.PLEASE_UPLOAD_EXCEL));
      }
      else if (activeStep === fieldMappingSheetConfig.iliDataSummaryScreen) {
         let isIliSummarySelected = _.find(selectedIliSummarySheetData, (sheetData) => {
            return sheetData?.isTabChecked;
         });
         if (_.isNull(selectedIliSummarySheetData) || !isUndefined(isIliSummarySelected)) {
            setOpenDialog(true);
            return;
         }
         childRef.current.GetDataEntryValues();
         version?.length > arrayConstants.nonEmptyArray
            ? versionChildRef.current.getSearchedData()
            : setActiveStep((prevActiveStep) => prevActiveStep + fieldMappingSheetConfig.incrementStepper);
      }
      else if (activeStep === fieldMappingSheetConfig.fieldMappingScreen && fieldMappingData.length === fieldMappingSheetConfig.fieldMapLengthCheck) {
         dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.PLEASE_COMPLETE_FIELD_MAPPING));
      }
      else if (activeStep === fieldMappingSheetConfig.fieldMappingScreen) {
         childRef.current.GetFieldMappingData();
         fieldMappingCheck();
      }
      else setActiveStep((prevActiveStep) => prevActiveStep + fieldMappingSheetConfig.incrementStepper);
   };

   const fieldMappingCheck = () => {
      let filteredFieldMappingData = fieldMappingDataFilter(fieldMappingData);
      let fieldMapParentIdCheck = _.filter(filteredFieldMappingData, function (currentObject) {
         return currentObject.tableColumn !== displayText.DEFAULT_PARENTID && currentObject.tableColumn !== undefined;
      });
      let fieldMapValidate = fieldMapParentIdCheck.map((fieldData) => {
         let occurance = filteredFieldMappingData.filter((field) => {
            const isSheetIndexEqual = field.sheetIndex === fieldData.sheetIndex;
            const isTableColumnEqual = field.tableColumn === fieldData.tableColumn;
            const isNotIgnored = field.tableColumn !== displayText.FIELD_MAPPING_IGNORED;
            const isTableColumnNotNull = field.tableColumn !== null;
            const isTableColumnEmpty = field.tableColumn !== stringManipulationCheck.EMPTY_STRING
            return isSheetIndexEqual && isTableColumnEqual && isNotIgnored && isTableColumnNotNull && isTableColumnEmpty;
         });
         let duplicateBoolean = occurance.length > fieldMappingSheetConfig.occurrenceLengthCheck;
         return {
            fieldName: fieldData.excelColumn,
            count: occurance.length,
            duplicate: duplicateBoolean,
            occurance: occurance
         };
      });
      let fieldMapNullCheck = _.find(fieldMapParentIdCheck, { tableColumn: undefined });
      let fieldMapDuplicateCheck = _.find(fieldMapValidate, { duplicate: true });
      if (fieldMapDuplicateCheck) {
         let duplicateFields = _.find(fieldMapValidate, { duplicate: true }).occurance;
         dispatch(snackbarActionCreator.showFailureSnackbar(duplicateFields.map(e => e.excelColumn).join(fieldCheck.joinColumnText) + errorMessage.HAS_DUPLICATE_COLUMN));
      }
      else if (fieldMapNullCheck) {
         dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.PLEASE_SELECT_TABLE_COLUMN + fieldMapNullCheck.excelColumn));
      }
      else if (fieldMapParentIdCheck.length === fieldMappingSheetConfig.fieldMapLengthCheck) {
         dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.PLEASE_COMPLETE_FIELD_MAPPING));
      }
      else {
         checkDashboardFields();
      }
   };

   const getFieldMappingData = (overallRelation) => {
      setFieldMappingFieldsData(overallRelation);
   };

   const handleBack = (step, isForceBack) => {
      if (isForceBack) {
         setActiveStep(step);
         dispatch(actionCreator.ClearFieldMappingErrorValidation());
         return;
      }
      if (activeStep === fieldMappingSheetConfig.fieldMappingScreen) {
         childRef.current.GetFieldMappingData();
      }
      if (step === fieldMappingSheetConfig.dataImportScreen) {
         if (dataSaveCompleted) {
            onContinueClick();
            setDataImportDialog(false)
            setActiveStep(step);
            return;
         }
         setDataImportDialog(true);
         return;
      }
      if ((step === fieldMappingSheetConfig.fieldMappingScreen || step === fieldMappingSheetConfig.iliDataSummaryScreen) && dataSaveCompleted) {
         setRedirectWarningDialog(true);
         return;
      }
      if (activeStep === fieldMappingSheetConfig.qcDashboardScreen) {
         dispatch(actionCreator.ClearFieldMappingErrorValidation());
      }
      setActiveStep(step);
   };

   const handleNavigation = (step) => {
      if (step > activeStep) handleNext();
      else if (step < activeStep) handleBack(step);
   };

   const getVendorsList = () => {
      const url = `${apiRouter.COMMON}/${apiRouter.GET_VENDORS}`;
      dispatch(actionCreator.GetVendorsList(url));
   };

   const getOperationalAreaList = () => {
      const url = `${apiRouter.COMMON}/${apiRouter.GET_OPERATIONAL_AREA_LIST
         }?${displayText.CLIENTSGUID}=${clientDetails?.clientsGuid}`;
      dispatch(actionCreator.GetOperationalAreaList(url));
   };

   const getUnitList = () => {
      const url = `${apiRouter.FIELD_MAPPING}/${apiRouter.UNIT}`;
      dispatch(actionCreator.GetUnitList(url));
   };

   const getFeatureList = () => {
      const url = `${apiRouter.EXCEL_IMPORT}/${apiRouter.GET_ANOMALY_CATEGORY}`;
      dispatch(actionCreator.GetFeaturesList(url));
   };

   const getSummaryList = () => {
      const url = `${apiRouter.FIELD_MAPPING}/${apiRouter.GET_SUMMARY_LIST}`;
      dispatch(actionCreator.GetILISummaryFields(url));
   };

   const getPreviewData = (formData) => {
      const url = `${apiRouter.EXCEL_IMPORT}/${apiRouter.IMPORT_EXCEL_DATA}`;
      dispatch(dataImportActionCreator.FetchExcelData(url, formData, false));
   };

   const GetMasterSummaryList = () => {
      const url = `${apiRouter.FIELD_MAPPING}/${apiRouter.GET_TABLE_UNITS}`;
      dispatch(actionCreator.GetMasterList(url));
   };

   const isNegativeNumber = (number) => {
      if (number.charAt(fieldCheck.initialFieldCount) !== stringManipulationCheck.DECREMENT_OPERATOR) {
         return true;
      }
      return false;
   };

   const handleSaveDashboardFields = () => {
      if (isShowError) { return; }
      let mopFlag = !MOP && (!isNotEmptyNullUndefined(maximumOperatingPressure) || !isNegativeNumber(maximumOperatingPressure));
      let smysFlag = !SMYS && (!isNotEmptyNullUndefined(maximumYieldStrength) || !isNegativeNumber(maximumYieldStrength));
      let odFlag = !OD && (!isNotEmptyNullUndefined(outerDiameter) || !isNegativeNumber(outerDiameter));
      if (mopFlag || smysFlag || odFlag) {
         return setIsShowError(true);
      }
      updateFieldMapping(`${displayText.ILI_DATA_TABLE}.${displayText.MAOP_COLUMN}`, maopUnit, maopSubUnit, maopAbbr, fieldMappingData);
      updateFieldMapping(`${displayText.ILI_DATA_TABLE}.${displayText.SMYS_COLUMN}`, smysUnit, smysSubUnit, smysAbbr, fieldMappingData);
      updateFieldMapping(`${displayText.ILI_DATA_TABLE}.${displayText.OD_COLUMN}`, odUnit, odSubUnit, odAbbr, fieldMappingData);
      saveILIData();
   };

   useEffect(() => {
      getVendorsList();
      getOperationalAreaList();
      getUnitList();
      getFeatureList();
      getAllSubunit();
      setIsShowError(false);
      GetMasterSummaryList();
      const unloadFileName = fileGuid;
      return () => {
         setIsShowError(false);
         deleteFile(unloadFileName);
         dispatch(dataImportActionCreator.ClearFieldMappingErrorValidation())
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const getAllSubunit = () => {
      const url = `${apiRouter.FIELD_MAPPING}/${apiRouter.GET_ALL_UNITS}`;
      dispatch(actionCreator.GetAllUnitsList(url));
   }

   useEffect(() => {
      window.addEventListener('beforeunload', function (event) {
         event.preventDefault();
         let userDetail = JSON.parse(decryptData(sessionStorageKey.USER_DETAILS));
         if (isNotNull(userDetail) && isNotEmptyNullUndefined(fileGuid)) {
            let url = `${apiRouter.FILE_UPLOAD}/${apiRouter.UPLOAD_CANCEL}?${apiRouter.DELETE_ORIGINAL_FILE}=${false}&${apiRouter.FILE_NAME}=${fileGuid}`;
            serviceCall.deleteFileCall(url);
            setFileGuid(stringManipulationCheck.EMPTY_STRING);
         }
         event.returnValue = "";
      });
   }, [fileGuid])

   const handleOpen = () => {
      setOpen(true);
   };

   const handleVendorOpen = () => {
      setVendorOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const handleVendorClose = () => {
      setVendorOpen(false);
   };

   const handleDialog = (isOpen) => {
      setOpenDialog(isOpen);
   };

   useEffect(() => {
      if (fieldMappingErrorValidation === false) {
         setActiveStep(fieldMappingSheetConfig.qcDashboardScreen);
      }
   }, [fieldMappingErrorValidation]);

   useEffect(() => {
      if (matchingDetailUpdate) {
         dispatch(actionCreator.ClearUpdatedMatchingDetails());
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [matchingDetailUpdate]);

   useEffect(() => {
      if (excelData && !confirmCancel) {
         window.setTimeout(() => {
            setEnableCancel(true);
         }, fieldMappingSheetConfig.stateUpdateDelay);
         setProgress(fieldMappingSheetConfig.progressBarConclude);
         if (selectedVendor !== displayText.DEFAULT_PARENTID) {
            setActiveStep((prevActiveStep) => prevActiveStep + fieldMappingSheetConfig.incrementStepper);
            saveVendorOperationArea();
         }
         if (activeStep === fieldMappingSheetConfig.dataImportScreen && selectedVendor !== displayText.DEFAULT_PARENTID) {
            setIsExcelReady(true);
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [excelData]);

   const saveVendorOperationArea = () => {
      const data = {
         IliToolVendorClGuid: selectedVendor,
         IliToolOperationalAreaClGuid: selectedOperationalArea === displayText.DEFAULT_PARENTID ? null : selectedOperationalArea,
         iliToolVendorDescription: vendorLabel,
         iliToolOperationalAreaDescription: operationalAreaLabel
      }
      const url = `${apiRouter.EXCEL_IMPORT}/${apiRouter.SAVE_VENDOR_OPERATIONAL}`;
      setIsVendorOperationalSave(true);
      dispatch(actionCreator.SaveVendorArea(url, data));
   };

   const handleChange = (type, e) => {
      if (!isNotEmptyNullUndefined(e.target.value)) {
         return stringManipulationCheck.EMPTY_STRING;
      }
      switch (type) {
         case displayText.MAX_OPERATING_PRESSURE:
            if (e.target.value === displayText.INITIAL_VALUE) {
               setMOP(true);
               return setMOPOptionValue(e.target.value);
            }
            setMOP(false);
            setShowMOPOption(checkMOP);
            return setMOPOptionValue(e.target.value)
         case displayText.MIN_YIELD_STRENGTH:
            if (e.target.value === displayText.INITIAL_VALUE) {
               setSMYS(true);
               return setMYSOptionValue(e.target.value);
            }
            setSMYS(false);
            setShowMYSOption(checkMYS);
            return setMYSOptionValue(e.target.value)
         case displayText.OUTER_DIAMETER:
            if (e.target.value === displayText.INITIAL_VALUE) {
               setOD(true);
               return setODOptionValue(e.target.value);
            }
            setOD(false);
            setShowODOption(checkOD);
            return setODOptionValue(e.target.value);
         default:
            return stringManipulationCheck.EMPTY_STRING;
      }
   }

   const handleInputChange = async (type, e) => {
      let textBoxValue = e.target.value;
      switch (type) {
         case displayText.MAX_OPERATING_PRESSURE:
            if (!isNotEmptyNullUndefined(e.target.value)) {
               setMaximumOperatingPressureConvertedValue(stringManipulationCheck.EMPTY_STRING);
               return setMaximumOperatingPressure(stringManipulationCheck.EMPTY_STRING);
            }
            let mopConvertedValue = await renderSpecificUnit(displayText.MAOP_COLUMN, maopSubUnit, textBoxValue, maopAbbr, maopUnit)
            let maxPressure = convertToValidPrecisionNumber(fieldMappingSheetConfig.pressurePrecision, fieldMappingSheetConfig.pressureScale, mopConvertedValue.toString());
            let isMaxPressureValid = _.last(maxPressure);
            let maxPressureValue = _.head(maxPressure);

            if (isMaxPressureValid && maxPressureValue.charAt(initialCharacterIndex) !== stringManipulationCheck.DECREMENT_OPERATOR) {
               setIsShowError(false);
               setIsMaxPressureError(false);
               setIsMaxPressureNegative(false)
               setMaximumOperatingPressureConvertedValue(maxPressureValue.toString());
               return setMaximumOperatingPressure(maxPressureValue.toString());
            }
            if (maxPressureValue.charAt(initialCharacterIndex) === stringManipulationCheck.DECREMENT_OPERATOR) {
               setIsShowError(true);
               setIsMaxPressureNegative(true)
               setMaximumOperatingPressureConvertedValue(maxPressureValue.toString());
               return setMaximumOperatingPressure(maxPressureValue.toString());
            }
            setIsShowError(true);
            setIsMaxPressureError(true);
            setMaximumOperatingPressureConvertedValue(maxPressureValue.toString());
            return setMaximumOperatingPressure(maxPressureValue.toString());
         case displayText.MIN_YIELD_STRENGTH:
            let mysConvertedValue = await renderSpecificUnit(displayText.SMYS_COLUMN, smysSubUnit, textBoxValue, smysAbbr, smysUnit)

            if (mysConvertedValue.length > fieldMappingSheetConfig.iliDataResolutionLimit) {
               return setIsShowError(true);
            }
            if (textBoxValue.charAt(initialCharacterIndex) === stringManipulationCheck.DECREMENT_OPERATOR) {
               setIsShowError(true);
               setMaximumYieldStrength(removeCharacter(removeSpecialCharacter(textBoxValue)))
               return setIsMinimumYieldStrengthNegative(true);
            }
            setIsShowError(false);
            setIsMinimumYieldStrengthNegative(false);
            setSmysConvertedValue(mysConvertedValue);
            return setMaximumYieldStrength(removeCharacter(removeSpecialCharacter(textBoxValue)));
         case displayText.OUTER_DIAMETER:
            if (!isNotEmptyNullUndefined(e.target.value)) {
               setOdConvertedValue(stringManipulationCheck.EMPTY_STRING);
               return setOuterDiameter(stringManipulationCheck.EMPTY_STRING);
            }

            let odUnitConvertedValue = await renderSpecificUnit(displayText.OD_COLUMN, odSubUnit, textBoxValue, odAbbr, odUnit)
            let outerDiameterValue = convertToValidPrecisionNumber(
               fieldMappingSheetConfig.diameterPrecision,
               fieldMappingSheetConfig.diameterScale,
               odUnitConvertedValue.toString()
            );
            let isOuterDiameterValid = _.last(outerDiameterValue);
            let outerDiameterParsedValue = _.head(outerDiameterValue);

            if (isOuterDiameterValid && outerDiameterParsedValue.charAt(initialCharacterIndex) !== stringManipulationCheck.DECREMENT_OPERATOR) {
               setIsShowError(false);
               setIsOuterDiameterError(false);
               setIsOuterDiameterNegative(false);
               setOdConvertedValue(outerDiameterParsedValue.toString());
               return setOuterDiameter(outerDiameterParsedValue.toString());
            }
            if (outerDiameterParsedValue.charAt(initialCharacterIndex) === stringManipulationCheck.DECREMENT_OPERATOR) {
               setIsShowError(true);
               setIsOuterDiameterNegative(true);
               setOdConvertedValue(outerDiameterParsedValue.toString());
               return setOuterDiameter(outerDiameterParsedValue.toString());
            }
            setIsShowError(true);
            setIsOuterDiameterError(true)
            setOdConvertedValue(outerDiameterParsedValue.toString());
            return setOuterDiameter(outerDiameterParsedValue.toString());
         default:
            return stringManipulationCheck.EMPTY_STRING;
      }
   };

   const summaryDataCallback = (summaryData) => {
      setIliDataSummary(summaryData);
      let columns = [];
      selectedIliSummarySheetData && selectedIliSummarySheetData.forEach((currentSheet, sheetIndex) => {
         currentSheet && currentSheet.dataColumns && currentSheet.dataColumns.forEach((sheetValue) => {
            columns.push(sheetValue.key);
         });
      });
      const formData = new FormData();
      const jsonData = {};
      jsonData[displayText.SELECTED_VENDOR_NAME] = isNotEmptyNullUndefined(summaryList) ? _.find(summaryList.iliToolVendorClNames, { iliToolVendorClGuid: summaryData.toolVendorCl }).name : null;
      jsonData[displayText.VENDOR_ID] = summaryData.toolVendorCl;
      jsonData[displayText.EXCEL_COLUMNS] = columns;
      formData.append(formDataInput.fieldInput, JSON.stringify(jsonData));
      let url = `${apiRouter.EXCEL_IMPORT}/${apiRouter.GET_FIELD_MATCHING}`;
      dispatch(dataImportActionCreator.UpdateVendorMatchingDetails(url, formData));
   };

   const versionCallback = (versionData) => {
      setSelectedVersions(versionData);
      setActiveStep(fieldMappingSheetConfig.fieldMappingScreen);
   };

   const searchVersion = (data) => {
      getSearchVersion(data);
   };

   const mappedDataCallback = (fieldMappedData) => {
      setFieldMappingData(fieldMappedData);
   };

   const getSearchVersion = (data) => {
      let searchEntries = {
         beginDate: data.beginDate,
         endDate: data.endDate,
         toolVendorCl: data.toolVendorCl ?? data.toolVendorCl,
         toolTypeCl: data.toolTypeCl ?? data.toolTypeCl,
         projectNumber: data.projectNumber ?? data.projectNumber,
         fromLocation: data.fromLocationDesc ?? data.fromLocationDesc,
         toLocation: data.toLocationDesc ?? data.toLocationDesc
      }
      setShowVersion(true);
      const url = `${apiRouter.FIELD_MAPPING}/${apiRouter.ILI_VERSIONING}?${displayText.SUMMARY_BEGIN_DATE}=${searchEntries.beginDate}
      &${displayText.SUMMARY_END_DATE}=${searchEntries.endDate}&${displayText.SUMMARY_TOOL_VENDOR}=${searchEntries.toolVendorCl}
      &${displayText.SUMMARY_TOOL_TYPE}=${searchEntries.toolTypeCl}&${displayText.SUMMARY_PROJECT_NO}=${searchEntries.projectNumber}
      &${displayText.SUMMARY_FROM_LOCATION}=${searchEntries.projectNumber}&${displayText.SUMMARY_TO_LOCATION}=${searchEntries.toLocation}`;
      dispatch(actionCreator.GetExistingVersions(url));
   };

   useEffect(() => {
      setVersion(versionList);
   }, [versionList]);

   const saveILIData = () => {
      setDashboardFieldDialogOpen(false);
      let summaryList = [];
      let featureTypeData = featureTypeDropDown && featureTypeRow && selectedFeatureType !== displayText.DEFAULT_PARENTID ? selectedFeatureType : null
      let fieldElements = {
         IliFeed: false,
         OutsideDiameter: null,
         B31gMaop: null,
         Smys: null,
         SelectedOD: odOptionValue,
         SelectedB31gMaop: mopOptionValue,
         SelectedSmys: mysOptionValue,
         SelectedFeatureType: featureTypeData
      }
      if (isNotEmptyNullUndefined(maximumOperatingPressure) || isNotEmptyNullUndefined(maximumYieldStrength) || isNotEmptyNullUndefined(outerDiameter)) {
         fieldElements.IliFeed = true;
         fieldElements.OutsideDiameter = odConvertedValue ?? outerDiameter;
         fieldElements.B31gMaop = maximumOperatingPressureConvertedValue ?? maximumOperatingPressure;
         fieldElements.Smys = smysConvertedValue ?? maximumYieldStrength;
         fieldElements.SelectedOD = odOptionValue;
         fieldElements.SelectedB31gMaop = mopOptionValue;
         fieldElements.SelectedSmys = mysOptionValue;
      }
      summaryList.push(iliDataSummary);
      let matchedColumnsLength = matchingDetails?.MatchedColumns?.length;
      let fieldMappingFiltered = fieldMappingDataFilter(fieldMappingData);
      let fieldMapCheckLength = fieldMappingFiltered.length;
      let templateChanged = true;
      if (matchedColumnsLength === fieldMapCheckLength) {
         let fieldMatchingCounter = fieldMappingSheetConfig.defaultCounterValue;
         fieldMappingFiltered.map((mapItem, mapIndex) => {
            if (_.find(matchingDetails?.MatchedColumns, { excelColumn: mapItem.excelColumn, tableColumn: mapItem.tableColumn })) {
               fieldMatchingCounter++;
            }
            return null
         });
         templateChanged = (fieldMapCheckLength !== fieldMatchingCounter);
      }
      let overrideVersion = _.find(selectedVersions, (versionItem) => { return versionItem.status !== displayText.ARCHIVED });
      let saveTemplateJson = {
         fileName: fileGuid,
         iliFieldDetails: fieldMappingFiltered,
         iliInspectionDetails: summaryList,
         ILIParameterDetails: fieldElements,
         TemplateMasterGuid: _.head(matchingDetails?.TemplateMasterGuid),
         IsVersionOverWrite: isNotEmptyNullUndefined(overrideVersion?.iliInspectionGuid),
         IsTemplateChange: templateChanged,
         SavedInspectionGuid: overrideVersion?.iliInspectionGuid
      };
      const formData = new FormData();
      formData.append(formDataInput.fileName, fileGuid);
      formData.append(formDataInput.isFirstLoad, true);
      formData.append(formDataInput.excelTemplate, JSON.stringify(saveTemplateJson));
      formData.append(formDataInput.isSaveClick, true);
      clearDashboardFields();
      const url = `${apiRouter.EXCEL_IMPORT}/${apiRouter.IMPORT_EXCEL_DATA}`;
      dispatch(actionCreator.SaveTemplate(url, formData));
   };
   //file progressive bar
   useEffect(() => {
      if (fileSize > 0 && progress <= 100) {
         setEnableCancel(false);
         fileUpload();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [fileToBeUpload, progress]);

   useEffect(() => {
      setUnitQuantityList(quantityList);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [quantityList])

   useEffect(() => {
      if (revertCompleted) {
         handleBack(fieldMappingSheetConfig.dataImportScreen, true);
         onContinueClick(false);
         dispatch(dataImportActionCreator.RevertSuccess(null));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps  
   }, [revertCompleted]);

   const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
   };

   const getFileContext = (e) => {
      let targetFile = e.target.files[0];
      if (targetFile) {
         if (!targetFile.name.match(regularExpression.EXCEL_FORMATS)) {
            dispatch(
               snackbarActionCreator.showFailureSnackbar(
                  errorMessage.PLEASE_UPLOAD_VALID_EXCEL
               )
            );
            e.target.value = null;
            return (stringManipulationCheck.EMPTY_STRING);
         } 
            setConfirmCancel(false);
            resetChunkProperties();
            const _file = targetFile;
            setFile({
               fileObj: targetFile,
               fileName: targetFile.name,
            });
            setFileSize(targetFile.size);
            setFileName(targetFile.name);
            const totalCount =
            targetFile.size % chunkSize === fieldMappingSheetConfig.defaultFileSize
                  ? targetFile.size / chunkSize
                  : Math.floor(targetFile.size / chunkSize) + fieldMappingSheetConfig.counterInitialValue; // Total count of chunks will have been upload to finish the file
            setChunkCount(totalCount);
            setFileToBeUpload(targetFile);
            e.target.value = null;
            const fileId = uuidv4() + stringManipulationCheck.DOT_OPERATOR + _file.name.split(stringManipulationCheck.DOT_OPERATOR).pop();
            setFileGuid(fileId);
            dispatch(dataImportActionCreator.SetFileName(fileId));
            encryptData(fileId, displayText.FILE_NAME);
         setIliDataSummary(stringManipulationCheck.EMPTY_STRING);
      }
   };

   const fileUpload = () => {
      setOverlayText(displayText.FILE_UPLOADING);
      dispatch(dataImportActionCreator.SelectedILISummarySheetData(null));
      if (counter <= chunkCount) {
         let chunk = fileToBeUpload.slice(beginningOfTheChunk, endOfTheChunk);
         uploadChunk(chunk);
      }
   };

   const uploadChunk = async (chunk) => {
      try {
         const url = `${apiRouter.FILE_UPLOAD}/${apiRouter.UPLOAD_CHUNKS}?${apiRouter.ID}=${counter}&${apiRouter.FILE_NAME}=${fileGuid}`;
         serviceCall.postData(url, chunk).then((result) => {
            const data = result.data;
            if (data && data.isSuccess) {
               setEnableRestart(false);
               setBeginningOfTheChunk(endOfTheChunk);
               setEndOfTheChunk(endOfTheChunk + chunkSize);
               if (counter === chunkCount) {
                  if (chunkCount === fieldMappingSheetConfig.chunkCountOne) {
                     setTimeout(function () {
                        setProgress(fieldMappingSheetConfig.progressBarFinalStage);
                     }, fieldMappingSheetConfig.stateUpdateDelay);
                  }
                  uploadCompleted();
               } else {
                  let percentage = (counter / chunkCount) * fieldMappingSheetConfig.chunkCalculateByHundred;
                  setTimeout(function () {
                     setProgress(percentage);
                  }, fieldMappingSheetConfig.stateUpdateDelay);
               }
               setCounter(counter + fieldMappingSheetConfig.counterInitialValue);
            } else {
               dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.CHUNK_UPLOAD_FAILED));
               setEnableCancel(true);
               setEnableRestart(true);
            }
         });
      } catch (error) {
         dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.CHUNK_UPLOAD_FAILED));
         setEnableCancel(true);
         setEnableRestart(true);
      }
   };

   const uploadCompleted = async () => {
      let formData = new FormData();
      formData.append(formDataInput.isFirstLoad, true);
      formData.append(formDataInput.sheetIndex, fieldMappingSheetConfig.fileUploadIndex);
      formData.append(formDataInput.startIndex, fieldMappingSheetConfig.fileUploadIndex);
      formData.append(formDataInput.excelTemplate, null);
      formData.append(formDataInput.isSaveClick, false);
      formData.append(formDataInput.vendorGuid, selectedVendor);
      const url = `${apiRouter.FILE_UPLOAD}/${apiRouter.UPLOAD_COMPLETE}?${formDataInput.fileName}=${fileGuid}`;
      serviceCall.postData(url, formData).then((result) => {
         const data = result.data;
         if (data?.isSuccess) {
            formData.append(formDataInput.fileName, fileGuid);
            getPreviewData(formData);
         } else {
            dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.UPLOAD_COMPLETE_FAIL));
         }
      });
   };

   const resetChunkProperties = () => {
      setShowProgress(true);
      setProgress(fieldMappingSheetConfig.progressBarInitialValue);
      setCounter(fieldMappingSheetConfig.counterInitialValue);
      setBeginningOfTheChunk(fieldMappingSheetConfig.progressBarInitialValue);
      setEndOfTheChunk(chunkSize);
   };

   const triggerCancel = () => {
      setOverlayText(errorMessage.CANCELING_UPLOADING);
      setConfirmCancel(true);
      cancelChunkUpload();
   };

   const cancelChunkUpload = () => {
      setFile({
         fileObj: stringManipulationCheck.EMPTY_STRING,
         fileName: stringManipulationCheck.EMPTY_STRING,
      });
      setShowProgress(false);
      setFileSize(fieldMappingSheetConfig.defaultFileSize);
      setFileName(stringManipulationCheck.EMPTY_STRING);
      const url = `${apiRouter.FILE_UPLOAD}/${apiRouter.UPLOAD_CANCEL}?${apiRouter.DELETE_ORIGINAL_FILE}=${false}&${apiRouter.FILE_NAME}=${fileGuid}`;
      serviceCall.postData(url).then((result) => {
         const data = result.data;
         setEnableCancel(true);
         data
            ? dispatch(snackbarActionCreator.showSuccessSnackbar(errorMessage.UPLOAD_CANCELLED_SUCCESS))
            : dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.UPLOAD_CANCELLED_FAIL))
      });
   };

   const fileOnClick = (event) => {
      if (selectedVendor === displayText.DEFAULT_PARENTID) {
         event.preventDefault();
         setIsShowError(true);
      }
   };

   const restartUpload = () => {
      fileUpload();
   };

   const onVendorChangeHandler = (event) => {
      let label = event.nativeEvent.target.innerText;
      setVendorLabel(label);
      dispatch(actionCreator.updateSelectedVendor(event.target.value));
      setSelectedVendor(event.target.value);
      setIsShowError(false);
   };

   const onFeatureChangeHandler = (event) => {
      setSelectedFeatureType(event.target.value);
   }

   const onOperationalAreaChange = (event) => {
      let label = event.nativeEvent.target.innerText;
      setOperationalAreaLabel(label);
      dispatch(actionCreator.updateSelectedOperationalArea(event.target.value));
      setSelectedOperationalArea(event.target.value);
   };

   const handleErrorValidation = () => {
      dispatch(actionCreator.ClearFieldMappingErrorValidation());
   };

   useEffect(() => {
      if (isVendorOperationalAdded && activeStep === fieldMappingSheetConfig.iliDataSummaryScreen) {
         getSummaryList();
         setIsVendorOperationalSave(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isVendorOperationalAdded]);

   const renderMaximumPressureError = () => {
      let errorMessages = [];
      if (!maximumOperatingPressure && isShowError) {
         errorMessages.push(errorMessage.PLEASE_ENTER_MAXIMUM_PRESSURE);
      }
      if (isShowError && isMaxPressureNegative) {
         errorMessages.push(errorMessage.PLEASE_PROVIDE_VALID_POSITIVE_INPUT_MAOP_COLUMN);
      }
      if (isShowError && isMaxPressureError) {
         errorMessages.push(errorMessage.PLEASE_PROVIDE_VALID_INPUT_PRECISION_MAOP_COLUMN);
      }
      return renderErrorMessageList(errorMessages);
   };

   const renderErrorMessageList = (errorMessageArray) => {
      if (isNotEmptyNullUndefined(errorMessageArray) && errorMessageArray.length !== fieldMappingSheetConfig.fieldMapLengthCheck) {
         let listItem = errorMessageArray.map((errorValue) => (
            <li>
               <div className="error">
                  {errorValue}
               </div>
            </li>
         ));
         return (
            <ul className={classes.errorList}>
               {listItem}
            </ul>
         )
      }
      return (<></>);
   }

   const renderOuterDiameterError = () => {
      let errorMessages = [];
      if (!outerDiameter && isShowError) {
         errorMessages.push(errorMessage.PLEASE_ENTER_DIAMETER);
      }
      if (isShowError && isOuterDiameterNegative) {
         errorMessages.push(errorMessage.PLEASE_PROVIDE_VALID_POSITIVE_INPUT_OD_COLUMN)
      }
      if (isShowError && isOuterDiameterError) {
         errorMessages.push(errorMessage.PLEASE_PROVIDE_VALID_INPUT_PRECISION_OD_COLUMN)
      }
      return renderErrorMessageList(errorMessages);
   };

   const renderSmysError = () => {
      let errorMessages = [];
      if (!maximumYieldStrength && isShowError) {
         errorMessages.push(errorMessage.PLEASE_ENTER_MINIMUM_STRENGTH);
      }
      if (isShowError && isMinimumYieldStrengthNegative) {
         errorMessages.push(errorMessage.PLEASE_PROVIDE_VALID_POSITIVE_INPUT_SMYS_COLUMN);
      }
      return renderErrorMessageList(errorMessages);
   };

   const renderSpecificUnit = async (columnName, subUnit, currentValue, abbreviation, unitValue) => {
      let getTargetUnit = _.find(masterList, { columnName: columnName });
      if (getTargetUnit.units === displayText.NON_APPLICABLE) {
         return null
      }
      let unitType = getTargetUnit?.unitsType;
      let fieldMappingFiltered = fieldMappingDataFilter(fieldMappingData);
      let fieldMappingUnit = _.find(fieldMappingFiltered, { tableColumn: `${displayText.ILI_DATA_TABLE}.${columnName}` });
      if (subUnit === getTargetUnit.unitName) {
         return currentValue;
      }
      if (isNotEmptyNullUndefined(unitValue) && isNotEmptyNullUndefined(subUnit)) {
         let targetUnitConversion = await fetchUnitConversion(currentValue, subUnit, getTargetUnit.unitName, unitType)
         let convertedUnit = targetUnitConversion?.data?.data;
         return convertedUnit;
      }
      if (isNotEmptyNullUndefined(fieldMappingUnit?.excelUnitName)) {
         let targetUnitConversion = await fetchUnitConversion(currentValue, fieldMappingUnit?.excelUnitName, getTargetUnit.unitName, unitType);
         let convertedUnit = targetUnitConversion?.data?.data;
         return convertedUnit;
      }
      return currentValue;
   }

   const renderQcInfo = (column) => {
      switch (column) {
         case displayText.MAOP_COLUMN:
            if (maximumOperatingPressureConvertedValue) {
               let getTargetUnit = _.find(masterList, { columnName: displayText.MAOP_COLUMN });
               return (
                  <div className={classes.infoMessageStyle}>
                     {maximumOperatingPressureConvertedValue} {getTargetUnit.unitName}
                  </div>
               )
            }
            return null;
         case displayText.SMYS_COLUMN:
            if (smysConvertedValue) {
               let getTargetUnit = _.find(masterList, { columnName: displayText.SMYS_COLUMN });
               return (
                  <div className={classes.infoMessageStyle}>
                     {smysConvertedValue} {getTargetUnit.unitName}
                  </div>
               )
            }
            return null;
         case displayText.OD_COLUMN:
            if (odConvertedValue) {
               let getTargetUnit = _.find(masterList, { columnName: displayText.OD_COLUMN });
               return (
                  <div className={classes.infoMessageStyle}>
                     {odConvertedValue} {getTargetUnit.unitName}
                  </div>
               )
            }
            return null;
         default:
            return null;
      }
   };

   const handleOpenUnits = (isOpen) => {
      setOpenUnits(isOpen);
   };

   const handleOpenSubUnits = (value) => {
      setOpenSubUnits(value);
   };

   const setSelectedUnitData = (event) => {
      event ? setSelectedUnit(event.target.value) : setSelectedUnit(selectedUnit);
      setSelectedSubUnit(displayText.DEFAULT_PARENTID);
      let selectedUnitData = event.target.value === displayText.DEFAULT_PARENTID ? null : event.target.value;
      setSubQuantity(selectedUnitData);
   };

   const setSubQuantity = (parentUnit) => {
      dispatch(dataImportActionCreator.DataSaveLoaderOverlay(true, displayText.LOADING_SUB_UNITS));
      const url = `${apiRouter.FIELD_MAPPING}/${apiRouter.GET_QUANTITY}?${displayText.QUANTITY_NAME}=${parentUnit}`;
      dispatch(dataImportActionCreator.GetQuantityList(url));
   }

   const setSelectedSubUnitData = (event) => {
      event ? setSelectedSubUnit(event.target.value) : setSelectedSubUnit(selectedSubUnit);
      if (event && event.nativeEvent.target.innerText.split(" ")[1]) {
         event ? setSelectedSubUnitAbbr(event.nativeEvent.target.innerText.split(" ")[1].slice(1, -1)) : setSelectedSubUnitAbbr(selectedSubUnitAbbr);
      }
   };

   const renderSubUnitMenuItems = () => {
      let dropDownData = [];
      if (selectedUnit !== displayText.DEFAULT_PARENTID) {
         dropDownData.push(<MenuItem value={displayText.DEFAULT_PARENTID}>
            {displayText.SELECT}
         </MenuItem>);
         unitQuantityList && unitQuantityList.forEach((unit) => {
            dropDownData.push(
               <MenuItem key={unit.unitName} value={unit.unitName}>
                  {`${unit.unitName} (${unit.abbreviation})`}
               </MenuItem>
            )
         })
         return dropDownData
      }
      dropDownData.push(<MenuItem value={displayText.DEFAULT_PARENTID}>
         {displayText.SELECT}
      </MenuItem>)
      return dropDownData
   }

   const renderUnitsDialog = () => {
      return (
         <Dialog
            open={unitOfMeasureDialog}
            fullWidth={true}
            maxWidth="sm"
            onClose={(e) => setUnitOfMeasureDialog(false)}
            disableBackdropClick={true}>
            <DialogTitle className={commonClasses.dialogTitle}>
               {displayText.UNIT_OF_MEASURE}
            </DialogTitle>
            <DialogContent>
               <>
                  <div className={classes.dashboardData}>
                     <Grid
                        container
                        spacing={dataImportGrid.DefaultSpacing}
                        className={classes.versionModel}>
                        <Grid item xs={gridWidth.MaxWidth}>
                           <FormControl
                              variant="outlined"
                              className={classes.unitsDropdown}>
                              <InputLabel htmlFor="outlined-age-native-simple">
                                 {displayText.UNIT_OF_MEASURE}
                              </InputLabel>
                              <Select
                                 open={openUnits}
                                 onClose={() => handleOpenUnits(false)}
                                 onOpen={() => handleOpenUnits(true)}
                                 value={selectedUnit}
                                 onChange={(event) => { setSelectedUnitData(event) }}
                                 MenuProps={{ disableScrollLock: false }}
                                 label={displayText.UNIT_OF_MEASURE}>
                                 <MenuItem value={displayText.DEFAULT_PARENTID}>
                                    {displayText.SELECT}
                                 </MenuItem>
                                 {isNotEmptyNullUndefined(unitList) && unitList?.map((unit) => (
                                    <MenuItem key={unit} value={unit}>
                                       {unit}
                                    </MenuItem>
                                 ))}
                              </Select>
                           </FormControl>
                        </Grid>
                        <Grid item xs={gridWidth.MaxWidth}>
                           <FormControl
                              variant="outlined"
                              className={classes.unitsDropdown}>
                              <InputLabel htmlFor="outlined-age-native-simple">
                                 {displayText.SUB_UNIT_OF_MEASURE}
                              </InputLabel>
                              <Select
                                 open={openSubUnits}
                                 onClose={() => handleOpenSubUnits(false)}
                                 onOpen={() => handleOpenSubUnits(true)}
                                 value={selectedSubUnit}
                                 onChange={(event) => { setSelectedSubUnitData(event) }}
                                 MenuProps={{ disableScrollLock: false }}
                                 disabled={selectedUnit === displayText.DEFAULT_PARENTID}
                                 label={displayText.SUB_UNIT_OF_MEASURE}>
                                 {renderSubUnitMenuItems()}
                              </Select>
                           </FormControl>
                        </Grid>
                     </Grid>
                  </div>
               </>
            </DialogContent>
            <DialogActions>
               <Button
                  fullWidth
                  variant="contained"
                  className={classes.qcSubmitOk}
                  onClick={(e) => onSaveQCUnits()}>
                  {displayText.OK}
               </Button>
               <Button
                  fullWidth
                  variant="contained"
                  className={classes.qcsubmitOk}
                  onClick={(e) => setUnitOfMeasureDialog(false)}>
                  {displayText.CANCEL}
               </Button>
            </DialogActions>
         </Dialog>
      )
   };

   const openUnitOfMeasureDialog = (isDialogOpen, columnName) => {
      if (!isDialogOpen) {
         setUnitOfMeasureDialog(isDialogOpen);
         return;
      }
      setSelectedUnit(displayText.DEFAULT_PARENTID);
      setSelectedSubUnit(displayText.DEFAULT_PARENTID);
      setUnitOfMeasureDialog(isDialogOpen);
      setCurrentSelectedUnit(columnName);
      switch (columnName) {
         case displayText.MAOP_COLUMN:
            if (isNotEmptyNullUndefined(maopUnit) && isNotEmptyNullUndefined(maopSubUnit)) {
               setSelectedUnit(maopUnit);
               setSubQuantity(maopUnit);
               setSelectedSubUnit(maopSubUnit);
               setSelectedSubUnitAbbr(maopAbbr);
               return;
            }
            renderFromFieldMapping(columnName);
            return;
         case displayText.SMYS_COLUMN:
            if (isNotEmptyNullUndefined(smysUnit) && isNotEmptyNullUndefined(smysSubUnit)) {
               setSelectedUnit(smysUnit);
               setSubQuantity(smysUnit);
               setSelectedSubUnit(smysSubUnit);
               setSelectedSubUnitAbbr(smysAbbr);
               return;
            }
            renderFromFieldMapping(columnName);
            return;
         case displayText.OD_COLUMN:
            if (isNotEmptyNullUndefined(odUnit) && isNotEmptyNullUndefined(odSubUnit)) {
               setSelectedUnit(odUnit);
               setSubQuantity(odUnit);
               setSelectedSubUnit(odSubUnit);
               setSelectedSubUnitAbbr(odAbbr);
               return;
            }
            renderFromFieldMapping(columnName);
            return;
         default:
            return;
      }
   };

   const onSaveQCUnits = async () => {
      if (selectedUnit === displayText.DEFAULT_PARENTID || selectedSubUnit === displayText.DEFAULT_PARENTID) {
         openUnitOfMeasureDialog(false, null);
         switch (currentSelectedUnit) {
            case displayText.MAOP_COLUMN:
               setMaopUnit(null);
               setMaopSubUnit(null);
               setMaopAbbr(null);
               return;
            case displayText.SMYS_COLUMN:
               setSmysUnit(null);
               setSmysSubUnit(null);
               setSmysAbbr(null);
               return;
            case displayText.OD_COLUMN:
               setOdUnit(null);
               setOdSubUnit(null);
               setOdAbbr(null);
               return;
            default:
               return;
         }
      }
      if (!isNotEmptyNullUndefined(selectedUnit) || !isNotEmptyNullUndefined(selectedSubUnit)) {
         return dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.PLEASE_SELECT_UNIT_AND_SUB_UNIT));
      }
      switch (currentSelectedUnit) {
         case displayText.MAOP_COLUMN:
            let getMaopTargetUnit = _.find(masterList, { columnName: displayText.MAOP_COLUMN });
            if (getMaopTargetUnit.units === displayText.NON_APPLICABLE) {
               return;
            }
            let tableUnitDetails = _.find(quantityList, function (quantityTableListItem) {
               let abbreviationList = quantityTableListItem.abbreviation.split(stringManipulationCheck.PIPE_OPERATOR);
               if (abbreviationList.some((element) => element === getMaopTargetUnit.units)) {
                  return quantityTableListItem.unitName
               }
            });
            if (!isNotEmptyNullUndefined(tableUnitDetails) && isNotEmptyNullUndefined(getMaopTargetUnit.units) && isNotEmptyNullUndefined(selectedSubUnitAbbr)) {
               return dispatch(snackbarActionCreator.showFailureSnackbar(`${errorMessage.UNIT_MISMATCH} [${getMaopTargetUnit.units}] ${errorMessage.UNIT_MISMATCH_TARGET} [${selectedSubUnitAbbr}]`));
            }
            openUnitOfMeasureDialog(false, null);
            setMaopUnit(selectedUnit);
            setMaopSubUnit(selectedSubUnit);
            setMaopAbbr(selectedSubUnitAbbr);
            if (isNotEmptyNullUndefined(maximumOperatingPressure)) {
               let convertedValue = await renderSpecificUnit(displayText.MAOP_COLUMN, selectedSubUnit, maximumOperatingPressure, selectedSubUnitAbbr, selectedUnit)
               let maxPressure = convertToValidPrecisionNumber(fieldMappingSheetConfig.pressurePrecision, fieldMappingSheetConfig.pressureScale, convertedValue.toString());
               if (maxPressure[1] && maxPressure[0].charAt(0) === stringManipulationCheck.DECREMENT_OPERATOR) {
                  setIsShowError(false);
                  setIsMaxPressureError(false);
                  setIsMaxPressureNegative(false);
                  return setMaximumOperatingPressureConvertedValue(convertedValue.toString());
               }
               if (maxPressure[0].charAt(0) === stringManipulationCheck.DECREMENT_OPERATOR) {
                  setIsShowError(true);
                  setIsMaxPressureNegative(true);
                  return setMaximumOperatingPressureConvertedValue(convertedValue.toString());
               }
               setIsShowError(true);
               setIsMaxPressureError(true);
               return setMaximumOperatingPressureConvertedValue(convertedValue.toString());
            }
            return;
         case displayText.SMYS_COLUMN:
            let getSmysTargetUnit = _.find(masterList, { columnName: displayText.SMYS_COLUMN });
            if (getSmysTargetUnit.units === displayText.NON_APPLICABLE) {
               return;
            }
            let tableSmysUnitDetails = _.find(quantityList, function (quantitytableListItem) {
               let abbreviationList = quantitytableListItem.abbreviation.split(stringManipulationCheck.PIPE_OPERATOR);
               if (abbreviationList.some((element) => element === getSmysTargetUnit.units)) {
                  return quantitytableListItem.unitName
               }
            });
            if (!isNotEmptyNullUndefined(tableSmysUnitDetails) && isNotEmptyNullUndefined(getMaopTargetUnit.units) && isNotEmptyNullUndefined(selectedSubUnitAbbr)) {
               return dispatch(
                  snackbarActionCreator.showFailureSnackbar(
                     `${errorMessage.UNIT_MISMATCH} [${getSmysTargetUnit.units}] ${errorMessage.UNIT_MISMATCH_TARGET} [${selectedSubUnitAbbr}]`
                  )
               );
            }
            openUnitOfMeasureDialog(false, null);
            setSmysUnit(selectedUnit);
            setSmysSubUnit(selectedSubUnit);
            setSmysAbbr(selectedSubUnitAbbr);
            if (isNotEmptyNullUndefined(maximumYieldStrength)) {
               let convertedValue = await renderSpecificUnit(displayText.SMYS_COLUMN, selectedSubUnit, maximumYieldStrength, selectedSubUnitAbbr, selectedUnit)
               if (convertedValue.toString().charAt(0) === stringManipulationCheck.DECREMENT_OPERATOR) {
                  setIsShowError(true);
                  setIsMinimumYieldStrengthNegative(true)
               }
               else {
                  setIsShowError(false);
                  setIsMinimumYieldStrengthNegative(false);
               }
               setSmysConvertedValue(convertedValue.toString());
            }
            return;
         case displayText.OD_COLUMN:
            let getOdTargetUnit = _.find(masterList, { columnName: displayText.OD_COLUMN });
            if (getOdTargetUnit.units === displayText.NON_APPLICABLE) {
               return;
            }
            let tableOdUnitDetails = _.find(quantityList, function (quantitytableListItem) {
               let abbreviationList = quantitytableListItem.abbreviation.split(stringManipulationCheck.PIPE_OPERATOR);
               if (abbreviationList.some((element) => element === getOdTargetUnit.units)) {
                  return quantitytableListItem.unitName
               }
            });
            if (!isNotEmptyNullUndefined(tableOdUnitDetails) && isNotEmptyNullUndefined(getOdTargetUnit.units) && isNotEmptyNullUndefined(selectedSubUnitAbbr)) {
               return dispatch(snackbarActionCreator.showFailureSnackbar(`${errorMessage.UNIT_MISMATCH} [${getOdTargetUnit.units}] ${errorMessage.UNIT_MISMATCH_TARGET} [${selectedSubUnitAbbr}]`));
            }
            openUnitOfMeasureDialog(false, null);
            setOdUnit(selectedUnit);
            setOdSubUnit(selectedSubUnit);
            setOdAbbr(selectedSubUnitAbbr);
            if (isNotEmptyNullUndefined(outerDiameter)) {
               let convertedValue = await renderSpecificUnit(displayText.OD_COLUMN, selectedSubUnit, outerDiameter, selectedSubUnitAbbr, selectedUnit)
               let outerDiameterValue = convertToValidPrecisionNumber(fieldMappingSheetConfig.diameterPrecision, fieldMappingSheetConfig.diameterScale, convertedValue.toString());
               if (outerDiameterValue[1] && outerDiameterValue[0].charAt(0) !== stringManipulationCheck.DECREMENT_OPERATOR) {
                  setIsShowError(false);
                  setIsOuterDiameterError(false);
                  setIsOuterDiameterNegative(false);
               }
               else if (outerDiameterValue[0].charAt(0) === stringManipulationCheck.DECREMENT_OPERATOR) {
                  setIsShowError(true);
                  setIsOuterDiameterNegative(true);
               }
               else {
                  setIsShowError(true);
                  setIsOuterDiameterError(true);
               }
               setOdConvertedValue(convertedValue.toString());
            }
            return;
         default:
            return;
      }
   };

   const updateFieldMapping = (columnName, selectedUnitData, selectedSubUnitData, selectedSubUnitAbbrData, fieldMap) => {
      let currentFieldData = _.find(fieldMap, { tableColumn: columnName });
      if (isNotEmptyNullUndefined(currentFieldData)) {
         currentFieldData[displayText.UNIT_NAME] = selectedSubUnitAbbrData;
         currentFieldData[displayText.EXCEL_UNIT_NAME] = selectedSubUnitData;
         currentFieldData[displayText.UNIT_TYPE] = selectedUnitData;
         let currentFieldIndex = _.findIndex(fieldMap, { tableColumn: columnName });
         fieldMap.splice(currentFieldIndex, arrayConstants.currentRelationSplice, currentFieldData);
      }
      setFieldMappingData(fieldMap)
      setFieldMappingFieldsData(fieldMap);
   };

   const renderFromFieldMapping = (selectedColumn) => {
      let fieldMappingFiltered = fieldMappingDataFilter(fieldMappingData);
      let currentColumnData = _.find(fieldMappingFiltered, { tableColumn: `${displayText.ILI_DATA_TABLE}.${selectedColumn}` });
      if (isNotEmptyNullUndefined(currentColumnData?.unitType)) {
         setSelectedUnit(currentColumnData.unitType);
         setSubQuantity(currentColumnData.unitType);
         setSelectedSubUnit(currentColumnData.excelUnitName);
         setSelectedSubUnitAbbr(currentColumnData.excelUnit);
      }
   };

   const onContinueClick = () => {
      setActiveStep(fieldMappingSheetConfig.dataImportScreen);
      setFile({
         fileObj: stringManipulationCheck.EMPTY_STRING,
         fileName: stringManipulationCheck.EMPTY_STRING,
      });
      setIliDataSummary(stringManipulationCheck.EMPTY_STRING);
      setFieldMappingData([]);
      setFieldMappingFieldsData([]);
      setIsShowError(false);
      setShowProgress(false);
      setEnableCancel(true);
      setShowVersion(false);
      setVersion([]);
      setSelectedVersions([]);
      setMOPOptionValue(fieldMappingSheetConfig.defaultQcInputRadioValue);
      setMYSOptionValue(fieldMappingSheetConfig.defaultQcInputRadioValue);
      setODOptionValue(fieldMappingSheetConfig.defaultQcInputRadioValue);
      setMaximumOperatingPressure(stringManipulationCheck.EMPTY_STRING);
      setMaximumYieldStrength(stringManipulationCheck.EMPTY_STRING);
      setOuterDiameter(stringManipulationCheck.EMPTY_STRING);
      deleteFile(fileGuid);
      setOdAbbr(null);
      setOdSubUnit(null);
      setOdUnit(null);
      setSmysAbbr(null);
      setSmysSubUnit(null);
      setSmysUnit(null);
      setMaopAbbr(null);
      setMaopSubUnit(null);
      setMaopUnit(null);
      setFileGuid(stringManipulationCheck.EMPTY_STRING);
      setMaximumOperatingPressureConvertedValue(null);
      setSmysConvertedValue(null);
      setOdConvertedValue(null);
      setSelectedSubUnitAbbr(displayText.DEFAULT_PARENTID);
      setSelectedSubUnit(displayText.DEFAULT_PARENTID);
      setSelectedUnit(displayText.DEFAULT_PARENTID);
      setFeatureTypeRow(false);
      setFeatureTypeDropDown(false);
      setFeatureTypeDropDownOpen(false);
      setSelectedFeatureType(displayText.DEFAULT_PARENTID);
      dispatch(dataImportActionCreator.clearQCDashboardData());
      setDataImportDialog(false);
   };

   const onDeclineNavigation = () => {
      setDataImportDialog(false);
   }

   const handleFeatureTypeCheckboxChange = () => {
      setFeatureTypeDropDown(!featureTypeDropDown)
   }

   const handleFeatureDropDownOpen = () => {
      setFeatureTypeDropDownOpen(true);
   }

   const handleFeatureDropDownClose = () => {
      setFeatureTypeDropDownOpen(false);
   }

   const renderQcDashboardInputFields = () => {
      return (
         <Dialog
            open={dashboardFieldDialog}
            fullWidth={true}
            maxWidth="md"
            onClose={(e) => setDashboardFieldDialogOpen(false)}
            disableBackdropClick={true}>
            <DialogTitle className={commonClasses.dialogTitle}>
               {displayText.DASHBOARD_FIELDS}
            </DialogTitle>
            <DialogContent>
               <>
                  <div className={classes.dasboardData}>
                     <div className={classes.qcPopUp}>
                        <div className="row">
                           <div className="col-sm-5">
                              <Typography className={commonClasses.typographyPadding}>
                                 {displayText.MAX_OPERATING_PRESSURE}
                              </Typography>
                              {!MOP ? (
                                 <FormControl
                                    variant="outlined"
                                    className={classes.formControl}>
                                    <TextField
                                       variant="outlined"
                                       value={maximumOperatingPressure}
                                       onChange={(e) => handleInputChange(displayText.MAX_OPERATING_PRESSURE, e)}
                                       id="filled-required"
                                       fullWidth
                                       error={((maximumOperatingPressure === stringManipulationCheck.EMPTY_STRING || isMaxPressureNegative) && isShowError)}
                                       autoComplete="off"
                                    />
                                    {renderQcInfo(displayText.MAOP_COLUMN)}
                                 </FormControl>
                              ) : (
                                 stringManipulationCheck.EMPTY_STRING
                              )}
                           </div>
                           <div className="col-sm-2 text-center">
                              <span className="pointer">
                                 <SwapHorizontalCircleIcon
                                    onClick={(e) => openUnitOfMeasureDialog(true, displayText.MAOP_COLUMN)}
                                    title={displayText.SELECT_UNIT}
                                    className={classes.unitImg} />
                              </span>
                           </div>
                           <div className="col-sm-5 dialog-div ">
                              <FormControl
                                 variant="outlined"
                                 className={classes.formControl}>
                                 <RadioGroup value={mopOptionValue} onChange={(e) => handleChange(displayText.MAX_OPERATING_PRESSURE, e)}>
                                    <FormControlLabel
                                       value={fieldMappingSheetConfig.defaultQcInputRadioValue}
                                       control={<Radio />}
                                       label={displayText.OVERIDE_ALL_VALUE}
                                       className="qcInputRadio" />
                                    {showMOPOption ? (
                                       <>
                                          <FormControlLabel
                                             value={fieldMappingSheetConfig.fillInRadioValue}
                                             control={<Radio />}
                                             label={displayText.FILL_MISSING}
                                             className="qcInputRadio" />
                                          <FormControlLabel
                                             value={fieldMappingSheetConfig.fieldMapRadioValue}
                                             control={<Radio />}
                                             label={displayText.FROM_FIELDMAPPING}
                                             className="qcInputRadio" />
                                       </>
                                    ) : (
                                       stringManipulationCheck.EMPTY_STRING
                                    )}
                                 </RadioGroup>
                              </FormControl>
                           </div>
                        </div>
                     </div>
                     <div className={classes.qcPopUp}>
                        <div className="row">
                           <div className="col-sm-5">
                              <Typography className={commonClasses.typographyPadding}>
                                 {displayText.MIN_YIELD_STRENGTH}
                              </Typography>
                              {!SMYS
                                 ? (
                                    <FormControl
                                       variant="outlined"
                                       className={classes.formControl}>
                                       <TextField
                                          variant="outlined"
                                          value={maximumYieldStrength}
                                          onChange={(e) => handleInputChange(displayText.MIN_YIELD_STRENGTH, e)}
                                          id="filled-required"
                                          fullWidth
                                          error={((maximumYieldStrength === stringManipulationCheck.EMPTY_STRING || isMinimumYieldStrengthNegative) && isShowError)}
                                          autoComplete="off"
                                       />
                                       {renderQcInfo(displayText.SMYS_COLUMN)}
                                    </FormControl>
                                 ) : (
                                    stringManipulationCheck.EMPTY_STRING
                                 )
                              }
                           </div>
                           <div className="col-sm-2 text-center">
                              <span className="pointer">
                                 <SwapHorizontalCircleIcon
                                    onClick={(e) => openUnitOfMeasureDialog(true, displayText.SMYS_COLUMN)}
                                    title={displayText.SELECT_UNIT}
                                    className={classes.unitImg} />
                              </span>
                           </div>
                           <div className="col-sm-5 dialog-div ">
                              <FormControl
                                 variant="outlined"
                                 className={classes.formControl}>
                                 <RadioGroup value={mysOptionValue} onChange={(e) => handleChange(displayText.MIN_YIELD_STRENGTH, e)}>
                                    <FormControlLabel
                                       value={fieldMappingSheetConfig.defaultQcInputRadioValue}
                                       control={<Radio />}
                                       label={displayText.OVERIDE_ALL_VALUE}
                                       className="qcInputRadio" />
                                    {showMYSOption
                                       ? (
                                          <>
                                             <FormControlLabel
                                                value={fieldMappingSheetConfig.fillInRadioValue}
                                                control={<Radio />}
                                                label={displayText.FILL_MISSING}
                                                className="qcInputRadio" />
                                             <FormControlLabel
                                                value={fieldMappingSheetConfig.fieldMapRadioValue}
                                                control={<Radio />}
                                                label={displayText.FROM_FIELDMAPPING}
                                                className="qcInputRadio" />
                                          </>
                                       ) : (stringManipulationCheck.EMPTY_STRING)
                                    }
                                 </RadioGroup>
                              </FormControl>
                           </div>
                        </div>
                     </div>
                     <div className={classes.qcPopUp}>
                        <div className="row">
                           <div className="col-sm-5">
                              <Typography className={classes.typographyPadding}>
                                 {displayText.OUTER_DIAMETER}
                              </Typography>
                              {!OD
                                 ? (
                                    <FormControl
                                       variant="outlined"
                                       className={classes.formControl}>
                                       <TextField
                                          variant="outlined"
                                          value={outerDiameter}
                                          onChange={(e) => handleInputChange(displayText.OUTER_DIAMETER, e)}
                                          id="filled-required"
                                          fullWidth
                                          error={(outerDiameter === stringManipulationCheck.EMPTY_STRING || isOuterDiameterNegative) && isShowError}
                                          autoComplete="off"
                                       />
                                       {renderQcInfo(displayText.OD_COLUMN)}
                                    </FormControl>
                                 ) : (stringManipulationCheck.EMPTY_STRING)
                              }
                           </div>
                           <div className="col-sm-2 text-center">
                              <span className={'pointer'}>
                                 <SwapHorizontalCircleIcon
                                    onClick={(e) => openUnitOfMeasureDialog(true, displayText.OD_COLUMN)}
                                    title={displayText.SELECT_UNIT}
                                    className={classes.unitImg} />
                              </span>
                           </div>
                           <div className="col-sm-5 dialog-div">
                              <FormControl
                                 variant="outlined"
                                 className={classes.formControl}
                              >
                                 <RadioGroup value={odOptionValue} onChange={(e) => handleChange(displayText.OUTER_DIAMETER, e)}>
                                    <FormControlLabel
                                       value={fieldMappingSheetConfig.defaultQcInputRadioValue}
                                       control={<Radio />}
                                       label={displayText.OVERIDE_ALL_VALUE}
                                       className="qcInputRadio" />
                                    {showODOption ? (
                                       <>
                                          <FormControlLabel
                                             value={fieldMappingSheetConfig.fillInRadioValue}
                                             control={<Radio />}
                                             label={displayText.FILL_MISSING}
                                             className="qcInputRadio" />
                                          <FormControlLabel
                                             value={fieldMappingSheetConfig.fieldMapRadioValue}
                                             control={<Radio />}
                                             label={displayText.FROM_FIELDMAPPING}
                                             className="qcInputRadio" />
                                       </>
                                    ) : (
                                       stringManipulationCheck.EMPTY_STRING
                                    )}
                                 </RadioGroup>
                              </FormControl>
                           </div>
                        </div>
                     </div>
                     {
                        featureTypeRow && (
                           <div className="row">
                              <div className="col-sm-5">

                                 {featureTypeDropDown && (
                                    <>
                                       <Typography className={classes.typographyPadding}>
                                          {displayText.FEATURE_TYPE}
                                       </Typography>
                                       <FormControl
                                          variant="outlined"
                                          className={classes.unitsDropdown}>
                                          <Select
                                             open={featureTypeDropDownOpen}
                                             onOpen={handleFeatureDropDownOpen}
                                             onClose={handleFeatureDropDownClose}
                                             value={selectedFeatureType}
                                             onChange={(e) => onFeatureChangeHandler(e)}
                                             MenuProps={{ disableScrollLock: true }}>
                                             <MenuItem value={displayText.DEFAULT_PARENTID}>
                                                {featureTypes ? displayText.SELECT : displayText.LOADING}
                                             </MenuItem>
                                             {featureTypes?.map((feature) => (
                                                <MenuItem value={feature?.iliAnomalyTypeClGuid}>
                                                   {feature?.name}
                                                </MenuItem>
                                             ))}
                                          </Select>
                                       </FormControl>
                                    </>
                                 )}
                              </div>
                              <div className="col-sm-2"></div>
                              <div className="col-sm-5">
                                 <FormControlLabel
                                    control={
                                       <Checkbox
                                          checked={featureTypeDropDown}
                                          onChange={handleFeatureTypeCheckboxChange}
                                          name="checkedB"
                                          color="primary"
                                       />
                                    }
                                    label={displayText.FILL_MISSING}
                                 />
                              </div>
                           </div>
                        )
                     }
                     {!MOP && renderMaximumPressureError()}
                     {!SMYS && renderSmysError()}
                     {!OD && renderOuterDiameterError()}
                  </div>
               </>
            </DialogContent >
            <DialogActions>
               <Button
                  fullWidth
                  variant="contained"
                  className={classes.qcSubmitOk}
                  onClick={(e) => handleSaveDashboardFields()}>
                  {displayText.SAVE}
               </Button>
               <Button
                  fullWidth
                  variant="contained"
                  className={classes.qcsubmitOk}
                  onClick={(e) => clearDashboardFields()}>
                  {displayText.CANCEL}
               </Button>
            </DialogActions>
         </Dialog >
      )
   };

   const clearDashboardFields = () => {
      setDashboardFieldDialogOpen(false);
      setMaopAbbr(null);
      setMaopSubUnit(null);
      setMaopUnit(null);
      setSmysAbbr(null);
      setSmysSubUnit(null);
      setSmysUnit(null);
      setOdUnit(null);
      setOdSubUnit(null);
      setOdAbbr(null);
   }

   const renderFieldMappingValidationDialog = () => {
      return (
         <Dialog
            open={fieldMappingErrorValidation}
            maxWidth="lg"
            fullWidth={true}
            scroll="paper"
            disableBackdropClick={true}>
            <DialogTitle className={commonClasses.dialogTitle}>
               {displayText.FIELD_MAPPING_VALIDATION}
            </DialogTitle>
            <DialogContent>
               <AppBar position="static" className={classes.tabHeading}>
                  <Tabs
                     value={tabValue}
                     onChange={handleTabChange}
                     classes={{ indicator: commonClasses.tabInkbar }}
                     scrollButtons="auto"
                     variant="scrollable"
                     className={commonClasses.tabHeader}
                     aria-label="simple tabs example">
                     {renderTabComponent(false)}
                  </Tabs>
               </AppBar>
               {renderTabComponent(true)}
            </DialogContent>
            <DialogActions>
               <Button
                  variant="contained"
                  className={classes.errorValidationOk}
                  onClick={(e) => handleErrorValidation()}>
                  {displayText.OK}
               </Button>
            </DialogActions>
         </Dialog>
      )
   };

   const renderDataImportScreen = () => {
      return (
         <>
            {fileName && (
               <Grid container className={classes.fileDetails} spacing={dataImportGrid.DefaultSpacing}>
                  <Grid xs={gridWidth.DefaultWidth}>
                     <Box className={"fileName-styling"}>{fileName}</Box>
                  </Grid>
               </Grid>
            )}
            <div className={classes.alignCenter}>
               <Grid container spacing={dataImportGrid.DefaultSpacing}>
                  <Grid item xs={gridWidth.DefaultWidth}>
                     <Typography className={classes.labelPadding}>
                        {displayText.VENDOR_SELECT}
                     </Typography>
                  </Grid>
                  <Grid item xs={gridWidth.DefaultWidth}>
                     <FormControl
                        variant="outlined"
                        className={classes.formControl}
                     >
                        <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                        <Select
                           open={vendorOpen}
                           onOpen={handleVendorOpen}
                           onClose={handleVendorClose}
                           value={selectedVendor}
                           onChange={(e) => onVendorChangeHandler(e)}
                           MenuProps={{ disableScrollLock: true }}
                           error={(selectedVendor === displayText.DEFAULT_PARENTID && isShowError)}
                        >
                           <MenuItem value={displayText.DEFAULT_PARENTID}>
                              {isVendorLoading ? displayText.LOADING : displayText.SELECT}
                           </MenuItem>
                           {vendorsList?.map((vendor) => (
                              <MenuItem name={vendor?.vendorName} value={vendor?.vendorsGuid}>
                                 {vendor?.vendorName}
                              </MenuItem>
                           ))}
                        </Select>
                     </FormControl>
                     {selectedVendor === displayText.DEFAULT_PARENTID &&
                        isShowError ? (
                        <>
                           <div className={classes.errorMessageStyle}>
                              {errorMessage.PLEASE_SELECT_VENDOR}{" "}
                           </div>
                        </>
                     ) : (
                        <></>
                     )}
                  </Grid>
               </Grid>
            </div>
            <div className={classes.alignCenter}>
               <Grid container spacing={dataImportGrid.DefaultSpacing}>
                  <Grid item xs={gridWidth.DefaultWidth}>
                     <Typography className={classes.labelPadding}>
                        {displayText.OPERATIONAL_SELECT}
                     </Typography>
                  </Grid>
                  <Grid item xs={gridWidth.DefaultWidth}>
                     <FormControl
                        variant="outlined"
                        className={classes.formControl}
                     >
                        <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                        <Select
                           value={selectedOperationalArea}
                           onChange={(e) => onOperationalAreaChange(e)}
                           open={open}
                           onOpen={handleOpen}
                           onClose={handleClose}
                           MenuProps={{
                              disableScrollLock: true,
                           }}
                        >
                           <MenuItem value={displayText.DEFAULT_PARENTID}>
                              {isOperationalAreaLoading ? displayText.LOADING : displayText.SELECT}
                           </MenuItem>
                           {operationalList && operationalList.map((area) => (
                              <MenuItem value={area?.clientOperationalAreaGuid}>
                                 {area?.name}
                              </MenuItem>
                           ))}
                        </Select>
                     </FormControl>
                  </Grid>
               </Grid>
            </div>
            <div
               className={
                  enableRestart
                     ? classes.chooseFileAlignCenterRestart
                     : classes.chooseFileAlignCenter
               }
            >
               <div className={"display-flex"}>
                  <Jumbotron className={classes.jumbotron}>
                     <Form>
                        <Form.Group>
                           <span>
                              <Form.File
                                 id="custom-file"
                                 label={displayText.SELECT_EXCEL_FILE}
                                 custom
                                 onClick={fileOnClick}
                                 onChange={getFileContext}
                              />
                           </span>
                        </Form.Group>
                        <Form.Group
                           className={showProgress ? 'block-display' : 'none-display'}>
                           {progressInstance}
                        </Form.Group>
                     </Form>
                  </Jumbotron>
                  {enableRestart && (
                     <Button
                        onClick={restartUpload}
                        className={classes.restartButton}
                     >
                        {displayText.RETRY}
                     </Button>
                  )}
               </div>
            </div>
         </>
      )
   };

   const redirectToDataImportScreen = () => {
      setRedirectWarningDialog(false);
      handleBack(fieldMappingSheetConfig.dataImportScreen);
   };

   const cancelRedirect = () => {
      setRedirectWarningDialog(false);
   };

   const renderRedirectWarningDialog = () => {
      return (
         <Dialog
            open={redirectWarningDialog}
            maxWidth="xs"
            fullWidth={true}
            disableBackdropClick={true}
            onClose={(e) => setRedirectWarningDialog(false)}>
            <DialogTitle className={commonClasses.dialogTitle}>
               {displayText.WARNING}
            </DialogTitle>
            <DialogContent>
               <div className={classes.textFieldPadding}>
                  <Typography>{displayText.WARNING_REDIRECT_FIRST_STEP}</Typography>
               </div>
            </DialogContent>
            <DialogActions>
               <Button
                  variant="contained"
                  className={classes.redirectOk}
                  onClick={(e) => redirectToDataImportScreen()}>
                  {displayText.YES}
               </Button>
               <Button
                  variant="contained"
                  className={classes.cancelbtn}
                  onClick={(e) => cancelRedirect()}>
                  {displayText.NO}
               </Button>
            </DialogActions>
         </Dialog>
      )
   }

   const renderDataSummaryScreen = () => {
      return (
         <>
            {fileName && (
               <Grid container className={classes.fileDetails} spacing={dataImportGrid.DefaultSpacing}>
                  <Grid xs={gridWidth.DefaultWidth}>
                     <Box className={"fileName-styling"}>{fileName}</Box>
                  </Grid>
                  <Grid xs={gridWidth.DefaultWidth}>
                  </Grid>
               </Grid>
            )}
            <Grid container className={classes.dataSummary} spacing={dataImportGrid.DefaultSpacing}>
               <SplitterLayout
                  className={classes.splitPane}
                  vertical={true}
                  primaryMinSize={100}
                  secondaryMinSize={100}>
                  <SheetTabs
                     sheetData={excelData}
                     fileObj={file}
                     fileGuid={fileGuid}
                     showDialog={openDialog}
                     handleDialog={handleDialog}
                  />
                  <SplitterLayout
                     className={classes.splitPane}
                     vertical={true}
                     primaryMinSize={showVersion ? fieldMappingSheetConfig.versionPrimaryMinSize : fieldMappingSheetConfig.splitScreenMinimumSize}
                     secondaryMinSize={showVersion && version?.length > arrayConstants.nonEmptyArray ? fieldMappingSheetConfig.versionSecondaryMinSize : fieldMappingSheetConfig.versionSecondaryMinSizeNoData}
                     secondaryInitialSize={fieldMappingSheetConfig.versionSecondaryMinSizeNoData}>
                     <DataEntry
                        ref={childRef}
                        selectedVendor={dataSummaryVendor}
                        selectedOperationalArea={dataSummaryOperationalArea}
                        summaryData={summaryList}
                        summaryDataSave={summaryDataCallback}
                        dataSummary={iliDataSummary}
                        searchVersion={searchVersion}
                     ></DataEntry>
                     {showVersion && version?.length > arrayConstants.nonEmptyArray ?
                        <Versioning ref={versionChildRef}
                           versionList={version}
                           savedVersions={versionCallback}
                        >
                        </Versioning> : (showVersion && <div className={(classes.paper, classes.noDataStyling)}><b>{displayText.NO_DATA_FOUND}</b></div>)}
                  </SplitterLayout>
               </SplitterLayout>
            </Grid>
         </>
      )
   };

   const renderSpinner = () => {
      return (
         <div className="uploadSpinner">
            <CircularProgress className={classes.spinnerStyle} />
            <Typography variant="h6" className={classes.marginCenter}>
               {displayText.LOADING_PREVIEW}
            </Typography>
         </div>
      )
   };

   const renderFieldMappingScreen = () => {
      return (
         <>
            <Grid container spacing={dataImportGrid.DefaultSpacing} className={classes.fileDetails}>
               <Grid xs={gridWidth.DefaultWidth}>
                  {fileName && (<Box className={"fileName-styling"}>{fileName}</Box>)}
               </Grid>
               <Grid xs={gridWidth.DefaultWidth}>
                  {matchingDetails && matchingDetails.MatchedDetails && <Box className={"matchingPercentage"}>
                     {displayText.MATCHING_PERCENTAGE} :{" "}
                     <span className={"blink_me"}>
                        {
                           matchingDetails["MatchedDetails"][0]
                              .percentageOfMatching
                        }{" "}
                     </span>
                  </Box>}
               </Grid>
            </Grid>
            <Grid container className={classes.dataSummary} spacing={dataImportGrid.DefaultSpacing}>
               <SplitterLayout
                  className={classes.splitPane}
                  vertical={true}
                  primaryMinSize={fieldMappingSheetConfig.splitScreenMinimumSize}
                  secondaryMinSize={fieldMappingSheetConfig.splitScreenMaxSize}
               >
                  <SheetTabs
                     sheetData={excelData}
                     fileObj={file}
                     fileGuid={fileGuid}
                     activeStep={activeStep} />
                  <Fieldmapping
                     ref={childRef}
                     fieldMappingFieldsData={fieldMappingFieldsData}
                     getFieldMappingData={getFieldMappingData}
                     sheetData={excelData}
                     units={unitList}
                     mappedData={mappedDataCallback}
                     masterList={masterList}
                  />
               </SplitterLayout>
            </Grid>
         </>
      )
   };

   const renderQcDashboardScreen = () => {
      return (
         <>
            {fileName && (
               <Grid container className={classes.fileDetails} spacing={dataImportGrid.DefaultSpacing}>
                  <Grid xs={gridWidth.DefaultWidth}>
                     <Box className={"fileName-styling"}>{fileName}</Box>
                  </Grid>
               </Grid>
            )}
            <QcDashboard versionList={selectedVersions} />
         </>
      );
   };

   const renderStepper = () => {
      return (
         <Stepper
            activeStep={activeStep}
            alternativeLabel
            className={classes.root}>
            {steps.map((label, stepperIndex) => (
               <Step
                  key={label}
                  className={"pointer"}
                  onClick={(e) => handleNavigation(stepperIndex)}
               >
                  <StepLabel>{label}</StepLabel>
               </Step>
            ))}
         </Stepper>
      )
   };

   const renderTabComponent = (tabPanel) => {
      return _.head(fieldMappingErrorValidationValue)?.map((currentSheet, sheetIndex) => {
         if (tabPanel) {
            return renderTabPanel(currentSheet, sheetIndex);
         }
         return renderTabs(currentSheet, sheetIndex);
      })
   };

   const renderTabs = (currentSheet, sheetIndex) => {
      return (
         <Tab
            label={currentSheet.sheetName}
            className={tabValue === sheetIndex ? commonClasses.tabActiveHeader : commonClasses.tabHeader}
            id={`simple-tab-${sheetIndex}`}
            aria-controls={`simple-tabpanel-${sheetIndex}`} />
      )
   };

   const renderTabPanel = (currentSheet, sheetIndex) => {
      return (
         <div
            role="tabpanel"
            hidden={tabValue !== sheetIndex}
            id={`simple-tabpanel-${sheetIndex}`}
            aria-labelledby={`simple-tab-${sheetIndex}`}>
            {tabValue === sheetIndex && (
               <Box p={3}>
                  {renderAccordionData(currentSheet, sheetIndex)}
                  {/* <DataGrid columns={currentSheet.dataColumns} className="rdg-light error-data-grid" rows={currentSheet.rows} /> */}
               </Box>
            )}
         </div>
      )
   };

   const renderAccordionData = (currentSheet, sheetIndex) => {
      let currentGroupedData = currentSheet.grouped;
      return Object.keys(currentGroupedData).map((groupName, groupIndex) => {
         let columns = Object.keys(_.head(currentGroupedData[groupName]));
         let errorDescriptionIndex = columns.indexOf(fieldCheck.errorDescription);
         if (errorDescriptionIndex > -1) {
            columns.splice(errorDescriptionIndex, 1);
         }
         let dataColumns = columns.map((currentCol) => {
            return { key: currentCol, resizable: true, name: currentCol, width: fieldMappingSheetConfig.dataTableDefaultWidth }
         });
         return (
            <Accordion
               expanded={selectedAccordion === groupIndex}
               onChange={handleAccordionChange(groupIndex)}>
               <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header">
                  <Typography className="error">{groupName}: {currentGroupedData[groupName].length}
                  </Typography>
               </AccordionSummary>
               <AccordionDetails>
                  <DataGrid columns={dataColumns} className="rdg-light file-upload-width" rows={currentGroupedData[groupName]} />
               </AccordionDetails>
            </Accordion>
         )
      });
   }

   const handleAccordionChange = (panel) => (event, isExpanded) => {
      setSelectedAccordion(isExpanded ? panel : false);
   };

   const renderStepperData = (currentStep) => {
      switch (currentStep) {
         case fieldMappingSheetConfig.dataImportScreen:
            return renderDataImportScreen()
         case fieldMappingSheetConfig.iliDataSummaryScreen:
            if (!loader && isExcelReady) {
               return renderDataSummaryScreen()
            }
            return renderSpinner()
         case fieldMappingSheetConfig.fieldMappingScreen:
            if (!loader) {
               return renderFieldMappingScreen()
            }
            return (<CircularProgress className={classes.spinnerStyle} />)
         case fieldMappingSheetConfig.qcDashboardScreen:
            return renderQcDashboardScreen()
         default:
            return stringManipulationCheck.EMPTY_STRING
      }
   };

   return (
      <>
         <LoadingOverlay spinner className="loaderLayout" active={showOverlayLoader} text={showOverlayLoaderMessage}></LoadingOverlay>
         <LoadingOverlay spinner className="loaderLayout" active={isSummaryLoading} text={displayText.FETCHING_SUMMARY_DETAILS}></LoadingOverlay>
         <LoadingOverlay spinner className="loaderLayout" active={isVendorOperationalSave} text={displayText.SAVING_VENDOR_OPERATIONAL_AREA}></LoadingOverlay>
         <LoadingOverlay spinner className={!enableCancel && "loaderLayout"} active={!enableCancel} text={
            <>
               <div>{overlayText}</div>
               <br></br>
               {!enableCancel && (<Button
                  onClick={triggerCancel}
                  className={classes.backButton}
               >
                  {displayText.CANCEL}
               </Button>)}
            </>} />
         <div className={"gridBoxStyling"}>
            <Grid className={classes.root}>
               {renderStepper()}
               {renderStepperData(activeStep)}
            </Grid>
            {renderQcDashboardInputFields()}
            {renderFieldMappingValidationDialog()}
            {renderRedirectWarningDialog()}
            {unitOfMeasureDialog && renderUnitsDialog()}
         </div>
         <ClientChangeModal
            isDialogOpen={dataImportDialog}
            continueNavigation={onContinueClick}
            onDeclineNavigation={onDeclineNavigation}>
         </ClientChangeModal>
      </>
   );
}