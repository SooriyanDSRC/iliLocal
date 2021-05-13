import { roleManageReducerConstant } from "../../reducerConstant";
const initialState = {
  roleDetails: null,
  isRoleEdited: null,
  isRoleDeleted: null,
  isRoleAdded: null,
  featuresDetail: null,
  rolesLoader: false,
  reload: false,
  roleList: null,
  selectedRoleFeatures: null,
};

const roleManageReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case roleManageReducerConstant.FETCH_ROLES:
      return {
        ...state,
        roleDetails: action.value.data,
        isRoleDeleted: false,
        selectedRoleFeatures: null,
      };
    case roleManageReducerConstant.ROLES_LOADER:
      return {
        ...state,
        rolesLoader: action.value,
      };
    case roleManageReducerConstant.FETCH_MENU:
      return {
        ...state,
        featuresDetail: action.value.data,
        isRoleDeleted: false,
      };
    case roleManageReducerConstant.IS_ROLE_SUCCESS:
      return {
        ...state,
        isRoleAdded: true,
        reload: true,
        roleList: action.value.data,
      };
    case roleManageReducerConstant.ROLE_EDIT_CLEAR:
      return {
        ...state,
        isRoleEdited: null,
      };
    case roleManageReducerConstant.IS_ROLE_EDIT_SUCCESS:
      return {
        ...state,
        isRoleEdited: true,
      };
    case roleManageReducerConstant.IS_ROLE_DELETE_SUCCESS:
      return {
        ...state,
        isRoleDeleted: true,
      };
    case roleManageReducerConstant.ROLE_ADD_CLEAR:
      return {
        ...state,
        isRoleAdded: null,
      };
    case roleManageReducerConstant.ROLE_DELETE_CLEAR:
      return {
        ...state,
        isRoleDeleted: null,
      };
    case roleManageReducerConstant.RELOAD_ROLE:
      return {
        ...state,
        reload: action.value,
      };
    case roleManageReducerConstant.FETCH_ROLE_BY_ID:
      return {
        ...state,
        selectedRoleFeatures: action.value,
      };
    default:
      return state;
  }
};

export default roleManageReducer;
