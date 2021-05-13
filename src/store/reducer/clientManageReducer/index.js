import { clientManageReducerConstant } from '../../reducerConstant';
const initialState = {
  clientDetails: null,
  isClientEdited: null,
  isClientDeleted: null,
  isClientAdded: null,
  loader: false,
  countryList: null,
  stateList: null,
  clientProfile: null,
};

const clientManageReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case clientManageReducerConstant.FETCH_CLIENTS:
      return {
        ...state,
        clientDetails: action.value.data,
        loader: false,
      };
    case clientManageReducerConstant.LOADER:
      return {
        ...state,
        loader: true,
      };
    case clientManageReducerConstant.FETCH_COUNTRY_LIST:
      return {
        ...state,
        countryList: action.value.data,
      };
    case clientManageReducerConstant.FETCH_STATE_LIST:
      return {
        ...state,
        stateList: action.value.data,
      };
    case clientManageReducerConstant.IS_CLIENT_SUCCESS:
      return {
        ...state,
        isClientAdded: true,
      };
    case clientManageReducerConstant.CLIENT_EDIT_CLEAR:
      return {
        ...state,
        isClientEdited: null,
      };
    case clientManageReducerConstant.IS_CLIENT_EDIT_SUCCESS:
      return {
        ...state,
        isClientEdited: true,
      };
    case clientManageReducerConstant.IS_CLIENT_DELETE_SUCCESS:
      return {
        ...state,
        isClientDeleted: true,
      };
    case clientManageReducerConstant.CLIENT_ADD_CLEAR:
      return {
        ...state,
        isClientAdded: null,
      };
    case clientManageReducerConstant.CLIENT_DELETE_CLEAR:
      return {
        ...state,
        isClientDeleted: null,
      };
    case clientManageReducerConstant.FETCH_CLIENT_BY_ID:
      return {
        ...state,
        clientProfile: action.value.data,
      };
    default:
      return state;
  }
};

export default clientManageReducer;