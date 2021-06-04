import serviceCall from '../serviceCall';
import { applicationUserManageReducerConstant } from '../reducerConstant';
import {
   showSuccessSnackbar,
   showFailureSnackbar,
} from './snackbarAction';
import { statusCode, sessionStorageKey } from '../../constant';
import { encryptData, isStatusCodeValid } from '../../components/shared/helper'

export const FetchApplicationUser = (url) => {
   return (dispatch) => {
      dispatch(StartLoader());
      return serviceCall
         .getAllData(url)
         .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
               dispatch(FetchApplicationUserSuccess(result));
               return;
            }
            dispatch(showFailureSnackbar(result));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

const FetchApplicationUserSuccess = (val) => {
   if (val?.data?.preferences)
      encryptData(val.data.preferences, sessionStorageKey.ADMIN_PREF);
   return {
      type: applicationUserManageReducerConstant.FETCH_APP_USERS,
      value: val,
   };
};

export const AddApplicationUser = (url, data) => {
   return (dispatch) => {
      dispatch(AddApplicationUserClear(null));
      dispatch(ApplicationUserLoader(true));
      return serviceCall
         .postData(url, data)
         .then((result) => {
            if (result && result.status === statusCode.CODE_201) {
               dispatch(showSuccessSnackbar());
               dispatch(AddApplicationUserSuccess(true));
            } else {
               dispatch(showFailureSnackbar(result));
            }
            dispatch(ApplicationUserLoader(false));
         })
         .catch((e) => {
            dispatch(ApplicationUserLoader(false));
            console.log(e);
         });
   };
};

const AddApplicationUserSuccess = (val) => {
   return {
      type: applicationUserManageReducerConstant.IS_APP_USER_SUCCESS,
      value: val,
   };
};
const AddApplicationUserClear = (val) => {
   return {
      type: applicationUserManageReducerConstant.APP_USER_ADD_CLEAR,
      value: val,
   };
};

export const EditApplicationUser = (url, data, isCurrentUser) => {
   return (dispatch) => {
      dispatch(EditApplicationUserClear(null));
      return serviceCall
         .editData(url, data)
         .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
               !isCurrentUser && dispatch(updateUserName(data.username));
               dispatch(showSuccessSnackbar());
               dispatch(EditApplicationUserSuccess(true));
               return;
            }
            dispatch(showFailureSnackbar(result));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

const EditApplicationUserSuccess = (val) => {
   return {
      type: applicationUserManageReducerConstant.IS_APP_USER_EDIT_SUCCESS,
      value: val,
   };
};
const EditApplicationUserClear = (val) => {
   return {
      type: applicationUserManageReducerConstant.APP_USER_EDIT_CLEAR,
      value: val,
   };
};
const updateUserName = (data) => {
   return {
      type: applicationUserManageReducerConstant.UPDATE_MY_ACCOUNT_USERNAME,
      value: data
   }
}

export const DeleteApplicationUser = (url, data) => {
   return (dispatch) => {
      dispatch(DeleteApplicationUserClear(null));
      return serviceCall
         .deleteCall(url, data)
         .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
               dispatch(showSuccessSnackbar());
               dispatch(DeleteApplicationUserSuccess(true));
               return;
            }
            dispatch(showFailureSnackbar(result));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

const DeleteApplicationUserSuccess = (val) => {
   return {
      type: applicationUserManageReducerConstant.IS_APP_USER_DELETE_SUCCESS,
      value: val,
   };
};
const DeleteApplicationUserClear = (val) => {
   return {
      type: applicationUserManageReducerConstant.APP_USER_DELETE_CLEAR,
      value: val,
   };
};

export const CheckEmailExists = (url) => {
   return (dispatch) => {
      return serviceCall
         .getAllData(url)
         .then((result) => {
            result && result.data ? dispatch(IsCheckEmailExists(result.data)) : dispatch(IsCheckEmailNotExists(result.data));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

const IsCheckEmailExists = (val) => {
   return {
      type: applicationUserManageReducerConstant.ISCHECK_EMAIL_EXISTS,
      value: val,
   };
};
const IsCheckEmailNotExists = (val) => {
   return {
      type: applicationUserManageReducerConstant.ISCHECK_EMAIL_NOT_EXISTS,
      value: val,
   };
};

export const AddApplicationUsertoClient = (url, data) => {
   return (dispatch) => {
      dispatch(AddApplicationUserClear(null));
      return serviceCall
         .postData(url, data)
         .then((result) => {
            if (result && result.status === statusCode.CODE_201) {
               dispatch(showSuccessSnackbar());
               dispatch(AddApplicationUserToClientSuccess(true));
               return;
            }
            dispatch(showFailureSnackbar(result));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

export const UserInvite = (url, data) => {
   return (dispatch) => {
      dispatch(StartLoader(true));
      dispatch(InviteApplicationUserSuccess(false));
      return serviceCall
         .postData(url, data)
         .then((result) => {
            if (result && result.status === statusCode.CODE_200) {
               dispatch(showSuccessSnackbar());
               dispatch(InviteApplicationUserSuccess(true));
               return;
            }
            dispatch(showFailureSnackbar(result));
         })
         .catch((e) => {
            console.log(e);
         });
   };
};

const InviteApplicationUserSuccess = (val) => {
   return {
      type: applicationUserManageReducerConstant.INVITE_APPLICATION_USER,
      value: val,
   };
};

const AddApplicationUserToClientSuccess = (val) => {
   return {
      type: applicationUserManageReducerConstant.PROVERSION_TO_CLIENT,
      value: val,
   };
};

const StartLoader = () => {
   return { type: applicationUserManageReducerConstant.APP_USER_LOADER };
};

const ApplicationUserLoader = (val) => {
   return {
      type: applicationUserManageReducerConstant.APP_USER_CREATE_LOADER,
      value: val,
   };
};