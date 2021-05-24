import React, { useState, useEffect } from "react";
import { Modal, Backdrop, Fade, Grid, Button, TextField, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import LoadingOverlay from "react-loading-overlay";
import { displayText, apiRouter, errorMessage, clientProfileLabelText, stringManipulationCheck, regularExpression } from "../../../../constant";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../../../store/action/clientManageAction";
import serviceCall from "../../../../store/serviceCall";
import Checkbox from "@material-ui/core/Checkbox";
import _ from "lodash";
import CommonStyles from "../../../../scss/commonStyles";
import { client, gridWidth } from '../../../../gridconstants';
import { modalStylingAttributes } from '../../../../modalconstants';
import {
   isEmpty, isNotEmpty, isNotEmptyNullUndefined, isEmailFormatCorrect, leftTrim, autoCompleteOff, removeSpecialCharacter,
   isNullUndefined, handleCloseStateCountry, removeSpecialCharacterExceptDot
} from "../../../../components/shared/helper";

const useStyles = makeStyles((theme) => ({
   modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
   },
   root: {
      height: "94%",
      '@media (max-width: 750px)': {
         height: "96%"
      },
      width: "80%",
      overflowY: "hidden",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      outline: "none"
   },
   menuItemStyle: {
      "&:hover": {
         backgroundColor: "#d3dadd !important",
         color: "#00648d !important",
      }
   },
   rootBody: {
      padding: theme.spacing(6, 4, 0),
      height: "85%",
      backgroundColor: theme.palette.background.paper,
      flexGrow: 1,
      overflowY: "hidden",
      minHeight: "-webkit-fill-available"
   },
   footer: {
      display: "flex",
      justifyContent: "flex-end"
   }
}));

export default function AddClientModal(props) {
   const classes = useStyles();
   const dispatch = useDispatch();
   const { action } = props;
   const countryList = useSelector((clientCountryList) => clientCountryList.clientManage.countryList);
   const { isClientAdded, isClientEdited } = useSelector((state) => state.clientManage);
   const stateList = useSelector((clientStateList) => clientStateList.clientManage.stateList);
   const [clientId, setClientsId] = useState(stringManipulationCheck.EMPTY_STRING);
   const [name, setName] = useState(stringManipulationCheck.EMPTY_STRING);
   const [email, setEmail] = useState(stringManipulationCheck.EMPTY_STRING);
   const [mainContact, setMainContact] = useState(stringManipulationCheck.EMPTY_STRING);
   const [phone, setPhone] = useState(stringManipulationCheck.EMPTY_STRING);
   const [address, setAddress] = useState(stringManipulationCheck.EMPTY_STRING);
   const [city, setCity] = useState(stringManipulationCheck.EMPTY_STRING);
   const [state, setState] = useState(stringManipulationCheck.EMPTY_STRING);
   const [country, setCountry] = useState(stringManipulationCheck.EMPTY_STRING);
   const [postal, setPostal] = useState(stringManipulationCheck.EMPTY_STRING);
   const [isActive, setIsActive] = useState(false);
   const [isShowError, setIsShowError] = useState(false);
   const [checkClientName, setCheckClientName] = useState(false);
   const [isEmailError, setIsEmailError] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const commonClasses = CommonStyles();

   const handleCloseStateDropDown = (event, closeReason) => {
      if (closeReason === displayText.BLUR) {
         let state = handleCloseStateCountry(props.clientDetails?.state);
         setState(state);
      }
   };

   const handleCloseCountryDropDown = (event, closeReason) => {
      if (closeReason === displayText.BLUR) {
         let country = handleCloseStateCountry(props.clientDetails?.country);
         setCountry(country);
      }
   };

   const handleCloseModel = () => {
      props.handleClose();
      clearData();
      setIsShowError(false);
      setCheckClientName(false);
      setIsEmailError(false);
      setIsLoading(false);
   };

   const handleSaveClient = async () => {
      setIsLoading(true);
      let isAllowedToSave = true;
      let isClientExists = await checkClientNameExist();
      setCheckClientName(isClientExists?.data);
      if (isClientExists?.data) {
         setIsLoading(false);
         isAllowedToSave = false;
      }
      if (email) {
         setIsEmailError(isEmailFormatCorrect(email));
         isAllowedToSave = !isEmailFormatCorrect(email);
      }
      if (isNotEmpty(name) && isAllowedToSave) {
         let clientData = {
            name: name,
            email: email,
            address: address,
            city: city,
            state: state ? state : stringManipulationCheck.EMPTY_STRING,
            postal: postal,
            country: country,
            phone: phone,
            mainContact: mainContact
         };
         if (action === displayText.ADD) {
            let addUrl = `${apiRouter.CLIENT}`;
            let addClientData = {
               isActive: true,
               ...clientData
            };
            dispatch(actionCreator.AddClient(addUrl, addClientData));
            return;
         }
         let editUrl = `${apiRouter.CLIENT}`;
         let editClientData = {
            clientsGuid: clientId,
            isActive: isActive,
            ...clientData
         };
         dispatch(actionCreator.EditClient(editUrl, editClientData));
         return;
      }
      setIsShowError(true);
      setIsLoading(false);
   };

   const checkClientExist = async () => {
      setName(leftTrim(name));
      let isClientExists = await checkClientNameExist();
      setCheckClientName(isClientExists?.data);
   };

   async function checkClientNameExist() {
      if (isEmpty(name)) {
         setIsShowError(true);
         return stringManipulationCheck.EMPTY_STRING;
      }
      let checkClientNameUrl = `${apiRouter.CLIENT}/${apiRouter.CHECK_CLIENT_NAME_EXISTS}?${displayText.CLIENT_NAME}=${name}`;
      if (action !== displayText.ADD) { checkClientNameUrl = `${checkClientNameUrl}&${displayText.CLIENTSGUID}=${clientId}`; }
      return serviceCall.getAllData(checkClientNameUrl);
   }

   const checkEmailValidation = async () => {
      if (email) {
         setIsEmailError(isEmailFormatCorrect(email));
         return;
      }
      setIsEmailError(false);
   };

   function clearData() {
      setClientsId(stringManipulationCheck.EMPTY_STRING);
      setName(stringManipulationCheck.EMPTY_STRING);
      setEmail(stringManipulationCheck.EMPTY_STRING);
      setPhone(stringManipulationCheck.EMPTY_STRING);
      setAddress(stringManipulationCheck.EMPTY_STRING);
      setCity(stringManipulationCheck.EMPTY_STRING);
      setState(stringManipulationCheck.EMPTY_STRING);
      setCountry(stringManipulationCheck.EMPTY_STRING);
      setPostal(stringManipulationCheck.EMPTY_STRING);
      setIsActive(false);
      setMainContact(stringManipulationCheck.EMPTY_STRING);
   }

   const handleInputChange = (type, e) => {
      switch (type) {
         case displayText.CLIENT_NAME: {
            if (_.trimStart(e.target.value) === stringManipulationCheck.DOT_OPERATOR) {
               return stringManipulationCheck.EMPTY_STRING;
            }
            let clientName = removeSpecialCharacterExceptDot(e.target.value);
            return setName(_.trimStart(clientName));
         }
         case clientProfileLabelText.MAINCONTACT:
            return setMainContact(e.target.value);
         case displayText.ADDRESS:
            return setAddress(e.target.value);
         case displayText.CITY: {
            if (e.target.value.length <= modalStylingAttributes.cityCharacterLimit) {
               let cityName = removeSpecialCharacter(e.target.value);
               return setCity(cityName.replace(regularExpression.CITY, stringManipulationCheck.EMPTY_STRING));
            }
            return;
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
         default:
            return stringManipulationCheck.EMPTY_STRING;
      }
   };

   const getStateList = () => {
      let url = `${apiRouter.STATE}`;
      dispatch(actionCreator.FetchStateList(url));
   };

   const handleSelectCountry = (event, selectedCountry) => {
      if (isNotEmptyNullUndefined(selectedCountry)) {
         let url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${selectedCountry?.countryGuid}`;
         dispatch(actionCreator.FetchStateList(url));
      }
   };

   const getStateListbyCountry = () => {
      if (isNotEmptyNullUndefined(country)) {
         let countryResult = _.find(countryList, (Country) => {
            return Country.name === country;
         });

         let url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${countryResult?.countryGuid}`;
         dispatch(actionCreator.FetchStateList(url));
      }
   };

   useEffect(() => {
      if (isEmpty(country)) {
         getStateList();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [country]);

   useEffect(() => {
      if (props.clientDetails) {
         setClientsId(props.clientDetails?.clientsGuid);
         setName(props.clientDetails?.name);
         setEmail(props.clientDetails?.email);
         setPhone(props.clientDetails?.phone);
         setMainContact(props.clientDetails?.mainContact);
         setAddress(props.clientDetails?.address);
         setCity(props.clientDetails?.city);
         setState(props.clientDetails?.state);
         setCountry(props.clientDetails?.country ? props.clientDetails.country : stringManipulationCheck.EMPTY_STRING);
         setPostal(props.clientDetails?.postal);
         setIsActive(props.clientDetails?.isActive);
         getStateListbyCountry();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props.clientDetails]);

   useEffect(() => {
      if (isClientAdded || isClientEdited) {
         handleCloseModel();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isClientAdded, isClientEdited]);

   const renderNameAddressCity = () => {
      return (
         <>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  error={((isEmpty(name) && isShowError) || checkClientName)}
                  variant="outlined"
                  required
                  value={name}
                  onBlur={checkClientExist}
                  onChange={(e) => handleInputChange(displayText.CLIENT_NAME, e)}
                  id="filled-required"
                  label={clientProfileLabelText.CLIENTNAME}
                  fullWidth
                  helperText={(isEmpty(name) && isShowError) ? errorMessage.PLEASE_ENTER_CLIENT_NAME :
                     checkClientName ? errorMessage.CLIENT_ALREADY_EXISTS : (stringManipulationCheck.EMPTY_STRING)
                  } />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  variant="outlined"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  id="filled-required"
                  label={displayText.ADDRESS}
                  fullWidth />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  variant="outlined"
                  value={city}
                  onChange={(e) => handleInputChange(displayText.CITY, e)}
                  id="filled-required"
                  label={displayText.CITY}
                  fullWidth />
            </Grid>
         </>
      )
   }

   const renderAutoComplete = (input, list, name, stateMethod, closeMethod) => {
      return (
         <Grid item xs={gridWidth.DefaultWidth}>
            <Autocomplete
               required
               onFocus={(event) => autoCompleteOff(event)}
               options={list}
               inputValue={input}
               onChange={(event, selectedCountry) => {
                  name === displayText.COUNTRY && handleSelectCountry(event, selectedCountry);
               }}
               onInputChange={(event, selectedProperty) => {
                  isNullUndefined(event) ? stateMethod(selectedProperty) : stateMethod(input);
               }}
               getOptionLabel={(list) => list.name}
               onClose={(event, closeReason) =>
                  closeMethod(event, closeReason)
               }
               openOnFocus={true}
               renderInput={(params) => (
                  <>
                     {stringManipulationCheck.SINGLE_SPACE_STRING}
                     <TextField
                        {...params}
                        label={name}
                        variant="outlined" />
                  </>
               )} />
         </Grid>
      )
   }

   const renderStateCountryPostal = () => {
      return (
         <>
            {renderAutoComplete(state, stateList, displayText.PROVINCE_STATE, setState, handleCloseStateDropDown)}
            {renderAutoComplete(country, countryList, displayText.COUNTRY, setCountry, handleCloseCountryDropDown)}
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  variant="outlined"
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                  label={displayText.POSTALCODE}
                  fullWidth />
            </Grid>
         </>
      )
   }

   const renderPhoneContactEmail = () => {
      return (
         <>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  variant="outlined"
                  value={phone}
                  onChange={(e) => handleInputChange(displayText.PHONE, e)}
                  label={displayText.PHONE}
                  fullWidth />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  variant="outlined"
                  value={mainContact}
                  onChange={(e) => handleInputChange(clientProfileLabelText.MAINCONTACT, e)}
                  label={clientProfileLabelText.MAINCONTACT}
                  fullWidth />
            </Grid>
            <Grid item xs={gridWidth.DefaultWidth}>
               <TextField
                  error={isEmailError}
                  variant="outlined"
                  value={email}
                  onBlur={checkEmailValidation}
                  onChange={(e) => setEmail(e.target.value)}
                  label={displayText.EMAIL}
                  fullWidth
                  helperText={
                     isEmailError
                        ? errorMessage.PLEASE_ENTER_CORRECT_MAIL_FORMAT
                        : stringManipulationCheck.EMPTY_STRING
                  } />
            </Grid>
         </>
      )
   }

   const renderHeader = () => {
      return (
         <div className={commonClasses.header}>
            <div>
               {action === displayText.ADD
                  ? displayText.ADD_CLIENT
                  : displayText.EDIT_CLIENT}
            </div>
            <div onClick={handleCloseModel}>
               <Close className={commonClasses.close} />
            </div>
         </div>
      )
   }

   const renderActiveCheckbox = () => {
      return (
         <Grid item xs={gridWidth.DefaultWidth}>
            {action === displayText.EDIT ? (
               <>
                  <FormControlLabel
                     checked={isActive}
                     control={<Checkbox color="primary" />}
                     onChange={(e) => handleInputChange(displayText.ISACTIVE, e)}
                     label={displayText.ISACTIVE}
                     labelPlacement="end" />
               </>
            ) : (<></>)}
         </Grid>
      )
   }

   const renderFooter = () => {
      return (
         <Grid item xs={gridWidth.MaxWidth}>
            <div className={classes.footer}>
               <div>
                  <Button
                     className={commonClasses.saveBtn}
                     onClick={(e) => handleSaveClient()}>
                     {displayText.SAVE}
                  </Button>
               </div>
               <div className="ml-5">
                  <Button
                     className={commonClasses.cancelBtn}
                     onClick={(e) => handleCloseModel()}>
                     {displayText.CANCEL}
                  </Button>
               </div>
            </div>
         </Grid>
      )
   }

   return (
      <Modal
         aria-labelledby="add-client-modal-title"
         aria-describedby="add-client-modal-description"
         className="client-modal-h"
         open={props.open}
         closeAfterTransition
         BackdropComponent={Backdrop}
         BackdropProps={{
            timeout: modalStylingAttributes.backDropTimeout,
         }}>
         <Fade in={props.open}>
            <div className={classes.root}>
               <LoadingOverlay active={isLoading} spinner text={displayText.SAVING}></LoadingOverlay>
               {renderHeader()}
               <div className={classes.rootBody}>
                  <form>
                     <Grid container spacing={client.ModalSpacing}>
                        {renderNameAddressCity()}
                        {renderStateCountryPostal()}
                        {renderPhoneContactEmail()}
                        {renderActiveCheckbox()}
                        {renderFooter()}
                     </Grid>
                  </form>
               </div>
            </div>
         </Fade>
      </Modal>
   );
}
