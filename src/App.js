/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
   HashRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import { apiRouter, routerConstants, sessionStorageKey, stringManipulationCheck } from './constant';
import SuccessSnackbar from './components/shared/snackBar';
import './scss/style.scss';
import Loading from './loading';
import { decryptData, isCookieValid } from './components/shared/helper'
const Layout = React.lazy(() => import('./components/containers/Layout'));
const Login = React.lazy(() => import('./screens/login'));
const SetPassword = React.lazy(() => import('./screens/setpassword'));
const ForgotPassword = React.lazy(() => import('./screens/forgotpassword'));
const SuccessUpdatePassword = React.lazy(() => import('./successscreens/passwordupdate'));
const SuccessMailSend = React.lazy(() => import('./successscreens/sendlink'));

function App() {
   const PrivateRoute = ({ component: HomeComponent, ...rest }) => (
      <Route
         {...rest}
         render={(props) => (
            (JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)) && isCookieValid())
               ? <Layout {...props} /> : <Redirect to={apiRouter.LOGIN} />
         )}
      />
   );

   return (
      <HashRouter>
         <React.Suspense fallback={<Loading />}>
            <Switch>
               <Route
                  exact
                  path={apiRouter.LOGIN}
                  name={routerConstants.LOGIN}
                  render={(props) => <Login {...props} />}
               />
               <Route
                  exact
                  path={routerConstants.FORGOT_PASSWORD_URL}
                  name={routerConstants.FORGOT_PASSWORD}
                  render={(props) => <ForgotPassword {...props} />}
               />
               <Route
                  exact
                  path={routerConstants.SET_PASSWORD_URL}
                  name={routerConstants.SET_PASSWORD}
                  render={(props) => <SetPassword {...props} />}
               />
               <Route
                  exact
                  path={routerConstants.SUCCESS_UPDATE_URL}
                  name={routerConstants.SUCCESS_UPDATE}
                  render={(props) => <SuccessUpdatePassword {...props} />}
               />
               <Route
                  exact
                  path={routerConstants.SUCCESS_MAIL_SEND_URL}
                  name={routerConstants.SUCCESS_MAIL_SEND}
                  render={(props) => <SuccessMailSend {...props} />}
               />
               <PrivateRoute
                  exact={false}
                  path={stringManipulationCheck.DIVISION_OPERATOR}
                  name={routerConstants.MY_PROFILE_URL}
                  render={(props) => <Layout {...props} />}
               />
            </Switch>
            <SuccessSnackbar />
         </React.Suspense>
      </HashRouter>
   );
}

export default App;
