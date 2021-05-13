import React, { useState, useEffect } from "react";
import { Modal, Backdrop, Fade, Grid, Button, TextField, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import LoadingOverlay from "react-loading-overlay";
import { displayText, apiRouter, errorMessage, clientProfileLabelText, stringManipulationCheck, regularExpression } from "../../../../constant";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreator from "../../../../store/action/vendorManageAction";
import serviceCall from "../../../../store/serviceCall";
import Checkbox from "@material-ui/core/Checkbox";
import _ from "lodash";
import CommonStyles from "../../../../scss/commonStyles";
import {
   isEmpty, isEmailFormatCorrect, isEmptyNullUndefined, isNotEmpty, leftTrim, autoCompleteOff,
   removeSpecialCharacter, removeSpecialCharacterExceptDot, handleCloseStateCountry
} from "../../../../components/shared/helper";
import { modalStylingAttributes } from '../../../../modalconstants';
import { gridWidth, vendor } from '../../../../gridconstants';

const useStyles = makeStyles((theme) => ({
   modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
   },
   root: {
      width: "80%",
      height: "92%",
      '@media (max-width: 800px)': {
         height: "96%"
      },
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
      padding: theme.spacing(6, 4, 3),
      height: "95%",
      backgroundColor: theme.palette.background.paper,
      flexGrow: 1,
      overflowY: "auto"
   },
   width: {
      width: "100%"
   },
   formControl: {
      minWidth: 120,
      width: "100%"
   },
   footer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "0.5rem"
   },
   saveBtn: {
      margin: theme.spacing(2, 0, 2),
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
   cancelBtn: {
      margin: theme.spacing(2, 0, 2),
      marginLeft: "12px",
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
}));

export default function AddVendorModal(props) {
   const classes = useStyles();
   const dispatch = useDispatch();
   const { action } = props;
   const countryList = useSelector((vendorCountryList) => vendorCountryList.vendorManage.countryList);
   const stateList = useSelector((vendorStateList) => vendorStateList.vendorManage.stateList);
   const [vendorsGuid, setVendorGuid] = useState(stringManipulationCheck.EMPTY_STRING);
   const [vendorName, setVendorName] = useState(stringManipulationCheck.EMPTY_STRING);
   const [mainContact, setMainContact] = useState(stringManipulationCheck.EMPTY_STRING);
   const [email, setEmail] = useState(stringManipulationCheck.EMPTY_STRING);
   const [phone, setPhone] = useState(stringManipulationCheck.EMPTY_STRING);
   const [address, setAddress] = useState(stringManipulationCheck.EMPTY_STRING);
   const [city, setCity] = useState(stringManipulationCheck.EMPTY_STRING);
   const [state, setState] = useState(stringManipulationCheck.EMPTY_STRING);
   const [country, setCountry] = useState(stringManipulationCheck.EMPTY_STRING);
   const [postalcode, setPostal] = useState(stringManipulationCheck.EMPTY_STRING);
   const [isactive, setIsActive] = useState(false);
   const [isShowError, setIsShowError] = useState(false);
   const [checkVendorName, setCheckVendorName] = useState(false);
   const [isEmailError, setisEmailError] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const commonClasses = CommonStyles();

   const handleCloseStateDropDown = (event, closeReason) => {
      if (closeReason === displayText.BLUR) {
         let state = handleCloseStateCountry(props.vendorDetail?.state);
         setState(state);
      }
   };

   const handleCloseCountryDropDown = (event, closeReason) => {
      if (closeReason === displayText.BLUR) {
         let country = handleCloseStateCountry(props.vendorDetail?.country);
         setCountry(country);
      }
   };

   const handleCloseModel = () => {
      clearData();
      setIsShowError(false);
      setCheckVendorName(false);
      setisEmailError(false);
      props.handleClose();
   };

   const handleSaveVendor = async () => {
      let isAllowedToSave = true;
      setIsLoading(true);
      if (isNotEmpty(vendorName)) {
         let isVendorExists = await checkVendorNameExist();
         setCheckVendorName(isVendorExists.data);
         if (isVendorExists.data) {
            isAllowedToSave = false;
            setIsLoading(false);
         }
      }
      if (email) {
         setisEmailError(isEmailFormatCorrect(email));
         isAllowedToSave = !isEmailFormatCorrect(email);
      }
      if (isNotEmpty(vendorName) && isAllowedToSave) {
         let vendorData = {
            vendorsGuid: vendorsGuid,
            maincontact: mainContact,
            vendorName: vendorName,
            email: email,
            address: address,
            city: city,
            state: state ? state : stringManipulationCheck.EMPTY_STRING,
            postalcode: postalcode,
            country: country,
            phone: phone,
         };

         handleCloseModel();
         if (action === displayText.ADD) {
            delete vendorData.vendorsGuid;
            let addurl = `${apiRouter.VENDORS}`;
            let addVendorData = {
               isActive: true,
               ...vendorData,
            };
            dispatch(actionCreator.AddVendor(addurl, addVendorData));
            setIsLoading(false);
         } else {
            let editurl = `${apiRouter.VENDORS}`;
            let editVendorData = {
               vendorsGuid: vendorsGuid,
               isActive: isactive,
               ...vendorData,
            };
            dispatch(actionCreator.EditVendor(editurl, editVendorData));
            setIsLoading(false);
         }
      } else {
         setIsShowError(true);
         setIsLoading(false);
      }
   };

   const checkVendorExist = async () => {
      setVendorName(leftTrim(vendorName));
      let isVendorExists = await checkVendorNameExist();
      setCheckVendorName(isVendorExists?.data);
   };

   async function checkVendorNameExist() {
      let checkVendorNameUrl = `${apiRouter.VENDORS}/${apiRouter.CHECK_VENDOR_NAME_EXISTS
         }?${apiRouter.VENDOR_NAME}=${vendorName}`;
      if (action !== displayText.ADD) {
         checkVendorNameUrl = `${checkVendorNameUrl}&${apiRouter.VENDOR_GUID}=${vendorsGuid}`;
      }
      return serviceCall.getAllData(checkVendorNameUrl);
   }

   function clearData() {
      setVendorGuid(stringManipulationCheck.EMPTY_STRING);
      setVendorName(stringManipulationCheck.EMPTY_STRING);
      setMainContact(stringManipulationCheck.EMPTY_STRING);
      setEmail(stringManipulationCheck.EMPTY_STRING);
      setPhone(stringManipulationCheck.EMPTY_STRING);
      setAddress(stringManipulationCheck.EMPTY_STRING);
      setCity(stringManipulationCheck.EMPTY_STRING);
      setState(stringManipulationCheck.EMPTY_STRING);
      setCountry(stringManipulationCheck.EMPTY_STRING);
      setPostal(stringManipulationCheck.EMPTY_STRING);
      setIsActive(false);
   }

   const handleInputChange = (type, e) => {
      switch (type) {
         case displayText.NAME: {
            if (_.trimStart(e.target.value) !== stringManipulationCheck.DOT_OPERATOR) {
               let name = removeSpecialCharacterExceptDot(e.target.value);
               return setVendorName(_.trimStart(name));
            }
            else return stringManipulationCheck.EMPTY_STRING;
         }
         case displayText.ADDRESS:
            return setAddress(e.target.value);
         case displayText.CITY: {
            if (e.target.value.length <= modalStylingAttributes.cityCharacterLimit) {
               let cityName = removeSpecialCharacter(e.target.value);
               return setCity(cityName.replace(regularExpression.CITY, stringManipulationCheck.EMPTY_STRING));
            } else return;
         }
         case displayText.POSTALCODE:
            return setPostal(e.target.value);
         case displayText.PHONE:
            let phoneNumber = e.target.value.replace(regularExpression.PHONE, stringManipulationCheck.EMPTY_STRING);
            if (phoneNumber.length <= displayText.PHONE_NUMBER_LENGTH) {
               return setPhone(phoneNumber);
            } else {
               return setPhone(phone);
            }
         case displayText.ISACTIVE:
            return setIsActive(e.target.checked);
         default:
            return stringManipulationCheck.EMPTY_STRING;
      }
   };

   const checkEmailValidation = async () => {
      if (email) setisEmailError(isEmailFormatCorrect(email));
      else setisEmailError(false);
   };

   const handleSelectCountry = (event, selectedCountry) => {
      if (isEmptyNullUndefined(selectedCountry)) {
         let url = `${apiRouter.STATE}/${apiRouter.GET_STATEBY_COUNTRY}?${displayText.COUNTRY_GUID}=${selectedCountry?.countryGuid}`;
         dispatch(actionCreator.FetchStateList(url));
      }
   };

   useEffect(() => {
      if (props.vendorDetail) {
         setVendorGuid(props.vendorDetail?.vendorsGuid);
         setVendorName(props.vendorDetail?.vendorName);
         setMainContact(props.vendorDetail?.mainContact);
         setEmail(props.vendorDetail?.email);
         setPhone(props.vendorDetail?.phone);
         setAddress(props.vendorDetail?.address);
         setCity(props.vendorDetail?.city);
         setState(props.vendorDetail?.state);
         setCountry(props.vendorDetail?.country);
         setPostal(props.vendorDetail?.postalcode);
         setIsActive(props.vendorDetail?.isActive);
         getStateListbyCountry();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props.vendorDetail]);

   const getStateList = () => {
      let url = `${apiRouter.STATE}`;
      dispatch(actionCreator.FetchStateList(url));
   };

   const getStateListbyCountry = () => {
      if (isEmptyNullUndefined(country)) {
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

   return (
      <Modal
         aria-labelledby="add-client-modal-title"
         aria-describedby="add-client-modal-description"
         className="common-modal-h"
         open={props.open}
         closeAfterTransition
         BackdropComponent={Backdrop}
         BackdropProps={{ timeout: modalStylingAttributes.backDropTimeout }}
      >
         <Fade in={props.open}>
            <div className={classes.root}>
               <LoadingOverlay active={isLoading} spinner text={displayText.SAVING}></LoadingOverlay>
               <div className={commonClasses.header}>
                  <div>
                     {action === displayText.ADD ? displayText.ADD_VENDOR : displayText.EDIT_VENDOR}
                  </div>
                  <div onClick={handleCloseModel}>
                     <Close className={commonClasses.close} />
                  </div>
               </div>
               <div className={classes.rootBody}>
                  <form>
                     <Grid container spacing={vendor.ModalSpacing}>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              error={
                                 (vendorName === stringManipulationCheck.EMPTY_STRING && isShowError) ||
                                 checkVendorName === true
                              }
                              variant="outlined"
                              required
                              value={vendorName}
                              onBlur={() => checkVendorExist()}
                              onChange={(e) => handleInputChange(displayText.NAME, e)}
                              id="filled-required"
                              label={displayText.VENDOR_NAME}
                              fullWidth
                              helperText={
                                 vendorName === stringManipulationCheck.EMPTY_STRING && isShowError
                                    ? errorMessage.PLEASE_ENTER_VENDOR_NAME
                                    : checkVendorName
                                       ? errorMessage.VENDOR_ALREADY_EXISTS
                                       : stringManipulationCheck.EMPTY_STRING
                              }
                           />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              variant="outlined"
                              value={mainContact}
                              onChange={(e) => setMainContact(e.target.value)}
                              id="filled-required"
                              label={clientProfileLabelText.MAINCONTACT}
                              fullWidth
                           />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              error={isEmailError}
                              variant="outlined"
                              value={email}
                              onBlur={checkEmailValidation}
                              onChange={(e) => setEmail(e.target.value)}
                              id="filled-required"
                              label={displayText.EMAIL}
                              fullWidth
                              disabled={action === displayText.EDIT_VENDOR}
                              helperText={
                                 isEmailError
                                    ? errorMessage.PLEASE_ENTER_CORRECT_MAIL_FORMAT
                                    : stringManipulationCheck.EMPTY_STRING
                              }
                           />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              variant="outlined"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              id="filled-required"
                              label={displayText.ADDRESS}
                              fullWidth
                           />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              variant="outlined"
                              value={city}
                              onChange={(e) => handleInputChange(displayText.CITY, e)}
                              id="filled-required"
                              label={displayText.CITY}
                              fullWidth
                           />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <Autocomplete
                              required
                              onFocus={(event) => autoCompleteOff(event)}
                              options={stateList}
                              inputValue={state}
                              onInputChange={(event, selectedstate) => {
                                 event ? setState(selectedstate) : setState(state);
                              }}
                              getOptionLabel={(statesList) => statesList.name}
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
                                       variant="outlined"
                                    />
                                 </>
                              )}
                           />
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
                              getOptionLabel={(countriesList) => countriesList.name}
                              onClose={(event, closeReason) =>
                                 handleCloseCountryDropDown(event, closeReason)
                              }
                              openOnFocus={true}
                              renderInput={(params) => (
                                 <>
                                    {stringManipulationCheck.SINGLE_SPACE_STRING}
                                    <TextField
                                       {...params}
                                       label={displayText.COUNTRY}
                                       variant="outlined"
                                    />
                                 </>
                              )}
                           />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              variant="outlined"
                              value={postalcode}
                              onChange={(e) => setPostal(e.target.value)}
                              id="filled-required"
                              label={displayText.POSTALCODE}
                              fullWidth
                           />
                        </Grid>
                        <Grid item xs={gridWidth.DefaultWidth}>
                           <TextField
                              variant="outlined"
                              value={phone}
                              onChange={(e) => handleInputChange(displayText.PHONE, e)}
                              id="filled-required"
                              label={displayText.PHONE}
                              fullWidth
                           />
                        </Grid>
                        {action === displayText.EDIT ? (
                           <>
                              {stringManipulationCheck.SINGLE_SPACE_STRING}
                              <Grid item xs={gridWidth.DefaultWidth}>
                                 <FormControlLabel
                                    checked={isactive}
                                    control={<Checkbox color="primary" />}
                                    onChange={(e) => handleInputChange(displayText.ISACTIVE, e)}
                                    label={displayText.ISACTIVE}
                                    labelPlacement="end"
                                 />
                              </Grid>
                           </>
                        ) : (
                           <></>
                        )}
                        <Grid item xs={gridWidth.MaxWidth}>
                           <div className={classes.footer}>
                              <div>
                                 <Button
                                    className={classes.saveBtn}
                                    onClick={(e) => handleSaveVendor()}
                                 >
                                    {displayText.SAVE}
                                 </Button>
                              </div>
                              <div className="ml-5">
                                 <Button
                                    className={classes.cancelBtn}
                                    onClick={(e) => handleCloseModel()}
                                 >
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
