import { userManageReducerConstant } from '../../reducerConstant';

const initialState = {
    countryList: null,
    stateList: null,
    rolesList: null,
    userDetails: null,
    isUserAdded: null,
    isUserEdited: null,
    isUserDeleted: null,
    usertableLoader: null,
    isCurrentUser: null,
    isLoggingOut: false,
};

const userManageReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case userManageReducerConstant.FETCH_USER_DETALS:
            return {
                ...state,
                userDetails: action.value.data,
                usertableLoader: false,
            };
        case userManageReducerConstant.FETCH_COUNTRY_LIST:
            return {
                ...state,
                countryList: action.value.data,
            };
        case userManageReducerConstant.FETCH_STATE_LIST:
            return {
                ...state,
                stateList: action.value.data,
            };

        case userManageReducerConstant.USERTABLE_LOADER:
            return {
                ...state,
                usertableLoader: true,
            };
        case userManageReducerConstant.IS_USER_SUCCESS:
            return {
                ...state,
                isUserAdded: true,
                isCurrentUser: action.value.isCurrentUser
            };
        case userManageReducerConstant.USER_ADD_CLEAR:
            return {
                ...state,
                isUserAdded: null,
                isCurrentUser: null
            };

        case userManageReducerConstant.USER_EDIT_CLEAR:
            return {
                ...state,
                isUserEdited: null,
            };
        case userManageReducerConstant.IS_USER_EDIT_SUCCESS:
            return {
                ...state,
                isUserEdited: true,
            };
        case userManageReducerConstant.IS_USER_DELETE_SUCCESS:
            return {
                ...state,
                isUserDeleted: true,
            };
        case userManageReducerConstant.FETCH_ROLES_LIST:
            return {
                ...state,
                rolesList: action.value.data,
            };
        case userManageReducerConstant.USER_DELETE_CLEAR:
            return {
                ...state,
                isUserDeleted: null,
            };
        case userManageReducerConstant.IS_USER_LOGGING_OUT:
            return {
                ...state,
                isLoggingOut: action.value
            }
        default:
            return state;
    }
};

export default userManageReducer;
