import React from 'react';
import { apiRouter, displayText, routerConstants } from './constant';

const MyProfile = React.lazy(() => import('./screens/myprofile'));
const ApplicationUser = React.lazy(() => import('./screens/applicationuser'));
const UserManagement = React.lazy(() => import('./screens/usermanagement'));
const Vendors = React.lazy(() => import('./screens/vendors'));
const ClientManagement = React.lazy(() => import('./screens/clientmanagement'));
const ClientProfile = React.lazy(() => import('./screens/clientprofile'));
const DataImport = React.lazy(() => import('./screens/dataimport'));
const OperationalAreaManagement = React.lazy(() => import('./screens/operationalarea'));
const RoleManagement = React.lazy(() => import('./screens/rolemanagement'));

const routes = [
  { path: apiRouter.MY_PROFILE, name: displayText.MY_PROFILE, component: MyProfile },
  { path: routerConstants.APPLICATION_ADMIN_URL, name: displayText.APPLICATION_ADMIN, component: ApplicationUser },
  { path: `${apiRouter.CLIENT_URL_ROLES}:${displayText.CLIENT_ID}${apiRouter.USER_MANAGEMENT_URL_FOR_ROLES}`, name: displayText.USER_MANAGEMENT, component: UserManagement },
  { path: `${apiRouter.CLIENT_URL_ROLES}:${displayText.CLIENT_ID}${apiRouter.OPERATIONAL_AREA_URL_FOR_ROLES}`, name: displayText.OPERATIONAL_AREA, component: OperationalAreaManagement },
  { path: routerConstants.VENDOR_MANAGEMENT_URL, name: apiRouter.VENDORS, component: Vendors },
  { path: routerConstants.CLIENT_MANAGEMENT_URL, name: displayText.CLIENT_MANAGEMENT, component: ClientManagement },
  { path: routerConstants.COMPANY_PROFILE_URL, name: displayText.COMPANY_PROFILE, component: ClientProfile },
  { path: `${apiRouter.CLIENT_URL_ROLES}:${displayText.CLIENT_ID}${routerConstants.ROLE_MANAGEMENT_URL}`, name: displayText.ROLE_MANAGEMENT, component: RoleManagement },
  { path: routerConstants.ROLE_MANAGEMENT_URL, name: displayText.ROLE_MANAGEMENT, component: RoleManagement },
  { path: apiRouter.DATA_IMPORT, name: displayText.DATAIMPORT, component: DataImport },
];

export default routes;