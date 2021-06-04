import { applicationUserManageReducerConstant } from '../../reducerConstant';

const initialState = {
  appUserDetails: null,
  isAppUserAdded: null,
  isAppUserEdited: null,
  isAppUserDeleted: null,
  isEmailExists: null,
  isAppUserLoaderactive: null,
  applicationuserloader: false,
  isUserInvite: false
};

const applicationUserManageReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case applicationUserManageReducerConstant.FETCH_APP_USERS:
      return {
        ...state,
        appUserDetails: action.value.data,
        applicationuserloader: false
      };
    case applicationUserManageReducerConstant.APP_USER_LOADER:
      return {
        ...state,
        applicationuserloader: true,
      };
    case applicationUserManageReducerConstant.APP_USER_CREATE_LOADER:
      return {
        ...state,
        isAppUserLoaderactive: action.value,
      };
    case applicationUserManageReducerConstant.IS_APP_USER_SUCCESS:
      return {
        ...state,
        isAppUserAdded: true,
        isAppUserEdited: null,
        isAppUserDeleted: null,
      };
    case applicationUserManageReducerConstant.APP_USER_ADD_CLEAR:
      return {
        ...state,
        isAppUserAdded: null,
      };
    case applicationUserManageReducerConstant.IS_APP_USER_EDIT_SUCCESS:
      return {
        ...state,
        isAppUserEdited: true,
        isAppUserAdded: null,
        isAppUserDeleted: null,
      };
    case applicationUserManageReducerConstant.APP_USER_EDIT_CLEAR:
      return {
        ...state,
        isAppUserEdited: null,
      };
    case applicationUserManageReducerConstant.IS_APP_USER_DELETE_SUCCESS:
      return {
        ...state,
        isAppUserDeleted: true,
      };
    case applicationUserManageReducerConstant.APP_USER_DELETE_CLEAR:
      return {
        ...state,
        isAppUserDeleted: null,
      };
    case applicationUserManageReducerConstant.ISCHECK_EMAIL_EXISTS:
      return {
        ...state,
        isEmailExists: true,
      };
    case applicationUserManageReducerConstant.ISCHECK_EMAIL_NOT_EXISTS:
      return {
        ...state,
        isEmailExists: false,
      };
    case applicationUserManageReducerConstant.APP_USER_LOADER_SHOW:
      return {
        ...state,
        isAppUserLoaderactive: true,
      };
    case applicationUserManageReducerConstant.APP_USER_LODER_HIDE:
      return {
        ...state,
        isAppUserLoaderactive: false,
      };
    case applicationUserManageReducerConstant.PROVERSION_TO_CLIENT:
      return {
        ...state,
        isProvisionedToClient: true,
        isAppUserLoaderactive: false,
      };
    case applicationUserManageReducerConstant.INVITE_APPLICATION_USER:
      return {
        ...state,
        isUserInvite: action.value,
      };
    default:
      return state;
  }
};

export default applicationUserManageReducer;
