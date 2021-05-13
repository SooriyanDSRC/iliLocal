import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
   Grid, TextField, Typography, Button, Dialog, DialogTitle, DialogActions,
   DialogContentText, DialogContent, FormControl, IconButton, OutlinedInput,
   InputLabel, InputAdornment, Modal, Backdrop, Fade
} from "@material-ui/core";
import TextRecord from "../../components/shared/textRecord";
import { isEmptyNullUndefined, isDotEmpty, isEmpty, isNotNull, encryptData, decryptData } from "../../components/shared/helper";
import { Close, Visibility, VisibilityOff } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { apiRouter, sessionStorageKey, displayText, errorMessage, regularExpression, clientProfileLabelText, stringManipulationCheck } from "../../constant";
import { myProfileGrid, gridWidth } from "../../gridconstants";
import * as snackbarActionCreator from "../../store/action/snackbarAction";
import * as userActionCreator from "../../store/action/userAction";
import { useHistory } from "react-router-dom";
import * as actionCreator from "../../store/action/userManageAction";
import _ from "lodash";
import { modalStylingAttributes } from "../../modalconstants";
import LoadingOverlay from "react-loading-overlay";

const useStyles = makeStyles((theme) => ({
   passwordGuidelineStyle: {
      textAlign: "center",
      color: "#000000"
   },
   txtRecord: {
      padding: "12px 14px !important",
   },
   lableStyle: {
      color: "#00648d",
      textAlign: "left",
      width: "100%"
   },
   formControl: {
      padding: "20px",
      display: "flex",
      justifyContent: "center"
   },
   widthContent: {
      width: "max-content",
      marginLeft: "auto",
      color: "#000000",
      marginRight: "auto",
      fontSize: "13px"
   },
   header: {
      backgroundColor: "#00648d",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 50,
      fontSize: "1rem",
      padding: "1rem",
      fontWeight: "700"
   },
   footer: {
      display: "flex",
      marginTop: "0.5rem"
   },
   dropdownRoot: {
      display: "flex",
      padding: "1.5%",
      width: "100%"
   },
   modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
   },
   h_auto: {
      height: "auto !important"
   },
   root: {
      height: "auto !important",
      width: "60%",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      outline: "none"
   },
   rootBody: {
      backgroundColor: theme.palette.background.paper,
      flexGrow: 1
   },
   gridStyle: { height: "auto", marginTop: "0.5% !important" },
   headStyle: {
      marginTop: "28px",
      textAlign: "left"
   },
   spinnerStyle: {
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
      margin: "auto"
   },
   submitOk: {
      marginLeft: "50%",
      background: "#00648d",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#036290",
         color: "#ffffff"
      }
   },
   errMsg: {
      padding: "5px",
      color: "#ff0000",
      display: "flex",
      justifyContent: "center"
   },
   submitNo: {
      marginLeft: "18px !important",
      background: "#ffffff",
      borderRadius: 8,
      color: "#808080",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#fffff",
         color: "#000000"
      },
   },
   saveButton: {
      margin: theme.spacing(3, 0, 2),
      background: "#00648d",
      borderRadius: 8,
      height: "40px",
      width: "100px",
      '@media (max-width: 850px)': {
         width: "auto !important"
      },
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#1d79ac",
         color: "#ffffff"
      }
   },

   cancelButton: {
      margin: "24px 12px 2px",
      marginleft: "12px",
      height: "40px",
      width: "100px",
      '@media (max-width: 850px)': {
         width: "auto !important"
      },
      background: "#b6b6b6",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#c6c6c6",
         color: "#000000"
      }
   },
   btnChangePassword: {
      margin: "25px 10px 0px 0px",
      background: "#00648d",
      borderRadius: 8,
      height: "40px",
      width: "auto !important",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#1d79ac",
         color: "#ffffff"
      }
   },
   dialogTitle: {
      background: "#00648d",
      color: "#ffffff"
   },
   icon: {
      color: "#036290",
      cursor: "pointer"
   },
   dialogContentText: {
      padding: "20px !important",
      display: "flex !important",
      justifyContent: "center !important"
   },
   closeBtn: {
      fontSize: "1.5rem !important",
      cursor: "pointer !important"
   },
   bgColor: {
      background: "#ebedef"
   },
   marginLeftAuto: {
      marginLeft: "auto"
   },
   lineSpacingWidthLowerCase: {
      width: "180px"
   },
   lineSpacingWidthNumbers: {
      width: "130px"
   },
   messageAlignment: {
      display: "flex",
      justifyContent: "center",
      color: "#000000"
   }
}));

export default function MyProfile() {
   const classes = useStyles();
   const history = useHistory();
   const dispatch = useDispatch();
   const errMsg = useSelector((state) => state.user.errMsg);
   const { countryList, stateList } = useSelector((state) => state.userManage);
   const { myProfile, isPasswordUpdated, validationMessage } = useSelector((state) => state.user);
   const userId = JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)).usersGuid;
   const [userName, setUserName] = useState(stringManipulationCheck.EMPTY_STRING);
   const [address, setAddress] = useState(stringManipulationCheck.EMPTY_STRING);
   const [city, setCity] = useState(stringManipulationCheck.EMPTY_STRING);
   const [provincestate, setProvinceState] = useState(stringManipulationCheck.EMPTY_STRING);
   const [country, setCountry] = useState(stringManipulationCheck.EMPTY_STRING);
   const [postal, setPostal] = useState(stringManipulationCheck.EMPTY_STRING);
   const [phone, setPhone] = useState(stringManipulationCheck.EMPTY_STRING);
   const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
   const [myProfileDialogOpen, setMyProfileDialogOpen] = useState(false);
   const [passwordErrorMessage, setPasswordErrorMessage] = useState(stringManipulationCheck.EMPTY_STRING);
   const [newPassword, setNewPassword] = useState(stringManipulationCheck.EMPTY_STRING);
   const [confirmPassword, setConfirmPassword] = useState(stringManipulationCheck.EMPTY_STRING);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [edituserName, setEditUserName] = useState(stringManipulationCheck.EMPTY_STRING);
   const [editaddress, setEditAddress] = useState(stringManipulationCheck.EMPTY_STRING);
   const [editcity, setEditCity] = useState(stringManipulationCheck.EMPTY_STRING);
   const [editprovincestate, setEditProvinceState] = useState(stringManipulationCheck.EMPTY_STRING);
   const [editcountry, setEditCountry] = useState(stringManipulationCheck.EMPTY_STRING);
   const [editpostal, setEditPostal] = useState(stringManipulationCheck.EMPTY_STRING);
   const [editphone, setEditPhone] = useState(stringManipulationCheck.EMPTY_STRING);
   const [newPasswordError, setNewPasswordError] = useState(false);
   const [confirmPasswordError, setConfirmPasswordError] = useState(false);
   const [oldPassword, setOldPassword] = useState(stringManipulationCheck.EMPTY_STRING);
   const [showOldPassword, setShowOldPassword] = useState(stringManipulationCheck.EMPTY_STRING);
   const [oldPasswordError, setOldPasswordError] = useState(stringManipulationCheck.EMPTY_STRING);
   const [isLoading, setIsLoading] = useState(false);

   const clearChangePassword = () => {
      setChangePasswordDialogOpen(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setShowOldPassword(false);
      setNewPasswordError(false);
      setConfirmPasswordError(false);
      setOldPasswordError(false);
      setNewPassword(stringManipulationCheck.EMPTY_STRING);
      setConfirmPassword(stringManipulationCheck.EMPTY_STRING);
      setOldPassword(stringManipulationCheck.EMPTY_STRING);
      dispatch(userActionCreator.ClearValidationMessage());
   };

   const handleLogOut = () => {
      sessionStorage.clear();
      localStorage.clear();
      history.push(apiRouter.SUCCESS_UPDATE);
      window.location.reload();
   };

   const handleInput = (fieldname, e) => {
      if (fieldname === displayText.NEWPASSWORD) {
         setNewPasswordError(false);
         setNewPassword(e.target.value);
         return;
      }
      if (fieldname === displayText.CONFIRM_PASSWORD) {
         setConfirmPasswordError(false);
         setConfirmPassword(e.target.value);
         return;
      }
      if (fieldname === displayText.OLD_PASSWORD) {
         setOldPasswordError(false);
         setOldPassword(e.target.value);
         return;
      }
   };

   const handleClearUserDetails = () => {
      setEditUserName(stringManipulationCheck.EMPTY_STRING);
      setEditAddress(stringManipulationCheck.EMPTY_STRING);
      setEditCity(stringManipulationCheck.EMPTY_STRING);
      setEditProvinceState(stringManipulationCheck.EMPTY_STRING);
      setEditCountry(stringManipulationCheck.EMPTY_STRING);
      setEditPostal(stringManipulationCheck.EMPTY_STRING);
      setEditPhone(stringManipulationCheck.EMPTY_STRING);
      setMyProfileDialogOpen(false);
   };

   const handleSetUserPassword = async () => {
      if (isEmpty(oldPassword)) {
         setPasswordErrorMessage(errorMessage.PLEASE_ENTER_OLD_PASSWORD);
         setOldPasswordError(true);
         setNewPasswordError(false);
         setConfirmPasswordError(false);
         return true;
      }
      if (isEmpty(newPassword) && isEmpty(confirmPassword)) {
         setPasswordErrorMessage(errorMessage.PLEASE_ENTER_BOTH_PASSWORD);
         setNewPasswordError(true);
         setConfirmPasswordError(true);
         return;
      }
      if (isEmpty(newPassword)) {
         setPasswordErrorMessage(errorMessage.PLEASE_ENTER_NEW_PASSWORD);
         setNewPasswordError(true);
         setOldPasswordError(false);
         setConfirmPasswordError(false);
         return;
      }
      if (isEmpty(confirmPassword)) {
         setPasswordErrorMessage(errorMessage.PLEASE_ENTER_CONFIRM_PASSWORD);
         setConfirmPasswordError(true);
         setNewPasswordError(false);
         setOldPasswordError(false);
         return;
      }
      if (newPassword.length !== confirmPassword.length || !_.isEqual(newPassword, confirmPassword)) {
         setPasswordErrorMessage(errorMessage.BOTH_PASSWORD_SHOULD_MATCH);
         setNewPasswordError(true);
         setConfirmPasswordError(true);
         return;
      }
      const isNewPassword = regularExpression.PASSWORD.test(newPassword);
      const isConfirmPassword = regularExpression.PASSWORD.test(confirmPassword);
      if (!isNewPassword) {
         setPasswordErrorMessage(errorMessage.PASSWORD_NOT_MATCH_REQUIREMENT);
         setNewPasswordError(true);
         setOldPasswordError(false);
         setConfirmPasswordError(false);
         return;
      }
      if (!isConfirmPassword) {
         setPasswordErrorMessage(errorMessage.PASSWORD_NOT_MATCH_REQUIREMENT);
         setConfirmPasswordError(true);
         setNewPasswordError(false);
         setOldPasswordError(false);
         return;
      }
      setIsLoading(true);
      let setPasswordURL = `${apiRouter.COMMON}/${apiRouter.CHANGEPASSWORD}`;
      let updatePasswordData = {
         usersGuid: JSON.parse(decryptData(sessionStorageKey.USER_DETAILS))?.usersGuid,
         oldPassword: oldPassword,
         password: confirmPassword
      };
      await dispatch(userActionCreator.UpdatePassword(setPasswordURL, updatePasswordData, apiRouter.CHANGEPASSWORD));
   };

   const handleClickShowOldPassword = () => {
      setShowOldPassword(!showOldPassword);
   };
   const handleClickShowNewPassword = () => {
      setShowNewPassword(!showNewPassword);
   };
   const handleClickShowConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword);
   };
   const handleCloseStateDropDown = (event, closeReason) => {
      if (closeReason === displayText.BLUR) {
         setEditProvinceState(myProfile?.state ? myProfile.state : stringManipulationCheck.EMPTY_STRING);
      }
   };
   const handleCloseCountryDropDown = (event, closeReason) => {
      if (closeReason === displayText.BLUR) {
         setEditCountry(myProfile?.country ? myProfile.country : stringManipulationCheck.EMPTY_STRING);
      }
   };
   const getMyProfile = async () => {
      let url = `${apiRouter.COMMON}/${apiRouter.GET_USER_PROFILE}/${userId}`;
      dispatch(userActionCreator.GetMyProfile(url));
   };

   const updateUserDetail = async () => {
      if (!isDotEmpty(edituserName)) {
         dispatch(snackbarActionCreator.showFailureSnackbar(errorMessage.PLEASE_ENTER_VALID_USERNAME));
         return;
      }
      let url = `${apiRouter.COMMON}/${apiRouter.UPDATE_USER_PROFILE}`;
      let data = {
         usersGuid: userId,
         email: JSON.parse(decryptData(sessionStorageKey.USER_DETAILS))?.email,
         userName: edituserName,
         address: editaddress,
         city: editcity,
         state: editprovincestate,
         country: editcountry,
         postalcode: editpostal,
         phone: editphone,
      };
      await dispatch(userActionCreator.UpdateMyProfile(url, data));
      setMyProfileDialogOpen(false);
      await getMyProfile();
      let sessionData = JSON.parse(decryptData(sessionStorageKey.USER_DETAILS));
      sessionData.userName = edituserName;
      encryptData(sessionData, sessionStorageKey.USER_DETAILS);
      dispatch(userActionCreator.updateUsername(sessionData));
   };

   const handleEditProfile = () => {
      setEditUserName(userName);
      setEditAddress(address);
      setEditCity(city);
      setEditProvinceState(provincestate);
      setEditCountry(country);
      setEditPostal(postal);
      setEditPhone(phone);
      setMyProfileDialogOpen(true);
      getStateListbyCountry(country);
   };

   const getStateListbyCountry = (editCountry) => {
      if (isEmptyNullUndefined(editCountry)) {
         var countryResult = _.find(countryList, (Country) => {
            return Country.name === editCountry;
         });
         var url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${countryResult?.countryGuid}`;
         dispatch(actionCreator.FetchStateList(url));
      }
   };

   const CountryList = () => {
      const url = `${apiRouter.COUNTRY}`;
      dispatch(actionCreator.FetchCountryList(url));
   };
   const StateList = () => {
      const url = `${apiRouter.STATE}`;
      dispatch(actionCreator.FetchStateList(url));
   };
   useEffect(() => {
      if (isNotNull(myProfile)) {
         setUserName(myProfile?.userName);
         setAddress(myProfile?.address);
         setCity(myProfile?.city);
         setProvinceState(myProfile?.state);
         setCountry(myProfile?.country);
         setPostal(myProfile?.postalcode);
         setPhone(myProfile?.phone);
      }
   }, [myProfile]);

   const handleSelectCountry = (event, selectedCountry) => {
      if (isEmptyNullUndefined(selectedCountry)) {
         var url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${selectedCountry?.countryGuid}`;
         dispatch(actionCreator.FetchStateList(url));
      }
   };

   useEffect(() => {
      CountryList();
      StateList();
      clearChangePassword();
      getMyProfile();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      isPasswordUpdated ? handleLogOut() : setIsLoading(isPasswordUpdated);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isPasswordUpdated]);

   useEffect(() => {
      if (isEmpty(editcountry)) {
         StateList();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [editcountry]);

   useEffect(() => {
      if (!isEmpty(validationMessage) && validationMessage !== errorMessage.IS_OLD_PASSWORD_VALID) {
         setPasswordErrorMessage(validationMessage);
         setNewPasswordError(true);
         setConfirmPasswordError(true);
         setIsLoading(false);
         return;
      }
      if (!isEmpty(validationMessage) && validationMessage === errorMessage.IS_OLD_PASSWORD_VALID) {
         setPasswordErrorMessage(validationMessage);
         setOldPasswordError(true);
         setIsLoading(false);
         return;
      }
      if (!isEmpty(validationMessage)) {
         setChangePasswordDialogOpen(false);
         clearChangePassword();
         setIsLoading(false);
         return;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [validationMessage]);

   const handleInputChange = (type, e) => {
      switch (type) {
         case displayText.PHONE:
            let phoneNumber = e.target.value.replace(regularExpression.PHONE, stringManipulationCheck.EMPTY_STRING);
            if (phoneNumber.length <= displayText.PHONE_NUMBER_LENGTH) {
               return setEditPhone(phoneNumber);
            }
            return setEditPhone(editphone);
         case displayText.CITY: {
            if (e.target.value.length <= modalStylingAttributes.cityCharacterLimit) {
               let cityName = e.target.value.replace(regularExpression.CITY_CHECK_CHARACTER, stringManipulationCheck.EMPTY_STRING);
               return setEditCity(cityName.replace(regularExpression.CITY, stringManipulationCheck.EMPTY_STRING));
            }
            return;
         }
         default:
            return stringManipulationCheck.EMPTY_STRING;
      }
   }
   const myProfileDetails = () => {
      return (<Grid item xs={gridWidth.MaxWidth}>
         <Grid
            container
            className={classes.gridStyle}
            spacing={myProfileGrid.DefaultSpacing}
            direction="column"
            justify="center"
            alignItems="center">
            <Grid item xs={gridWidth.CustomMaxWidth}>
               <Grid container className={classes.gridStyle} spacing={myProfileGrid.DefaultSpacing}>
                  <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                     <TextRecord
                        readOnly={true}
                        lableName={displayText.USER_NAME}
                        textValue={userName} />
                  </Grid>
                  <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                     <TextRecord
                        readOnly={true}
                        lableName={displayText.ADDRESS}
                        textValue={address} />
                  </Grid>
                  <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                     <TextRecord
                        readOnly={true}
                        lableName={displayText.CITY}
                        textValue={city} />
                  </Grid>
                  <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                     <TextRecord
                        readOnly={true}
                        lableName={displayText.PROVINCE_STATE}
                        textValue={provincestate} />
                  </Grid>
                  <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                     <TextRecord
                        readOnly={true}
                        lableName={displayText.COUNTRY}
                        textValue={country} />
                  </Grid>
                  <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                     <TextRecord
                        readOnly={true}
                        lableName={clientProfileLabelText.POSTAL_CODE}
                        textValue={postal} />
                  </Grid>
                  <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                     <TextRecord
                        readOnly={true}
                        lableName={displayText.PHONE}
                        textValue={phone} />
                  </Grid>
                  <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                     <div className={classes.footer}>
                        <div>
                           <Button
                              lableName={stringManipulationCheck.EMPTY_STRING}
                              fullWidth
                              onClick={(e) => setChangePasswordDialogOpen(true)}
                              variant="contained"
                              className={classes.btnChangePassword}>
                              {displayText.CHANGE_PASSWORD}
                           </Button>
                        </div>
                        <div>
                           <Button
                              className={classes.saveButton}
                              onClick={(e) => handleEditProfile()}>
                              {displayText.EDIT_PROFILE}
                           </Button>
                        </div>
                     </div>
                  </Grid>
               </Grid>
            </Grid>
         </Grid>
         <Grid item sm={gridWidth.SmWidth} xs={gridWidth.InitialWidth} />
      </Grid>)
   }

   const myProfileEditDialog = () => {
      return (<Modal
         aria-labelledby="add-client-modal-title"
         aria-describedby="add-client-modal-description"
         className={classes.modal}
         open={myProfileDialogOpen}
         closeAfterTransition
         BackdropComponent={Backdrop}
         BackdropProps={{
            timeout: modalStylingAttributes.backDropTimeout,
         }}
      >
         <Fade in={myProfileDialogOpen}>
            <div className={classes.root}>
               <div className={classes.header}>
                  <div>{displayText.MY_PROFILE}</div>
                  <div className={classes.marginLeftAuto}>
                     {JSON.parse(decryptData(sessionStorageKey.USER_DETAILS))?.email}
                  </div>
                  <div onClick={(e) => handleClearUserDetails()}>
                     <Close className={classes.closeBtn} />
                  </div>
               </div>
               <div className={classes.rootBody}>
                  <form>
                     <Grid item xs={gridWidth.MaxWidth}>
                        <Grid
                           container
                           className={classes.gridStyle}
                           spacing={myProfileGrid.DefaultSpacing}
                           direction="column"
                           justify="center"
                           alignItems="center">
                           <Grid item xs={gridWidth.CustomMaxWidth}>
                              <Grid
                                 container
                                 className={classes.gridStyle}
                                 spacing={myProfileGrid.DefaultSpacing}>
                                 <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                                    <TextRecord
                                       lableName={displayText.USER_NAME}
                                       textValue={edituserName}
                                       readOnly={false}
                                       onChange={(e) => setEditUserName(e.target.value)} />
                                 </Grid>
                                 <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                                    <TextRecord
                                       readOnly={false}
                                       lableName={displayText.ADDRESS}
                                       onChange={(e) => setEditAddress(e.target.value)}
                                       textValue={editaddress} />
                                 </Grid>
                                 <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                                    <TextRecord
                                       lableName={displayText.CITY}
                                       textValue={editcity}
                                       onChange={(e) => handleInputChange(displayText.CITY, e)}
                                       readOnly={false} />
                                 </Grid>
                                 <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                                    <Typography
                                       className={classes.lableStyle}
                                       variant="h6">
                                       {displayText.PROVINCE_STATE}
                                    </Typography>
                                    <Autocomplete
                                       className={classes.bgColor}
                                       required
                                       options={stateList}
                                       inputValue={editprovincestate}
                                       onInputChange={(event, selectedstate) => {
                                          event
                                             ? setEditProvinceState(selectedstate)
                                             : setEditProvinceState(editprovincestate);
                                       }}
                                       getOptionLabel={(statelist) => statelist?.name}
                                       onClose={(event, closeReason) => handleCloseStateDropDown(event, closeReason)}
                                       openOnFocus={true}
                                       renderInput={(params) => (
                                          <>
                                             {stringManipulationCheck.SINGLE_SPACE_STRING}
                                             <TextField {...params} variant="outlined" />
                                          </>
                                       )} />
                                 </Grid>
                                 <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                                    <Typography
                                       className={classes.lableStyle}
                                       variant="h6">
                                       {displayText.COUNTRY}
                                    </Typography>
                                    <Autocomplete
                                       className={classes.bgColor}
                                       required
                                       options={countryList}
                                       inputValue={editcountry}
                                       onChange={(event, selectedCountry) => { handleSelectCountry(event, selectedCountry); }}
                                       onInputChange={(event, selectedcountry) => {
                                          event
                                             ? setEditCountry(selectedcountry)
                                             : setEditCountry(editcountry);
                                       }}
                                       onClose={(event, closeReason) => handleCloseCountryDropDown(event, closeReason)}
                                       getOptionLabel={(countrylist) =>
                                          countrylist?.name}
                                       openOnFocus={true}
                                       renderInput={(params) => (
                                          <>
                                             {stringManipulationCheck.SINGLE_SPACE_STRING}
                                             <TextField {...params} variant="outlined" />
                                          </>
                                       )} />
                                 </Grid>
                                 <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                                    <TextRecord
                                       readOnly={false}
                                       lableName={clientProfileLabelText.POSTAL_CODE}
                                       onChange={(e) => setEditPostal(e.target.value)}
                                       textValue={editpostal} />
                                 </Grid>
                                 <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MaxWidth}>
                                    <TextRecord
                                       readOnly={false}
                                       lableName={displayText.PHONE}
                                       onChange={(e) => handleInputChange(displayText.PHONE, e)}
                                       textValue={editphone} />
                                 </Grid>
                                 <Grid item sm={gridWidth.DefaultWidth} xs={gridWidth.MinWidth}>
                                    <div className={classes.footer}>
                                       <div>
                                          <Button
                                             className={classes.saveButton}
                                             onClick={(e) => updateUserDetail()}
                                             variant="contained">
                                             {displayText.SAVE}
                                          </Button>
                                       </div>
                                       <div>
                                          <Button
                                             className={classes.cancelButton}
                                             onClick={(e) => handleClearUserDetails()}>
                                             {displayText.CANCEL}
                                          </Button>
                                       </div>
                                    </div>
                                 </Grid>
                              </Grid>
                           </Grid>
                        </Grid>
                        <Grid item sm={gridWidth.SmWidth} xs={gridWidth.InitialWidth} />
                     </Grid>
                  </form>
               </div>
            </div>
         </Fade>
      </Modal>)
   }

   const changePasswordDialog = () => {
      return (
         <Dialog open={changePasswordDialogOpen} keepMounted>
            <LoadingOverlay active={isLoading} spinner text={displayText.PASSWORD_UPDATING}></LoadingOverlay>
            <DialogTitle className={classes.dialogTitle}>
               {displayText.CHANGE_PASSWORD}
            </DialogTitle>
            <DialogContent>
               <DialogContentText>
                  <div className={classes.dialogContentText}>
                     <FormControl className={classes.textfield} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">
                           {displayText.OLD_PASSWORD}
                        </InputLabel>
                        <OutlinedInput
                           id="outlined-adornment-password"
                           type={showOldPassword ? displayText.TEXT : displayText.PASSWORD.toLowerCase()}
                           autoComplete="new-password"
                           error={oldPasswordError}
                           value={oldPassword}
                           onChange={(e) => { handleInput(displayText.OLD_PASSWORD, e); }}
                           startAdornment={
                              <InputAdornment position="start">
                                 <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowOldPassword}
                                    edge="start">
                                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                 </IconButton>
                              </InputAdornment>
                           }
                           labelWidth={displayText.SET_PASSWORD_MEDIUM_WIDTH} />
                     </FormControl>
                  </div>
                  <div className={classes.dialogContentText}>
                     <FormControl className={classes.textfield} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">
                           {displayText.NEW_PASSWORD}
                        </InputLabel>
                        <OutlinedInput
                           id="outlined-adornment-password"
                           type={showNewPassword ? displayText.TEXT : displayText.PASSWORD.toLowerCase()}
                           error={newPasswordError}
                           value={newPassword}
                           onChange={(e) => { handleInput(displayText.NEWPASSWORD, e) }}
                           startAdornment={
                              <InputAdornment position="start">
                                 <IconButton
                                    aria-label={displayText.TOGGLE_PASSWORD_VISIBILITY}
                                    onClick={handleClickShowNewPassword}
                                    edge="start">
                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                 </IconButton>
                              </InputAdornment>}
                           labelWidth={displayText.SET_PASSWORD_MEDIUM_WIDTH} />
                     </FormControl>
                  </div>
                  <div className={classes.formControl}>
                     <FormControl className={classes.textfield} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">
                           {displayText.CONFIRMPASSWORD}
                        </InputLabel>
                        <OutlinedInput
                           id="outlined-adornment-password"
                           type={showConfirmPassword ? displayText.TEXT : displayText.PASSWORD.toLowerCase()}
                           value={confirmPassword}
                           error={confirmPasswordError}
                           onChange={(e) => { handleInput(displayText.CONFIRM_PASSWORD, e) }}
                           startAdornment={
                              <InputAdornment position="start">
                                 <IconButton
                                    aria-label={displayText.TOGGLE_PASSWORD_VISIBILITY}
                                    onClick={handleClickShowConfirmPassword}
                                    edge="start">
                                    {showConfirmPassword ? (
                                       <Visibility />
                                    ) : (<VisibilityOff />)}
                                 </IconButton>
                              </InputAdornment>
                           }
                           labelWidth={displayText.PASSWORD_FIELD_MAX_WIDTH}
                        />
                     </FormControl>
                  </div>
                  {(oldPasswordError || newPasswordError || confirmPasswordError) ? (
                     <div className={classes.errMsg}>{passwordErrorMessage}</div>
                  ) : (
                     <div className={classes.errStyle}>{errMsg}</div>
                  )}
                  <div className={classes.passwordGuidelineStyle}>
                     <h4>{displayText.PASSWORD_GUIDELINES}</h4>
                  </div>
                  <div>
                     <p className={classes.messageAlignment}>{displayText.PASSWORD_MUST_CONT_ALL_FOLLOW}</p>
                  </div>
                  <ul className={classes.widthContent}>
                     <li>{displayText.PASSWORD_INSTRUCTION}</li>
                     <li>{displayText.UPPERCASE_LETTER_A_Z}</li>
                     <li>{displayText.LOWERCASE_LETTER_a_z}</li>
                     <li>{displayText.NUMBERS_0_9}</li>
                     <li>{displayText.SYMBOLS_OR_SPECIAL}</li>
                  </ul>
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button
                  fullWidth
                  variant="contained"
                  className={classes.submitOk}
                  onClick={(e) => handleSetUserPassword()}>
                  {displayText.SAVE}
               </Button>
               <Button
                  fullWidth
                  variant="contained"
                  className={classes.submitNo}
                  onClick={(e) => clearChangePassword()}>
                  {displayText.CANCEL}
               </Button>
            </DialogActions>
         </Dialog>)
   }

   return (
      <div>
         <Grid spacing={myProfileGrid.DefaultSpacing} className={classes.h_auto}>
            <Grid item xs={gridWidth.MaxWidth}>
               <Typography variant="h5" className={classes.headStyle} gutterBottom>
                  {displayText.MY_PROFILE}
               </Typography>
            </Grid>
            {myProfileDetails()}
            {myProfileEditDialog()}
            {changePasswordDialog()}
         </Grid>
      </div>
   );
}
