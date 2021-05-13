import { snackBarReducerConstant, snackBarReducerConstantSeverity } from '../../reducerConstant';
import { stringManipulationCheck } from '../../../constant';

const snackbarReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case snackBarReducerConstant.SNACKBAR_SUCCESS:
      return {
        ...state,
        snackbarOpen: true,
        successSnackbarMessage: action.message,
        severity: snackBarReducerConstantSeverity.SUCCESS,
      };
    case snackBarReducerConstant.SNACKBAR_FAILURE:
      return {
        ...state,
        snackbarOpen: true,
        failureSnackbarMessage: action.message,
        severity: snackBarReducerConstantSeverity.ERROR,
      };
    case snackBarReducerConstant.SNACKBAR_WARNING:
      return {
        ...state,
        snackbarOpen: true,
        failureSnackbarMessage: action.message,
        severity: snackBarReducerConstantSeverity.WARNING,
      };
    case snackBarReducerConstant.SNACKBAR_CLEAR:
      return {
        ...state,
        snackbarOpen: false,
        errorSnackbarOpen: false,
        successSnackbarMessage: stringManipulationCheck.EMPTY_STRING,
        failureSnackbarMessage: stringManipulationCheck.EMPTY_STRING,
        infoSnackbarOpen: false,
      };
    default:
      return state;
  }
};

export default snackbarReducer;
