import serviceCall from "../serviceCall";
import { dataImportReducerConstant } from "../reducerConstant";
import { errorMessage, statusCode, displayText, apiRouter, formDataInput, stringManipulationCheck, loaderMessages } from "../../constant";
import { showSuccessSnackbar, showFailureSnackbar } from "./snackbarAction";
import { fieldMappingSheetConfig, fieldCheck, qcDashboardCheck } from "../../dataimportconstants";
import { isStatusCodeValid, isNotEmptyNullUndefined, isNullUndefined, filterExcelResponse } from "../../components/shared/helper";
import _ from 'lodash';

export const GetVendorsList = (url) => {
   return (dispatch) => {
      dispatch(setVendorLoader(true));
      return serviceCall
         .getAllData(url)
         .then((result) => {
            dispatch(ReturnListMethods(result, displayText.ILI_VENDOR));
            dispatch(removeVendorLoader(false));
         })
         .catch((e) => {
            console.log(e);
            dispatch(removeVendorLoader(false));
         });
   };
};

export const GetFeaturesList = (url) => {
   return (dispatch) => {
      return serviceCall
         .getAllData(url)
         .then((result) => {
            dispatch(ReturnListMethods(result, displayText.FEATURE_LIST_DATA));
         })
         .catch((e) => {
            console.log(e);
         });
   }
};

export const GetOperationalAreaList = (url) => {
   return (dispatch) => {
      dispatch(setOperationalLoader(true));
      return serviceCall
         .getAllData(url)
         .then((result) => {
            dispatch(ReturnListMethods(result, displayText.ILI_OPERATIONAL_AREA));
            dispatch(removeOperationalLoader(false));
         })
         .catch((e) => {
            console.log(e);
            dispatch(removeOperationalLoader(false));
         });
   };
};

export const GetUnitList = (url) => {
   return (dispatch) => {
      return serviceCall
         .getAllData(url)
         .then((result) => {
            dispatch(ReturnListMethods(result, displayText.ILI_UNIT));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

export const GetExistingVersions = (url, data) => {
   return (dispatch) => {
      return serviceCall
         .getAllData(url, data)
         .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
               dispatch(ReturnListMethods(result, displayText.ILI_VERSION));
               return;
            }
            dispatch(showFailureSnackbar(result));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

export const GetILISummaryFields = (url) => {
   return (dispatch) => {
      dispatch(setSummaryLoader(true));
      return serviceCall
         .getAllData(url)
         .then((result) => {
            dispatch(ReturnListMethods(result, displayText.ILI_SUMMARY));
            dispatch(removeSummaryLoader(false));
         })
         .catch((e) => {
            dispatch(removeSummaryLoader(false));
            console.log(e);
         });
   };
};

export const GetMasterList = (url) => {
   return (dispatch) => {
      return serviceCall
         .getAllData(url)
         .then((result) => {
            dispatch(ReturnListMethods(result, displayText.MASTER));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

export const GetQuantityList = (url) => {
   return (dispatch) => {
      return serviceCall
         .getAllData(url)
         .then((result) => {
            dispatch(ReturnListMethods(result, displayText.QUANTITY));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

export const GetAllUnitsList = (url) => {
   return (dispatch) => {
      return serviceCall
         .getAllData(url)
         .then((result) => {
            dispatch(ReturnListMethods(result, displayText.SELECT_UNIT));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

export const RevertSuccess = (value) => {
   return (dispatch) => {
      dispatch({ type: dataImportReducerConstant.REVERT_SUCCESS_REDIRECT, value });
   }
};

const validateAllSheets = (resultData) => {
   return resultData.map((sheetValues, sheetIndex) => {
      const sheetData = Object.keys(sheetValues);
      const allSheetValidations = sheetData.map((sheetFullName, sheetFullIndex) => {
         const sheetName = _.head(sheetFullName.split(qcDashboardCheck.splitParameter));
         const rows = resultData[sheetIndex][`${sheetName}${fieldCheck.mainDataCheck}`];
         const grouped = _.groupBy(rows, fieldCheck.errorDescription);
         return { grouped, sheetName };
      });
      return allSheetValidations;
   });
}

const createQcFormData = (savedInspectionGuid, data) => {
   const qcInputFormData = new FormData();
   const qcInput = {};
   qcInput.inspectionguid = savedInspectionGuid;
   qcInput.ilifielddetails = JSON.parse(data.excelTemplateDto).iliFieldDetails;
   qcInput.SavedInspectionGuid = null;
   qcInput.VersionId = null;
   qcInputFormData.append(formDataInput.qcInput, JSON.stringify(qcInput));
   return qcInputFormData;
}

export const SaveTemplate = (url, data) => {
   return (dispatch) => {
      let iteration = fieldMappingSheetConfig.initialIterationValue;
      const intervalData = setInterval(function () {
         dispatch(DataSaveLoaderOverlay(true, loaderMessages[iteration] ?? _.last(loaderMessages)));
         iteration++;
      }, fieldMappingSheetConfig.timeIntervalLimit);
      dispatch(DataSaveLoaderOverlay(true, displayText.SAVING_TEMPLATE));
      dispatch(SaveTemplateClear(null));
      return serviceCall
         .postData(url, data)
         .then((result) => {
            clearInterval(intervalData);
            if (!isStatusCodeValid(result, statusCode.CODE_200)) {
               dispatch(DataSaveLoaderOverlay(false, displayText.SAVING_TEMPLATE_ERROR));
               dispatch(showFailureSnackbar(result));
               return;
            }
            if (!_.includes(Object.keys(_.head(result.data)), displayText.SAVED_DETAILS)) {
               const errorResult = validateAllSheets(result.data);
               dispatch(FieldMappingErrorValidation(errorResult));
               dispatch(DataSaveLoaderOverlay(false, displayText.SAVING_COMPLETED));
               return;
            }
            if (!_.head((_.head(result.data)).SavedDetails).inboundSave) {
               dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_FETCH_QC_DASHBOARD));
               dispatch(DataSaveLoaderOverlay(false, displayText.SAVING_COMPLETED));
               return
            }
            const resultObj = _.head((_.head(result.data)).SavedDetails);
            const savedInspectionGuid = resultObj.inspectionGuid;
            const qcFormData = createQcFormData(savedInspectionGuid, data);
            dispatch(DataSaveLoaderOverlay(false, displayText.SAVING_COMPLETED));
            dispatch(
               SavedDataQCDashboard(
                  `${apiRouter.QUALITY_CONTROL_DASHBOARD}/${apiRouter.GET_QUALITY_CONTROL_DASHBOARD}`,
                  qcFormData,
                  savedInspectionGuid,
                  data,
                  resultObj
               )
            );
            dispatch(DataSaveLoaderOverlay(true, displayText.QC_DASHBOARD_LOADER));
            dispatch(SaveTemplateSuccess(true));
         })
         .catch((e) => {
            clearInterval(intervalData);
            console.log(e);
            dispatch(DataSaveLoaderOverlay(false, displayText.SAVING_TEMPLATE_ERROR));
         });
   };
};

export const LoadPreviousQCData = (savedInspectionGuid, versionId, qcInput) => {
   return (dispatch) => {
      let qcFormData = new FormData();
      let qcInputData = JSON.parse(qcInput.get(formDataInput.qcInput));
      qcInputData.SavedInspectionGuid = savedInspectionGuid;
      qcInputData.VersionId = versionId;
      qcFormData.append(formDataInput.qcInput, JSON.stringify(qcInputData));
      dispatch(GetPreviousQCData(`${apiRouter.QUALITY_CONTROL_DASHBOARD}/${apiRouter.GET_QUALITY_CONTROL_DASHBOARD}`, qcFormData));
      dispatch(DataSaveLoaderOverlay(true, displayText.QC_DASHBOARD_PREVIOUS_VERSION_LOADER));
   }
};

export const SaveQCData = (url, data, fileName) => {
   return (dispatch) => {
      return serviceCall.postData(url, data).then((result) => {
         dispatch(DataSaveLoaderOverlay(false, displayText.SAVING_TEMPLATE_ERROR));
         if (!isStatusCodeValid(result, statusCode.CODE_200)) {
            dispatch(showFailureSnackbar(displayText.ERROR_IN_SAVING_QC_DASHBOARD_DATA));
            return;
         }
         if (!result.data.isSaved) {
            dispatch(showFailureSnackbar(displayText.ERROR_IN_SAVING_QC_DASHBOARD_DATA));
            return;
         }
         dispatch(SaveQCResponse(result.data));
         dispatch(showSuccessSnackbar(displayText.SUCCESS));
      }).catch((e) => {
         QcDashboardErrorHandler();
      })
   }
};

export const clearQCDashboardData = () => {
   return (dispatch) => {
      dispatch({ type: dataImportReducerConstant.CLEAR_QCDASHBOARD_DATA });
   }
};

export const GetPreviousQCData = (url, data) => {
   return (dispatch) => {
      return serviceCall.getExcelPreview(url, data)
         .then((result) => {
            dispatch(DataSaveLoaderOverlay(false));
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
               dispatch(SetPreviousQCData(result.data));
               return;
            }
            dispatch(showFailureSnackbar(displayText.ERROR_IN_FETCHING_QC_DASHBOARD_DATA));
         })
         .catch((e) => {
            QcDashboardErrorHandler();
         })
   }
};

export const SavedDataQCDashboard = (url, data, savedInspectionGuid, formData, templateSaveResult) => {
   return (dispatch) => {
      return serviceCall.getExcelPreview(url, data).then((result) => {
         dispatch(DataSaveLoaderOverlay(false));
         if (isStatusCodeValid(result, statusCode.CODE_200)) {
            let jointLength = false;
            let lastJointLength = false;

            result.data.forEach((dataItem, dataItemIndex) => {
               Object.keys(dataItem.value).forEach((dataItemVal, idx) => {
                  if (dataItemVal.toLowerCase() === qcDashboardCheck.jointLength_Key &&
                     _.head(dataItem.value[dataItemVal]) > fieldMappingSheetConfig.fieldMapLengthCheck) {
                     jointLength = true;
                  }
                  if (dataItemVal.toLowerCase() === qcDashboardCheck.lastJointLength_Key &&
                     _.head(dataItem.value[dataItemVal]) > fieldMappingSheetConfig.fieldMapLengthCheck) {
                     lastJointLength = true;
                  }
               })
            });
            dispatch(SetQCDasbhoardData(result.data, data, savedInspectionGuid, formData, templateSaveResult, jointLength, lastJointLength));
            return;
         }
         dispatch(showFailureSnackbar(displayText.ERROR_IN_FETCHING_QC_DASHBOARD_DATA));
      })
         .catch((e) => {
            QcDashboardErrorHandler();
         })
   }
};

const QcDashboardErrorHandler = () => {
   return (dispatch) => {
      dispatch(DataSaveLoaderOverlay(false, displayText.SAVING_TEMPLATE_ERROR));
      dispatch(showFailureSnackbar(displayText.ERROR_IN_FETCHING_QC_DASHBOARD_DATA));
   }
};

const SetPreviousQCData = (data) => {
   return { type: dataImportReducerConstant.SET_PREVIOUS_VERSION_QC_DATA, value: data };
};

export const RemoveDataSaveCompletedFlag = () => {
   return { type: dataImportReducerConstant.CLEAR_DATA_SAVE_COMPLETED };
};

const SetQCDasbhoardData = (data, qcInput, savedInspectionGuid, formData, templateResult, jointLength, lastJointLength) => {
   let value = {
      resultData: data,
      savedInspectionGuid,
      formData,
      qcInput,
      templateResult,
      jointLength,
      lastJointLength
   }
   return { type: dataImportReducerConstant.SET_QC_DASHBOARD_DATA, value };
};


export const SaveVendorArea = (url, data) => {
   return (dispatch) => {
      dispatch(clearVendorAndOperationalArea(null));
      return serviceCall
         .postData(url, data)
         .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
               dispatch(SaveVendorOperationalSuccess(result.data));
               return;
            }
            dispatch(showFailureSnackbar(result));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

const SaveQCResponse = (val) => {
   return {
      type: dataImportReducerConstant.SAVE_QC_RESPONSE,
      value: val
   }
};

export const DataSaveLoaderOverlay = (val, data) => {
   return {
      type: dataImportReducerConstant.DATA_SAVE_LOADER,
      value: { val, data },
   };
};

const ReturnListMethods = (result, type) => {
   return (dispatch) => {
      if (result && result.data) {
         switch (type) {
            case displayText.MASTER:
               return dispatch(MasterList(result));
            case displayText.ILI_SUMMARY:
               return dispatch(SummaryList(result));
            case displayText.ILI_VERSION:
               return dispatch(VersionsList(result));
            case displayText.ILI_UNIT:
               return dispatch(UnitsList(result));
            case displayText.ILI_OPERATIONAL_AREA:
               return dispatch(OperationalList(result));
            case displayText.ILI_VENDOR:
               return dispatch(VendorsList(result));
            case displayText.QUANTITY:
               return dispatch(QuantityList(result));
            case displayText.SELECT_UNIT:
               return dispatch(AllUnits(result));
            case displayText.FEATURE_LIST_DATA:
               return dispatch(FeatureList(result));
            default:
               return stringManipulationCheck.EMPTY_STRING;
         }
      }
      else
         dispatch(showFailureSnackbar(result))
   };
};

const VendorsList = (val) => {
   return { type: dataImportReducerConstant.VENDORS_LIST, value: val };
};

const OperationalList = (val) => {
   return { type: dataImportReducerConstant.OPERATIONAL_AREA_LIST, value: val };
};

const UnitsList = (val) => {
   return { type: dataImportReducerConstant.UNIT_LIST, value: val };
};

const VersionsList = (val) => {
   return { type: dataImportReducerConstant.VERSION_LIST, value: val };
};

const SummaryList = (val) => {
   return { type: dataImportReducerConstant.ILI_SUMMARY_LIST, value: val };
};

const MasterList = (val) => {
   return { type: dataImportReducerConstant.MASTER_LIST, value: val };
};

const QuantityList = (val) => {
   return { type: dataImportReducerConstant.QUANTITY_LIST, value: val };
};

const FeatureList = (val) => {
   return { type: dataImportReducerConstant.FETCH_FEATURE_TYPE, value: val };
};

const AllUnits = (val) => {
   return { type: dataImportReducerConstant.ALL_UNITS, value: val };
}

const SaveTemplateClear = (val) => {
   return { type: dataImportReducerConstant.TEMPLATE_ADD_CLEAR, value: val };
};

const SaveTemplateSuccess = (val) => {
   return { type: dataImportReducerConstant.IS_TEMPLATE_SUCCESS, value: val };
};

const FieldMappingErrorValidation = (val) => {
   return { type: dataImportReducerConstant.ERROR_VALIDATION_FIELDMAPPING, value: val }
};

export const ClearFieldMappingErrorValidation = () => {
   return { type: dataImportReducerConstant.CLEAR_ERROR_VALIDATION_FIELDMAPPING }
};

export const updateSelectedVendor = (val) => {
   if (val === displayText.DEFAULT_PARENTID) {
      return { type: dataImportReducerConstant.SELECTED_VENDOR_UPDATE, value: null };
   }
   return { type: dataImportReducerConstant.SELECTED_VENDOR_UPDATE, value: val };
};

export const updateSelectedOperationalArea = (val) => {
   if (val === displayText.DEFAULT_PARENTID) {
      return { type: dataImportReducerConstant.SELECTED_OPERATIONAL_AREA_UPDATE, value: null };
   }
   return { type: dataImportReducerConstant.SELECTED_OPERATIONAL_AREA_UPDATE, value: val };
};

const SaveVendorOperationalSuccess = (val) => {
   return { type: dataImportReducerConstant.IS_VENDOR_OPERATIONAL_SUCCESS, value: val };
};

export const clearVendorAndOperationalArea = (val) => {
   return { type: dataImportReducerConstant.IS_VENDOR_OPERATIONAL_CLEAR, value: val };
};

export const FetchExcelData = (url, data, lazyLoad = false) => {
   return async (dispatch) => {
      if (isNotEmptyNullUndefined(url) && isNotEmptyNullUndefined(data)) {
         return serviceCall.getExcelPreview(url, data)
            .then((result) => {
               if (!isStatusCodeValid(result, statusCode.CODE_200) || !isNotEmptyNullUndefined(result.data)) {
                  dispatch(FetchExcelDataFailure());
                  dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_PARSE_EXCEL));
                  return;
               }
               if (lazyLoad) {
                  dispatch(FetchPartialData(result.data));
                  return;
               }
               dispatch(FetchAllSheetData(result.data));
            })
            .catch((e) => {
               dispatch(FetchExcelDataFailure());
               dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_PARSE_EXCEL));
            });
      }
      else {
         dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_PARSE_EXCEL));
      }
   }
};

export const UpdateVendorMatchingDetails = (url, data) => {
   return (dispatch) => {
      return serviceCall.postData(url, data)
         .then((result) => {
            if (!isStatusCodeValid(result, statusCode.CODE_200) || !isNotEmptyNullUndefined(result.data)) {
               dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_UPDATE_MATCHING_DETAILS));
            }
            dispatch({ type: dataImportReducerConstant.FETCH_UPDATED_MATCHING_DETAILS, value: _.head(result.data) });
         })
         .catch((e) => {
            dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_UPDATE_MATCHING_DETAILS));
         })
   }
};

export const ClearUpdatedMatchingDetails = () => {
   return (dispatch) => {
      dispatch({ type: dataImportReducerConstant.CLEAR_MATCHING_DETAIL_UPDATE })
   }
};

const FetchExcelDataFailure = () => {
   return {
      type: dataImportReducerConstant.FETCH_EXCEL_DATA_FAILURE,
   };
};

export const clearSelectedData = () => {
   return {
      type: dataImportReducerConstant.CLEAR_VENDOR_OPAREA
   }
};

const FetchPartialData = (resultData) => {
   return (dispatch) => {
      let allSheetData = resultData.map((currentSheetData, index) => {
         let keyReference = Object.keys(currentSheetData);
         let { mainDataKeyName, mainDataRowKeyName } = filterExcelResponse(keyReference);
         let sheetName = isNullUndefined(currentSheetData) && isNullUndefined(keyReference) ? mainDataKeyName.split(stringManipulationCheck.UNDERSCORE_OPERATOR) : stringManipulationCheck.EMPTY_STRING;
         let cols = isNullUndefined(currentSheetData) && isNullUndefined(keyReference) &&
            currentSheetData[mainDataKeyName]?.length > fieldMappingSheetConfig.fieldMapLengthCheck
            ? _.map(_.head(currentSheetData[mainDataKeyName]), "key")
            : [];
         let rowCountReference = currentSheetData[mainDataRowKeyName];
         let rowCount = isNullUndefined(rowCountReference) && _.head(rowCountReference);
         let dataColumns = cols.length > fieldMappingSheetConfig.fieldMapLengthCheck && cols.map((currentCol) => {
            return { key: currentCol, resizable: true, width: fieldMappingSheetConfig.dataGridColumnWidth, name: currentCol }
         });
         let rows = convertRowsToSingleObject(currentSheetData[mainDataKeyName]);
         return { dataColumns, rows, sheetName, rowCount };
      });
      dispatch(FetchExcelDataLazyLoadSuccess(_.head(allSheetData)));
   }
};

const FetchAllSheetData = (resultData) => {
   return (dispatch) => {
      dispatch({ type: dataImportReducerConstant.DATA_IMPORT_LOADER });
      let allSheetData = resultData.map((currentSheetData, index) => {
         if (Object.keys(currentSheetData).length !== 0) {
            let keyReference = Object.keys(currentSheetData);
            let { mainDataKeyName, mainDataRowKeyName, genericDataKeyName } = filterExcelResponse(keyReference);
            let sheetName = isNullUndefined(currentSheetData) && isNullUndefined(keyReference)
               ? _.head(_.head(keyReference).split(stringManipulationCheck.UNDERSCORE_OPERATOR))
               : stringManipulationCheck.EMPTY_STRING;
            let cols = isNullUndefined(currentSheetData) && isNullUndefined(mainDataKeyName) &&
               currentSheetData[mainDataKeyName].length > fieldMappingSheetConfig.fieldMapLengthCheck ?
               _.map(_.head(currentSheetData[mainDataKeyName]), "key") : [];
            let rowCountReference = currentSheetData[mainDataRowKeyName];
            let rowCount = isNullUndefined(rowCountReference) && _.head(rowCountReference);
            let dataColumns = cols.length > fieldMappingSheetConfig.fieldMapLengthCheck && cols.map((currentCol) => {
               return { key: currentCol, resizable: true, width: fieldMappingSheetConfig.dataGridColumnWidth, name: currentCol }
            });
            let rows = isNullUndefined(mainDataKeyName) && convertRowsToSingleObject(currentSheetData[mainDataKeyName]);
            let genericData = currentSheetData[genericDataKeyName];
            if (genericData && genericData.length !== fieldMappingSheetConfig.fieldMapLengthCheck) {
               let { genericDataColumns, genericRows } = FetchGenericData(currentSheetData, genericDataKeyName);
               return { dataColumns, rows, sheetName, genericDataColumns, genericRows, rowCount };
            }
            else {
               return { dataColumns, rows, sheetName, rowCount };
            }
         } else {
            return null;
         }
      });
      dispatch(FetchExcelDataSuccess(allSheetData));
   }
};

const convertRowsToSingleObject = (rows) => {
   return rows.map(currentRow => {
      return convertArrayOfObjectToObject(currentRow);
   })
}

const convertArrayOfObjectToObject = (array) => {
   return _.transform(array, (resultObject, keyValuePair) => {
      return (resultObject[keyValuePair.key] = keyValuePair.value, resultObject);
   }, {});
};

const FetchGenericData = (currentSheetData, keyReference) => {
   let genericColumnReference = _.head(currentSheetData[keyReference]);
   let genericCols = genericColumnReference ? _.map(genericColumnReference, "key") : [];
   let genericDataColumns = genericCols && genericCols.map((currentCol) => {
      return { key: currentCol, resizable: true, width: fieldMappingSheetConfig.headerColumnWidth, name: currentCol }
   });
   let genericRows = convertRowsToSingleObject(currentSheetData[keyReference]);
   return { genericDataColumns, genericRows };
};

export const FetchILISummaryData = (url, data) => {
   return (dispatch) => {
      dispatch(DataSaveLoaderOverlay(true, displayText.LOADING_ILI_SUMMARY_DASHBOARD));
      return serviceCall.postData(url, data)
         .then((result) => {
            if (!isStatusCodeValid(result, statusCode.CODE_200) || !isNotEmptyNullUndefined(result.data)) {
               dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_FETCH_SUMMARY_DETAILS));
            }
            dispatch({ type: dataImportReducerConstant.FETCH_ILI_SUMMARY_DASHBOARD, value: result.data });
            dispatch(DataSaveLoaderOverlay(false));
         })
         .catch((e) => {
            dispatch(showFailureSnackbar(errorMessage.UNABLE_TO_FETCH_SUMMARY_DETAILS));
            dispatch(DataSaveLoaderOverlay(false));
         })
   }
};

export const ClearExcelDataLazyLoad = () => {
   return {
      type: dataImportReducerConstant.CLEAR_EXCEL_LAZY_LOAD,
   };
};

const FetchExcelDataLazyLoadSuccess = (sheetData) => {
   return {
      type: dataImportReducerConstant.FETCH_EXCEL_DATA_LAZY_LOAD_SUCCESS,
      value: sheetData,
   };
};

const FetchExcelDataSuccess = (sheetData) => {
   return {
      type: dataImportReducerConstant.FETCH_EXCEL_DATA_SUCCESS,
      value: sheetData,
   };
};

export const SetFileName = (fileName) => {
   return (dispatch) => {
      dispatch({
         type: dataImportReducerConstant.SET_FILE_NAME,
         value: fileName
      })
   }
};

export const SelectedILISummarySheetData = (val) => {
   return { type: dataImportReducerConstant.SELECTED_ILISUMMARY_SHEETDATA, value: val };
};

// const FetchFileGuid = (fileGuid) => {
//    return {
//       type: dataImportReducerConstant.FETCH_FILE_GUID,
//       value: fileGuid,
//    };
// };

export const setSummaryLoader = (val) => {
   return { type: dataImportReducerConstant.SET_SUMMARY_LOADER, value: val };
}

export const removeSummaryLoader = (val) => {
   return { type: dataImportReducerConstant.REMOVE_SUMMARY_LOADER, value: val };
}

export const setVendorLoader = (val) => {
   return { type: dataImportReducerConstant.SET_VENDOR_LOADER, value: val };
}

export const removeVendorLoader = (val) => {
   return { type: dataImportReducerConstant.REMOVE_VENDOR_LOADER, value: val };
}

export const setOperationalLoader = (val) => {
   return { type: dataImportReducerConstant.SET_OPERATIONAL_LOADER, value: val };
}

export const removeOperationalLoader = (val) => {
   return { type: dataImportReducerConstant.REMOVE_OPERATIONAL_LOADER, value: val };
}

export const updateSummaryScreenData = (val) => (dispatch) => {
   dispatch({ type: dataImportReducerConstant.ILI_SUMMARY_SCREEN_DATA, value: val });
}

export const updateToolType = (val) => (dispatch) => {
   dispatch({ type: dataImportReducerConstant.UPDATE_TOOL_TYPE, value: val })
}