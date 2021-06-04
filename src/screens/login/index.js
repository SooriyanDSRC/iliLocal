import React, { useState, useEffect } from "react";
import {
   Button, CircularProgress, Link, Grid, Container, FormControl, IconButton, OutlinedInput,
   InputLabel, InputAdornment
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import _ from "lodash";
import * as actionCreator from "../../store/action/userAction";
import ILILogo from "../../assets/images/ILI_Logo.png";
import { errorMessage, apiRouter, regularExpression, displayText, stringManipulationCheck, sessionStorageKey } from "../../constant";
import { arrayConstants } from "../../arrayconstants";
import { modalStylingAttributes } from '../../modalconstants';
import { decryptData, isCookieValid, removeCookie } from "../../components/shared/helper";


const useStyles = makeStyles((theme) => ({
   mainDiv: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
   },
   loginForm: {
      maxWidth: "95%",
      width: "450px",
      textAlign: "center"
   },
   form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      borderRadius: 12,
      padding: "10%",
      border: "3px solid #00648d",
      background: "#ffffff"
   },
   circularProgressSpace: {
      marginLeft: "10px"
   },
   textField: {
      width: "100%",
      marginTop: "20px"
   },
   white: { color: "#ffffff" },
   submit: {
      margin: theme.spacing(3, 0, 2),
      background: "#00648d",
      borderRadius: 12,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff",
      }
   },
   forgotLink: {
      color: "#00648d",
      textTransform: "none"
   },
   errStyle: {
      color: "red",
      marginTop: "1rem"
   }
}));

export default function Login() {
   const loading = useSelector((state) => state.user.isLoading);
   const userDetails = useSelector((state) => state.user.userDetails);
   const errMsg = useSelector((state) => state.user.errMsg);
   const { isLoggingOut } = useSelector((state) => state.userManage);
   const classes = useStyles();
   const dispatch = useDispatch();
   const history = useHistory();
   const [emailId, setEmailId] = useState(stringManipulationCheck.EMPTY_STRING);
   const [password, setPassword] = useState(stringManipulationCheck.EMPTY_STRING);
   const [showPassword, setShowPassword] = useState(false);
   const [loginInputEmailError, setLoginEmailInputError] = useState(false);
   const [loginInputPasswordError, setLoginPasswordInputError] = useState(false);
   const [loginErrorMessage, setLoginErrorMessage] = useState(stringManipulationCheck.EMPTY_STRING);

   function handleLoginUser() {
      if (loading) {
         return;
      }
      if (emailId.length > arrayConstants.nonEmptyArray && password.length > arrayConstants.nonEmptyArray) {
         const result = regularExpression.EMAIL.test(
            String(emailId).toLowerCase()
         );
         if (!result) {
            setLoginErrorMessage(errorMessage.PLEASE_ENTER_CORRECT_MAIL_FORMAT);
            setLoginEmailInputError(true);
         } else {
            const url = `${apiRouter.USERS}/${apiRouter.AUTHENICATE}`;
            const data = {
               email: emailId,
               password,
            };
            removeCookie();
            dispatch(actionCreator.UserLogin(url, data));
         }
      } else if (emailId.length === arrayConstants.nonEmptyArray && password.length > arrayConstants.nonEmptyArray) {
         setLoginErrorMessage(errorMessage.PLEASE_ENTER_EMAIL);
         setLoginEmailInputError(true);
      } else if (emailId.length > arrayConstants.nonEmptyArray && password.length === arrayConstants.nonEmptyArray) {
         const result = regularExpression.EMAIL.test(
            String(emailId).toLowerCase()
         );
         if (!result) {
            setLoginErrorMessage(errorMessage.PLEASE_ENTER_CORRECT_MAIL_FORMAT);
            setLoginEmailInputError(true);
         } else {
            setLoginErrorMessage(errorMessage.PLEASE_ENTER_PASSWORD);
            setLoginPasswordInputError(true);
         }
      } else if (emailId.length === arrayConstants.nonEmptyArray && password.length === arrayConstants.nonEmptyArray) {
         setLoginErrorMessage(errorMessage.PLEASE_ENTER_MAIL_ID_AND_PASSWORD);
         setLoginEmailInputError(true);
         setLoginPasswordInputError(true);
      }
   }

   useEffect(() => {
      if (isLoggingOut) {
         window.location.reload();
      }
   }, [isLoggingOut])

   const handleInputChange = (type, e) => {
      setLoginEmailInputError(false);
      setLoginPasswordInputError(false);
      if (_.isEqual(type, displayText.NAME)) {
         setEmailId(e.target.value);
      } else {
         setPassword(e.target.value);
      }
   };

   const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
   };

   useEffect(() => {
      let UserDetail = JSON.parse(decryptData(sessionStorageKey.USER_DETAILS));
      if (!_.isNull(UserDetail) && isCookieValid()) {
         //isNotempty check would come
         const url = `${apiRouter.FEATURES}`;
         dispatch(actionCreator.GetUserFeatures(url));
         history.push(apiRouter.MY_PROFILE);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [userDetails]);

   useEffect(() => {
      return () => {
         setLoginErrorMessage(stringManipulationCheck.EMPTY_STRING);
         dispatch(actionCreator.setErrMsg(stringManipulationCheck.EMPTY_STRING));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <div className="c-app c-default-layout flex-row align-items-center background-white">
         <Container>
            <div className={classes.mainDiv}>
               <div className={classes.loginForm}>
                  <form className={classes.form} noValidate>
                     <img src={ILILogo} alt="ILI_logo" className="w-85" />
                     <FormControl className={classes.textField} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-email">
                           {displayText.EMAIL}
                        </InputLabel>
                        <OutlinedInput
                           id="outlined-adornment-email"
                           type={displayText.TEXT}
                           error={loginInputEmailError}
                           value={emailId}
                           onChange={(e) => handleInputChange(displayText.NAME, e)}
                           startAdornment={
                              <InputAdornment position="start">
                                 <IconButton aria-label={displayText.USER_NAME_ICON} edge="start">
                                    <MailOutlineIcon />
                                 </IconButton>
                              </InputAdornment>
                           }
                           labelWidth={displayText.EMAIL_FIELD_DEFAULT_WIDTH} />
                     </FormControl>
                     <FormControl className={classes.textField} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">
                           {displayText.PASSWORD}
                        </InputLabel>
                        <OutlinedInput
                           id="outlined-adornment-password"
                           error={loginInputPasswordError}
                           type={showPassword ? displayText.TEXT : displayText.PASSWORD.toLowerCase()}
                           value={password}
                           onChange={(e) => handleInputChange(displayText.PASSWORD.toLowerCase(), e)}
                           onKeyPress={(event) => {
                              if (event.key === displayText.ENTER) {
                                 handleLoginUser();
                              }
                           }}
                           startAdornment={
                              <InputAdornment position="start">
                                 <IconButton
                                    aria-label={displayText.TOGGLE_PASSWORD_VISIBILITY}
                                    onClick={handleClickShowPassword}
                                    edge="start"
                                 >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                 </IconButton>
                              </InputAdornment>
                           }
                           labelWidth={displayText.PASSWORD_FIELD_WIDTH} />
                     </FormControl>
                     {loginInputPasswordError || loginInputEmailError ? (
                        <div className={classes.errStyle}>{loginErrorMessage}</div>
                     ) : (
                           <div className={classes.errStyle}>{errMsg}</div>
                        )}
                     <Button
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                        onClick={handleLoginUser}>
                        {loading ? <CircularProgress size={Number(modalStylingAttributes.circularProgressSize)} color="inherit" /> : stringManipulationCheck.EMPTY_STRING}{stringManipulationCheck.SINGLE_SPACE_STRING}
                        <span className={classes.circularProgressSpace}>{displayText.LOGIN}</span>
                     </Button>
                     <Grid item xs>
                        <Link
                           href="#/forgot-password"
                           variant="body2"
                           className={classes.forgotLink}>
                           {displayText.FORGOT_PASSWORD_LINK_TEXT}
                        </Link>
                     </Grid>
                  </form>
               </div>
            </div>
         </Container>
      </div >
   );
}
