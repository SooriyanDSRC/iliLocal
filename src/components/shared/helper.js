import serviceCall from "../../store/serviceCall";
import { displayText, regularExpression, dataTypeCheck, stringManipulationCheck, apiRouter, tokenValidity, sessionStorageKey } from "../../constant";
import { wizardStepper, fieldCheck } from "../../dataimportconstants";
import { fieldMappingSheetConfig } from "../../dataimportconstants";
import moment from "moment";
import _ from "lodash";
import CryptoAES from 'crypto-js/aes';
import CryptoENC from 'crypto-js/enc-utf8';
import { arrayConstants } from "../../arrayconstants";

export function preferenceIsActive(preference) {
   if (preference &&
      preference.isActive &&
      preference.isActive.toLowerCase() === displayText.FALSE) {
      return false;
   }
   return true;
}

export function getSteps() {
   return [
      wizardStepper.SELECT_FILE,
      wizardStepper.ILI_DATA_SUMMARY,
      wizardStepper.FIELDS_MAPPING,
      wizardStepper.QC_DASHBOARD,
   ];
}

export const deleteFile = (fileName) => {
   const url = `${apiRouter.FILE_UPLOAD}/${apiRouter.UPLOAD_CANCEL}?${apiRouter.DELETE_ORIGINAL_FILE}=${false}&${apiRouter.FILE_NAME}=${fileName}`;
   if (isNotEmptyNullUndefined(fileName)) {
      return serviceCall.postData(url, null)
   }
}

export const fetchUnitConversion = async (value, currentUnit, targetUnit, unitType) => {
   const url = `${apiRouter.FIELD_MAPPING}/${apiRouter.GET_CONVERTED_VALUE}?value=${value}&sourceUnit=${currentUnit}&targetUnit=${targetUnit}&unitType=${unitType}`;
   if (isNotEmptyNullUndefined(value) &&
   isNotEmptyNullUndefined(currentUnit) &&
   isNotEmptyNullUndefined(targetUnit) &&
   isNotEmptyNullUndefined(unitType) &&
      currentUnit !== displayText.DEFAULT_PARENTID) {
      return await serviceCall.getAllData(url);
   }
   return { data: { data: value } };
}

export function preferenceIsAsc(preference) {
   return preference === displayText.ASCENDING;
}

export function splitString(data) {
   return data?.split(stringManipulationCheck.SINGLE_SPACE_STRING);
}

export function isEmailValid(email) {
   return (email !== stringManipulationCheck.EMPTY_STRING && regularExpression.EMAIL.test(String(email).toLowerCase()));
}

export function isNullUndefined(data) {
   return data !== null && data !== undefined;
}

export function isUndefined(data) {
   return data !== undefined;
}

export function isNotEmptyNullUndefined(data) {
   return data !== null &&
      data !== undefined &&
      data !== stringManipulationCheck.EMPTY_STRING;
}

export function isEmptyNullUndefined(data) {
   return data === null ||
      data === undefined ||
      data === stringManipulationCheck.EMPTY_STRING;
}

export function isNotEmpty(data) {
   return data?.trim() !== stringManipulationCheck.EMPTY_STRING;
}

export function isEmpty(data) {
   return data?.trim() === stringManipulationCheck.EMPTY_STRING;
}

export function isEmailFormatCorrect(email) {
   return !regularExpression.EMAIL.test(String(email).toLowerCase());
}

export function leftTrim(data) {
   return data?.replace(/^\s+/, stringManipulationCheck.EMPTY_STRING);
}

export function convertToISODate(date) {
   return moment(date).format(displayText.ISO_DATE_FORMAT);
}

export function formatDate(date) {
   return isNotEmptyNullUndefined(date) ? moment(date).format(displayText.YEAR_MONTH_DAY_FORMAT) : stringManipulationCheck.EMPTY_STRING;
}

export function isDotEmpty(data) {
   return data?.trim() !== stringManipulationCheck.EMPTY_STRING && data !== stringManipulationCheck.DOT_OPERATOR;
}

export function isNotNull(data) {
   return data !== null;
}

export function removeCharacter(data) {
   return data.replace(/[^\d.-]/g, stringManipulationCheck.EMPTY_STRING);
}

export function convertToValidPrecisionNumber(precision, scale, data) {
   if (isNotEmptyNullUndefined(data)) {
      let splittedDecimal = data.split(stringManipulationCheck.DOT_OPERATOR);
      let beforeDecimalCount = _.head(splittedDecimal)?.length;
      let afterDecimalCount = _.last(splittedDecimal)?.length;

      if (scale === fieldMappingSheetConfig.scaleValue) {
         return (beforeDecimalCount <= precision)
            ? [removeCharacter(removeSpecialCharacter(data)), true]
            : [removeCharacter(removeSpecialCharacter(data)), false];
      }
      if (splittedDecimal.length > fieldMappingSheetConfig.decimalDataLengthCheck) {
         let decimalCopy = data.toString();
         let decimalCopySplit = decimalCopy.split(stringManipulationCheck.DOT_OPERATOR);
         let decimalDigits = _.last(decimalCopySplit);
         let realDigits = _.head(decimalCopySplit);

         if (isNotEmptyNullUndefined(decimalDigits)) {
            decimalCopy = removeSpecialCharacterExceptDot(decimalDigits);
            data = `${realDigits}.${decimalCopy}`;
         }
         return beforeDecimalCount <= precision - scale &&
            afterDecimalCount <= scale
            ? [removeCharacter(data), true]
            : [removeCharacter(data), false];
      }
      return beforeDecimalCount <= precision - scale
         ? [removeCharacter(data), true]
         : [removeCharacter(data), false];
   }
}

export function isStatusCodeValid(result, statusCode) {
   if (isUndefined(result?.status) && (result?.status === statusCode)) {
      return true;
   }
   return false;
}

export function setSessionStorage(key, value) {
   return encryptData(value, key);
}

export function autoCompleteOff(event) {
   event.target.setAttribute(displayText.AUTO_COMPLETE, displayText.NEW_PASSWORD_ATTRIBUTE);
}

export function isArrayContainsObject(data) {
   return (isNotEmptyNullUndefined(data) &&
      data.length > fieldMappingSheetConfig.fieldMapLengthCheck
      && typeof (_.head(data)) === dataTypeCheck.OBJECT);
}

export function removeSpecialCharacter(value) {
   return value
      .replace(/[*|\":<>[\]{}`\\()';@&$#^%_+!&?/,]/g, stringManipulationCheck.EMPTY_STRING)
      .replace(/\./g, stringManipulationCheck.EMPTY_STRING);
}

export function removeSpecialCharacterExceptDot(value) {
   return value.replace(/[*|\":<>[\]{}`\\()';@&$#^%_+!&?/,]/g, stringManipulationCheck.EMPTY_STRING);
}

export function handleCloseStateCountry(propDetails) {
   return isNotEmptyNullUndefined(propDetails) ? propDetails : stringManipulationCheck.EMPTY_STRING;
}

export function removeMultipleSpace(data) {
   return data.replace(/  +/g, stringManipulationCheck.SINGLE_SPACE_STRING)
}

export function findFeatures(features, name) {
   return isNullUndefined(_.find(features, (featuresItem) => {
      return featuresItem.name === name;
   }));
}

export function checkFieldLength(length, condition) {
   return length > condition;
}

export function findFeaturesRole(features, name) {
   return _.find(features, (featuresItem) => {
      return featuresItem.name === name;
   });
}

export function encryptData(data, key) {
   let encryptedData = CryptoAES.encrypt(JSON.stringify(data), key);
   localStorage.setItem(key, encryptedData);
   sessionStorage.setItem(key, encryptedData)
}

export function decryptData(key) {
   let localStorageData = (isNotNull(sessionStorage.getItem(key))) ? sessionStorage.getItem(key) : localStorage.getItem(key)
   if (!isNotEmptyNullUndefined(localStorageData)) {
      return null;
   }
   let _cipherText = CryptoAES.decrypt(localStorageData.toString(), key);
   return (_cipherText.toString(CryptoENC));
}

export function isCookieValid() {
   if (isNotEmptyNullUndefined(document.cookie)) {
      let token = document.cookie.split(stringManipulationCheck.ASSIGNTO_OPERATOR);
      const jwtToken = JSON.parse(atob(token[arrayConstants.tokenData]?.split(stringManipulationCheck.DOT_OPERATOR)[arrayConstants.tokenData]));
      const expires = jwtToken.exp;
      if (isNotEmptyNullUndefined(expires) && Date.now() <= expires * tokenValidity.convertToMilliSeconds) {
         return true;
      }
      sessionStorage.clear();
      localStorage.clear();
      return false;
   }
   sessionStorage.clear();
   localStorage.clear();
   return false;
}

export function filterExcelResponse(keys) {
   let mainDataKeyName = _.find(keys, (keyItem) => {
      return keyItem.toLowerCase().includes(fieldCheck.mainDataField) && !keyItem.toLowerCase().includes(fieldCheck.rowCountField)
   });
   let mainDataRowKeyName = _.find(keys, (keyItem) => {
      return keyItem.toLowerCase().includes(fieldCheck.mainDataField) && keyItem.toLowerCase().includes(fieldCheck.rowCountField)
   });
   let genericDataKeyName = _.find(keys, (keyItem) => {
      return keyItem.toLowerCase().includes(fieldCheck.genericDataField) && !keyItem.toLowerCase().includes(fieldCheck.rowCountField)
   });
   let genericDataRowKeyName = _.find(keys, (keyItem) => {
      return keyItem.toLowerCase().includes(fieldCheck.genericDataField) && keyItem.toLowerCase().includes(fieldCheck.rowCountField)
   });
   return { mainDataKeyName, mainDataRowKeyName, genericDataKeyName, genericDataRowKeyName }
}
export function isNullorUndefined(data) {
   return data === null || data === undefined;
}

export function getDirection(header, orderBy, isAsc) {
   if (orderBy === header.sort && !isAsc) {
      return displayText.DESC
   }
   return displayText.ASCENDING
}

export function removeDoubleQuotes(value) {
   return value.replace(regularExpression.REMOVE_DOUBLE_QUOTES, stringManipulationCheck.EMPTY_STRING);
}

export function removeCookie() {
   document.cookie = `${sessionStorageKey.TOKEN}=`
}
