import serviceCall from '../serviceCall';
import { userManageReducerConstant } from '../reducerConstant';
import { showSuccessSnackbar, showFailureSnackbar } from './snackbarAction';
import { statusCode, sessionStorageKey, displayText } from './../../constant';
import { encryptData, isStatusCodeValid } from '../../components/shared/helper';

export const FetchUserDetails = (url) => {
    return (dispatch) => {
        dispatch(StartLoader());
        return serviceCall
            .getAllData(url)
            .then((result) => {
                result && result.data
                    ? dispatch(UserDetailsSuccess(result))
                    : dispatch(showFailureSnackbar(result))
            })
            .catch((e) => {
                console.log(e);
            });
    };
};

const UserDetailsSuccess = (val) => {
    if (val?.data?.preferences)
        encryptData(val.data.preferences, sessionStorageKey.USER_PREF);
    return {
        type: userManageReducerConstant.FETCH_USER_DETALS,
        value: val,
    };
};

export const AddUser = (url, data, isCurrentUser = false) => {
    return (dispatch) => {
        dispatch(LoaderShow(true));
        dispatch(AddUserClear(null));
        return serviceCall
            .postData(url, data)
            .then((result) => {
                if (isStatusCodeValid(result, statusCode.CODE_201)) {
                    dispatch(showSuccessSnackbar(displayText.SUCCESS));
                    dispatch(AddUserSuccess(true, isCurrentUser));
                } else {
                    dispatch(showFailureSnackbar(result));
                }
                dispatch(LoaderHide(false));
            })
            .catch((e) => {
                dispatch(LoaderHide(false));
                console.log(e);
            });
    };
};

export const AddUserClear = (val) => {
    return { type: userManageReducerConstant.USER_ADD_CLEAR, value: val };
};

const LoaderShow = (val) => {
    return { type: userManageReducerConstant.LOADER_SHOW, value: val };
};

const LoaderHide = (val) => {
    return { type: userManageReducerConstant.LODER_HIDE, value: val };
};

const AddUserSuccess = (val, isCurrentUser) => {
    let obj = { val, isCurrentUser }
    return { type: userManageReducerConstant.IS_USER_SUCCESS, value: obj };
};

export const EditUser = (url, data, currentUser) => {
    return (dispatch) => {
        dispatch(EditUserClear(null));
        return serviceCall
            .editData(url, data)
            .then((result) => {
                if (isStatusCodeValid(result, statusCode.CODE_200)) {
                    currentUser && dispatch(updateUserName(data.userName));
                    dispatch(showSuccessSnackbar(displayText.SUCCESS));
                    dispatch(EditUserSuccess(true));
                } else {
                    dispatch(showFailureSnackbar(result));
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };
};

const EditUserSuccess = (val) => {
    return { type: userManageReducerConstant.IS_USER_EDIT_SUCCESS, value: val };
};

const EditUserClear = (val) => {
    return { type: userManageReducerConstant.USER_EDIT_CLEAR, value: val };
};

const updateUserName = (data) => {
    return {
        type: userManageReducerConstant.UPDATE_USER_MANAGEMENT_USERNAME,
        value: data
    }
}

export const DeleteUser = (url, data) => {
    return (dispatch) => {
        dispatch(DeleteUserClear(null));
        return serviceCall
            .deleteCall(url, data)
            .then((result) => {
                if (isStatusCodeValid(result, statusCode.CODE_200)) {
                    dispatch(showSuccessSnackbar(displayText.SUCCESS));
                    dispatch(DeleteUserSuccess(true));
                } else {
                    dispatch(showFailureSnackbar(result));
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };
};

const DeleteUserSuccess = (val) => {
    return { type: userManageReducerConstant.IS_USER_DELETE_SUCCESS, value: val };
};

const DeleteUserClear = (val) => {
    return { type: userManageReducerConstant.USER_DELETE_CLEAR, value: val };
};

export const FetchCountryList = (url) => (dispatch) => {
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

const CountryList = (val) => ({ type: userManageReducerConstant.FETCH_COUNTRY_LIST, value: val });

export const FetchStateList = (url) => (dispatch) => {
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

const StateList = (val) => ({ type: userManageReducerConstant.FETCH_STATE_LIST, value: val });

export const FetchRolesList = (url) => (dispatch) => {
    return serviceCall
        .getAllData(url)
        .then((result) => {
            if (isStatusCodeValid(result, statusCode.CODE_200)) {
                dispatch(RolesList(result));
            }
        })
        .catch((e) => {
            console.log(e);
        });
};

const StartLoader = () => {
    return { type: userManageReducerConstant.USERTABLE_LOADER };
};

const RolesList = (val) => ({ type: userManageReducerConstant.FETCH_ROLES_LIST, value: val });