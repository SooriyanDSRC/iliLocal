import React, { useState, useEffect } from "react";
import {
   Modal, Backdrop, Fade, Grid, Button, TextField, FormControlLabel, MenuItem, ListItemText, InputLabel, Select, FormControl,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import LoadingOverlay from "react-loading-overlay";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../../../store/action/userManageAction";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import { displayText, errorMessage, apiRouter, sessionStorageKey, stringManipulationCheck, regularExpression } from "../../../../constant";
import serviceCall from "../../../../store/serviceCall";
import _ from "lodash";
import {
   isEmailValid, isEmptyNullUndefined, isNotEmpty, leftTrim, isUndefined, autoCompleteOff, removeSpecialCharacter,
   handleCloseStateCountry, removeSpecialCharacterExceptDot, isNotNull, decryptData
} from "../../../../components/shared/helper";
import CommonStyles from "../../../../scss/commonStyles";
import { modalStylingAttributes } from '../../../../modalconstants';
import { user, gridWidth } from '../../../../gridconstants';


const useStyles = makeStyles((theme) => ({
   modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
   },
   root: {
      height: "92%",
      '@media (max-width: 725px)': {
         height: "100%"
      },
      width: "80%",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      outline: "none"
   },
   button: {
      margin: theme.spacing(0.5, 0),
      color: "rgba(3, 98, 144, 2)",
      background: "#ffffff",
      textTransform: "none",
      width: "auto",
      height: "50%",
      "&:hover": {
         backgroundColor: "#ffffff !important",
         color: "#4f5d73 !important"
      },
      cursor: "pointer"
   },
   resetRoot: {
      flexGrow: 1,
      marginTop: "2%",
      display: "flex",
      "& > *": {
         margin: theme.spacing(1),
      },
      justifyContent: "space-around !important",
      cursor: "pointer"
   },
   menuItemStyle: {
      "&:hover": {
         backgroundColor: "#d3dadd !important",
         color: "#00648d !important",
      }
   },
   errMsg: {
      color: "red",
      marginLeft: "5%"
   },
   rootBody: {
      padding: theme.spacing(6, 4, 3),
      height: "95%",
      backgroundColor: theme.palette.background.paper,
      flexGrow: 1,
      overflowY: "hidden"
   },
   width: {
      width: "100%"
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
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
      fontaddress: "700"
   },
   formControl: {
      minWidth: 120,
      width: "100%"
   },
   footer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "0.5rem"
   }
}));

export default function AddUserModal(props) {
   const classes = useStyles();
   const dispatch = useDispatch();
   const { action } = props;
   const { countryList, stateList, rolesList, isUserAdded, isUserEdited } = useSelector((state) => state.userManage);
   const [userName, setUserName] = useState(stringManipulationCheck.EMPTY_STRING);
   const [userEmail, setUserEmail] = useState(stringManipulationCheck.EMPTY_STRING);
   const [address, setAddress] = useState(stringManipulationCheck.EMPTY_STRING);
   const [city, setCity] = useState(stringManipulationCheck.EMPTY_STRING);
   const [provincestate, setProvinceState] = useState(stringManipulationCheck.EMPTY_STRING);
   const [isactive, setIsActive] = useState(false);
   const [country, setCountry] = useState(stringManipulationCheck.EMPTY_STRING);
   const [postal, setPostal] = useState(stringManipulationCheck.EMPTY_STRING);
   const [phone, setPhone] = useState(stringManipulationCheck.EMPTY_STRING);
   const [loadertext, setLoadertext] = useState(stringManipulationCheck.EMPTY_STRING);
   const [isShowError, setIsShowError] = useState(false);
   const [checkEmailExists, setCheckEmailExists] = useState(false);
   const [isEmailError, setIsEmailError] = useState(false);
   const [rolesDropdown, setRolesDropdown] = useState([]);
   const [selectedRoles, setSelectedRoles] = useState([]);
   const [currentUser, setCurrentUser] = useState(null);
   const [currentUserRole, setCurrentUserRole] = useState(null);
   const [existsUserDetails, setExistsUserDetails] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const commonClasses = CommonStyles();
   const handleCloseUser = () => {
      props.handleClose();
      clearData();
      setIsShowError(false);
      setIsEmailError(false);
      setIsLoading(false);
   };

   const handleSelectAllOperationalArea = () => {
      if (Object.assign([], selectedRoles).length === rolesDropdown.length) {
         setSelectedRoles([]);
      } else {
         setSelectedRoles(rolesDropdown);
      }
   };

   const handleInputChange = (type, e) => {
      switch (type) {
         case displayText.USER_NAME: {
            if (e.target.value !== stringManipulationCheck.DOT_OPERATOR) {
               let name = removeSpecialCharacterExceptDot(e.target.value);
               return setUserName(_.trimStart(name));
            }
            return stringManipulationCheck.EMPTY_STRING;
         }
         case displayText.EMAIL:
            return setUserEmail(e.target.value);
         case displayText.ADDRESS:
            return setAddress(e.target.value);
         case displayText.CITY: {
            if (e.target.value.length <= modalStylingAttributes.cityCharacterLimit) {
               let cityName = removeSpecialCharacter(e.target.value);
               return setCity(cityName.replace(regularExpression.CITY, stringManipulationCheck.EMPTY_STRING));
            } return;
         }
         case displayText.POSTALCODE:
            return setPostal(e.target.value);
         case displayText.PHONE:
            let phoneNumber = e.target.value.replace(regularExpression.PHONE, stringManipulationCheck.EMPTY_STRING);
            if (phoneNumber.length <= displayText.PHONE_NUMBER_LENGTH) {
               return setPhone(phoneNumber);
            }
            return setPhone(phone);
         case displayText.ISACTIVE:
            return setIsActive(e.target.checked);
         case displayText.ROLE: {
            let checkedRoles = Object.assign([], selectedRoles);
            let index = _.findIndex(checkedRoles, e);
            if (index === -1) {
               checkedRoles.push(e);
            } else {
               checkedRoles = checkedRoles.filter((c) => {
                  return c.rolesGuid !== e.rolesGuid;
               });
            }
            return setSelectedRoles(checkedRoles);
         }
         default:
            return stringManipulationCheck.EMPTY_STRING;
      }
   };

   const handleSaveUser = async () => {
      setLoadertext(displayText.SAVING)
      setIsLoading(true);
      setIsShowError(!isNotEmpty(userName));
      let isAllowedToSave = true;
      let isTheEmailValid = isEmailValid(userEmail);
      setIsEmailError(!isTheEmailValid);
      isAllowedToSave = isTheEmailValid;
      let isEmailExists = await handleCheckEmailExists();
      setCheckEmailExists(isEmailExists.data);
      if (!isNotEmpty(userName) && !isNotEmpty(userEmail) && !selectedRoles.length > 0) {
         setIsLoading(false);
         return
      }
      if (isEmailExists.data) {
         isAllowedToSave = false;
      }
      if (isNotEmpty(userName) && isNotEmpty(userEmail) && selectedRoles.length > 0 && isAllowedToSave) {
         let rolesID = _.map(_.cloneDeep(selectedRoles), displayText.ROLE_GUIDE);
         const data = {
            userName: userName,
            email: userEmail,
            address: address,
            city: city,
            state: provincestate,
            country: country,
            postalcode: postal,
            phone: phone,
            ClientsGuid: props?.clientId,
            isAppAdmin: false,
            RolesGuid: rolesID,
         };
         if (action === displayText.ADD) {
            let addUrl = `${apiRouter.USERS}/${apiRouter.ADDUSER}`;
            if (data.email === JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)).email &&
               !isUndefined(_.find(JSON.parse(decryptData(sessionStorageKey.USER_DETAILS))).clients, { clientsGuidLabel: data.ClientsGuid })) {
               props.userLogoutConfirm();
               dispatch(actionCreator.AddUser(addUrl, data, true));
               return;
            }
            dispatch(actionCreator.AddUser(addUrl, data));
         } else {
            let editUrl = `${apiRouter.USERS}`;
            let editUserData = {
               usersGuid: props.userDetail?.usersGuid,
               isactive: isactive,
               ...data,
            };
            let isCurrentUser = false;
            if (data.email === JSON.parse(decryptData(sessionStorageKey.USER_DETAILS)).email) {
               isCurrentUser = true;
            }
            dispatch(actionCreator.EditUser(editUrl, editUserData, isCurrentUser));
         }
      } else {
         setIsShowError(true);
         setIsLoading(false);
      }
   };

   const handleCloseClient = () => {
      setIsShowError(false);
      setIsEmailError(false);
      props.handleClose();
      clearData();
   };

   const handleSelectCountry = (event, selectedCountry) => {
      let checkCountry = isEmptyNullUndefined(selectedCountry);
      if (checkCountry) {
         let url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${selectedCountry?.countryGuid}`;
         dispatch(actionCreator.FetchStateList(url));
      }
   };

   function clearData() {
      setUserName(stringManipulationCheck.EMPTY_STRING);
      setUserEmail(stringManipulationCheck.EMPTY_STRING);
      setAddress(stringManipulationCheck.EMPTY_STRING);
      setCity(stringManipulationCheck.EMPTY_STRING);
      setProvinceState(stringManipulationCheck.EMPTY_STRING);
      setCountry(stringManipulationCheck.EMPTY_STRING);
      setPostal(stringManipulationCheck.EMPTY_STRING);
      setPhone(stringManipulationCheck.EMPTY_STRING);
      setSelectedRoles([]);
      setIsActive(false);
   }

   const handleCloseStateDropDown = (event, closeReason) => {
      if (closeReason === displayText.BLUR) {
         let state = handleCloseStateCountry(props.userDetail?.state);
         setProvinceState(state);
      }
   };

   const handleCloseCountryDropDown = (event, closeReason) => {
      if (closeReason === displayText.BLUR) {
         let country = handleCloseStateCountry(props.userDetail?.country);
         setCountry(country);
      }
   };

   const checkEmailValidation = async () => {
      if (action === displayText.ADD) {
         let isTheEmailValid = isEmailValid(userEmail);
         if (!isTheEmailValid) {
            setIsEmailError(true);
            setIsShowError(true);
            return;
         }
         setLoadertext(displayText.FETCHING_USER_DATA)
         setIsEmailError(false);
         setIsLoading(true);
         let isEmailExists = await handleCheckEmailExists();
         if (isEmailExists.data) {
            setCheckEmailExists(isEmailExists.data);
            setIsShowError(isEmailExists.data);
            setIsLoading(false);
            return
         }
         let userDetails = await handleExistsUserDetails();
         if (isEmptyNullUndefined(userDetails?.data)) {
            setExistsUserDetails(userDetails?.data);
            setCheckEmailExists(false);
            setIsLoading(false);
            return;
         }
         setCheckEmailExists(false);
         setIsLoading(false);
         setExistsUserDetails(null);
      }
   };

   useEffect(() => {
      if (isEmptyNullUndefined(existsUserDetails)) {
         setUserName(existsUserDetails?.userName);
         setAddress(existsUserDetails?.address);
         setCity(existsUserDetails?.city);
         setProvinceState(existsUserDetails?.state ? existsUserDetails?.state : stringManipulationCheck.EMPTY_STRING);
         setCountry(existsUserDetails?.country ? existsUserDetails?.country : stringManipulationCheck.EMPTY_STRING);
         setPostal(existsUserDetails?.postalcode);
         setPhone(existsUserDetails?.phone);
         return;
      }
      setUserName(stringManipulationCheck.EMPTY_STRING);
      setAddress(stringManipulationCheck.EMPTY_STRING);
      setCity(stringManipulationCheck.EMPTY_STRING);
      setProvinceState(stringManipulationCheck.EMPTY_STRING);
      setCountry(stringManipulationCheck.EMPTY_STRING);
      setPostal(stringManipulationCheck.EMPTY_STRING);
      setPhone(stringManipulationCheck.EMPTY_STRING);
   }, [existsUserDetails]);

   useEffect(() => {
      if (props.userDetail) {
         setUserName(props.userDetail?.userName);
         setUserEmail(props.userDetail?.email);
         setAddress(props.userDetail?.address);
         setCity(props.userDetail?.city);
         setProvinceState(props.userDetail?.state ? props.userDetail?.state : stringManipulationCheck.EMPTY_STRING);
         setCountry(props.userDetail?.country ? props.userDetail?.country : stringManipulationCheck.EMPTY_STRING);
         setPostal(props.userDetail?.postalcode);
         setSelectedRoles(props.userDetail?.roles);
         setPhone(props.userDetail?.phone);
         setIsActive(props.userDetail?.isActive);
         getStateListbyCountry();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props.userDetail]);

   useEffect(() => {
      setCurrentUser(props.currentUser);
      setCurrentUserRole(props.isAdminUser)
   }, [props]);

   useEffect(() => {
      if (isUserAdded || isUserEdited) {
         handleCloseUser();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isUserAdded, isUserEdited]);

   const getStateListbyCountry = () => {
      if (isEmptyNullUndefined(country)) {
         let countryResult = _.find(countryList, (Country) => {
            return Country.name === country;
         });
         let url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${countryResult?.countryGuid}`;
         dispatch(actionCreator.FetchStateList(url));
      }
   };

   const getStateList = () => {
      let url = `${apiRouter.STATE}`;
      dispatch(actionCreator.FetchStateList(url));
   };

   useEffect(() => {
      if (isNotNull(rolesList)) {
         setRolesDropdown(_.orderBy(rolesList, [displayText.ROLE_NAME], [displayText.ASCENDING]));
      }
   }, [rolesList]);

   useEffect(() => {
      if (!isNotEmpty(country)) {
         getStateList();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [country]);

   async function handleExistsUserDetails() {
      let existsUserDetailsUrl = stringManipulationCheck.EMPTY_STRING;
      if (action === displayText.ADD) {
         existsUserDetailsUrl = `${apiRouter.USERS}/${apiRouter.GET_USER_DETAIL}/${userEmail}`;
         return serviceCall.getAllData(existsUserDetailsUrl);
      }
   }

   async function handleCheckEmailExists() {
      let checkEmailUrl = `${apiRouter.USERS}/${apiRouter.CHECK_USEREMAIL_EXISTS}/${userEmail}/${props?.clientId}`;
      if (action !== displayText.ADD) {
         checkEmailUrl = `${checkEmailUrl}?${displayText.USER_GUID}=${props?.userDetail?.usersGuid}`;
      }
      return serviceCall.getAllData(checkEmailUrl);
   }

   const trimEmptySpace = async () => {
      setUserName(leftTrim(userName));
   };

   const renderEditing = () => {
      if (action !== displayText.EDIT) {
         return (<></>);
      }
      if (currentUser) {
         if (currentUserRole) {
            return (<>
               {stringManipulationCheck.SINGLE_SPACE_STRING}
               <Grid item xs={gridWidth.DefaultWidth}>
                  <FormControlLabel
                     checked={isactive}
                     control={<Checkbox color="primary" />}
                     onChange={(e) => handleInputChange(displayText.ISACTIVE, e)}
                     label={displayText.ISACTIVE}
                     labelPlacement="end" />
               </Grid>
            </>)
         }
         return (<></>);
      }
      return (<>
         {stringManipulationCheck.SINGLE_SPACE_STRING}
         <Grid item xs={gridWidth.DefaultWidth}>
            <FormControlLabel
               checked={isactive}
               control={<Checkbox color="primary" />}
               onChange={(e) => handleInputChange(displayText.ISACTIVE, e)}
               label={displayText.ISACTIVE}
               labelPlacement="end" />
         </Grid>
      </>);
   }

   const renderEmailUsernameAddress = () => {
      return (
         <>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  error={
                     (!isNotEmpty(userEmail) && isShowError) ||
                        isEmailError ||
                        (checkEmailExists === true && isShowError)
                        ? true
                        : false
                  }
                  onBlur={checkEmailValidation}
                  variant="outlined"
                  required
                  value={userEmail}
                  onChange={(e) => handleInputChange(displayText.EMAIL, e)}
                  id="filled-required"
                  label={displayText.EMAIL}
                  fullWidth
                  disabled={action !== displayText.ADD && currentUser}
                  helperText={
                     !isNotEmpty(userEmail) && isShowError
                        ? errorMessage.PLEASE_ENTER_EMAIL
                        : isEmailError
                           ? errorMessage.PLEASE_ENTER_CORRECT_MAIL_FORMAT
                           : checkEmailExists && isShowError
                              ? errorMessage.EMAIL_ALREADY_EXISTS
                              : stringManipulationCheck.EMPTY_STRING
                  } />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  error={userName === stringManipulationCheck.EMPTY_STRING && isShowError}
                  variant="outlined"
                  required
                  value={userName}
                  onBlur={trimEmptySpace}
                  onChange={(e) => handleInputChange(displayText.USER_NAME, e)}
                  id="filled-required"
                  label={displayText.USER_NAME}
                  fullWidth
                  helperText={
                     userName === stringManipulationCheck.EMPTY_STRING && isShowError
                        ? errorMessage.PLEASE_ENTER_USERNAME
                        : stringManipulationCheck.EMPTY_STRING
                  } />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  variant="outlined"
                  value={address}
                  onChange={(e) => handleInputChange(displayText.ADDRESS, e)}
                  id="filled-required"
                  label={displayText.ADDRESS}
                  fullWidth />
            </Grid>
         </>
      )
   }

   const renderCityStateCountry = () => {
      return (
         <>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  variant="outlined"
                  value={city}
                  onChange={(e) => handleInputChange(displayText.CITY, e)}
                  id="filled-required"
                  label={displayText.CITY}
                  fullWidth />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <Autocomplete
                  required
                  onFocus={(event) => autoCompleteOff(event)}
                  options={stateList}
                  inputValue={provincestate}
                  onInputChange={(event, selectedstate) => {
                     event
                        ? setProvinceState(selectedstate)
                        : setProvinceState(provincestate);
                  }}
                  getOptionLabel={(statelist) => statelist?.name}
                  onClose={(event, closeReason) =>
                     handleCloseStateDropDown(event, closeReason)
                  }
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
                  required
                  onFocus={(event) => autoCompleteOff(event)}
                  options={countryList}
                  inputValue={country}
                  onChange={(event, selectedCountry) => {
                     handleSelectCountry(event, selectedCountry);
                  }}
                  onInputChange={(event, selectedcountry) => {
                     event ? setCountry(selectedcountry) : setCountry(country);
                  }}
                  getOptionLabel={(countrylist) => countrylist?.name}
                  onClose={(event, closeReason) =>
                     handleCloseCountryDropDown(event, closeReason)
                  }
                  openOnFocus={true}
                  renderInput={(params) => (
                     <>
                        <TextField
                           {...params}
                           label={displayText.COUNTRY}
                           variant="outlined" />
                     </>
                  )} />
            </Grid>
         </>
      )
   }
   const renderPostalPhoneRoles = () => {
      return (
         <>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  variant="outlined"
                  value={postal}
                  onChange={(e) => handleInputChange(displayText.POSTALCODE, e)}
                  id="filled-required"
                  label={displayText.POSTALCODE}
                  fullWidth />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  variant="outlined"
                  value={phone}
                  onChange={(e) => handleInputChange(displayText.PHONE, e)}
                  id="filled-required"
                  label={displayText.PHONE}
                  fullWidth />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  required
                  error={!selectedRoles?.length > 0 && isShowError}>
                  <InputLabel id="client-label">Roles</InputLabel>
                  <Select
                     labelId="client-outlined-label"
                     id="client-outlined"
                     multiple
                     value={_.map(selectedRoles, displayText.ROLE_NAME)}
                     labelWidth={50}
                     renderValue={(selected) => selected.join(stringManipulationCheck.COMMA_OPERATOR)}>
                     {rolesDropdown.length > 0 && (
                        <MenuItem
                           key={displayText.SELECT_ALL_CLIENT_DROPDOWN}
                           value={displayText.ALL}
                           className={classes.menuItemStyle}
                           onClick={(e) => handleSelectAllOperationalArea()}>
                           <Checkbox
                              checked={
                                 selectedRoles?.length === rolesDropdown?.length
                              } />
                           <ListItemText primary={displayText.SELECT_ALL} />
                        </MenuItem>
                     )}
                     {rolesDropdown.map((rolesObj) => (
                        <MenuItem
                           key={rolesObj.roleName}
                           value={rolesObj.rolesGuid}
                           className={classes.menuItemStyle}
                           onClick={(e) => handleInputChange(displayText.ROLE, rolesObj)}>
                           <Checkbox
                              checked={
                                 _.map(selectedRoles, displayText.ROLE_GUIDE).indexOf(
                                    rolesObj.rolesGuid
                                 ) > -1
                              } />
                           <ListItemText primary={rolesObj.roleName} />
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>
               {(!selectedRoles?.length > 0 && isShowError) ? (
                  <>
                     <div className={classes.errMsg}>
                        {errorMessage.PLEASE_SELECT_ROLE}{stringManipulationCheck.SINGLE_SPACE_STRING}
                     </div>
                  </>
               ) : (<></>)}
            </Grid>
         </>
      )
   }
   return (
      <Modal
         aria-labelledby="add-client-modal-title"
         aria-describedby="add-client-modal-state"
         className="common-modal-h"
         open={props.open}
         closeAfterTransition
         BackdropComponent={Backdrop}
         BackdropProps={{
            timeout: modalStylingAttributes.backDropTimeout,
         }}>
         <Fade in={props.open}>
            <div className={classes.root}>
               <LoadingOverlay active={isLoading} spinner text={loadertext}></LoadingOverlay>
               <div className={classes.header}>
                  <div>
                     {action === displayText.ADD
                        ? displayText.ADD_USER
                        : displayText.EDIT_USER}
                  </div>
                  <div onClick={handleCloseClient}>
                     <Close className={commonClasses.close} />
                  </div>
               </div>
               <div className={classes.rootBody}>
                  <form>
                     <Grid container spacing={user.ModalSpacing}>
                        {renderEmailUsernameAddress()}
                        {renderCityStateCountry()}
                        {renderPostalPhoneRoles()}
                        {action === displayText.EDIT && renderEditing()}
                        <Grid item xs={gridWidth.MaxWidth}>
                           <div className={classes.footer}>
                              <div>
                                 <Button
                                    className={commonClasses.saveBtn}
                                    onClick={handleSaveUser}>
                                    {displayText.SAVE}
                                 </Button>
                              </div>
                              <div className="ml-5">
                                 <Button
                                    className={commonClasses.cancelBtn}
                                    onClick={(e) => handleCloseClient()}>
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
