import serviceCall from "../serviceCall";
import { showSuccessSnackbar, showFailureSnackbar } from "./snackbarAction";
import { roleManageReducerConstant } from "../reducerConstant";
import { statusCode, displayText } from "../../constant";
import { isEmptyNullUndefined, isStatusCodeValid } from '../../components/shared/helper';

export const FetchRole = (url) => {
  return (dispatch) => {
    dispatch(roleLoader(true));
    return serviceCall
      .getAllData(url)
      .then((result) => {
        if (isStatusCodeValid(result, statusCode.CODE_200)) {
          dispatch(FetchRoleSuccess(result));
          dispatch(roleLoader(false));
        } else {
          dispatch(showFailureSnackbar(result));
          dispatch(roleLoader(false));
        }
      })
      .catch((e) => {
        dispatch(roleLoader(false));
        console.log(e);
      });
  };
};

export const FetchFeatures = (url) => {
  return (dispatch) => {
    dispatch(roleLoader(true));
    return serviceCall
      .getAllData(url)
      .then((result) => {
        if (isStatusCodeValid(result, statusCode.CODE_200)) {
          dispatch(FetchMenuSuccess(result));
          dispatch(roleLoader(false));
        } else {
          dispatch(showFailureSnackbar(result));
          dispatch(roleLoader(false));
        }
      })
      .catch((e) => {
        dispatch(roleLoader(false));
        console.log(e);
      });
  };
};

export const AddRole = (url, data) => {
  return (dispatch) => {
    dispatch(AddRoleClear(null));
    return serviceCall
      .postData(url, data)
      .then((result) => {
        if (isStatusCodeValid(result, statusCode.CODE_200)) {
          dispatch(showSuccessSnackbar(displayText.SUCCESS));
          dispatch(AddRoleSuccess(true));
          dispatch(reloadRole());
        } else {
          dispatch(showFailureSnackbar(result));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
};

export const FetchRoleById = (url) => {
  return (dispatch) => {
    return serviceCall
      .getAllData(url)
      .then((result) => {
        if (isStatusCodeValid(result, statusCode.CODE_200)) {
          dispatch(FetchRoleByIdSuccess(result));
        } else {
          dispatch(showFailureSnackbar(result));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
};

export const EditRole = (url, data) => {
  return (dispatch) => {
    dispatch(EditRoleClear(null));
    return serviceCall.postData(url, data).then((result) => {
      if (isStatusCodeValid(result, statusCode.CODE_200)) {
        dispatch(showSuccessSnackbar(displayText.SUCCESS));
        dispatch(EditRoleSuccess(true));
      } else {
        dispatch(showFailureSnackbar(result));
      }
    });
  };
};

export const DeleteRole = (url, data) => {
  return (dispatch) => {
    dispatch(DeleteRoleClear(null));
    return serviceCall.deleteCall(url, data).then((result) => {
      if (isStatusCodeValid(result, statusCode.CODE_200)) {
        dispatch(showSuccessSnackbar(displayText.SUCCESS));
        dispatch(DeleteRoleSuccess(true));
      } else {
        dispatch(showFailureSnackbar(result));
      }
    });
  };
};

export const DispatchRole = (result) => {
  return (dispatch) => {
    dispatch(EditRoleClear(null));
    if (isEmptyNullUndefined(result) && result !== displayText.DEFAULT_PARENTID) {
      dispatch(showSuccessSnackbar(displayText.SUCCESS));
      dispatch(EditRoleSuccess(true));
    } else {
      dispatch(showFailureSnackbar(result));
    }
  };
};

const FetchRoleSuccess = (val) => {
  return { type: roleManageReducerConstant.FETCH_ROLES, value: val };
};

const FetchMenuSuccess = (val) => {
  return { type: roleManageReducerConstant.FETCH_MENU, value: val };
};

const AddRoleSuccess = (val) => {
  return { type: roleManageReducerConstant.IS_ROLE_SUCCESS, value: val };
};

const EditRoleSuccess = (val) => {
  return {
    type: roleManageReducerConstant.IS_ROLE_EDIT_SUCCESS,
    value: val,
  };
};

const AddRoleClear = (val) => {
  return { type: roleManageReducerConstant.ROLE_ADD_CLEAR, value: val };
};

const EditRoleClear = (val) => {
  return { type: roleManageReducerConstant.ROLE_EDIT_CLEAR, value: val };
};

const DeleteRoleClear = (val) => {
  return { type: roleManageReducerConstant.ROLE_DELETE_CLEAR, value: val };
};

const DeleteRoleSuccess = (val) => {
  return {
    type: roleManageReducerConstant.IS_ROLE_DELETE_SUCCESS,
    value: val,
  };
};

const reloadRole = () => {
  return {
    type: roleManageReducerConstant.RELOAD_ROLE,
    value: true,
  };
};

const roleLoader = (val) => {
  return {
    type: roleManageReducerConstant.ROLES_LOADER,
    value: val,
  };
};

const FetchRoleByIdSuccess = (val) => {
  return {
    type: roleManageReducerConstant.FETCH_ROLE_BY_ID,
    value: val.data,
  };
};
