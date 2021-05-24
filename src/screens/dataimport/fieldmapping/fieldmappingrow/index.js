import React, { useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, Grid, TextField, InputLabel, Select, MenuItem, Button, Dialog, DialogTitle, DialogActions, DialogContent } from "@material-ui/core";
import LightToolTip from '../../../../components/shared/lightToolTip';
import { displayText, errorMessage, stringManipulationCheck } from "../../../../constant";
import { arrayConstants } from '../../../../arrayconstants';
import { isUndefined, isNotEmpty, isNotEmptyNullUndefined } from "../../../../components/shared/helper";
import _ from "lodash";
import { gridWidth, dataImportGrid } from "../../../../gridconstants";
import CommonStyles from "../../../../scss/commonStyles";
import { useDispatch } from 'react-redux';
import * as snackbarActionCreator from "../../../../store/action/snackbarAction";
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import { fieldMappingSheetConfig } from "../../../../dataimportconstants";

const useStyles = makeStyles((theme) => ({
   excelColumn: {
      display: "flex",
      flexDirection: "row",
      height: "50px",
      alignItems: "center",
      justifyContent: "space-between",
      position: "absolute",
      bottom: "60px",
      paddingTop: "5%",
      width: "100%"
   },
   masterColumn: {
      float: "left",
      display: "inline",
      width: "100%"
   },
   unitImg: {
      backgroundColor: "#00648d",
      color: "#ffffff",
      borderRadius: "4px",
      marginTop: "3px",
      fontSize: "32px"
   },
   unitsDropdown: {
      width: "100%"
   },
   ignored: {
      width: "100%",
      "& .MuiOutlinedInput-input": {
         color: "#00648D"
      },
      "& .MuiInputLabel-root": {
         color: "#00648D"
      },
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
         borderColor: "#00648D"
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
         color: "#00648D"
      },
      "& .MuiInputLabel-root.Mui-focused": {
         color: "#00648D"
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
         borderColor: "#00648D"
      },
   },
   rootOrdinary: {
      width: "100%"
   },
   selectUnit: {
      background: "#00648d",
      borderRadius: 8,
      height: "47px",
      width: "100% !important",
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      },
      marginTop: "2px"
   },
   dashboardData: {
      padding: "20px 35px 12px 35px"
   },
   versionModel: {
      height: "100% !important",
      marginTop: "-8px !important"
   },
   errorMessageStyle: {
      color: "#ff0000",
      marginLeft: "5%"
   }
}));

export default function FieldMappingRow(props) {
   const classes = useStyles();
   const [targetColumn, setTargetColumn] = useState(displayText.DEFAULT_PARENTID);
   const [units, setUnits] = useState([]);
   const [selectedTargetUnit, setSelectedTargetUnit] = useState(stringManipulationCheck.EMPTY_STRING);
   const [selectedUnit, setSelectedUnit] = useState(displayText.DEFAULT_PARENTID);
   const [masterColumns, setMasterColumns] = useState([]);
   const [sheetName, setSheetName] = useState(null);
   const [openUnits, setOpenUnits] = useState(false);
   const [highlightIgnore, setHighlightIgnore] = useState(false);
   const commonClasses = CommonStyles();
   const [dialogOpen, setDialogOpen] = useState(false);
   const [selectedSubUnit, setSelectedSubUnit] = useState(displayText.DEFAULT_PARENTID);
   const [openSubUnits, setOpenSubUnits] = useState(false);
   const dispatch = useDispatch();
   const [unitQuantityList, setUnitQuantityList] = useState([]);
   const [chooseUnit, setChooseUnit] = useState(displayText.DEFAULT_PARENTID);
   const [chooseSubUnit, setChooseSubUnit] = useState(displayText.DEFAULT_PARENTID);
   const [chooseSubUnitAbbr, setChooseSubUnitAbbr] = useState('');
   const [chosenSubunit, setChosenSubunit] = useState('');
   const [showSubUnit, setShowSubUnit] = useState(false);

   useEffect(() => {
      setUnits(props?.units);
      setMasterColumns(props?.masterList);
      setSheetName(props?.sheetName);
      if (isNotEmptyNullUndefined(props?.fieldMappingFieldsData)) {
         return getFieldMappingDetails(props?.fieldMappingFieldsData);
      }
      if (isNotEmptyNullUndefined(props?.fieldMappingData)) {
         return getFieldMappingDetails(props?.fieldMappingData);
      }
   }, [props]);

   useEffect(() => {
      if (props?.quantityList?.length > arrayConstants.nonEmptyArray) {
         setUnitQuantityList(props?.quantityList);
         setShowSubUnit(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props?.quantityList]);

   const getFieldMappingDetails = (fieldMappingData) => {
      if (fieldMappingData.length > arrayConstants.initialOrder) {
         const data = _.find(fieldMappingData, {
            excelColumn: props?.columnName,
            sheetName: props?.sheetName,
         });
         if (isUndefined(data)) {
            setFieldMappingData(data);
            if (isNotEmptyNullUndefined(data?.excelUnitName) && isNotEmptyNullUndefined(data?.excelUnit)) {
               setChooseSubUnit(data?.excelUnitName)
            }
         }
      }
   }

   const setFieldMappingData = (data) => {
      if (data?.unitType) {
         setSelectedUnit(selectedUnit !== displayText.DEFAULT_PARENTID ? selectedUnit : data?.unitType);
         setSelectedSubUnit(selectedSubUnit !== displayText.DEFAULT_PARENTID ? selectedSubUnit : data?.excelUnitName);
         const excelSubunit = _.find(props?.getAllUnitList, function (subunit) {
            return subunit.unitName === data?.excelUnitName;
         });
         setChosenSubunit(excelSubunit?.abbreviation ? excelSubunit?.abbreviation : chooseSubUnitAbbr);
      }
      setSelectedTargetUnit(data?.tableColumn === displayText.FIELD_MAPPING_IGNORED ? displayText.NON_APPLICABLE : data?.tableUnit);
      setTargetColumn(data?.tableColumn);
      setMasterColumns(props?.masterList);
      setUnits(props?.units);
      setSheetName(props?.sheetName);
      if (data?.tableColumn === displayText.FIELD_MAPPING_IGNORED) {
         setHighlightIgnore(true);
         return;
      }
      setHighlightIgnore(false);
   };

   const setSelectedUnitData = (event) => {
      event ? setChooseUnit(event.target.value) : setChooseUnit(chooseUnit);
      const selectedUnitData = event.target.value === displayText.DEFAULT_PARENTID
         ? (null, setChosenSubunit(stringManipulationCheck.EMPTY_STRING), setChooseSubUnit(displayText.DEFAULT_PARENTID), setUnitQuantityList([]))
         : event.target.value;
      setShowSubUnit(true)
      props.fetchSubUnits(selectedUnitData);
   };

   const setSelectedSubUnitData = (event) => {
      if (event.target.value === displayText.DEFAULT_PARENTID) {
         event ? setChooseSubUnit(event.target.value) : setChooseSubUnit(chooseSubUnit);
         setChooseSubUnitAbbr('');
         return;
      }
      event ? setChooseSubUnit(event.target.value) : setChooseSubUnit(chooseSubUnit);
      event ? setChooseSubUnitAbbr(event.nativeEvent.target.innerText.split(stringManipulationCheck.SINGLE_SPACE_STRING)[arrayConstants.excelUnitAbbreviation]?.slice(fieldMappingSheetConfig.sliceExcelAbbreviation, fieldMappingSheetConfig.sliceExcelAbbreviationElement)) :
         setChooseSubUnitAbbr(chooseSubUnitAbbr);
   };

   const saveUnits = () => {
      const subUnitDetails = _.find(props?.quantityList, function (quantityListItem) {
         return quantityListItem.unitName === chooseSubUnit;
      });
      const tableUnitDetails = _.find(props?.quantityList, function (quantitytableListItem) {
         const abbreviationList = quantitytableListItem.abbreviation.split(stringManipulationCheck.PIPE_OPERATOR);
         if (abbreviationList.some((element) => element === selectedTargetUnit)) {
            return quantitytableListItem.unitName
         }
      });
      if (!isNotEmptyNullUndefined(tableUnitDetails) && isNotEmptyNullUndefined(selectedTargetUnit) && isNotEmptyNullUndefined(subUnitDetails)) {
         dispatch(snackbarActionCreator.showFailureSnackbar(`${errorMessage.UNIT_MISMATCH} [${selectedTargetUnit}] ${errorMessage.UNIT_MISMATCH_TARGET} [${subUnitDetails?.abbreviation}]`));
         return;
      }
      setSelectedUnit(chooseUnit);
      setSelectedSubUnit(chooseSubUnit);
      setChosenSubunit(chooseSubUnit === displayText.DEFAULT_PARENTID ? stringManipulationCheck.EMPTY_STRING : chooseSubUnitAbbr);
      const selectedUnitData = chooseUnit === displayText.DEFAULT_PARENTID ? null : chooseUnit;
      const selectedSubUnitData = chooseSubUnit === displayText.DEFAULT_PARENTID ? null : chooseSubUnit;
      props.onValueChange(
         props.columnName,
         selectedUnitData,
         selectedSubUnitData,
         targetColumn,
         selectedTargetUnit,
         sheetName,
         props.sheetIndex
      );
      setDialogOpen(false);
   }

   const setFieldMapValue = (event) => {
      event ? setTargetColumn(event.target.value) : setTargetColumn(targetColumn);
      const selectedValue = event.target.value;
      const columnName = selectedValue?.split(stringManipulationCheck.DOT_OPERATOR).pop();
      const targetUnitData = _.find(masterColumns, { columnName: columnName === displayText.NULL ? JSON.parse(columnName) : columnName })?.units;
      const unitOfMeasure = selectedUnit === displayText.DEFAULT_PARENTID ? null : selectedUnit;
      const subUnit = selectedSubUnit === displayText.DEFAULT_PARENTID ? null : selectedSubUnit;

      if (event.target.value === displayText.FIELD_MAPPING_IGNORED) {
         setHighlightIgnore(true);
      }
      setSelectedTargetUnit(isUndefined(targetUnitData) ? targetUnitData : stringManipulationCheck.EMPTY_STRING);
      props.onValueChange(
         props.columnName,
         unitOfMeasure,
         subUnit,
         event.target.value,
         targetUnitData,
         sheetName,
         props.sheetIndex
      );
   };

   const handleOpenUnits = (value) => {
      setOpenUnits(value);
   };

   const handleOpenSubUnits = (value) => {
      setOpenSubUnits(value);
   };

   const handleSubmitUnit = () => {
      saveUnits();
   };

   const handleCloseUnits = () => {
      setDialogOpen(false);
   }

   const chooseUnits = () => {
      if (targetColumn === displayText.DEFAULT_PARENTID || !isUndefined(targetColumn)) {
         dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.PLEASE_COMPLETE_FIELDMAPPING_TO_CONTINUE));
         return;
      }
      setDialogOpen(true);
      setChooseUnit(selectedUnit);
      setChooseSubUnit(selectedSubUnit);
      if (isNotEmptyNullUndefined(selectedUnit) && selectedUnit !== displayText.DEFAULT_PARENTID) {
         props.fetchSubUnits(selectedUnit);
         return;
      }
      setUnitQuantityList([]);
   }

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
               {`${displayText.SELECT}  ${displayText.UNIT_OF_MEASURE}`}
            </DialogTitle>
            <DialogContent className={classes.dialogOverflow}>
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
                              value={chooseUnit}
                              onChange={(event) => { setSelectedUnitData(event) }}
                              MenuProps={{ disableScrollLock: false }}
                              label={displayText.UNIT_OF_MEASURE}>
                              {renderUnitsMenuItem()}
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
                              value={chooseSubUnit}
                              onChange={(event) => { setSelectedSubUnitData(event) }}
                              MenuProps={{ disableScrollLock: false }}
                              label={displayText.SUB_UNIT_OF_MEASURE}
                              disabled={unitQuantityList[0]?.quantityName !== chooseUnit}>
                              {renderSubunitMenuItem()}
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
                  onClick={(e) => handleSubmitUnit()}>
                  {displayText.OK}
               </Button>
               <Button
                  variant="contained"
                  className={commonClasses.cancelBtn}
                  onClick={(e) => handleCloseUnits()}>
                  {displayText.CANCEL}
               </Button>
            </DialogActions>
         </Dialog>)
   }

   const renderTableColumnMenuItems = () => {
      const tableData = [];
      tableData.push(<MenuItem value={displayText.DEFAULT_PARENTID}>{displayText.SELECT}</MenuItem>);
      masterColumns.forEach((column, idx) => {
         if (isNotEmpty(column.fieldAlias)) {
            tableData.push(
               <MenuItem
                  key={idx}
                  value={`${column.tableName}.${column.columnName}`}>
                  <LightToolTip title={column.fieldDescription}>
                     <div className="full_width">{column.fieldAlias}</div>
                  </LightToolTip>
               </MenuItem>
            );
         }
      });
      return tableData;
   };

   const renderUnitsMenuItem = () => {
      const unitData = [];
      unitData.push(<MenuItem value={displayText.DEFAULT_PARENTID}>
         {units ? displayText.SELECT : displayText.LOADING}
      </MenuItem>);
      units.forEach((unit) => {
         if (isNotEmpty(unit)) {
            unitData.push(
               <MenuItem key={unit} value={unit}>
                  {unit}
               </MenuItem>
            );
         }
      });
      return unitData;
   }

   const renderSubunitMenuItem = () => {
      const subUnitData = [];
      subUnitData.push(<MenuItem value={displayText.DEFAULT_PARENTID}>
         {displayText.SELECT}
      </MenuItem>);
      unitQuantityList.forEach((unit) => {
         if (isNotEmpty(unit.unitName)) {
            subUnitData.push(
               <MenuItem key={unit.unitName} value={unit.unitName}>
                  {`${unit.unitName} (${unit.abbreviation})`}
               </MenuItem>
            );
         }
      });
      return subUnitData;
   }

   const renderColumns = () => {
      return (
         <>
            <Grid item xs={gridWidth.ExcelColumnWidth}>
               <TextField
                  id="outlined-read-only-input"
                  label={displayText.EXCEL_COLUMN}
                  defaultValue={props.columnName}
                  InputProps={{ readOnly: true }}
                  className={classes.excelcolumn}
                  variant="outlined"
                  fullWidth={true} />
            </Grid>
            <Grid item xs={gridWidth.UnitsWidth}>
               <TextField
                  id="outlined-read-only-input"
                  label={displayText.EXCEL_UNIT}
                  value={chosenSubunit}
                  InputProps={{ readOnly: true }}
                  className={classes.excelcolumn}
                  variant="outlined"
                  fullWidth={true} />
            </Grid>
            <Grid item xs={gridWidth.ColumnWidth}>
               <div className={classes.masterColumn}>
                  <TextField
                     value={targetColumn}
                     className={highlightIgnore ? classes.ignored : classes.tableColumn}
                     onChange={(event) => setFieldMapValue(event)}
                     label={displayText.TABLE_COL}
                     variant="outlined"
                     fullWidth
                     select>
                     {renderTableColumnMenuItems()}
                  </TextField>
               </div>
            </Grid>
         </>
      )
   }

   const renderUnits = () => {
      return (
         <>
            <Grid item xs={gridWidth.UnitsWidth}>
               <TextField
                  id="outlined-read-only-input"
                  label={displayText.TARGET_UNIT}
                  value={selectedTargetUnit}
                  InputProps={{ readOnly: true }}
                  className={classes.excelcolumn}
                  variant="outlined"
                  fullWidth={true} />
            </Grid>
            <Grid item xs={gridWidth.UnitImageWidth}>
               {selectedTargetUnit === displayText.NON_APPLICABLE || selectedTargetUnit === stringManipulationCheck.PERCENTAGE ? (
                  <span className={'pointerNotAllowed'}>
                     <SwapHorizontalCircleIcon title={displayText.SELECT_UNIT} className={classes.unitImg}></SwapHorizontalCircleIcon>
                  </span>
               ) : (
                  <span className={'pointer'} onClick={(e) => chooseUnits()}>
                     <SwapHorizontalCircleIcon title={displayText.SELECT_UNIT} className={classes.unitImg}></SwapHorizontalCircleIcon>
                  </span>
               )}
            </Grid>
         </>
      )
   }

   return (
      <Fragment>
         {renderColumns()}
         {renderUnits()}
         {renderDialog()}
      </Fragment>
   );
}