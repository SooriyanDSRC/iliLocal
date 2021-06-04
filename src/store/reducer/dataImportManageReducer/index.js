import { dataImportReducerConstant } from "../../reducerConstant";
import { stringManipulationCheck } from "../../../constant";

const initialState = {
   vendorsList: null,
   selectedVendor: null,
   selectedOperationalArea: null,
   operationalList: null,
   excelData: null,
   loader: false,
   lastJointLength: false,
   jointLength: false,
   unitList: null,
   versionList: null,
   summaryList: null,
   masterList: null,
   matchingDetails: null,
   isTemplateAdded: null,
   lazyLoadData: [],
   isChunksAdded: null,
   showOverlayLoader: false,
   showOverlayLoaderMessage: stringManipulationCheck.EMPTY_STRING,
   isVendorOperationalAdded: null,
   fieldMappingErrorValidation: null,
   fieldMappingErrorValidationValue: null,
   excelTemplate: null,
   qcDashboardData: null,
   savedInspectionGuid: null,
   formData: null,
   matchingDetailUpdate: false,
   qcResponse: null,
   dataSaveCompleted: null,
   revertCompleted: null,
   previousVersionQCData: null,
   qcInput: null,
   dataSummaryOperationalArea: null,
   dataSummaryVendor: null,
   iliSummaryScreenData: null,
   quantityList: null,
   templateResult: null,
   iliSummaryDashboardData: null,
   selectedIliSummarySheetData: null,
   getAllUnitList: null,
   featureTypes: null,
   fileName: stringManipulationCheck.EMPTY_STRING,
   isSummaryLoading: null,
   isVendorLoading: null,
   isOperationalAreaLoading: null,
   toolTypeData: null
};

const dataImportManageReducer = (state = initialState, action = {}) => {
   switch (action.type) {
      case dataImportReducerConstant.VENDORS_LIST:
         return {
            ...state,
            vendorsList: action.value.data,
         };
      case dataImportReducerConstant.OPERATIONAL_AREA_LIST:
         return {
            ...state,
            operationalList: action.value.data,
         };
      case dataImportReducerConstant.UNIT_LIST:
         return {
            ...state,
            unitList: action.value.data,
         };
      case dataImportReducerConstant.VERSION_LIST:
         return {
            ...state,
            versionList: action.value.data,
         };
      case dataImportReducerConstant.ILI_SUMMARY_LIST:
         return {
            ...state,
            summaryList: action.value.data,
         };
      case dataImportReducerConstant.MASTER_LIST:
         return {
            ...state,
            masterList: action.value.data,
         };
      case dataImportReducerConstant.ALL_UNITS:
         return {
            ...state,
            getAllUnitList: action.value.data,
         };
      case dataImportReducerConstant.FETCH_EXCEL_DATA_SUCCESS:
         return {
            ...state,
            excelData: action.value,
            loader: false,
         };
      case dataImportReducerConstant.FETCH_EXCEL_DATA_FAILURE:
         return {
            ...state,
            loader: false,
         };
      case dataImportReducerConstant.DATA_IMPORT_LOADER:
         return {
            ...state,
            loader: true,
         };
      case dataImportReducerConstant.TEMPLATE_ADD_CLEAR:
         return {
            ...state,
            isTemplateAdded: null,
         };
      case dataImportReducerConstant.IS_TEMPLATE_SUCCESS:
         return {
            ...state,
            isTemplateAdded: true,
            fieldMappingErrorValidation: false,
            fieldMappingErrorValidationValue: null
         };
      case dataImportReducerConstant.FETCH_EXCEL_DATA_LAZY_LOAD_SUCCESS:
         return {
            ...state,
            lazyLoadData: action.value,
         };
      case dataImportReducerConstant.CLEAR_EXCEL_LAZY_LOAD:
         return {
            ...state,
            lazyLoadData: []
         };
      case dataImportReducerConstant.CHUNKS_ADD_CLEAR:
         return {
            ...state,
            isChunksAdded: null,
         };
      case dataImportReducerConstant.IS_CHUNKS_SUCCESS:
         return {
            ...state,
            isChunksAdded: true,
         };
      case dataImportReducerConstant.DATA_SAVE_LOADER:
         return {
            ...state,
            showOverlayLoader: action.value.val,
            showOverlayLoaderMessage: action.value.data
         };
      case dataImportReducerConstant.SELECTED_VENDOR_UPDATE:
         return {
            ...state,
            selectedVendor: action.value
         };
      case dataImportReducerConstant.CLEAR_VENDOR_OPAREA:
         return {
            ...state,
            selectedVendor: null,
            selectedOperationalArea: null
         };
      case dataImportReducerConstant.SELECTED_OPERATIONAL_AREA_UPDATE:
         return {
            ...state,
            selectedOperationalArea: action.value
         };
      case dataImportReducerConstant.IS_VENDOR_OPERATIONAL_SUCCESS:
         return {
            ...state,
            isVendorOperationalAdded: true,
            dataSummaryVendor: action.value.iliToolVendorClGuid,
            dataSummaryOperationalArea: action.value.iliToolOperationalAreaClGuid
         };
      case dataImportReducerConstant.IS_VENDOR_OPERATIONAL_CLEAR:
         return {
            ...state,
            isVendorOperationalAdded: null,
         };
      case dataImportReducerConstant.ERROR_VALIDATION_FIELDMAPPING:
         return {
            ...state,
            fieldMappingErrorValidation: true,
            fieldMappingErrorValidationValue: action.value
         };
      case dataImportReducerConstant.CLEAR_ERROR_VALIDATION_FIELDMAPPING:
         return {
            ...state,
            fieldMappingErrorValidation: null,
            fieldMappingErrorValidationValue: null,
            showOverlayLoader: false,
            showOverlayLoaderMessage: stringManipulationCheck.EMPTY_STRING,
            savedInspectionGuid: null,
            toolTypeData: null
         };
      case dataImportReducerConstant.UPDATE_EXCEL_TEMPLATE:
         return {
            ...state,
            excelTemplate: action.value
         };
      case dataImportReducerConstant.SET_QC_DASHBOARD_DATA:
         return {
            ...state,
            qcDashboardData: action.value.resultData,
            savedInspectionGuid: action.value.savedInspectionGuid,
            formData: action.value.formData,
            qcInput: action.value.qcInput,
            templateResult: action.value.templateResult,
            jointLength: action.value.jointLength,
            lastJointLength: action.value.lastJointLength
         };
      case dataImportReducerConstant.FETCH_UPDATED_MATCHING_DETAILS:
         return {
            ...state,
            matchingDetails: action.value,
            matchingDetailUpdate: true
         };
      case dataImportReducerConstant.CLEAR_MATCHING_DETAIL_UPDATE:
         return {
            ...state,
            matchingDetailUpdate: false
         };
      case dataImportReducerConstant.SAVE_QC_RESPONSE:
         return {
            ...state,
            qcResponse: action.value,
            dataSaveCompleted: true
         };
      case dataImportReducerConstant.CLEAR_QCDASHBOARD_DATA:
         return {
            ...state,
            qcDashboardData: null,
            dataSummaryOperationalArea: null,
            dataSummaryVendor: null,
            matchingDetails: null,
            jointLength: false,
            lastJointLength: false,
            formData: null,
            fileName: stringManipulationCheck.EMPTY_STRING,
            excelData: null,
            toolTypeData: null
         };
      case dataImportReducerConstant.REVERT_SUCCESS_REDIRECT:
         return {
            ...state,
            revertCompleted: action.value
         };
      case dataImportReducerConstant.SET_PREVIOUS_VERSION_QC_DATA:
         return {
            ...state,
            previousVersionQCData: action.value
         };
      case dataImportReducerConstant.QUANTITY_LIST:
         return {
            ...state,
            quantityList: action.value.data,
            showOverlayLoader: false,
            showOverlayLoaderMessage: null
         };
      case dataImportReducerConstant.CLEAR_DATA_SAVE_COMPLETED:
         return {
            ...state,
            dataSaveCompleted: null
         };
      case dataImportReducerConstant.FETCH_ILI_SUMMARY_DASHBOARD:
         return {
            ...state,
            iliSummaryDashboardData: action.value
         };
      case dataImportReducerConstant.SELECTED_ILISUMMARY_SHEETDATA:
         return {
            ...state,
            selectedIliSummarySheetData: action.value
         };
      case dataImportReducerConstant.FETCH_FILE_GUID:
         return {
            ...state,
            fileNewGuid: action.value
         }
      case dataImportReducerConstant.FETCH_FEATURE_TYPE:
         return {
            ...state,
            featureTypes: action.value.data
         }
      case dataImportReducerConstant.SET_FILE_NAME:
         return {
            ...state,
            fileName: action.value
         }
      case dataImportReducerConstant.SET_SUMMARY_LOADER:
         return {
            ...state,
            isSummaryLoading: true
         }
      case dataImportReducerConstant.REMOVE_SUMMARY_LOADER:
         return {
            ...state,
            isSummaryLoading: false
         }
      case dataImportReducerConstant.SET_VENDOR_LOADER:
         return {
            ...state,
            isVendorLoading: true
         }
      case dataImportReducerConstant.REMOVE_VENDOR_LOADER:
         return {
            ...state,
            isVendorLoading: false
         }
      case dataImportReducerConstant.SET_OPERATIONAL_LOADER:
         return {
            ...state,
            isOperationalAreaLoading: true
         }
      case dataImportReducerConstant.REMOVE_OPERATIONAL_LOADER:
         return {
            ...state,
            isOperationalAreaLoading: false
         }
      case dataImportReducerConstant.ILI_SUMMARY_SCREEN_DATA:
         return {
            ...state,
            iliSummaryScreenData: action.value
         }
      case dataImportReducerConstant.UPDATE_TOOL_TYPE:
         return {
            ...state,
            toolTypeData: action.value
         }

      default:
         return state;
   }
};

export default dataImportManageReducer;
