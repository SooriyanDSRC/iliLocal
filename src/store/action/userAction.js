import serviceCall from '../serviceCall';
import { userReducerConstant } from '../reducerConstant';
import { sessionStorageKey, errorMessage, displayText, statusCode, apiRouter, stringManipulationCheck } from '../../constant';
import { showSuccessSnackbar, showFailureSnackbar, showWarningSnackbar } from './snackbarAction';
import _ from 'lodash';
import { decryptData, isNullUndefined, isStatusCodeValid, isUndefined, encryptData, isEmpty, isCookieValid } from '../../components/shared/helper';
import { arrayConstants } from '../../arrayconstants';

export const UserLogin = (url, data) => (dispatch) => {
   dispatch(toggleLoader(true));
   return serviceCall
      .loginUser(url, data)
      .then((result) => {
         if (result && result.data) {
            encryptData(result.data, sessionStorageKey.USER_DETAILS);
            encryptData(result.data?.clients[arrayConstants.initialOrder], sessionStorageKey.USER_CURRENT_CLIENT_DETAILS);
            getCookie(result.data?.token);
            dispatch(UserClientInfo(JSON.parse(decryptData(sessionStorageKey.USER_DETAILS))?.clients[arrayConstants.initialOrder]))
            dispatch(UserLoginApi(result));
            if (isCookieValid()) {
               GetUserFeatures(apiRouter.FEATURES);
            }
            let userGuid = JSON.parse(decryptData(sessionStorageKey.USER_DETAILS))?.usersGuid;
            let clientsGuid = JSON.parse(decryptData(sessionStorageKey.USER_DETAILS))?.clients[arrayConstants.initialOrder].clientsGuid;
            let url = `${userReducerConstant.COMMON_USER_PREFERENCE}?${displayText.USER_GUID}=${userGuid}&${displayText.CLIENTSGUID}=${clientsGuid}`;
            return serviceCall.getAllData(url).then((userPreferenceResult) => {
               if (isStatusCodeValid(userPreferenceResult, statusCode.CODE_200)) {
                  setPrefToSession(
                     userPreferenceResult,
                     displayText.USER_TABLE,
                     sessionStorageKey.USER_PREF
                  );
                  setPrefToSession(
                     userPreferenceResult,
                     displayText.CLIENT_TABLE,
                     sessionStorageKey.CLIENT_PREF
                  );
                  setPrefToSession(
                     userPreferenceResult,
                     displayText.VENDOR_TABLE,
                     sessionStorageKey.VENDOR_PREF
                  );
                  setPrefToSession(
                     userPreferenceResult,
                     displayText.ADMIN_TABLE,
                     sessionStorageKey.ADMIN_PREF
                  );
               } else {
                  dispatch(showFailureSnackbar(userPreferenceResult));
               }
            });
         }
      })
      .catch((err) => {
         if (!isStatusCodeValid(err?.response, statusCode.CODE_400) && !isStatusCodeValid(err?.response, statusCode.CODE_401) && !(err?.response)) {
            dispatch(setErrMsg(errorMessage.USER_NOT_HAVE_PERMISSION_ACCESS));
            return;
         }
         if (isStatusCodeValid(err?.response, statusCode.CODE_400)) {
            dispatch(setErrMsg(errorMessage.INVALID_PASSWORD));
            return;
         }
         if (isStatusCodeValid(err?.response, statusCode.CODE_401)) {
            dispatch(setErrMsg(errorMessage.PLEASE_CONTACT_ADMIN));
            return;
         }
         if (err?.response) {
            dispatch(showFailureSnackbar(isUndefined(err?.response?.data?.message) ? err?.response?.data?.message : errorMessage.INTERNAL_SERVER_ERROR));
            dispatch(toggleLoader(false));
            return;
         }
      });
};

export const GetRefreshToken = (url) => {
   return (dispatch) => {
      dispatch(SetRefreshLoader(true));
      return serviceCall
         .cookiePostData(url, null)
         .then((result) => {
            if (!(result && result.data)) {
               dispatch(showFailureSnackbar(result));
               return;
            }
            getCookie(result.data?.token);
            dispatch(RemoveRefreshLoader(false));
         })
         .catch((e) => {
            dispatch(showFailureSnackbar(e));
         });
   };
}

export const RevokeToken = (url, data) => {
   return (dispatch) => {
      dispatch(setLogoutLoader(true));
      return serviceCall
         .revokePostData(url, data)
         .then((result) => {
            if (!(result && result.data)) {
               dispatch(showFailureSnackbar(result));
               dispatch(removeLogoutLoader(false));
               return;
            }
            sessionStorage.clear();
            localStorage.clear();
            window.location.reload();
            dispatch(removeLogoutLoader(false));
         })
         .catch((e) => {
            dispatch(showFailureSnackbar(e));
            dispatch(removeLogoutLoader(false));
         });
   };
}

function getCookie(name) {
   if (isNullUndefined(name))
      document.cookie = `${sessionStorageKey.TOKEN}=${name}`
}

export const SetUserClientDetails = (val) => {
   return (dispatch) => {
      dispatch(UserClientInfo(val));
   };
}

const UserClientInfo = (val) => ({ type: userReducerConstant.USER_CLIENT_INFO, value: val });
const UserLoginApi = (val) => ({ type: userReducerConstant.LOGIN_USER, value: val });
const toggleLoader = (val) => ({ type: userReducerConstant.TOGGLE_LOADER, value: val });
export const setErrMsg = (val) => ({ type: userReducerConstant.SET_ERR_MSG, value: val });

export const GetUserFeatures = (url) => {
   return (dispatch) => {
      dispatch(StartFeaturesLoader(true));
      return serviceCall
         .getAllData(url)
         .then((result) => {
            if (!(result && result.data)) {
               dispatch(StartFeaturesLoader(false));
               dispatch(showFailureSnackbar(result));
               return;
            }
            encryptData(result.data, sessionStorageKey.USER_ROLES);
            dispatch(FetchUserMenu(result));
         })
         .catch((e) => {
            dispatch(StartFeaturesLoader(false));
            dispatch(showFailureSnackbar(e));
         });
   };
};

export const GetPreference = (url) => {
   return (dispatch) => {
      return serviceCall
         .getAllData(url)
         .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
               setPrefToSession(
                  result,
                  displayText.USER_TABLE,
                  sessionStorageKey.USER_PREF
               );
               setPrefToSession(
                  result,
                  displayText.CLIENT_TABLE,
                  sessionStorageKey.CLIENT_PREF
               );
               setPrefToSession(
                  result,
                  displayText.VENDOR_TABLE,
                  sessionStorageKey.VENDOR_PREF
               );
               setPrefToSession(
                  result,
                  displayText.ADMIN_TABLE,
                  sessionStorageKey.ADMIN_PREF
               );
            } else {
               dispatch(showFailureSnackbar(result));
            }
         })
         .catch((e) => {
            dispatch(showFailureSnackbar(e));
         });
   };
};

const FetchUserMenu = (val) => {
   return { type: userReducerConstant.FETCH_USER_MENU, value: val, };
};

const StartFeaturesLoader = (val) => {
   return { type: userReducerConstant.SET_FEATURES_LOADER, value: val };
};

export const GetMyProfile = (url) => {
   return (dispatch) => {
      dispatch(StartLoader());
      dispatch(SetUpdateMyProfileSuccess(null));
      return serviceCall
         .getAllData(url)
         .then((result) => {
            result && result.data
               ? dispatch(FetchMyprofileSuccess(result))
               : dispatch(showFailureSnackbar(result));
         })
         .catch((e) => {
            dispatch(showFailureSnackbar(e));
         });
   };
};

const FetchMyprofileSuccess = (val) => {
   return { type: userReducerConstant.FETCH_MY_PROFILE, value: val, };
};

const StartLoader = () => {
   return { type: userReducerConstant.MY_PROFILE_LOADER };
};

export const updateUsername = (sessiondata) => {
   return (dispatch) => {
      dispatch({ type: userReducerConstant.UPDATE_USERNAME, value: sessiondata });
   }
};

export const UpdateMyProfile = (url, data) => {
   return (dispatch) => {
      dispatch(SetPasswordLoaderShow(true));
      return serviceCall
         .editData(url, data)
         .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
               dispatch(SetUpdateMyProfileSuccess(null));
               dispatch(showSuccessSnackbar(displayText.SUCCESS));
            } else {
               dispatch(showFailureSnackbar(result));
            }
         })
         .catch((e) => {
            dispatch(showFailureSnackbar(e));
         });
   };
};

export const ClearForgotPassword = () => {
   return (dispatch) => {
      dispatch({ type: userReducerConstant.CLEAR_FORGET_PASSWORD, value: null });
   };
};

export const SetUpdateMyProfile = (val) => {
   return (dispatch) => {
      dispatch(SetUpdateMyProfileSuccess(val));
   };
}

const SetUpdateMyProfileSuccess = (val) => { return { type: userReducerConstant.SET_UPDATE_MY_PROFILE, value: val }; };

export const UpdatePassword = (url, data, type) => {
   return (dispatch) => {
      dispatch(SetPasswordLoaderShow(true));
      dispatch(ValidationMessage(stringManipulationCheck.EMPTY_STRING));
      if (type === apiRouter.CHANGEPASSWORD) {
         return serviceCall
            .postData(url, data)
            .then((result) => {
               if (isStatusCodeValid(result, statusCode.CODE_200) && (isEmpty(result?.data))) {
                  dispatch(UpdatePasswordSuccess(true));
                  dispatch(showSuccessSnackbar(displayText.SUCCESS));
                  dispatch(SetPasswordLoaderHide(false));
               }
               else if (isStatusCodeValid(result, statusCode.CODE_200) && !isEmpty(result?.data)) {
                  dispatch(ValidationMessage(result?.data));
               }
               else {
                  dispatch(showFailureSnackbar(result));
                  dispatch(SetPasswordLoaderHide(true));
                  dispatch(UpdatePasswordFailure(false));
               }
            })
            .catch((e) => {
               dispatch(UpdatePasswordFailure(false));
               dispatch(SetPasswordLoaderHide(false));
            });
      }
      dispatch(ResetTokenExpired(false));
      return serviceCall
         .passwordChangePostCall(url, data)
         .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_208)) {
               dispatch(showWarningSnackbar(result?.statusText));
               dispatch(SetPasswordLoaderHide(false));
               return;
            }
            if (_.isEqual(result, errorMessage.LINK_EXPIRED_ERROR_MESSAGE)) {
               dispatch(ResetTokenExpired(true));
               return;
            }
            if ((isStatusCodeValid(result, statusCode.CODE_200) && isEmpty(result?.data))
               || (isStatusCodeValid(result?.status, statusCode.CODE_200) && !isEmpty(result?.data))) {
               dispatch(UpdatePasswordSuccess(true));
               dispatch(showSuccessSnackbar(displayText.SUCCESS));
               dispatch(SetPasswordLoaderHide(false));
               return;
            }
            if (isStatusCodeValid(result, statusCode.CODE_200) && !isEmpty(result?.data)) {
               dispatch(SetPasswordLoaderHide(false));
               result?.data.trim() === errorMessage.OLD_PASSWORD_IS_SAME_AS_CURRENT_PASSWORD && dispatch(showFailureSnackbar(result?.data));
               return dispatch(ValidationMessage(result?.data));
            }
            dispatch(ResetTokenExpired(false));
            dispatch(showFailureSnackbar(result));
            dispatch(SetPasswordLoaderHide(false));
            dispatch(UpdatePasswordFailure(false));
         })
         .catch((e) => {
            dispatch(UpdatePasswordFailure(false));
            dispatch(SetPasswordLoaderHide(false));
         });
   };
};

export const ClearValidationMessage = () => {
   return (dispatch) => {
      dispatch(ValidationMessage(stringManipulationCheck.EMPTY_STRING));
   };
};

const SetPasswordLoaderShow = (val) => { return { type: userReducerConstant.SET_PASSWORD_LODER_SHOW, value: val }; };

const SetPasswordLoaderHide = (val) => { return { type: userReducerConstant.SET_PASSWORD_LODER_HIDE, value: val }; };

const UpdatePasswordSuccess = (val) => { return { type: userReducerConstant.UPDATE_PASSWORD_SUCCESS, value: val }; };

const UpdatePasswordFailure = (val) => { return { type: userReducerConstant.UPDATE_PASSWORD_FAILURE, value: val }; };

const ValidationMessage = (val) => { return { type: userReducerConstant.VALIDATION_MESSAGE, value: val }; };

const ResetTokenExpired = (val) => { return { type: userReducerConstant.RESET_TOKEN_EXPIRED, value: val }; };

export const UserSendEmail = (url, data) => {
   return (dispatch) => {
      dispatch(LoaderShow(true));
      return serviceCall
         .passwordChangePostCall(url, data)
         .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
               dispatch(UserSendLinkApiSuccess(true));
            }
            else if (isStatusCodeValid(result, statusCode.CODE_208)) {
               dispatch(showWarningSnackbar(displayText.PLEASE_TRY_AFTER_SOMETIMES));
            } else {
               dispatch(UserSendLinkApiFailure(false));
            }
            dispatch(LoaderHide(false));
         })
         .catch((e) => {
            dispatch(UserSendLinkApiFailure(false));
            dispatch(LoaderHide(false));
         });
   };
};

const LoaderShow = (val) => {
   return { type: userReducerConstant.LOADER_SHOW, value: val };
};

const LoaderHide = (val) => {
   return { type: userReducerConstant.LODER_HIDE, value: val };
};

const UserSendLinkApiSuccess = (val) => {
   return { type: userReducerConstant.USER_SENDLINK_SUCCESS, value: val };
};

const UserSendLinkApiFailure = (val) => {
   return { type: userReducerConstant.USER_SENDLINK_FAILURE, value: val };
};

function setPrefToSession(result, tableName, key) {
   let clientPrefFilter = _.filter(result.data, (pref) => {
      return pref.entityName === tableName;
   });
   let obj = {};
   if (clientPrefFilter.length > arrayConstants.nonEmptyArray)
      _.map(clientPrefFilter, (pref) => {
         obj[pref.entityProperty] = pref.entityPreference;
      });
   encryptData(obj, key);
}

export const SelectedClientLoaderShow = (val) => {
   return (dispatch) => {
      dispatch(SelectedClientLoader(val));
   };
};

const SelectedClientLoader = (val) => {
   return { type: userReducerConstant.CLIENT_SELECT_LOADER, value: val };
};

export const setLogoutLoader = (val) => {
   return { type: userReducerConstant.SET_LOGOUT_LOADER, value: val };
}

export const removeLogoutLoader = (val) => {
   return { type: userReducerConstant.REMOVE_LOGOUT_LOADER, value: val };
}

export const SetRefreshLoader = (val) => {
   return { type: userReducerConstant.SET_REFRESH_LOADER, value: val };
}

export const RemoveRefreshLoader = (val) => {
   return { type: userReducerConstant.REMOVE_REFRESH_LOADER, value: val }
}
