import React, { useEffect, useState, forwardRef, useImperativeHandle, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab, Box, Grid } from "@material-ui/core";
import { fieldMappingSheetConfig } from "../../../dataimportconstants";
import _ from 'lodash';
import FieldMappingRow from './fieldmappingrow';
import { useSelector, useDispatch } from 'react-redux';
import { isNullUndefined } from "../../../components/shared/helper";
import { displayText, apiRouter, stringManipulationCheck } from '../../../constant';
import commonStyles from '../../../scss/commonStyles';
import { dataImportGrid, gridPadding } from '../../../gridconstants';
import * as actionCreator from "../../../store/action/dataImportAction";
import { arrayConstants } from '../../../arrayconstants';

const useStyles = makeStyles((theme) => ({
   box: {
      paddingTop: "40px",
      paddingBottom: "20px"
   },
   fieldMapContainer: {
      paddingTop: "10px",
   },
}));

function Fieldmapping(props, ref) {
   const classes = useStyles();
   const commonClasses = commonStyles();
   const [overallRelation, setRelation] = useState([]);
   const [allSheetData, setAllSheetData] = useState([]);
   const [value, setValue] = useState(fieldMappingSheetConfig.defaultTabIndex);
   const [units, setUnits] = useState([]);
   const [masterColumns, setMasterColumns] = useState([]);
   const [selectedTargetUnit, setSelectedTargetUnit] = useState([]);
   const handleChange = (event, newValue) => setValue(newValue);
   const dispatch = useDispatch();
   const { matchingDetails, quantityList, selectedIliSummarySheetData, getAllUnitList } = useSelector((state) => state.dataImportManage);
   const [clearSelectedUnit, setClearSelectedUnit] = useState([]);
   const [allUnits, setAllUnits] = useState([]);

   useImperativeHandle(ref, () => ({
      GetFieldMappingData: () => {
         handleFieldMappingData();
      }
   }));

   const handleFieldMappingData = () => {
      return props?.getFieldMappingData(overallRelation);
   };

   useEffect(() => {
      setAllSheetData(selectedIliSummarySheetData);
      setUnits(props?.units);
      setMasterColumns(props?.masterList)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props]);

   useEffect(() => {
      setAllUnits(getAllUnitList)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [getAllUnitList])

   useEffect(() => {
      fetchFieldMapping()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props?.fieldMappingFieldsData, matchingDetails?.MatchedColumns])

   const fetchFieldMapping = async () => {
      if (props?.fieldMappingFieldsData?.length > fieldMappingSheetConfig.fieldMapLengthCheck) {
         setRelation(props?.fieldMappingFieldsData);
      } else if (matchingDetails?.MatchedColumns && matchingDetails.MatchedColumns.length > fieldMappingSheetConfig.fieldMapLengthCheck) {
         props.sheetData.forEach((sheetDataValue, sheetDataIndex) => {
            sheetDataValue && sheetDataValue.dataColumns && sheetDataValue.dataColumns.forEach((column, index) => {
               let matchedColumn = _.find(matchingDetails.MatchedColumns, { excelColumn: column.name });
               if (isNullUndefined(matchedColumn) && isNullUndefined(matchedColumn.tableColumn)) {
                  let columnArray = matchedColumn?.tableColumn?.split(stringManipulationCheck.DOT_OPERATOR);
                  let columnName = _.last(columnArray);
                  let tableName = _.head(columnArray);
                  let matchedUnit = _.find(props?.masterList, { columnName: columnName, tableName: tableName })?.units;
                  setFieldMapValue(column.name, matchedColumn.unitType, matchedColumn.excelUnitName, matchedColumn.tableColumn,
                     matchedUnit, props.sheetData[sheetDataIndex].sheetName, sheetDataIndex);
               }
            });
         });
      } else {
         setRelation([]);
      }
   }

   const setFieldMapValue = (excelColumn, excelUnit, excelSubUnit, targetColumn, targetUnit, sheetName, sheetIndex) => {
      let currentRelation = overallRelation;
      let currentSheetObj = clearSelectedUnit;
      let obj = {};
      let subUnitDetails = _.find(allUnits, function (quantityListItem) {
         return quantityListItem.unitName === excelSubUnit;
      });
      let tableUnitDetails = _.find(allUnits, function (quantitytableListItem) {
         let abbreviationList = quantitytableListItem.abbreviation.split(stringManipulationCheck.PIPE_OPERATOR);
         if (abbreviationList.some((element) => element === targetUnit)) {
            return quantitytableListItem.unitName
         }
      });
      setClearSelectedUnit(currentSheetObj);
      obj[displayText.EXCEL_COLUMN_UNIT] = excelColumn;
      obj[displayText.UNIT_TYPE] = excelUnit;
      obj[displayText.EXCEL_UNIT_NAME] = subUnitDetails?.unitName;
      obj[displayText.UNIT_NAME] = subUnitDetails?.abbreviation;
      obj[displayText.TABLE_COLUMN] = targetColumn;
      obj[displayText.TABLE_UNIT_NAME] = tableUnitDetails?.unitName;
      obj[displayText.SHEET_NAME] = sheetName;
      obj[displayText.SHEET_INDEX] = sheetIndex;
      obj[displayText.TABLE_UNIT] = targetUnit;
      if (!_.find(currentRelation, { excelColumn: excelColumn, sheetName: sheetName })) {
         currentRelation.push(obj);
      } else {
         let index = _.findIndex(currentRelation, { excelColumn: excelColumn, sheetName: sheetName });
         currentRelation.splice(index, arrayConstants.currentRelationSplice, obj);
      }
      setRelation(currentRelation);
      props.mappedData(currentRelation);
   };

   useEffect(() => {
      setSelectedTargetUnit(selectedTargetUnit);
   }, [selectedTargetUnit]);

   const setParentNode = (parentUnit) => {
      if (parentUnit) {
         dispatch(actionCreator.DataSaveLoaderOverlay(true, displayText.LOADING_SUB_UNITS));
         const url = `${apiRouter.FIELD_MAPPING}/${apiRouter.GET_QUANTITY}?${displayText.QUANTITY_NAME}=${parentUnit}`;
         dispatch(actionCreator.GetQuantityList(url));
      }
   }


   const renderTabComponent = (tabPanel) => {
      return allSheetData?.map((currentSheet, sheetIndex) => {
         if (tabPanel) {
            return renderTabPanel(currentSheet, sheetIndex);
         }
         return renderTabs(currentSheet, sheetIndex);
      })
   }

   const renderTabs = (currentSheet, sheetIndex) => {
      return currentSheet && (
         <Tab
            key={currentSheet?.index}
            label={currentSheet.sheetName}
            className={value === sheetIndex ? commonClasses.tabActiveHeader : commonClasses.tabHeader}
            id={`${displayText.SIMPLE_TAB}-${sheetIndex}`}
            aria-controls={`${displayText.SIMPLE_TAB}${displayText.PANEL}-${sheetIndex}`} />
      );
   };

   const renderTabPanel = (currentSheet, sheetIndex) => {
      return (
         <div
            role={displayText.TAB_PANEL}
            hidden={value !== sheetIndex}
            key={sheetIndex}
            id={`${displayText.SIMPLE_TAB}${displayText.PANEL}-${sheetIndex}`}
            aria-labelledby={`${displayText.SIMPLE_TAB}-${sheetIndex}`}>
            {value === sheetIndex && (
               <Box p={gridPadding.DefaultPadding} className={classes.box}>
                  <Grid
                     container
                     className={classes.fieldMapContainer}
                     spacing={dataImportGrid.DefaultSpacing}>
                     {allSheetData && allSheetData[value] && allSheetData[value].dataColumns &&
                        allSheetData[value].dataColumns.map((column, index) => {
                           return (
                              <FieldMappingRow
                                 sheetName={allSheetData[value].sheetName}
                                 sheetIndex={currentSheet.index}
                                 columnName={column.name}
                                 index={index}
                                 units={units}
                                 onValueChange={setFieldMapValue}
                                 fetchSubUnits={setParentNode}
                                 clearSelectedUnitArray={clearSelectedUnit}
                                 quantityList={quantityList}
                                 getAllUnitList={allUnits}
                                 masterList={masterColumns}
                                 fieldMappingData={overallRelation}
                                 fieldMappingfieldsData={props.fieldMappingfieldsData} />)
                        }
                        )}
                  </Grid>
               </Box>
            )}
         </div>
      )
   };

   return (
      <Fragment>
         <div>
            <AppBar position="static" className={classes.tabHeading}>
               <Tabs
                  value={value}
                  onChange={handleChange}
                  classes={{ indicator: commonClasses.tabInkbar }}
                  scrollButtons="auto"
                  variant="scrollable"
                  className={commonClasses.tabHeader}
                  aria-label={displayText.SIMPLE_TAB}>
                  {renderTabComponent(false)}
               </Tabs>
            </AppBar>
         </div>
         {renderTabComponent(true)}
      </Fragment>
   );
}
export default forwardRef(Fieldmapping);