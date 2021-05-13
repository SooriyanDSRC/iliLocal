import { sessionStorageKey, statusCode, displayText } from '../../constant';
import serviceCall from '../serviceCall';
import { showSuccessSnackbar, showFailureSnackbar } from './snackbarAction';
import { vendorManageReducerConstant } from '../reducerConstant';
import { encryptData, isStatusCodeValid } from '../../components/shared/helper';

export const FetchVendor = (url) => {
  return (dispatch) => {
    dispatch(StartLoader());
    return serviceCall
      .getAllData(url)
      .then((result) => {
        if (isStatusCodeValid(result, statusCode.CODE_200)) {
          dispatch(FetchVendorSuccess(result));
        } else {
          dispatch(showFailureSnackbar(result));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
};

const FetchVendorSuccess = (val) => {
  if (val?.data?.preferences)
    encryptData(val.data.preferences, sessionStorageKey.VENDOR_PREF);
  return { type: vendorManageReducerConstant.FETCH_VENDORS, value: val };
};

export const FetchCountryList = (url) => {
  return (dispatch) => {
    return serviceCall
      .getAllData(url)
      .then((result) => {
        if (isStatusCodeValid(result, statusCode.CODE_200)) {
          dispatch(CountryList(result));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
};

export const AddVendor = (url, data) => {
  return (dispatch) => {
    dispatch(AddVendorClear(null));
    return serviceCall
      .postData(url, data)
      .then((result) => {
        if (isStatusCodeValid(result, statusCode.CODE_201)) {
          dispatch(showSuccessSnackbar(displayText.SUCCESS));
          dispatch(AddVendorSuccess(true));
        } else {
          dispatch(showFailureSnackbar(result));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
};

export const EditVendor = (url, data) => {
  return (dispatch) => {
    dispatch(EditVendorClear(null));
    return serviceCall.editData(url, data).then((result) => {
      if (isStatusCodeValid(result, statusCode.CODE_200)) {
        dispatch(showSuccessSnackbar(displayText.SUCCESS));
        dispatch(EditVendorSuccess(true));
      } else {
        dispatch(showFailureSnackbar(result));
      }
    });
  };
};

const CountryList = (val) => {
  return { type: vendorManageReducerConstant.FETCH_COUNTRY_LIST, value: val };
};

export const FetchStateList = (url) => {
  return (dispatch) => {

    return serviceCall
      .getAllData(url)
      .then((result) => {
        if (isStatusCodeValid(result, statusCode.CODE_200)) {
          dispatch(StateList(result));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
};

export const DeleteVendor = (url, data) => {
  return (dispatch) => {
    dispatch(DeleteVendorClear(null));
    return serviceCall.deleteCall(url, data).then((result) => {
      if (isStatusCodeValid(result, statusCode.CODE_200)) {
        dispatch(showSuccessSnackbar(displayText.SUCCESS));
        dispatch(DeleteVendorSuccess(true));
      } else {
        dispatch(showFailureSnackbar(result));
      }
    });
  };
};

const DeleteVendorSuccess = (val) => {
  return {
    type: vendorManageReducerConstant.IS_VENDOR_DELETE_SUCCESS,
    value: val,
  };
};

const StateList = (val) => {
  return { type: vendorManageReducerConstant.FETCH_STATE_LIST, value: val };
};

const AddVendorSuccess = (val) => {
  return { type: vendorManageReducerConstant.IS_VENDOR_SUCCESS, value: val };
};

const EditVendorSuccess = (val) => {
  return {
    type: vendorManageReducerConstant.IS_VENDOR_EDIT_SUCCESS,
    value: val,
  };
};

const AddVendorClear = (val) => {
  return { type: vendorManageReducerConstant.VENDOR_ADD_CLEAR, value: val };
};

const EditVendorClear = (val) => {
  return { type: vendorManageReducerConstant.VENDOR_EDIT_CLEAR, value: val };
};

const DeleteVendorClear = (val) => {
  return { type: vendorManageReducerConstant.VENDOR_DELETE_CLEAR, value: val };
};

const StartLoader = () => {
  return { type: vendorManageReducerConstant.VENDORTABLE_LOADER };
};

