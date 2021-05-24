import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ILILogo from "../../assets/images/ILI_Logo.png";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { errorMessage, regularExpression, displayText, apiRouter, stringManipulationCheck, routerConstants } from "../../constant";
import { isEmpty, removeCookie, isUndefined } from '../../components/shared/helper';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import * as actionCreator from "../../store/action/userAction";
import { Grid, Typography, Dialog, DialogTitle, DialogActions, DialogContent } from "@material-ui/core";
import CommonStyles from '../../scss/commonStyles';
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
   errStyle: {
      color: "red",
      marginTop: "1rem"
   },
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
   warningStyle: {
      color: "red",
      marginTop: "1rem"
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

   textField: {
      width: "100%",
      marginTop: "20px"
   },
   setPasswordForm: {
      maxWidth: "95%",
      width: "450px",
      textAlign: "center"
   },
   submit: {
      margin: theme.spacing(3, 0, 2),
      background: "#00648d",
      borderRadius: 12,
      color: "#ffffff",
      border: "none",
      textTransform: "none",
      "&:hover": {
         background: "#036290",
         color: "#ffffff"
      }
   },
   widthContent: {
      width: "max-content",
      marginLeft: "auto",
      marginRight: "auto",
      fontSize: "13px",
      textAlign: "left"
   },
   lineSpacingWidth: {
      width: "150px"
   },
   lineSpacingWidthNumbers: {
      width: "100px",
   },
   buttonMarginLeft: {
      marginLeft: "85px !important"
   },
   resentButton: {
      margin: theme.spacing(3, 1, 2),
      background: "#00648d",
      borderRadius: 8,
      height: "40px",
      width: "auto !important",
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   }
}));

export default function SetPassword() {
   const history = useHistory();
   const classes = useStyles();
   const commonClasses = CommonStyles();
   const errMsg = useSelector((state) => state.user.errMsg);
   let { isSetPasswordLoaderactive, isPasswordUpdated, isResetTokenExpired } = useSelector((state) => state.user);
   const resetPasswordUrlValue = history.location.search.split(displayText.URL_TOKEN)[displayText.URL_INDEX];
   const userGuid = history.location.search.split(displayText.URL_USER_GUID)[displayText.URL_INDEX];
   const dispatch = useDispatch();
   const [newPassword, setNewPassword] = useState(stringManipulationCheck.EMPTY_STRING);
   const [confirmPassword, setConfirmPassword] = useState(stringManipulationCheck.EMPTY_STRING);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [newPasswordError, setNewPasswordError] = useState(false);
   const [confirmPasswordError, setConfirmPasswordError] = useState(false);
   const [passwordErrorMessage, setPasswordErrorMessage] = useState(stringManipulationCheck.EMPTY_STRING);
   const [showLoader, setShowLoader] = useState(false);
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   const handleSetUserPassword = () => {
      if (isEmpty(newPassword) && isEmpty(confirmPassword)) {
         setPasswordErrorMessage(errorMessage.PLEASE_ENTER_BOTH_PASSWORD);
         setNewPasswordError(true);
         setConfirmPasswordError(true);
         return;
      }
      if (isEmpty(newPassword)) {
         setPasswordErrorMessage(errorMessage.PLEASE_ENTER_NEW_PASSWORD);
         setNewPasswordError(true);
         setConfirmPasswordError(false);
         return;
      }
      if (isEmpty(confirmPassword)) {
         setPasswordErrorMessage(errorMessage.PLEASE_ENTER_CONFIRM_PASSWORD);
         setConfirmPasswordError(true);
         setNewPasswordError(false);
         return;
      }
      if (newPassword.length !== confirmPassword.length || !_.isEqual(newPassword, confirmPassword)) {
         setPasswordErrorMessage(errorMessage.BOTH_PASSWORD_SHOULD_MATCH);
         setConfirmPasswordError(true);
         setNewPasswordError(true);
         return;
      }
      const isNewPassword = regularExpression.PASSWORD.test(newPassword);
      const isConfirmPassword = regularExpression.PASSWORD.test(confirmPassword);
      if (!isNewPassword) {
         setPasswordErrorMessage(errorMessage.PASSWORD_NOT_MATCH_REQUIREMENT);
         setNewPasswordError(true);
         setConfirmPasswordError(false);
         return;
      }
      if (!isConfirmPassword) {
         setPasswordErrorMessage(errorMessage.PASSWORD_NOT_MATCH_REQUIREMENT);
         setConfirmPasswordError(true);
         setNewPasswordError(false);
         return;
      }
      removeCookie();
      setShowLoader(true);
      let updatePasswordURL = `${apiRouter.USERS}/${apiRouter.UPDATE_PASSWORD}`;
      let resetPasswordURL = `${apiRouter.USERS}/${apiRouter.RESET_PASSWORD}`;
      if (isUndefined(resetPasswordUrlValue)) {
         let resetPassword = resetPasswordUrlValue.split(displayText.URL_USER_GUID);
         let resetPasswordData = {
            resetToken: resetPassword[0],
            usersGuid: resetPassword[1],
            password: confirmPassword,
         };
         dispatch(actionCreator.UpdatePassword(resetPasswordURL, resetPasswordData, apiRouter.UPDATE_PASSWORD));
         return;
      }
      let updatePasswordData = {
         usersGuid: userGuid,
         password: confirmPassword,
      };
      dispatch(actionCreator.UpdatePassword(updatePasswordURL, updatePasswordData, apiRouter.UPDATE_PASSWORD));
   };

   const handleInput = (fieldName, e) => {
      if (fieldName === displayText.NEWPASSWORD) {
         setNewPasswordError(false);
         setNewPassword(e.target.value);
         return;
      } if (fieldName === displayText.CONFIRM_PASSWORD) {
         setConfirmPasswordError(false);
         setConfirmPassword(e.target.value);
      }
   };

   const handleClickShowNewPassword = () => {
      setShowNewPassword(!showNewPassword);
   };

   const handleClickShowConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword);
   };

   const tokenExpiredDialog = () => {
      return (<Dialog
         open={isDialogOpen}
         keepMounted
         maxWidth="md"
         disableBackdropClick={true}>
         <DialogTitle className={commonClasses.dialogTitle}>
            {displayText.WARNING}
         </DialogTitle>
         <DialogContent>
            <div>
               <Typography className={commonClasses.typographyPadding}>
                  {displayText.RESET_PASSWORD_TOKEN_EXPIRED}
               </Typography>
            </div>
         </DialogContent>
         <DialogActions>
            <div className={classes.buttonMarginLeft} >
               <Button
                  variant="contained"
                  className={classes.resentButton}
                  onClick={(e) => history.push(routerConstants.FORGOT_PASSWORD_URL)}>
                  {displayText.RESEND_FORGOTPASSWORD_EMAIL}
               </Button>
               <Button
                  variant="contained"
                  className={commonClasses.submitNo}
                  onClick={(e) => setIsDialogOpen(false)}>
                  {displayText.CANCEL}
               </Button>
            </div>
         </DialogActions>
      </Dialog>)
   }

   useEffect(() => {
      if (isSetPasswordLoaderactive) {
         setShowLoader(isSetPasswordLoaderactive);
         if (isPasswordUpdated) {
            history.push(apiRouter.SUCCESS_UPDATE);
         }
         return;
      }
      return setShowLoader(isSetPasswordLoaderactive);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isSetPasswordLoaderactive, isPasswordUpdated]);

   useEffect(() => {
      if (isResetTokenExpired) {
         setShowLoader(false);
         setIsDialogOpen(true);
      }
   }, [isResetTokenExpired]);

   useEffect(() => {
      setIsDialogOpen(false);
      localStorage.clear();
   }, []);

   return (
      <LoadingOverlay active={showLoader} text={displayText.PASSWORD_UPDATING}>
         <div className="c-app c-default-layout flex-row align-items-center background-white">
            <Container>
               <div className={classes.mainDiv}>
                  <div className={classes.setPasswordForm}>
                     <form className={classes.form} noValidate>
                        <img src={ILILogo} alt={displayText.CENOZON_LOGO} className="w-85" />
                        <FormControl className={classes.textField} variant="outlined">
                           <InputLabel htmlFor="outlined-adornment-email">
                              {displayText.NEW_PASSWORD}
                           </InputLabel>
                           <OutlinedInput
                              id="outlined-adornment-email"
                              type={showNewPassword ? displayText.TEXT : displayText.PASSWORD.toLowerCase()}
                              value={newPassword}
                              onChange={(e) => { handleInput(displayText.NEWPASSWORD, e) }}
                              error={newPasswordError}
                              startAdornment={
                                 <InputAdornment position="start">
                                    <IconButton
                                       aria-label={displayText.TOGGLE_PASSWORD_VISIBILITY}
                                       onClick={handleClickShowNewPassword}
                                       edge="start">
                                       {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                 </InputAdornment>
                              }
                              labelWidth={displayText.SET_PASSWORD_MEDIUM_WIDTH} />
                        </FormControl>
                        <FormControl className={classes.textField} variant="outlined">
                           <InputLabel htmlFor="outlined-adornment-password">
                              {displayText.CONFIRMPASSWORD}
                           </InputLabel>
                           <OutlinedInput
                              id="outlined-adornment-password"
                              type={showConfirmPassword ? displayText.TEXT : displayText.PASSWORD.toLowerCase()}
                              value={confirmPassword}
                              error={confirmPasswordError}
                              onChange={(e) => { handleInput(displayText.CONFIRM_PASSWORD, e) }}
                              onKeyPress={(event) => {
                                 if (event.key === displayText.ENTER) {
                                    handleSetUserPassword();
                                 }
                              }}
                              startAdornment={
                                 <InputAdornment position="start">
                                    <IconButton
                                       aria-label={displayText.TOGGLE_PASSWORD_VISIBILITY}
                                       onClick={handleClickShowConfirmPassword}
                                       edge="start">
                                       {showConfirmPassword ? (<Visibility />) : (<VisibilityOff />)}
                                    </IconButton>
                                 </InputAdornment>
                              }
                              labelWidth={displayText.PASSWORD_FIELD_MAX_WIDTH} />
                        </FormControl>
                        {(newPasswordError || confirmPasswordError)
                           ? (<div className={classes.warningStyle}>
                              {passwordErrorMessage}
                           </div>)
                           : (<div className={classes.errStyle}>{errMsg}</div>)}
                        <Button
                           fullWidth
                           variant="contained"
                           className={classes.submit}
                           onClick={handleSetUserPassword}>
                           {displayText.SAVE}
                        </Button>
                        <Grid item xs>
                           <h4>{displayText.PASSWORD_GUIDELINES}</h4>
                        </Grid>
                        <p>{displayText.PASSWORD_MUST_CONT_ALL_FOLLOW}</p>
                        <ul className={classes.widthContent}>
                           <li>{displayText.PASSWORD_INSTRUCTION}</li>
                           <li>{displayText.UPPERCASE_LETTER_A_Z}</li>
                           <li>{displayText.LOWERCASE_LETTER_a_z}</li>
                           <li>{displayText.NUMBERS_0_9}</li>
                           <li>{displayText.SYMBOLS_OR_SPECIAL}</li>
                        </ul>
                     </form>
                  </div>
               </div>
            </Container>
         </div>
         {tokenExpiredDialog()}
      </LoadingOverlay>
   );
}
