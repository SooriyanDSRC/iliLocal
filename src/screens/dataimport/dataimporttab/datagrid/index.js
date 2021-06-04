import React, { useEffect, useState } from 'react'
import DataGrid from 'react-data-grid';
import { apiRouter, displayText, formDataInput, stringManipulationCheck } from "../../../../constant";
import { fieldMappingSheetConfig } from "../../../../dataimportconstants"
import 'react-data-grid/dist/react-data-grid.css';
import { useDispatch, useSelector } from "react-redux";
import * as dataImportActionCreator from "../../../../store/action/dataImportAction";

export default function DataGridComponent(props) {
   const { lazyLoadData } = useSelector((state) => state.dataImportManage);
   const dispatch = useDispatch();
   const [rows, setRows] = useState([]);
   const [columns, setColumns] = useState([]);
   const [sheetIndex, setSheetIndex] = useState(fieldMappingSheetConfig.defaultSheetIndex);
   const [allRows, setAllRows] = useState([]);
   const [currentLimit, setCurrentLimit] = useState(fieldMappingSheetConfig.previewDataInitialLimit);
   const [rowCount, setRowCount] = useState(fieldMappingSheetConfig.defaultRowCount);
   const [fileGuid, setFileGuid] = useState(stringManipulationCheck.EMPTY_STRING);

   useEffect(() => {
      setRows(props?.allRows.slice(fieldMappingSheetConfig.lazyLoadInitialStartLimit, fieldMappingSheetConfig.previewDataInitialLimit));
      setColumns(props?.columns);
      setSheetIndex(props?.sheetIndex);
      setAllRows(props?.allRows);
      setRowCount(props?.rowCount);
      setFileGuid(props?.fileGuid);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (lazyLoadData.length !== fieldMappingSheetConfig.lazyLoadInitialStartLimit) {
         dispatch(dataImportActionCreator.DataSaveLoaderOverlay(false, displayText.LOADING_PREVIEW));
         setAllRows(allRows.concat(lazyLoadData.rows));
         dispatch(dataImportActionCreator.ClearExcelDataLazyLoad());
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [lazyLoadData]);

   const isAtBottom = (event) => {
      let target = event.target;
      return target.clientHeight + target.scrollTop >= target.scrollHeight - fieldMappingSheetConfig.lazyLoadCallCondition;
   };

   const getLazyLoadData = () => {
      const bodyData = {
         isFirstLoad: false,
         sheetIndex: sheetIndex,
         startIndex: allRows.length,
         isSaveClick: false,
         fileName: fileGuid
      }
      let url = `${apiRouter.EXCEL_IMPORT}/${apiRouter.IMPORT_EXCEL_DATA}`;
      dispatch(dataImportActionCreator.FetchExcelData(url, bodyData, true));
   };

   const handleScroll = (event) => {
      if (!isAtBottom(event)) return;
      if ((currentLimit < rowCount) && (currentLimit < allRows.length)) {
         let currentRows = allRows.slice(currentLimit, currentLimit + fieldMappingSheetConfig.previewDataInitialLimit);
         let appendedSheetData = rows.concat(currentRows);
         setRows(appendedSheetData);
         setCurrentLimit(currentLimit + fieldMappingSheetConfig.previewDataInitialLimit);
         if (currentLimit === (allRows.length - fieldMappingSheetConfig.lazyLoadingInitiator)) {
            getLazyLoadData();
            dispatch(dataImportActionCreator.DataSaveLoaderOverlay(true, displayText.LOADING_PREVIEW));
         }
      }
   };

   return (
      <DataGrid
         columns={columns}
         className={rows.length < fieldMappingSheetConfig.previewDataInitialLimit ? "rdg-light header-data-grid" : "rdg-light row-data-grid"}
         onScroll={handleScroll}
         rows={rows} />
   )
}