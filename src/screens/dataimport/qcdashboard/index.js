import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Tabs, Tab, Grid, ListItem, ListItemText, List, ListItemIcon, Dialog, DialogActions, DialogTitle, DialogContent, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckBoxSharpIcon from '@material-ui/icons/CheckBoxSharp';
import InfoSharpIcon from '@material-ui/icons/InfoSharp';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import IconButton from '@material-ui/core/IconButton';
import CancelPresentationSharpIcon from '@material-ui/icons/CancelPresentationSharp';
import DataGrid from 'react-data-grid';
import revertIcon from '../../../assets/images/Revert.png';
import saveWithValidation from '../../../assets/images/save_with_validation.png';
import saveWithoutValidation from '../../../assets/images/save_without_validation.png';
import SwitchComponent from '../../../components/shared/switch';
import { displayText, apiRouter, errorMessage, statusCode, dataTypeCheck, stringManipulationCheck, formDataInput, graphBackgroundColors, regularExpression } from '../../../constant';
import { tabIndices, qcDashboardCheck, fieldMappingSheetConfig, fieldCheck } from '../../../dataimportconstants';
import { gridWidth, dataImportGrid } from '../../../gridconstants';
import { useSelector, useDispatch } from 'react-redux';
import * as dataImportActionCreator from '../../../store/action/dataImportAction';
import { showFailureSnackbar, showSuccessSnackbar } from '../../../store/action/snackbarAction';
import serviceCall from '../../../store/serviceCall';
import CommonStyles from '../../../scss/commonStyles';
import { isArrayContainsObject, isStatusCodeValid, isEmptyNullUndefined } from '../../../components/shared/helper';
import 'react-data-grid/dist/react-data-grid.css';
import LightToolTip from '../../../components/shared/lightToolTip';
import _ from 'lodash';
import { HorizontalBar } from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
   heading: {
      fontSize: '1rem',
   },
   closeIconBg: {
      color: '#ff0000',
      padding: '5px'
   },
   warningIconBg: {
      color: '#fddb00',
      padding: '5px'
   },
   doneIconBg: {
      color: 'green',
      padding: '5px'
   },
   infoIconBg: {
      color: '#00648d',
      padding: '5px'
   },
   tabHeader: {
      background: "#00648D",
      color: "#ffffff",
   },
   tabActiveHeader: {
      background: "#00648D",
      color: "#ffffff",
   },
   tabHighlightActiveHeader: {
      color: "#ffffff",
      background: "#ea5700",
      fontWeight: "700",
   },
   tabInkbar: {
      background: "transparent",
   },
   boxShadow: {
      background: "#ffffff",
      marginTop: '15px',
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: '10px',
      paddingBottom: 20,
      marginBottom: '10px',
      boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
   },
   root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
   },
   tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
      overflow: 'inherit'
   },
   typoContainer: {
      display: 'flex',
      justifyContent: 'space-between',
   },
   typographyQC: {
      padding: '20px',
      fontSize: '20px'
   },
   iconDiv: {
      paddingTop: '10px !important',
      textAlign: 'right'
   },
   iconBtn: {
      height: '35px',
   },
   submit_ok: {
      margin: theme.spacing(3, 1, 2),
      background: "#00648d",
      borderRadius: 8,
      padding: '10px',
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff",
      },
   },
   submit_no: {
      margin: theme.spacing(3, 1, 2),
      background: "#ffffff",
      borderRadius: 8,
      color: "#00648d",
      padding: '10px',
      marginLeft: '5px',
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#ffffff",
         color: "#00648d",
      },
   },
   buttonContainer: {
      textAlign: "right"
   },
   unitsDropdown: {
      width: "100%",
   },
   listItemButton: {
      paddingLeft: '8px'
   },
   listItemIcon: {
      minWidth: '41px'
   },
   tabHighlightHeader: {
      background: "#ffffff",
      color: "#ea5700",
      fontWeight: "700",
   },
   errorValidationOk: {
      margin: theme.spacing(3, 1, 2),
      background: "#00648d",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff",
      },
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
         color: "#000000",
      },
   },
   tabRedHeader: {
      background: '#ec3434',
      color: '#ffffff'
   },
   tabGreenHeader: {
      background: '#008000',
      color: '#ffffff'
   },
   dropDownGrid: {
      paddingTop: '20px!important'
   },
   versionSelect: {
      paddingTop: '10px'
   },
   dropDownLabel: {
      fontWeight: 'bolder',
      fontSize: 'larger',
      background: '#ffffff',
      paddingRight: '5px'
   },
   graphContainer: {
      borderTopStyle: 'ridge'
   },
   switch: {
      float: "inherit",
      marginTop: "1%"
   }
}));

export default function QcDashboard(props) {
   const commonClasses = CommonStyles();
   const [expanded, setExpanded] = useState(false);
   const [value, setValue] = useState(1);
   const [versionData, setVersionData] = useState([]);
   const [isActive, setIsActive] = useState(true);
   const [highlight, setHighlight] = useState(null);
   const [revertDialog, setRevertDialog] = useState(false);
   const [lengthDataDialog, setLengthDataDialog] = useState(false);
   const [openWithoutValidationDialog, setOpenWithoutValidationDialog] = useState(false);
   const [notesData, setNotesData] = useState(null);
   const {
      qcDashboardData, savedInspectionGuid, formData, qcResponse, dataSaveCompleted,
      previousVersionQCData, qcInput, iliSummaryDashboardData, jointLength, lastJointLength
   } = useSelector((state) => state.dataImportManage);
   const [dashboardData, setDashboardData] = useState(null);
   const [selectedVersion, setSelectedVersion] = useState(displayText.DEFAULT_PARENTID);
   const [openVersions, setOpenVersions] = useState(false);
   const [overrideVersionId, setOverrideVersionId] = useState(null);
   const [overrideVersionGuid, setOverrideVersionGuid] = useState(null);
   const [saveCompletionFlag, setSaveCompletionFlag] = useState(null);
   const [isJointLengthOverWrite, setIsJointLengthOverWrite] = useState(false);
   const [isValidate, setIsValidate] = useState(null);
   const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
   };
   const dispatch = useDispatch();

   useEffect(() => {
      setDashboardData(qcDashboardData);
      setTabHighlight(qcDashboardData);
   }, [qcDashboardData]);

   useEffect(() => {
      setVersionData(props?.versionList);
      let overrideVersion = _.find(props?.versionList, (versionItem) => { return versionItem.status !== displayText.ARCHIVED });
      setOverrideVersionId(overrideVersion?.versionId);
      setOverrideVersionGuid(overrideVersion?.iliInspectionGuid);
   }, [props]);

   useEffect(() => {
      if (!isActive) {
         setDashboardData(previousVersionQCData);
         setTabHighlight(previousVersionQCData);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [previousVersionQCData]);

   useEffect(() => {
      let rollbackUrl = `${apiRouter.EXCEL_IMPORT}/${apiRouter.ROLLBACK_DATA}/${savedInspectionGuid}`;
      return () => {
         if (savedInspectionGuid) {
            removalAPICall(rollbackUrl);
            dispatch(dataImportActionCreator.ClearFieldMappingErrorValidation())
         }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [savedInspectionGuid]);

   useEffect(() => {
      setSaveCompletionFlag(dataSaveCompleted);
   }, [dataSaveCompleted]);

   const removalAPICall = (rollbackUrl) => {
      if (!saveCompletionFlag) {
         dispatch(dataImportActionCreator.RemoveDataSaveCompletedFlag());
         return serviceCall.getAllData(rollbackUrl);
      }
      return;
   };

   const handleSwitchChange = (switchisActive) => {
      setIsActive(switchisActive);
      if (!switchisActive) {
         dispatch(dataImportActionCreator.LoadPreviousQCData(overrideVersionGuid, overrideVersionId, qcInput))
         setSelectedVersion(`${overrideVersionGuid}${stringManipulationCheck.UNDERSCORE_OPERATOR}${overrideVersionId}`);
         setDashboardData(null);
         setValue(fieldMappingSheetConfig.qcDashboardPreviousVersionSwitch);
         return;
      }
      setValue(fieldMappingSheetConfig.qcDashboardCurrentVersionSwitch);
      setDashboardData(qcDashboardData);
      setTabHighlight(qcDashboardData);
   };

   const setTabHighlight = (data) => {
      let highlightData = data?.map((dataItem, dataIndex) => {
         let lengthData = _.filter(dataItem.value, function (object, index) {
            return ((isArrayContainsObject(object) && !index.includes(qcDashboardCheck.isTable) && !index.toLowerCase().includes(qcDashboardCheck.isInformational)) || index.includes(qcDashboardCheck.isError));
         }).length;
         return { length: lengthData, key: dataItem.key };
      });
      setHighlight(highlightData);
   };

   const classes = useStyles();

   const handleTabChange = (event, newValue) => {
      if (newValue === tabIndices.defaultTabIndex && isActive && !dataSaveCompleted) {
         dispatch(showFailureSnackbar(errorMessage.PLEASE_SAVE_TO_VIEW_SUMMARY_DASHBOARD));
         return;
      } else if (newValue === 0 && isActive === true && dataSaveCompleted === true) {
         let url = `${apiRouter.DATA_SUMMARY}/${apiRouter.GET_DATA_SUMMARY_DASHBOARD}`;
         let data = {};
         data[formDataInput.inspectionGuid] = qcResponse.iliInspectionGuid;
         data[formDataInput.versionId] = qcResponse.versionId;
         dispatch(dataImportActionCreator.FetchILISummaryData(url, data));
      }
      setValue(newValue);
   };

   const handleCancelSaveWithoutValidation = () => {
      setOpenWithoutValidationDialog(false);
      setNotesData(null);
   };

   const saveQcDashboardData = (validationFlag, flag = null) => {
      setOpenWithoutValidationDialog(false);
      dispatch(dataImportActionCreator.DataSaveLoaderOverlay(true, displayText.SAVING_QC_DASHBOARD_DATA));
      let formdata = new FormData();
      let data = {};
      data[formDataInput.iliFieldDetails] = JSON.parse(formData?.get(formDataInput.excelTemplate)).iliFieldDetails;
      data[formDataInput.isVersionOverWrite] = isEmptyNullUndefined(overrideVersionId);
      data[formDataInput.savedInspectionGuid] = overrideVersionGuid;
      data[formDataInput.versionId] = overrideVersionId;
      data[formDataInput.versionNotes] = notesData;
      data[formDataInput.isValidated] = validationFlag;
      data[formDataInput.reportDate] = _.head(JSON.parse(formData?.get(formDataInput.excelTemplate)).iliInspectionDetails).reportDate;
      data[formDataInput.importDate] = _.head(JSON.parse(formData?.get(formDataInput.excelTemplate)).iliInspectionDetails).importDate;
      data[formDataInput.inspectionGuid] = savedInspectionGuid;
      data[formDataInput.iliInspectionDetails] = JSON.parse(formData?.get(formDataInput.excelTemplate)).iliInspectionDetails;
      data[formDataInput.isJointLength] = jointLength;
      data[formDataInput.isLastJointLength] = lastJointLength;
      data[formDataInput.isJointLengthOverWrite] = flag ?? isJointLengthOverWrite;
      // let fileName = JSON.parse(formData?.get(formDataInput.excelTemplate)).fileName;
      formdata.append(formDataInput.iliSaveInput, JSON.stringify(data));
      let url = `${apiRouter.ILI_DATA_SAVE}/${apiRouter.CASCADE_DATA_SAVE}`;
      dispatch(dataImportActionCreator.SaveQCData(url, formdata));
   };

   const revertQcDashboardData = () => {
      dispatch(dataImportActionCreator.DataSaveLoaderOverlay(true, displayText.REVERT_QC_DASHBOARD_DATA));
      if (!dataSaveCompleted) {
         let rollbackUrl = `${apiRouter.EXCEL_IMPORT}/${apiRouter.ROLLBACK_DATA}/${savedInspectionGuid}`;
         return serviceCall.getAllData(rollbackUrl).then((result) => {
            if (!isStatusCodeValid(result, statusCode.CODE_200) || !isEmptyNullUndefined(result.data)) {
               dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_REVERT));
               return;
            }
            dispatch(dataImportActionCreator.RevertSuccess(true));
            dispatch(showSuccessSnackbar(displayText.REVERT_SUCCESS));
            dispatch(dataImportActionCreator.DataSaveLoaderOverlay(false));
         }).catch((e) => {
            dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_REVERT));
            dispatch(dataImportActionCreator.DataSaveLoaderOverlay(false));
         });
      }
      let url = `${apiRouter.ILI_DATA_SAVE}/${apiRouter.REVERT_ILI_DATA}/${qcResponse.iliInspectionGuid}/${qcResponse.versionId}`;
      return serviceCall.postData(url, null).then((result) => {
         if (!isStatusCodeValid(result, statusCode.CODE_200) || !isEmptyNullUndefined(result.data)) {
            dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_REVERT));
            return;
         }
         dispatch(dataImportActionCreator.RevertSuccess(true));
         dispatch(showSuccessSnackbar(displayText.REVERT_SUCCESS));
         dispatch(dataImportActionCreator.DataSaveLoaderOverlay(false));
      }).catch((e) => {
         dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_REVERT));
         dispatch(dataImportActionCreator.DataSaveLoaderOverlay(false));
      });
   };

   const setNotes = (e) => {
      setNotesData(e.target.value);
   };

   const setSelectedVersionData = (event) => {
      event ? setSelectedVersion(event.target.value) : setSelectedVersion(selectedVersion);
      if (event.target.value !== displayText.DEFAULT_PARENTID) {
         let inspectionVersionvalue = event.target.value.split(qcDashboardCheck.splitParameter);
         let inspectionId = _.head(inspectionVersionvalue);
         let versionId = _.last(inspectionVersionvalue);
         dispatch(dataImportActionCreator.LoadPreviousQCData(inspectionId, versionId, qcInput))
      }
   };

   const handleOpenVersion = () => {
      setOpenVersions(true)
   };

   const handleCloseVersion = () => {
      setOpenVersions(false)
   };

   const accordionDataRender = (dataIndex, accordionValue) => {
      if (!isEmptyNullUndefined(dataIndex)) {
         return null;
      }
      let isAccordionLengthValid = accordionValue[dataIndex].length === fieldMappingSheetConfig.fieldMapLengthCheck;
      let isDataTypeString = typeof _.head(accordionValue[dataIndex]) === dataTypeCheck.STRING;
      let isOpenParenthesisIncluded = dataIndex.includes(stringManipulationCheck.PARENTHESIS_OPEN);
      let isCloseParenthesisIncluded = dataIndex.includes(stringManipulationCheck.PARENTHESIS_CLOSE);

      if (dataIndex.includes(qcDashboardCheck.isTable)) {
         return (
            <>
               <CheckBoxSharpIcon className={classes.doneIconBg} /> {_.head(dataIndex.split(qcDashboardCheck.splitParameter))}
            </>
         );
      }
      if (dataIndex.toLowerCase().includes(qcDashboardCheck.isInformational)) {
         return (
            <>
               <InfoSharpIcon className={classes.infoIconBg} /> {_.head(dataIndex.split(qcDashboardCheck.splitParameter))}
            </>
         );
      }
      if ((isAccordionLengthValid || accordionValue[dataIndex] === null || isDataTypeString) && !isOpenParenthesisIncluded && !isCloseParenthesisIncluded) {
         return (
            <>
               <CheckBoxSharpIcon className={classes.doneIconBg} /> {dataIndex}
            </>
         );
      }
      if (isOpenParenthesisIncluded && isCloseParenthesisIncluded) {
         let bracketedData = regularExpression.GET_DATA_INSIDE_PARENTHESIS.exec(dataIndex);
         let replacedData = dataIndex.replace(regularExpression.GET_DATA_INSIDE_PARENTHESIS, stringManipulationCheck.EMPTY_STRING);
         return (
            <>
               <CancelPresentationSharpIcon className={classes.closeIconBg} />
               {replacedData}
               {
                  isEmptyNullUndefined(bracketedData)
                  && (<span className="error">({bracketedData[regularExpression.REGEX_RESULT_INDEX]})</span>)
               }
            </>
         )
      }
      return (
         <>
            <CancelPresentationSharpIcon className={classes.closeIconBg} /> {dataIndex}
         </>
      );
   };

   const listItemIconRender = (data, listValue) => {
      if (data.includes(qcDashboardCheck.isTable)) {
         return (<CheckBoxSharpIcon className={classes.doneIconBg} />);
      }
      if (data.toLowerCase().includes(qcDashboardCheck.isInformational)) {
         return (<InfoSharpIcon className={classes.infoIconBg} />);
      }
      if (listValue[data]?.length === fieldMappingSheetConfig.fieldMapLengthCheck || listValue[data] === null || typeof (_.head(listValue[data])) === dataTypeCheck.STRING) {
         return (<CheckBoxSharpIcon className={classes.doneIconBg} />);
      }
      return (<CancelPresentationSharpIcon className={classes.closeIconBg} />);
   };

   const listItemDataRender = (data, listItemValue) => {
      if (data.includes(qcDashboardCheck.isTable)) {
         return (_.head(data.split(qcDashboardCheck.splitParameter)));
      }
      if (data.toLowerCase().includes(qcDashboardCheck.isInformational)) {
         return (listItemValue[data] && listItemValue[data].length > fieldMappingSheetConfig.fieldMapLengthCheck ? `${_.head(data.split(qcDashboardCheck.splitParameter))}: ${listItemValue[data]}` : _.head(data.split(qcDashboardCheck.splitParameter)));
      }
      return data;
   };

   const JointDataValidationSave = (flagValue) => {
      if (jointLength || lastJointLength) {
         setLengthDataDialog(true);
         setIsValidate(flagValue);
         return;
      }
      flagValue ? saveQcDashboardData(flagValue) : setOpenWithoutValidationDialog(true);
   }

   const acceptJointLengthData = (flag) => {
      setIsJointLengthOverWrite(flag)
      setLengthDataDialog(false);
      isValidate ? saveQcDashboardData(isValidate, flag) : setOpenWithoutValidationDialog(true);
   }

   const renderSaveWithValidationDialog = () => {
      return (
         <Dialog
            open={openWithoutValidationDialog}
            maxWidth="md"
            fullWidth={true}
            disableBackdropClick={true}
            onClose={(e) => setOpenWithoutValidationDialog(false)}>
            <DialogTitle className={commonClasses.dialogTitle}>
               {displayText.SAVE_WITHOUT_VALIDATION}
            </DialogTitle>
            <DialogContent>
               <div className={classes.textFieldPadding}>
                  <TextField id="outlined-multiline-static" label="Notes" fullWidth multiline rows={4} value={notesData} onChange={(e) => setNotes(e)} variant="outlined" />
               </div>
            </DialogContent>
            <DialogActions>
               <Button
                  variant="contained"
                  className={classes.errorValidationOk}
                  onClick={(e) => saveQcDashboardData(false)}>
                  {displayText.SAVE_WITHOUT_VALIDATION}
               </Button>
               <Button
                  variant="contained"
                  className={classes.cancelbtn}
                  onClick={(e) => handleCancelSaveWithoutValidation()}>
                  {displayText.CANCEL}
               </Button>
            </DialogActions>
         </Dialog>
      )
   }

   const renderVersionSaveButton = () => {
      if (isActive) {
         return (
            <Grid item xs={gridWidth.QcSaveGridWidth} className={classes.iconDiv}>
               <LightToolTip title={displayText.SAVE_WITH_VALIDATION}>
                  <IconButton onClick={(e) => JointDataValidationSave(true)} disabled={dataSaveCompleted}>
                     <img className={classes.iconBtn} alt={displayText.SAVE_WITH_VALIDATION} src={saveWithValidation}></img>
                  </IconButton>
               </LightToolTip>
               <LightToolTip title={displayText.SAVE_WITHOUT_VALIDATION} disabled={dataSaveCompleted}>
                  <IconButton onClick={(e) => JointDataValidationSave(false)}>
                     <img className={classes.iconBtn} alt={displayText.SAVE_WITHOUT_VALIDATION} src={saveWithoutValidation}></img>
                  </IconButton>
               </LightToolTip>
               <LightToolTip title={displayText.REVERT}>
                  <IconButton onClick={(e) => setRevertDialog(true)}>
                     <img className={classes.iconBtn} alt={displayText.REVERT} src={revertIcon}></img>
                  </IconButton>
               </LightToolTip>
            </Grid>
         )
      }
      return (
         <Grid item xs={gridWidth.QcSaveGridWidth} className={classes.dropDownGrid}>
            <FormControl variant="outlined" className={classes.unitsDropdown}>
               <InputLabel htmlFor="outlined-age-native-simple" className={classes.dropDownLabel}>
                  {displayText.SELECT_VERSION}
               </InputLabel>
               <Select
                  open={openVersions}
                  onClose={() => handleCloseVersion()}
                  onOpen={handleOpenVersion}
                  value={selectedVersion}
                  onChange={(event) => setSelectedVersionData(event)}
                  MenuProps={{ disableScrollLock: false }}
                  label={displayText.SELECT_VERSION}>
                  <MenuItem value={displayText.DEFAULT_PARENTID}>
                     {displayText.SELECT}
                  </MenuItem>
                  {
                     _.orderBy(
                        versionData,
                        version => Number(version.versionId.split(stringManipulationCheck.DECREMENT_OPERATOR)[1].trim()),
                        displayText.DESC.trim()
                     ).map((data, index) => (
                        <MenuItem key={index} value={`${data.iliInspectionGuid}${stringManipulationCheck.UNDERSCORE_OPERATOR}${data.versionId}`}>
                           {data.versionId}
                        </MenuItem>
                     ))
                  }
               </Select>
            </FormControl>
         </Grid>
      )
   }

   const renderRevertDialog = () => {
      return (
         <Dialog
            open={revertDialog}
            maxWidth="xs"
            fullWidth={true}
            disableBackdropClick={true}
            onClose={(e) => setRevertDialog(false)}>
            <DialogTitle className={commonClasses.dialogTitle}>
               {displayText.WARNING}
            </DialogTitle>
            <DialogContent>
               <div className={classes.textFieldPadding}>
                  <Typography>{displayText.WARNING_REVERT_SAVE}</Typography>
               </div>
            </DialogContent>
            <DialogActions>
               <Button
                  variant="contained"
                  className={classes.errorValidationOk}
                  onClick={(e) => revertQcDashboardData()}>
                  {displayText.REVERT}
               </Button>
               <Button
                  variant="contained"
                  className={classes.cancelbtn}
                  onClick={(e) => setRevertDialog(false)}>
                  {displayText.CANCEL}
               </Button>
            </DialogActions>
         </Dialog>
      )
   }

   const renderLengthDataDialog = () => {
      return (
         <Dialog
            open={lengthDataDialog}
            maxWidth="xs"
            fullWidth={true}
            disableBackdropClick={true}
            onClose={(e) => setLengthDataDialog(false)}>
            <DialogTitle className={commonClasses.dialogTitle}>
               {displayText.WARNING}
            </DialogTitle>
            <DialogContent>
               <div className={classes.textFieldPadding}>
                  <Typography>{displayText.WARNING_LENGTH_DATA}</Typography>
               </div>
            </DialogContent>
            <DialogActions>
               <Button
                  variant="contained"
                  className={classes.errorValidationOk}
                  onClick={(e) => acceptJointLengthData(true)}>
                  {displayText.YES}
               </Button>
               <Button
                  variant="contained"
                  className={classes.cancelbtn}
                  onClick={(e) => acceptJointLengthData(false)}>
                  {displayText.NO}
               </Button>
            </DialogActions>
         </Dialog>
      )
   }

   const renderSummaryDashboardGraph = (key) => {
      let labelData = iliSummaryDashboardData[key].map((labelItem) => {
         return labelItem.value ? `${labelItem.key} - ${labelItem.value}` : `${labelItem.key} - ${fieldCheck.initialLabelData}`;
      });
      let pointsData = iliSummaryDashboardData[key].map((labelItem) => {
         return labelItem.value;
      });
      let heightOption = (labelData.length * qcDashboardCheck.graphDataHeight) >= qcDashboardCheck.graphMinimumHeight
         ? (labelData.length * qcDashboardCheck.graphDataHeight)
         : qcDashboardCheck.graphMinimumHeight;
      let graphData = {
         labels: labelData,
         datasets: [
            {
               data: pointsData,
               backgroundColor: graphBackgroundColors,
               borderColor: graphBackgroundColors,
               borderWidth: qcDashboardCheck.dataSetBorderWidth,
            },
         ],
      };
      let options = {
         title: {
            display: true,
            text: key,
            fontSize: qcDashboardCheck.graphTitleFontSize,
         },
         legend: {
            display: false,
         },
         scales: {
            yAxes: [
               {
                  ticks: {
                     min: qcDashboardCheck.graphMinimumTick,
                     beginAtZero: true,
                  },
               },
            ],
            xAxes: [
               {
                  ticks: {
                     beginAtZero: true
                  },
               }
            ]
         },
      }
      return (
         <Grid
            item
            xs={gridWidth.GraphDefaultWidth}
            sm={gridWidth.GraphDefaultWidth}
            md={gridWidth.GraphDefaultWidth}
            lg={gridWidth.ChartLgWidth}
            className={classes.graphContainer}>
            <HorizontalBar
               width={gridWidth.ChartWidth}
               height={heightOption}
               data={graphData}
               options={options} />
         </Grid>
      )
   }

   const renderQcDashboard = (dataItemVal, idx, dataItemValue, dataItemIndex) => {
      if (dataItemVal.includes(qcDashboardCheck.countOf)) {
         return (
            <ListItem>
               <ListItemText primary={`${dataItemVal}: ${dataItemValue[dataItemVal]}`} />
            </ListItem>
         )
      }
      if (dataItemVal.toLowerCase() === qcDashboardCheck.jointLength_Key || dataItemVal.toLowerCase() === qcDashboardCheck.lastJointLength_Key) {
         return null;
      }
      if (dataItemVal.includes(qcDashboardCheck.isError)) {
         return (
            <List>
               <ListItem button className={classes.listItemButton}>
                  <ListItemIcon className={classes.listItemIcon}>
                     <CancelPresentationSharpIcon className={classes.closeIconBg} />
                  </ListItemIcon>
                  <ListItemText primary={
                     dataItemValue[dataItemVal]
                        ? `${_.head(dataItemVal.split(qcDashboardCheck.splitParameter))}: ${dataItemValue[dataItemVal]}`
                        : `${_.head(dataItemVal.split(qcDashboardCheck.splitParameter))}`} />
               </ListItem>
            </List>
         )
      }
      if (dataItemVal.toLowerCase().includes(qcDashboardCheck.isAlert)) {
         return (
            <List>
               <ListItem button className={classes.listItemButton}>
                  <ListItemIcon className={classes.listItemIcon}>
                     <ReportProblemOutlinedIcon className={classes.warningIconBg} />
                  </ListItemIcon>
                  <ListItemText primary={
                     dataItemValue[dataItemVal]
                        ? `${_.head(dataItemVal.split(qcDashboardCheck.splitParameter))}: ${dataItemValue[dataItemVal]}`
                        : `${_.head(dataItemVal.split(qcDashboardCheck.splitParameter))}`} />
               </ListItem>
            </List>
         )
      }
      if (isArrayContainsObject(dataItemValue[dataItemVal])) {
         let columns = Object.keys(_.head(dataItemValue[dataItemVal]));
         let dataColumns = columns.map((currentCol) => {
            return {
               key: currentCol,
               resizable: true,
               name: currentCol,
               width: fieldMappingSheetConfig.dataTableDefaultWidth
            }
         });
         return (
            <Accordion
               expanded={expanded === dataItemIndex + stringManipulationCheck.EMPTY_STRING + idx}
               onChange={handleChange(dataItemIndex + stringManipulationCheck.EMPTY_STRING + idx)}>
               <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header">
                  <Typography className={classes.heading}>{accordionDataRender(dataItemVal, dataItemValue)}
                  </Typography>
               </AccordionSummary>
               <AccordionDetails>
                  <DataGrid columns={dataColumns} className="rdg-light file-upload-width" rows={dataItemValue[dataItemVal]} />
               </AccordionDetails>
            </Accordion>
         )
      }
      return (
         <List>
            <ListItem button className={classes.listItemButton}>
               <ListItemIcon className={classes.listItemIcon}>
                  {listItemIconRender(dataItemVal, dataItemValue)}
               </ListItemIcon>
               <ListItemText primary={listItemDataRender(dataItemVal, dataItemValue)} />
            </ListItem>
         </List>
      )
   }

   const renderSummaryDashboardTab = () => {
      if (isActive) {
         return (
            <Tab
               key={tabIndices.defaultTabIndex}
               label={displayText.ILI_SUMMARY_DASHBOARD}
               className={
                  value === tabIndices.defaultTabIndex ? classes.tabActiveHeader : classes.tabHeader
               }
               id={`${displayText.SIMPLE_TAB}-${tabIndices.defaultTabIndex}`}
               aria-controls={`${displayText.SIMPLE_TAB}${displayText.PANEL}-${tabIndices.defaultTabIndex}`}>
            </Tab>
         )
      }
   }

   const renderQcDashboardTab = () => {
      return dashboardData?.map((dataItem, dataItemIndex) => {
         return (
            <Tab
               key={dataItemIndex + tabIndices.qcDashboardDefaultTabIndex}
               label={dataItem.key}
               className={_.find(highlight, (data) => {
                  return data.key === dataItem.key && data.length > fieldMappingSheetConfig.fieldMapLengthCheck
               })
                  ? classes.tabRedHeader
                  : classes.tabGreenHeader}
               id={
                  isActive
                     ? (`${displayText.SIMPLE_TAB}-${dataItemIndex + tabIndices.qcDashboardDefaultTabIndex}`)
                     : (`${displayText.SIMPLE_TAB}-${dataItemIndex}`)}
               aria-controls={isActive
                  ? (`${displayText.SIMPLE_TAB}${displayText.PANEL}-${dataItemIndex + tabIndices.qcDashboardDefaultTabIndex}`)
                  : (`${displayText.SIMPLE_TAB}${displayText.PANEL}-${dataItemIndex}`)}
            />
         )
      })
   }

   const renderSummaryDashboardTabPanel = () => {
      if (isActive) {
         return (
            <div
               role={displayText.TAB_PANEL}
               hidden={value !== tabIndices.defaultTabIndex}
               key={tabIndices.defaultTabIndex}
               id={`${displayText.VERTICAL_TAB}${displayText.PANEL}-${tabIndices.defaultTabIndex}`}
               aria-labelledby={`${displayText.VERTICAL_TAB}-${tabIndices.defaultTabIndex}`}
               className="full_width" >
               {
                  iliSummaryDashboardData && Object.keys(iliSummaryDashboardData).map(function (key) {
                     return renderSummaryDashboardGraph(key);
                  })
               }
            </div>
         )
      }
   }

   const renderQcDashboardTabPanel = () => {
      return dashboardData?.map((dataItem, dataItemIndex) => {
         return (
            <div
               role={displayText.TAB_PANEL}
               hidden={isActive ? (value !== dataItemIndex + tabIndices.qcDashboardDefaultTabIndex) : (value !== dataItemIndex)}
               key={dataItemIndex + tabIndices.qcDashboardDefaultTabIndex}
               id={isActive
                  ? `${displayText.VERTICAL_TAB}${displayText.PANEL}-${dataItemIndex + tabIndices.qcDashboardDefaultTabIndex}`
                  : `${displayText.VERTICAL_TAB}${displayText.PANEL}-${dataItemIndex}`}
               aria-labelledby={isActive
                  ? `${displayText.VERTICAL_TAB}-${dataItemIndex + tabIndices.qcDashboardDefaultTabIndex}`
                  : `${displayText.VERTICAL_TAB}${displayText.PANEL}-${dataItemIndex}`}
               className="full_width">
               {
                  Object.keys(dataItem.value).map((dataItemVal, idx) => {
                     return renderQcDashboard(dataItemVal, idx, dataItem.value, dataItemIndex)
                  })
               }
            </div>
         )
      })
   }

   return (
      <div className={classes.boxShadow}>
         <Grid container spacing={dataImportGrid.QcSpacing}>
            <Grid item xs={gridWidth.SwitchWidth}>
               {isArrayContainsObject(versionData) && (
                  <SwitchComponent
                     switchClass={classes.switch}
                     handleSwitchChange={handleSwitchChange}
                     activeText={displayText.CURRENT}
                     inActiveText={displayText.HISTORICAL}
                     isActive={isActive}
                  />)}
            </Grid>
            {renderVersionSaveButton()}
         </Grid>
         <div className={classes.root}>
            <Tabs
               value={value}
               onChange={handleTabChange}
               classes={{ indicator: classes.tabInkbar }}
               scrollButtons="auto"
               variant="scrollable"
               orientation="vertical"
               className={classes.tabs}
               aria-label="simple tabs example">
               {renderSummaryDashboardTab()}
               {renderQcDashboardTab()}
            </Tabs>
            {renderSummaryDashboardTabPanel()}
            {renderQcDashboardTabPanel()}
         </div>
         {renderSaveWithValidationDialog()}
         {renderRevertDialog()}
         {renderLengthDataDialog()}
      </div>
   )
}