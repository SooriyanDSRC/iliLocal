import { userReducerConstant } from '../../reducerConstant';
import { applicationUserManageReducerConstant } from '../../reducerConstant';
import { userManageReducerConstant } from '../../reducerConstant';
import { sessionStorageKey, stringManipulationCheck } from '../../../constant';
import { decryptData } from '../../../components/shared/helper';

const initialState = {
   userDetails: JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)) ?? null,
   isLoading: false,
   errMsg: stringManipulationCheck.EMPTY_STRING,
   isLoaderactive: null,
   isPasswordUpdated: null,
   isSetPasswordLoaderactive: null,
   myProfile: null,
   isMyProfileUpdate: null,
   currentClientName: null,
   currentClientID: null,
   currentClientToken: null,
   userFeatures: null,
   featuresLoader: false,
   isSendEmail: null,
   myProfileLoader: false,
   isSelectedClientLoader: false,
   validationMessage: stringManipulationCheck.EMPTY_STRING,
   isLogoutLoading: null,
   isResetTokenExpired: false,
   isRefreshCallTriggered: false
};

const userReducer = (state = initialState, action = {}) => {
   switch (action.type) {
      case userReducerConstant.LOGIN_USER:
         return {
            ...state,
            isLoading: false,
            isPasswordUpdated: null,
            errMsg: stringManipulationCheck.EMPTY_STRING,
            userDetails: action.value.data,
         };
      case userReducerConstant.SET_PASSWORD_LODER_SHOW:
         return {
            ...state,
            isSetPasswordLoaderactive: true,
         };
      case userReducerConstant.SET_FEATURES_LOADER:
         return {
            ...state,
            featuresLoader: action.value
         }
      case userReducerConstant.FETCH_USER_MENU:
         return {
            ...state,
            userFeatures: action.value.data,
            featuresLoader: false
         };
      case userReducerConstant.CLEAR_FORGET_PASSWORD:
         return {
            ...state,
            isSendEmail: null,
            isLoaderactive: null,
         };
      case userReducerConstant.USER_CLIENT_INFO:
         return {
            ...state,
            currentClientName: action.value.clientName,
            currentClientID: action.value.clientsGuid,
            currentClientToken: action.value.authToken

         };
      case userReducerConstant.CLIENT_SELECT_LOADER:
         return {
            ...state,
            isSelectedClientLoader: action.value,
         };
      case userReducerConstant.SET_UPDATE_MY_PROFILE:
         return {
            ...state,
            isMyProfileUpdate: action.value,
         };
      case userReducerConstant.MY_PROFILE_LOADER:
         return {
            ...state,
            myProfileLoader: true,
         };
      case userReducerConstant.FETCH_MY_PROFILE:
         let userDetails = state.userDetails;
         userDetails.userName = action.value.data.userName;
         return {
            ...state,
            myProfile: action.value.data,
            myProfileLoader: false,
            userDetails: userDetails
         };
      case userReducerConstant.SET_PASSWORD_LODER_HIDE:
         return {
            ...state,
            isSetPasswordLoaderactive: false,
         };
      case userReducerConstant.UPDATE_PASSWORD_SUCCESS:
         return {
            ...state,
            isPasswordUpdated: true,
         };
      case userReducerConstant.UPDATE_PASSWORD_FAILURE:
         return {
            ...state,
            isPasswordUpdated: false,
         };
      case userReducerConstant.TOGGLE_LOADER:
         return {
            ...state,
            isLoading: action.value,
         };
      case userReducerConstant.SET_ERR_MSG:
         return {
            ...state,
            isLoading: false,
            errMsg: action.value,
         };
      case userReducerConstant.LOADER_SHOW:
         return {
            ...state,
            isLoaderactive: true,
         };
      case userReducerConstant.LODER_HIDE:
         return {
            ...state,
            isLoaderactive: false,
         };
      case userReducerConstant.USER_SENDLINK_SUCCESS:
         return {
            ...state,
            isSendEmail: true,
         };
      case userReducerConstant.USER_SENDLINK_FAILURE:
         return {
            ...state,
            isSendEmail: false,
         };
      case userReducerConstant.UPDATE_USERNAME:
         return {
            ...state,
            userDetails: action.value
         }
      case applicationUserManageReducerConstant.UPDATE_MY_ACCOUNT_USERNAME:
         let userUpdatedDetails = state.userDetails;
         userUpdatedDetails.userName = action.value;
         return {
            ...state,
            userDetails: userUpdatedDetails
         };
      case userManageReducerConstant.UPDATE_USER_MANAGEMENT_USERNAME:
         let userUpdatedDetail = state.userDetails;
         userUpdatedDetail.userName = action.value;
         return {
            ...state,
            userDetails: userUpdatedDetail
         };
      case userReducerConstant.VALIDATION_MESSAGE:
         return {
            ...state,
            validationMessage: action.value
         };
      case userReducerConstant.RESET_TOKEN_EXPIRED:
         return {
            ...state,
            isResetTokenExpired: action.value
         }
      case userReducerConstant.SET_LOGOUT_LOADER:
         return {
            ...state,
            isLogoutLoading: true
         }
      case userReducerConstant.REMOVE_LOGOUT_LOADER:
         return {
            ...state,
            isLogoutLoading: false
         }
      case userReducerConstant.SET_REFRESH_LOADER:
         return {
            ...state,
            isRefreshCallTriggered: true
         }
      case userReducerConstant.REMOVE_REFRESH_LOADER:
         return {
            ...state,
            isRefreshCallTriggered: false
         }
      default:
         return state;
   }
};

export default userReducer;
