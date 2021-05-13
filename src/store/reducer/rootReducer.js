// import clientReducer from './clientReducer';

import { combineReducers } from 'redux';
import vendorManageReducer from './vendorManageReducer';
import userReducer from './userReducer';
import userManageReducer from './userManageReducer';
import applicationUserManageReducer from './applicationUserManageReducer';
import snackbarReducer from './snackbarReducer';
import clientManageReducer from './clientManageReducer';
import roleManageReducer from './roleManageReducer';
import operationalAreaManageReducer from './operationalAreaReducer';
import dataImportManageReducer from './dataImportManageReducer';
import sideBarReducer from './sideBarReducer';

const rootReducer = combineReducers({
    vendorManage: vendorManageReducer,
    user: userReducer,
    userManage: userManageReducer,
    snackbar: snackbarReducer,
    clientManage: clientManageReducer,
    appUserManage: applicationUserManageReducer,
    roleManage: roleManageReducer,
    opsAreaManage: operationalAreaManageReducer,
    dataImportManage: dataImportManageReducer,
    sideBar: sideBarReducer
});

export default rootReducer;
