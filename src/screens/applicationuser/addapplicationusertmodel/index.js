import React, { useState, useEffect } from "react";
import { Modal, Backdrop, Fade, Grid, FormControlLabel, Button, Checkbox, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Close } from "@material-ui/icons";
import LoadingOverlay from "react-loading-overlay";
import { errorMessage, apiRouter, displayText, stringManipulationCheck, regularExpression } from "../../../constant";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../../store/action/applicationUserManageAction";
import * as userActionCreator from "../../../store/action/userManageAction";
import serviceCall from "../../../store/serviceCall";
import _ from "lodash";
import {
   isEmailValid, isNotEmpty, isNotEmptyNullUndefined, leftTrim, autoCompleteOff, removeSpecialCharacter,
   removeSpecialCharacterExceptDot, handleCloseStateCountry, isEmpty
} from "../../../components/shared/helper";
import { modalStylingAttributes } from '../../../modalconstants';
import { applicationAdmin, gridWidth } from '../../../gridconstants';
import CommonStyles from '../../../scss/commonStyles';

const useStyles = makeStyles((theme) => ({
   modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
   },
   root: {
      height: "68%",
      width: "80%",
      "@media (max-width: 730px)": {
         height: "73%",
      },
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      outline: "none"
   },
   menuItemStyle: {
      "&:hover": {
         backgroundColor: "#d3dadd !important",
         color: "#00648d !important"
      },
   },
   rootBody: {
      padding: theme.spacing(6, 4, 3),
      height: "103%",
      backgroundColor: theme.palette.background.paper,
      flexGrow: 1
   },
   width: {
      width: "100%",
   },
   saveButton: {
      margin: theme.spacing(3, 1, 2),
      background: "#00648d",
      borderRadius: 8,
      height: "40px",
      width: "100px",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#00648d",
         color: "#ffffff"
      }
   },
   cancelButton: {
      margin: theme.spacing(3, 0, 2),
      marginleft: "12px",
      width: "100px",
      height: "40px",
      background: "#b6b6b6",
      borderRadius: 8,
      color: "#ffffff",
      textTransform: "none",
      "&:hover": {
         backgroundColor: "#c6c6c6",
         color: "#000000"
      }
   },
   formControl: {
      minWidth: 120,
      width: "100%"
   },
   footer: {
      display: "flex",
      justifyContent: "flex-end"
   }
}));

export default function ApplicationUserModal(props) {
   const dispatch = useDispatch();
   const { countryList, stateList } = useSelector((state) => state.userManage);
   const classes = useStyles();
   const [username, setUserName] = useState(stringManipulationCheck.EMPTY_STRING);
   const [address, setAddress] = useState(stringManipulationCheck.EMPTY_STRING);
   const [city, setCity] = useState(stringManipulationCheck.EMPTY_STRING);
   const [provincestate, setProvinceState] = useState(stringManipulationCheck.EMPTY_STRING);
   const [country, setCountry] = useState(stringManipulationCheck.EMPTY_STRING);
   const [postalcode, setPostalCode] = useState(stringManipulationCheck.EMPTY_STRING);
   const [phone, setPhone] = useState(stringManipulationCheck.EMPTY_STRING);
   const [existsUserDetails, setExistsUserDetails] = useState(null);
   const [email, setEmail] = useState(stringManipulationCheck.EMPTY_STRING);
   const action = props.action;
   const [isactive, setIsActive] = useState(false);
   const [isShowError, setIsShowError] = useState(false);
   const [isEmailError, setIsEmailError] = useState(false);
   const [checkEmailExists, setCheckEmailExists] = useState(false);
   const [isCurrentUser, setIsCurrentUser] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const commonClasses = CommonStyles();

   const handleInputChange = (type, e) => {
      switch (type) {
         case displayText.USER_NAME: {
            if (_.trimStart(e.target.value) !== stringManipulationCheck.DOT_OPERATOR) {
               let name = removeSpecialCharacterExceptDot(e.target.value);
               return setUserName(_.trimStart(name));
            }
            return stringManipulationCheck.EMPTY_STRING;
         }
         case displayText.ADDRESS:
            return setAddress(e.target.value);
         case displayText.CITY: {
            if (e.target.value.length <= modalStylingAttributes.cityCharacterLimit) {
               let cityName = removeSpecialCharacter(e.target.value);
               return setCity(cityName.replace(regularExpression.CITY, stringManipulationCheck.EMPTY_STRING));
            }
            return stringManipulationCheck.EMPTY_STRING;
         }
         case displayText.Country:
            return setCountry(stringManipulationCheck.EMPTY_STRING);
         case displayText.POSTALCODE:
            return setPostalCode(e.target.value);
         case displayText.PHONE:
            let phoneNumber = e.target.value.replace(regularExpression.PHONE, stringManipulationCheck.EMPTY_STRING);
            if (phoneNumber.length <= displayText.PHONE_NUMBER_LENGTH) {
               return setPhone(phoneNumber);
            }
            return setPhone(phone);
         case displayText.EMAIL:
            return setEmail(e.target.value);
         case displayText.ISACTIVE:
            return setIsActive(e.target.checked);
         default:
            return stringManipulationCheck.EMPTY_STRING;
      }
   };

   const handleSaveUser = async () => {
      let isAllowedToSave = true;
      let isTheEmailValid = isEmailValid(email);
      if (!isTheEmailValid || !isNotEmpty(username)) {
         setIsEmailError(!isTheEmailValid);
         setIsShowError(!isNotEmpty(username));
         return;
      }
      setIsLoading(true);
      isAllowedToSave = isTheEmailValid;
      if (isNotEmpty(email)) {
         let isEmailExists = await handleCheckEmailExists();
         setCheckEmailExists(isEmailExists?.data);
         let isNameValid = isNotEmpty(username);
         if (isEmailExists?.data || !isNameValid) {
            isAllowedToSave = false;
         }
      }
      if (isAllowedToSave) {
         const data = {
            username: username,
            email: email,
            address: address,
            city: city,
            state: provincestate,
            country: country,
            postalcode: postalcode,
            phone: phone,
         };
         handleCloseUser();
         if (action === displayText.ADD) {
            let addUrl = `${apiRouter.USERS}/${apiRouter.ADD_APP_ADMIN_USER}`;
            let addAppUser = { isAppAdmin: true, ...data };
            dispatch(actionCreator.AddApplicationUser(addUrl, addAppUser));
            setIsLoading(false);
         } else {
            let editUrl = `${apiRouter.USERS}`;
            let editAppUser = {
               usersGuid: props.appUserDetails?.usersGuid,
               isactive: isactive,
               isAppAdmin: true,
               ...data,
            };
            dispatch(actionCreator.EditApplicationUser(editUrl, editAppUser, props.isCurrentUser));
            setIsLoading(false);
         }
      } else {
         setIsShowError(true);
         setIsLoading(false);
      }
   };

   async function handleCheckEmailExists() {
      let checkEmailUrl = `${apiRouter.USERS}/${apiRouter.CHECK_APP_USEREMAIL_EXISTS
         }?${apiRouter.EMAIL}=${email}`;
      if (action !== displayText.ADD) {
         checkEmailUrl = `${checkEmailUrl}&${apiRouter.USERS_GUID}=${props?.appUserDetails?.usersGuid}`;
      }
      return serviceCall.getAllData(checkEmailUrl);
   }

   async function handleExistsUserDetails() {
      let existsUserDetailsUrl = stringManipulationCheck.EMPTY_STRING;
      if (action === displayText.ADD) {
         existsUserDetailsUrl = `${apiRouter.USERS}/${apiRouter.GET_USER_DETAIL}/${email}`;
         return serviceCall.getAllData(existsUserDetailsUrl);
      }
   }

   const checkEmailValidation = async () => {
      if (action === displayText.ADD) {
         let isTheEmailValid = isEmailValid(email);
         if (isTheEmailValid) {
            setIsEmailError(false);
         } else {
            setIsEmailError(true);
            setIsShowError(true);
            return;
         }
         let isEmailExists = await handleCheckEmailExists();
         if (isEmailExists.data) {
            setCheckEmailExists(isEmailExists.data);
            setIsShowError(isEmailExists.data);
         } else {
            let userDetails = await handleExistsUserDetails();
            if (isNotEmptyNullUndefined(userDetails?.data)) {
               setExistsUserDetails(userDetails?.data);
               setCheckEmailExists(false);
            } else {
               setCheckEmailExists(false);
               setExistsUserDetails(null);
            }
         }
      }
   };

   function clearData() {
      setUserName(stringManipulationCheck.EMPTY_STRING);
      setAddress(stringManipulationCheck.EMPTY_STRING);
      setCity(stringManipulationCheck.EMPTY_STRING);
      setProvinceState(stringManipulationCheck.EMPTY_STRING);
      setCountry(stringManipulationCheck.EMPTY_STRING);
      setPostalCode(stringManipulationCheck.EMPTY_STRING);
      setPhone(stringManipulationCheck.EMPTY_STRING);
      setEmail(stringManipulationCheck.EMPTY_STRING);
      setIsActive(false);
   }

   const getStateList = () => {
      let url = `${apiRouter.STATE}`;
      dispatch(userActionCreator.FetchStateList(url));
   };

   const handleCloseUser = () => {
      setIsShowError(false);
      setIsEmailError(false);
      props.handleClose();
      clearData();
      setIsLoading(false);
   };

   useEffect(() => {
      if (isNotEmptyNullUndefined(existsUserDetails)) {
         setUserName(existsUserDetails?.userName);
         setAddress(existsUserDetails?.address);
         setCity(existsUserDetails?.city);
         setProvinceState(
            existsUserDetails?.state ? existsUserDetails?.state : stringManipulationCheck.EMPTY_STRING
         );
         setCountry(existsUserDetails?.country ? existsUserDetails?.country : stringManipulationCheck.EMPTY_STRING);
         setPostalCode(existsUserDetails?.postalcode);
         setPhone(existsUserDetails?.phone);
         getStateListbyCountry();
      } else {
         setUserName(stringManipulationCheck.EMPTY_STRING);
         setAddress(stringManipulationCheck.EMPTY_STRING);
         setCity(stringManipulationCheck.EMPTY_STRING);
         setProvinceState(stringManipulationCheck.EMPTY_STRING);
         setCountry(stringManipulationCheck.EMPTY_STRING);
         setPostalCode(stringManipulationCheck.EMPTY_STRING);
         setPhone(stringManipulationCheck.EMPTY_STRING);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [existsUserDetails]);

   useEffect(() => {
      if (props.appUserDetails) {
         setUserName(props.appUserDetails?.userName);
         setEmail(props.appUserDetails?.email);
         setAddress(props.appUserDetails?.address);
         setCity(props.appUserDetails?.city);
         setProvinceState(props.appUserDetails?.state);
         setCountry(props.appUserDetails?.country);
         setPostalCode(props.appUserDetails?.postalcode);
         setPhone(props.appUserDetails?.phone);
         setIsActive(props.appUserDetails?.isActive);
         getStateListbyCountry();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props.appUserDetails]);

   useEffect(() => {
      setIsCurrentUser(props.isCurrentUser);
   }, [props.isCurrentUser]);

   useEffect(() => {
      if (isEmpty(country)) {
         getStateList();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [country]);

   const handleSelectCountry = (selectedCountry) => {
      if (isNotEmptyNullUndefined(selectedCountry)) {
         let url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${selectedCountry?.countryGuid}`;
         dispatch(userActionCreator.FetchStateList(url));
      }
   };

   const getStateListbyCountry = () => {
      if (isNotEmptyNullUndefined(country)) {
         let countryResult = _.find(countryList, (Country) => {
            return Country.name === country;
         });
         let url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${countryResult?.countryGuid}`;
         dispatch(userActionCreator.FetchStateList(url));
      }
   };

   const handleCloseStateDropDown = (event, closeReason) => {
      if (closeReason === displayText.BLUR) {
         let state = handleCloseStateCountry(props.appUserDetails?.state);
         setProvinceState(state);
      }
   };

   const handleCloseCountryDropDown = (event, closeReason) => {
      if (closeReason === displayText.BLUR) {
         let countryData = handleCloseStateCountry(props.appUserDetails?.country);
         setCountry(countryData);
      }
   };

   const trimEmptySpace = async () => {
      setUserName(leftTrim(username));
   };

   const renderHelperText = () => {
      if (isEmpty(email) && isShowError) {
         return (errorMessage.PLEASE_ENTER_EMAIL)
      }
      if (isEmailError) {
         return (errorMessage.PLEASE_ENTER_CORRECT_MAIL_FORMAT)
      }
      if (checkEmailExists && isShowError) {
         return (errorMessage.EMAIL_ALREADY_EXISTS)
      }
      return stringManipulationCheck.EMPTY_STRING;
   }

   return (
      <Modal
         aria-labelledby="add-app-user-modal-title"
         aria-describedby="add-app-user-modal-description"
         className="add-app-modal-h"
         open={props.open}
         closeAfterTransition
         BackdropComponent={Backdrop}
         BackdropProps={{ timeout: modalStylingAttributes.backDropTimeout }}>
         <Fade in={props.open}>
            <div className={classes.root}>
               <LoadingOverlay active={isLoading} spinner text={displayText.SAVING}></LoadingOverlay>
               <div className={commonClasses.header}>
                  <div>
                     {action === displayText.ADD
                        ? displayText.ADD_APP_ADMIN
                        : displayText.EDIT_APPLICATION_USER}
                  </div>
                  <div onClick={(e) => { handleCloseUser(); }}>
                     <Close className="closeFontSize" />
                  </div>
               </div>
               <div className={classes.rootBody}>
                  <form>
                     <Grid container spacing={applicationAdmin.ModalSpacing}>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              error={
                                 (isEmpty(email) && isShowError) ||
                                 isEmailError ||
                                 (checkEmailExists === true && isShowError)}
                              value={email}
                              onBlur={checkEmailValidation}
                              onChange={(e) => handleInputChange(displayText.EMAIL, e)}
                              variant="outlined"
                              required
                              id="filled-required"
                              label={displayText.EMAIL}
                              fullWidth
                              disabled={!isCurrentUser && action !== displayText.ADD}
                              helperText={renderHelperText()} />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              error={username === stringManipulationCheck.EMPTY_STRING && isShowError}
                              value={username}
                              onChange={(e) => handleInputChange(displayText.USER_NAME, e)}
                              onBlur={trimEmptySpace}
                              variant="outlined"
                              required
                              id="filled-required"
                              label={displayText.USER_NAME}
                              fullWidth
                              helperText={
                                 username === stringManipulationCheck.EMPTY_STRING && isShowError
                                    ? errorMessage.PLEASE_ENTER_USERNAME
                                    : stringManipulationCheck.EMPTY_STRING} />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              value={address}
                              onChange={(e) => handleInputChange(displayText.ADDRESS, e)}
                              variant="outlined"
                              id="filled-required"
                              label={displayText.ADDRESS}
                              fullWidth />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              value={city}
                              onChange={(e) => handleInputChange(displayText.CITY, e)}
                              variant="outlined"
                              id="filled-required"
                              label={displayText.CITY}
                              fullWidth />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <Autocomplete
                              onFocus={(event) => autoCompleteOff(event)}
                              options={stateList}
                              inputValue={provincestate}
                              onInputChange={(event, selectedstate) => {
                                 event
                                    ? setProvinceState(selectedstate)
                                    : setProvinceState(provincestate);
                              }}
                              getOptionLabel={(statelist) => statelist?.name}
                              onClose={(event, closeReason) => handleCloseStateDropDown(event, closeReason)}
                              openOnFocus={true}
                              renderInput={(params) => (
                                 <>
                                    {stringManipulationCheck.SINGLE_SPACE_STRING}
                                    <TextField
                                       {...params}
                                       label={displayText.PROVINCE_STATE}
                                       variant="outlined" />
                                 </>
                              )} />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <Autocomplete
                              onFocus={(event) => autoCompleteOff(event)}
                              options={countryList}
                              inputValue={country}
                              onChange={(event, selectedCountry) => { handleSelectCountry(selectedCountry); }}
                              onInputChange={(event, selectedcountry) => {
                                 event ? setCountry(selectedcountry) : setCountry(country);
                              }}
                              onClose={(event, closeReason) => handleCloseCountryDropDown(event, closeReason)}
                              getOptionLabel={(countrylist) => countrylist?.name}
                              openOnFocus={true}
                              renderInput={(params) => (
                                 <>
                                    {stringManipulationCheck.SINGLE_SPACE_STRING}
                                    <TextField
                                       {...params}
                                       label={displayText.COUNTRY}
                                       variant="outlined" />
                                 </>
                              )} />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              value={postalcode}
                              onChange={(e) => handleInputChange(displayText.POSTALCODE, e)}
                              variant="outlined"
                              id="filled-required"
                              label={displayText.POSTALCODE}
                              fullWidth />
                        </Grid>

                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              value={phone}
                              onChange={(e) => handleInputChange(displayText.PHONE, e)}
                              variant="outlined"
                              id="filled-required"
                              label={displayText.PHONE}
                              fullWidth />
                        </Grid>
                        {
                           (action === displayText.ADD && !isCurrentUser)
                              ? (<Grid item xs={gridWidth.DefaultWidth} />)
                              : isCurrentUser ? (<Grid item xs={gridWidth.DefaultWidth}>
                                 <FormControlLabel
                                    checked={isactive}
                                    control={<Checkbox color="primary" />}
                                    onChange={(e) => handleInputChange(displayText.ISACTIVE, e)}
                                    label={displayText.ISACTIVE}
                                    labelPlacement="end" />
                              </Grid>) : <Grid item xs={gridWidth.DefaultWidth}></Grid>
                        }
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <div className={classes.footer}>
                              <div>
                                 <Button
                                    className={classes.saveButton}
                                    onClick={(e) => handleSaveUser()}>
                                    {displayText.SAVE}
                                 </Button>
                              </div>
                              <div>
                                 <Button
                                    className={classes.cancelButton}
                                    onClick={(e) => { handleCloseUser() }}>
                                    {displayText.CANCEL}
                                 </Button>
                              </div>
                           </div>
                        </Grid>
                     </Grid>
                  </form>
               </div>
            </div>
         </Fade>
      </Modal>
   );
}