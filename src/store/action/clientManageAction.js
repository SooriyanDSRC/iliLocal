import serviceCall from '../serviceCall';
import { showSuccessSnackbar, showFailureSnackbar } from './snackbarAction';
import { clientManageReducerConstant } from '../reducerConstant';
import { sessionStorageKey, statusCode, displayText } from '../../constant';
import { encryptData, isStatusCodeValid } from '../../components/shared/helper';

export const FetchClient = (url) => {
   return (dispatch) => {
      dispatch(StartLoader());
      return serviceCall
         .getAllData(url)
         .then((result) => {
            isStatusCodeValid(result, statusCode.CODE_200) ? dispatch(FetchClientSuccess(result)) : dispatch(showFailureSnackbar(result));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

const FetchClientSuccess = (val) => {
   if (val?.data?.preferences) {
      encryptData(val.data.preferences, sessionStorageKey.CLIENT_PREF);
      return { type: clientManageReducerConstant.FETCH_CLIENTS, value: val };
   }
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

export const AddClient = (url, data) => {
   return (dispatch) => {
      dispatch(AddClientClear(null));
      return serviceCall
         .postData(url, data)
         .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
               dispatch(showSuccessSnackbar(displayText.SUCCESS));
               dispatch(AddClientSuccess(true));
            } else {
               dispatch(showFailureSnackbar(result));
            }
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

const AddClientClear = (val) => {
   return { type: clientManageReducerConstant.CLIENT_ADD_CLEAR, value: val };
};

export const EditClient = (url, data) => {
   return (dispatch) => {
      dispatch(EditClientClear(null));
      return serviceCall.editData(url, data).then((result) => {
         if (isStatusCodeValid(result, statusCode.CODE_200)) {
            dispatch(showSuccessSnackbar(displayText.SUCCESS));
            dispatch(EditClientSuccess(true));
         } else {
            dispatch(showFailureSnackbar(result));
         }
      });
   };
};

const EditClientClear = (val) => {
   return { type: clientManageReducerConstant.CLIENT_EDIT_CLEAR, value: val };
};

const CountryList = (val) => {
   return { type: clientManageReducerConstant.FETCH_COUNTRY_LIST, value: val };
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

export const DeleteClient = (url, data) => {
   return (dispatch) => {
      dispatch(DeleteClientClear(null));
      return serviceCall.deleteCall(url, data).then((result) => {
         if (isStatusCodeValid(result, statusCode.CODE_200)) {
            dispatch(showSuccessSnackbar(displayText.SUCCESS));
            dispatch(DeleteClientSuccess(true));
         } else {
            dispatch(showFailureSnackbar(result));
         }
      });
   };
};

export const FetchClientById = (url) => {
   return (dispatch) => {
      return serviceCall
         .getAllData(url)
         .then((result) => {
            isStatusCodeValid(result, statusCode.CODE_200) ? dispatch(FetchClientByIdSuccess(result)) : dispatch(showFailureSnackbar(result));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

const FetchClientByIdSuccess = (val) => {
   return { type: clientManageReducerConstant.FETCH_CLIENT_BY_ID, value: val };
};

const DeleteClientSuccess = (val) => {
   return {
      type: clientManageReducerConstant.IS_CLIENT_DELETE_SUCCESS,
      value: val,
   };
};

const StateList = (val) => {
   return { type: clientManageReducerConstant.FETCH_STATE_LIST, value: val };
};

const AddClientSuccess = (val) => {
   return { type: clientManageReducerConstant.IS_CLIENT_SUCCESS, value: val };
};

const EditClientSuccess = (val) => {
   return {
      type: clientManageReducerConstant.IS_CLIENT_EDIT_SUCCESS,
      value: val,
   };
};

const DeleteClientClear = (val) => {
   return { type: clientManageReducerConstant.CLIENT_DELETE_CLEAR, value: val };
};

const StartLoader = () => {
   return { type: clientManageReducerConstant.LOADER };
};

