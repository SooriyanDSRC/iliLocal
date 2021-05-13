import { vendorManageReducerConstant } from '../../reducerConstant';
const initialState = {
  vendorDetail: null,
  isVendorEdited: null,
  isVendorDeleted: null,
  isVendorAdded: null,
  loader: false,
  countryList: null,
  stateList: null,
  vendortableLoader: false
};

const vendorManageReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case vendorManageReducerConstant.FETCH_VENDORS:
      return {
        ...state,
        vendorDetail: action.value.data,
        vendortableLoader: false
      };
    case vendorManageReducerConstant.VENDORTABLE_LOADER:
      return {
        ...state,
        vendortableLoader: true,
      };
    case vendorManageReducerConstant.FETCH_COUNTRY_LIST:
      return {
        ...state,
        countryList: action.value.data,
      };
    case vendorManageReducerConstant.VENDOR_ADD_CLEAR:
      return {
        ...state,
        isVendorAdded: null,
      };
    case vendorManageReducerConstant.FETCH_STATE_LIST:
      return {
        ...state,
        stateList: action.value.data,
      };
    case vendorManageReducerConstant.IS_VENDOR_SUCCESS:
      return {
        ...state,
        isVendorAdded: true,
      };
    case vendorManageReducerConstant.IS_VENDOR_EDIT_SUCCESS:
      return {
        ...state,
        isVendorEdited: true,
      };
    case vendorManageReducerConstant.IS_VENDOR_DELETE_SUCCESS:
      return {
        ...state,
        isVendorDeleted: true,
      };

    case vendorManageReducerConstant.VENDOR_DELETE_CLEAR:
      return {
        ...state,
        isVendorDeleted: null,
      };

    case vendorManageReducerConstant.VENDOR_EDIT_CLEAR:
      return {
        ...state,
        isVendorEdited: null,
      };
    default:
      return state;
  }
};

export default vendorManageReducer;