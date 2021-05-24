import React, { useEffect } from 'react';
import { Content, Sidebar, Footer, Header } from './index';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { statusCode, apiRouter, sessionStorageKey, stringManipulationCheck, tokenValidity } from '../../constant';
import * as actionCreator from "../../store/action/userAction";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmptyNullUndefined, isNotNull,decryptData, isNullorUndefined, isCookieValid } from '../shared/helper';
import { arrayConstants } from '../../arrayconstants';

export default function Layout() {
   const history = useHistory();
   const dispatch = useDispatch();
   const { isRefreshCallTriggered } = useSelector((state) => state.user);

   useEffect(() => {
      startRefreshTokenTimer();
      setInterval(() => checkUserLoggedIn(), tokenValidity.checkUserDetailsInterval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isRefreshCallTriggered]);

   const startRefreshTokenTimer = () => {
      if (isNotEmptyNullUndefined(document.cookie)) {
         let token = document.cookie.split(stringManipulationCheck.ASSIGNTO_OPERATOR);
         const jwtToken = JSON.parse(atob(token[arrayConstants.tokenData].split(stringManipulationCheck.DOT_OPERATOR)[arrayConstants.tokenData]));
         const expires = new Date(jwtToken.exp * tokenValidity.convertToMilliSeconds);
         let timeout = expires - Date.now() - tokenValidity.oneMinuteInMilliSeconds;
         setInterval(() => triggerRefreshToken(), timeout);
      }
   }

   const checkUserLoggedIn = () => {
      if (isNullorUndefined(JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)))) {
         sessionStorage.clear();
         localStorage.clear();
         window.location.reload();
         history.push(apiRouter.LOGIN);
      }
   }

   const triggerRefreshToken = () => {
      if (isCookieValid() && !isRefreshCallTriggered) {
         const url = `${apiRouter.USERS}/${apiRouter.REFRESH_TOKEN}`;
         dispatch(actionCreator.GetRefreshToken(url));
      }
   }

   axios.interceptors.response.use(function (response) {
      return response;
   }, function (error) {
      if (statusCode.CODE_401 === error.response.status) {
         sessionStorage.clear();
         localStorage.clear();
         window.location.reload();
         history.push(apiRouter.LOGIN);
         return;
      }
      Promise.reject(error);
   });

   return (
      history.location.pathname !== apiRouter.LOGIN && (
         <div className='c-app c-default-layout'>
            <Sidebar />
            <div className='c-wrapper'>
               <Header />
               <div className='c-body'>
                  <Content />
               </div>
               <Footer />
            </div>
         </div>
      )
   );
}
