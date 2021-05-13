import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { Link, Grid, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LoadingOverlay from "react-loading-overlay";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../store/action/userAction";
import IconButton from "@material-ui/core/IconButton";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import { useHistory } from "react-router-dom";
import { errorMessage, apiRouter, regularExpression, displayText, stringManipulationCheck, routerConstants } from "../../constant";
import ILILogo from "../../assets/images/ILI_Logo.png";
import _ from "lodash";
import { isEmpty, removeCookie } from "../../components/shared/helper";

const useStyles = makeStyles((theme) => ({
   root: {
      background: "#ffffff",
      position: "fixed",
      height: "100%",
      width: "100%"
   },
   mainDiv: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "0"
   },
   loaderStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      marginLeft: "auto",
      marginRight: "auto"
   },
   forgotPasswordTextField: {
      marginTop: "30px",
      width: "100%"
   },
   errStyle: {
      color: "red",
      marginTop: "1rem"
   },
   forgotPasswordForm: {
      maxWidth: "95%",
      width: "450px",
      textAlign: "center"
   },

   formDiv: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      borderRadius: 12,
      padding: "10%",
      border: "3px solid #036290",
      background: "#ffffff"
   },

   forgotPasswordSubmit: {
      color: "#ffffff",
      margin: theme.spacing(3, 0, 2),
      background: "#036290",
      borderRadius: 12,
      textTransform: "none",
      "&:hover": {
         background: "#036290",
         color: "#ffffff"
      }
   }
}));

export default function ForgotPassword() {
   const dispatch = useDispatch();
   let { isLoaderactive, isSendEmail } = useSelector((state) => state.user);
   const classes = useStyles();
   const history = useHistory();
   const [email, setEmail] = useState(stringManipulationCheck.EMPTY_STRING);
   const [emailInputError, setEmailInputError] = useState(false);
   const [emailErrorMessage, setEmailErrorMessage] = useState(stringManipulationCheck.EMPTY_STRING);
   const [showLoader, setShowLoader] = useState(false);

   const checkEmailValidation = async () => {
      if (isEmpty(email)) {
         setEmailErrorMessage(errorMessage.PLEASE_ENTER_MAIL_ID);
         setEmailInputError(true);
         return;
      }
      if (!regularExpression.EMAIL.test(String(email).toLowerCase())) {
         setEmailErrorMessage(errorMessage.PLEASE_ENTER_CORRECT_MAIL_FORMAT);
         setEmailInputError(true);
         return;
      }
   }

   const handleSendEmail = async () => {
      let result = regularExpression.EMAIL.test(String(email).toLowerCase());
      removeCookie();
      setEmailErrorMessage(stringManipulationCheck.EMPTY_STRING);
      setEmailInputError(false);
      if (isEmpty(email)) {
         setEmailErrorMessage(errorMessage.PLEASE_ENTER_MAIL_ID);
         setEmailInputError(true);
         return;
      }
      if (!result) {
         setEmailErrorMessage(errorMessage.PLEASE_ENTER_CORRECT_MAIL_FORMAT);
         setEmailInputError(true);
         return;
      }
      let url = `${apiRouter.FORGOT_PASSWORD}/${apiRouter.SENDEMAIL}`;
      let userData = {
         email: email,
      };
      setShowLoader(true);
      dispatch(actionCreator.UserSendEmail(url, userData));
   };
   useEffect(() => {
      if (isLoaderactive && !_.isNull(isSendEmail)) {
         if (isSendEmail) {
            setShowLoader(isLoaderactive);
            history.push(routerConstants.SUCCESS_MAIL_SEND_URL);
         } else {
            setEmailErrorMessage(errorMessage.PLEASE_CONTACT_ADMIN);
            setEmailInputError(true);
            setShowLoader(false);
         }
      }
      else {
         setShowLoader(isLoaderactive);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isLoaderactive, isSendEmail]);

   useEffect(() => {
      return () => {
         dispatch(actionCreator.ClearForgotPassword());
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <LoadingOverlay active={showLoader} text={displayText.SENDING_MAIL}>
         <div className="c-app c-default-layout flex-row align-items-center background-white">
            <Container>
               <div className={classes.mainDiv}>
                  <div className={classes.forgotPasswordForm}>
                     <form className={classes.formDiv} noValidate>
                        <img src={ILILogo} alt={displayText.CENOZON_LOGO} className="w-85" />
                        <FormControl
                           className={classes.forgotPasswordTextField}
                           variant="outlined">
                           <InputLabel htmlFor="outlined-adornment-password">
                              {displayText.EMAIL}
                           </InputLabel>
                           <OutlinedInput
                              error={emailInputError}
                              id="outlined-adornment-password"
                              type="text"
                              value={email}
                              onBlur={checkEmailValidation}
                              onChange={(e) => { setEmail(e.target.value); }}
                              onKeyPress={(event) => {
                                 if (event.key === displayText.ENTER) { handleSendEmail(); }
                              }}
                              startAdornment={
                                 <InputAdornment position="start">
                                    <IconButton aria-label={displayText.USER_NAME_ICON} edge="start">
                                       <MailOutlineIcon />
                                    </IconButton>
                                 </InputAdornment>
                              }
                              labelWidth={displayText.EMAIL_FIELD_DEFAULT_WIDTH}
                           />
                        </FormControl>
                        {emailInputError ? (
                           <div className={classes.errStyle}>{emailErrorMessage}</div>
                        ) : (stringManipulationCheck.EMPTY_STRING)}
                        <Button
                           fullWidth
                           variant="contained"
                           className={classes.forgotPasswordSubmit}
                           onClick={handleSendEmail}
                        >
                           {displayText.SEND_LINK}
                        </Button>
                        <Grid item xs>
                           <Link
                              href={`#/login`}
                              variant="body2"
                              className={"back-to-login"}
                           >
                              {displayText.BACK_TO_LOGIN}
                           </Link>
                        </Grid>
                     </form>
                  </div>
               </div>
            </Container>
         </div>
      </LoadingOverlay>
   );
}