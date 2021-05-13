import { operationalAreaReducerConstant } from '../../reducerConstant';

const initialState = {
    operationalAreaDetails: null,
    opsAreaLoader: false,
    action: null,
    isOperationalAreaAdded: null,
    isOperationalAreaEdited: null,
    isOperationalAreaDeleted: null
};

const operationalAreaManageReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case operationalAreaReducerConstant.FETCH_OPERATIONAL_AREA:
            return {
                ...state,
                operationalAreaDetails: action.value.data,
                opsAreaLoader: false,
                isOperationalAreaAdded: null,
                isOperationalAreaEdited: null,
                isOperationalAreaDeleted: null
            };
        case operationalAreaReducerConstant.FETCH_OPERATIONAL_AREA_RELOAD:
            return {
                ...state,
                operationalAreaDetails: action.value,
            };
        case operationalAreaReducerConstant.OPSAREA_LOADER:
            return {
                ...state,
                opsAreaLoader: action.value,
            };
        case operationalAreaReducerConstant.ADD_OPERATIONALAREA_CLEAR:
            return {
                ...state,
                isOperationalAreaAdded: action.value,
            };
        case operationalAreaReducerConstant.ADD_OPERATIONALAREA_SUCCESS:
            return {
                ...state,
                isOperationalAreaAdded: action.value,
            };
        case operationalAreaReducerConstant.EDIT_OPERATIONALAREA_SUCCESS:
            return {
                ...state,
                isOperationalAreaEdited: action.value,
            };
        case operationalAreaReducerConstant.DELETE_OPERATIONALAREA_SUCCESS:
            return {
                ...state,
                isOperationalAreaDeleted: action.value,
            };
        case operationalAreaReducerConstant.ACTION:
            return {
                ...state,
                action: action.value,
            };
        default:
            return state;
    }
};

export default operationalAreaManageReducer;
