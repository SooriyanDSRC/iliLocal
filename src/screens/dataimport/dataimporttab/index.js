import React, { useEffect, useState } from 'react'
import {
   AppBar, Tabs, Tab, Box, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent,
   DialogActions, Button
} from '@material-ui/core';
import DataGrid from 'react-data-grid';
import { fieldMappingSheetConfig, tabIndices } from "../../../dataimportconstants";
import { makeStyles } from "@material-ui/core/styles";
import 'react-data-grid/dist/react-data-grid.css';
import DataGridComponent from './datagrid';
import { displayText, stringManipulationCheck, index, isTabChecked, initialSheetIndex } from '../../../constant';
import { gridPadding } from '../../../gridconstants';
import commonStyles from '../../../scss/commonStyles';
import { useDispatch, useSelector } from "react-redux";
import * as actionCreation from "../../../../src/store/action/dataImportAction";
import _ from "lodash";

const useStyles = makeStyles(() => ({
   dialogTitle: {
      background: "#00648d",
      color: "#ffffff",
   },
   dialogWidth: {
      width: "310px !important"
   }
}));

export default function SheetTabs(props) {
   const classes = useStyles();
   const commonClasses = commonStyles();
   const dispatch = useDispatch();
   const [allSheetData, setAllSheetData] = useState(null);
   const [copyAllSheetData, setCopyAllSelectedSheetData] = useState(null);
   const [activeStep, setActiveStep] = useState(null);
   const [dialogOpen, setDialogOpen] = useState(false);
   const [value, setValue] = useState(fieldMappingSheetConfig.defaultTabIndex);
   const [fileObj, setFileObj] = useState(null);
   const handleChange = (event, newValue) => { setValue(newValue); };
   const [fileGuid, setFileGuid] = useState(stringManipulationCheck.EMPTY_STRING);
   const { selectedIliSummarySheetData } = useSelector((state) => state.dataImportManage);

   useEffect(() => {
      setActiveStep(props?.activeStep);
      setFileObj(props?.fileObj);
      setFileGuid(props?.fileGuid);
      if (activeStep !== fieldMappingSheetConfig.fieldMappingScreen) {
         setCopyAllSelectedSheetData(Object.assign([], allSheetData));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props]);


   useEffect(() => {
      if (activeStep === fieldMappingSheetConfig.fieldMappingScreen || activeStep === null || activeStep === fieldMappingSheetConfig.qcDashboardScreen) {
         setAllSheetData(selectedIliSummarySheetData);
         return setValue(tabIndices.defaultTabIndex);
      }
      let copiedSheetData = props?.sheetData;
      if (selectedIliSummarySheetData === null) {
         copiedSheetData[initialSheetIndex].isTabChecked = true;
      }
      copiedSheetData[initialSheetIndex].index = initialSheetIndex;
      setAllSheetData(copiedSheetData);
      let selectedSheetData = _.filter(copiedSheetData, function (sheetData) {
         return sheetData?.isTabChecked;
      });
      dispatch(actionCreation.SelectedILISummarySheetData(selectedSheetData));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [activeStep]);

   useEffect(() => {
      if (props.showDialog) { setDialogOpen(true); }
   }, [props.showDialog]);

   const selectedPanel = (selectedTabIndex) => {
      const isSelectedTabChecked = copyAllSheetData[selectedTabIndex]?.isTabChecked;
      const isSelectedTabIndexEqual = copyAllSheetData[selectedTabIndex]?.index === selectedTabIndex;

      if (isSelectedTabChecked && isSelectedTabIndexEqual) {
         copyAllSheetData[selectedTabIndex].isTabChecked = !copyAllSheetData[selectedTabIndex]?.isTabChecked;
      }
      if (!isSelectedTabChecked || !isSelectedTabIndexEqual) {
         copyAllSheetData[selectedTabIndex][isTabChecked] = true;
         copyAllSheetData[selectedTabIndex][index] = selectedTabIndex;
      }
      let selectedSheetData = _.filter(copyAllSheetData, function (sheetData) {
         return sheetData?.isTabChecked;
      });
      dispatch(actionCreation.SelectedILISummarySheetData(selectedSheetData));
   };

   const handleCloseDialog = (isOpen) => {
      setDialogOpen(isOpen);
      props.handleDialog(isOpen);
   };

   const renderTabComponent = (tabPanel) => {
      return allSheetData?.map((currentSheet, sheetIndex) => {
         if (tabPanel) {
            return renderTabPanel(currentSheet, sheetIndex);
         }
         return renderTabs(currentSheet, sheetIndex);
      })
   };

   const renderTabs = (currentSheet, sheetIndex) => {
      return currentSheet && (
         <Tab
            className={value === sheetIndex ? commonClasses.tabActiveHeader : commonClasses.tabHeader}
            id={`${displayText.SIMPLE_TAB}-${sheetIndex}`}
            aria-controls={`${displayText.SIMPLE_TAB}${displayText.PANEL}-${sheetIndex}`}
            label={
               <FormControlLabel
                  key={activeStep !== fieldMappingSheetConfig.fieldMappingScreen ? sheetIndex : currentSheet?.index}
                  label={currentSheet.sheetName}
                  control={
                        <Checkbox
                           className={value === sheetIndex
                              ? commonClasses.activeTabCheckBoxColor
                              : commonClasses.tabCheckBoxColor}
                           checked={currentSheet?.isTabChecked}
                           onChange={activeStep !== fieldMappingSheetConfig.fieldMappingScreen ? () => { selectedPanel(sheetIndex) } : ()=> {}} />
                  }
               />
            }>
         </Tab>
      )
   };

   const renderTabPanel = (currentSheet, sheetIndex) => {
      return (
         <div
            role="tabpanel"
            hidden={value !== sheetIndex}
            id={`${displayText.SIMPLE_TAB}${displayText.PANEL}-${sheetIndex}`}
            aria-labelledby={`${displayText.SIMPLE_TAB}-${sheetIndex}`}>
            {value === sheetIndex && (
               <Box p={gridPadding.DefaultPadding}>
                  {currentSheet.genericDataColumns && currentSheet.genericDataColumns.length > fieldMappingSheetConfig.fieldMapLengthCheck &&
                     (<DataGrid
                        columns={currentSheet.genericDataColumns}
                        className="rdg-light header-data-grid"
                        rows={currentSheet.genericRows} />)}
                  {currentSheet.rows.length > fieldMappingSheetConfig.fieldMapLengthCheck &&
                     (<DataGridComponent
                        fileObj={fileObj}
                        currentSheet={currentSheet}
                        columns={currentSheet.dataColumns}
                        rowCount={currentSheet.rowCount}
                        rows={currentSheet.rows.slice(fieldMappingSheetConfig.fieldMappingRowSlice, fieldMappingSheetConfig.previewDataInitialLimit)}
                        sheetIndex={currentSheet?.index ?? sheetIndex}
                        allRows={currentSheet.rows}
                        fileGuid={fileGuid} />)}
               </Box>
            )}
         </div>
      )
   };

   const renderDialog = () => {
      return (
         <Dialog open={dialogOpen} keepMounted>
            <DialogTitle className={classes.dialogTitle}>
               {displayText.WARNING}
            </DialogTitle>
            <DialogContent>
               <DialogContent>
                  <b>{displayText.ILI_SUMMARY_SHEET_WARNING_DESCRIPTION}</b>
               </DialogContent>
            </DialogContent>
            <DialogActions>
               <Button
                  fullWidth
                  variant="contained"
                  className={commonClasses.submitNo}
                  onClick={(e) => handleCloseDialog(false)}>
                  {displayText.OK}
               </Button>
            </DialogActions>
         </Dialog>
      );
   }

   return (
      <div className="tabPadding sheetTab">
         <AppBar position="static">
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
         {renderTabComponent(true)}
         {renderDialog()}
      </div>
   )
}