import { snackBarReducerConstant } from '../reducerConstant';
import { displayText } from '../../constant';

export const showSuccessSnackbar = (message = displayText.SUCCESS) => {
  return (dispatch) => {
    dispatch({ type: snackBarReducerConstant.SNACKBAR_SUCCESS, message });
  };
};

export const showFailureSnackbar = (message) => {
  return (dispatch) => {
    dispatch({ type: snackBarReducerConstant.SNACKBAR_FAILURE, message });
  };
};

export const showWarningSnackbar = (message) => {
  return (dispatch) => {
    dispatch({ type: snackBarReducerConstant.SNACKBAR_WARNING, message });
  };
};

export const clearSnackbar = () => {
  return (dispatch) => {
    dispatch({ type: snackBarReducerConstant.SNACKBAR_CLEAR });
  };
};
