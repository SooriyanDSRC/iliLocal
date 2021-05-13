import serviceCall from '../serviceCall';
import { operationalAreaReducerConstant } from '../reducerConstant';
import { statusCode, displayText } from '../../constant';
import { showSuccessSnackbar, showFailureSnackbar } from './snackbarAction';
import { isStatusCodeValid } from '../../components/shared/helper';

export const GetOperationalArea = (url) => {
    return (dispatch) => {
        dispatch(StartLoader(true));
        return serviceCall
            .getAllData(url)
            .then((result) => {
                if (result && result.data) {
                    dispatch(FetchOperationalArea(result));
                } else {
                    dispatch(showFailureSnackbar(result));
                    dispatch(StartLoader(false));
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };
};

export const GetOperationalAreaReload = () => {
    return (dispatch) => {
        dispatch(FetchOperationalAreaReload(null));
    };
};

const FetchOperationalArea = (val) => {
    return { type: operationalAreaReducerConstant.FETCH_OPERATIONAL_AREA, value: val };
};

const FetchOperationalAreaReload = (val) => {
    return { type: operationalAreaReducerConstant.FETCH_OPERATIONAL_AREA_RELOAD, value: val };
};

export const SaveOperationalArea = (url, data) => {
    return (dispatch) => {
        dispatch(AddOperationaArea(null));
        return serviceCall
            .postData(url, data)
            .then((result) => {
                if (isStatusCodeValid(result, statusCode.CODE_201)) {
                    dispatch(showSuccessSnackbar(displayText.SUCCESS));
                    dispatch(AddOperationalAreaSuccess(true));
                } else {
                    dispatch(showFailureSnackbar(result));
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };
};

const AddOperationaArea = (val) => {
    return { type: operationalAreaReducerConstant.ADD_OPERATIONALAREA_CLEAR, value: val };
};

const AddOperationalAreaSuccess = (val) => {
    return { type: operationalAreaReducerConstant.ADD_OPERATIONALAREA_SUCCESS, value: val };
};

export const DialogAction = (val) => {
    return (dispatch) => {
        dispatch(Action(val));
    };
};

const Action = (val) => {
    return { type: operationalAreaReducerConstant.ACTION, value: val };
};

export const UpdateOperationalArea = (url, data) => {
    return (dispatch) => {
        return serviceCall
            .editData(url, data)
            .then((result) => {
                if (isStatusCodeValid(result, statusCode.CODE_200)) {
                    dispatch(showSuccessSnackbar(displayText.SUCCESS));
                    dispatch(EditOperationalAreaSuccess(true));
                } else {
                    dispatch(showFailureSnackbar(result));
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };
};

const EditOperationalAreaSuccess = (val) => {
    return { type: operationalAreaReducerConstant.EDIT_OPERATIONALAREA_SUCCESS, value: val };
};

export const DeleteOperationalArea = (url, data) => {
    return (dispatch) => {
        return serviceCall
            .deleteCall(url, data)
            .then((result) => {
                if (isStatusCodeValid(result, statusCode.CODE_200)) {
                    dispatch(showSuccessSnackbar(displayText.SUCCESS));
                    dispatch(DeleteOperationalAreaSuccess(true));
                } else {
                    dispatch(showFailureSnackbar(result));
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };
};

const DeleteOperationalAreaSuccess = (val) => {
    return { type: operationalAreaReducerConstant.DELETE_OPERATIONALAREA_SUCCESS, value: val };
};

const StartLoader = (val) => {
    return { type: operationalAreaReducerConstant.OPSAREA_LOADER, value: val };
};