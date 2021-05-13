import axios from 'axios';
import { displayText, sessionStorageKey, stringManipulationCheck } from '../../constant';
import { decryptData } from '../../components/shared/helper';
import { arrayConstants } from '../../arrayconstants';

const apiUrl = process.env.REACT_APP_API_URL ?? '';
export default {
  // Get all
  getAllData: (url) => new Promise((resolve, reject) => {
    axios
      .get(`${apiUrl}api/${url}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${displayText.BEARER} ${document.cookie.split(stringManipulationCheck.ASSIGNTO_OPERATOR)[arrayConstants.tokenData]}`,
          ClientsGuid: `${JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientsGuid}`
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve(err.message);
      });
  }),

  postData: (url, data) => new Promise((resolve, reject) => {
    axios
      .post(`${apiUrl}api/${url}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${displayText.BEARER} ${document.cookie.split(stringManipulationCheck.ASSIGNTO_OPERATOR)[arrayConstants.tokenData]}`,
          ClientsGuid: `${JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientsGuid}`
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve(err.message);
      });
  }),
  //Revoke Token API call 
  revokePostData: (url, data) => new Promise((resolve, reject) => {
    axios.defaults.withCredentials = true
    axios.post(`${apiUrl}api/${url}`, {}, {
      headers: {
        'Content-Type': displayText.APPLICATION_JSON,
        Authorization: `${displayText.BEARER} ${document.cookie.split(stringManipulationCheck.ASSIGNTO_OPERATOR)[arrayConstants.tokenData]}`,
        ClientsGuid: `${JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientsGuid}`
      }
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve(err.message);
      });
  }),

  loginUser: (url, data) => new Promise((resolve, reject) => {
    axios.defaults.withCredentials = true
    axios.post(`${apiUrl}api/${url}`, data, { crossDomain: true }, {
      headers: {
        'Content-Type': displayText.APPLICATION_JSON,
      }
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  }),

  // Refresh Token
  cookiePostData: (url) => new Promise((resolve, reject) => {
    axios.defaults.withCredentials = true
    axios.post(`${apiUrl}api/${url}`, {}, { crossDomain: true }, {
      headers: {
        'Content-Type': displayText.APPLICATION_JSON,
      }
    }).then((result) => {
      resolve(result);
    })
      .catch((err) => {
        resolve(err.message);
      });
  }),

  editData: (url, data) => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${apiUrl}api/${url}`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${displayText.BEARER} ${document.cookie.split(stringManipulationCheck.ASSIGNTO_OPERATOR)[arrayConstants.tokenData]}`,
            ClientsGuid: `${JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientsGuid}`
          },
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          resolve(err.message);
        });
    });
  },

  deleteCall: (url, data) => new Promise((resolve, reject) => {
    axios
      .delete(`${apiUrl}api/${url}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${displayText.BEARER} ${document.cookie.split(stringManipulationCheck.ASSIGNTO_OPERATOR)[arrayConstants.tokenData]}`,
          ClientsGuid: `${JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientsGuid}`
        },
        data,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve(err.message);
      });
  }),

  getExcelPreview: (url, data) => new Promise((resolve, reject) => {
    axios.post(`${apiUrl}api/${url}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `${displayText.BEARER} ${document.cookie.split(stringManipulationCheck.ASSIGNTO_OPERATOR)[arrayConstants.tokenData]}`,
        ClientsGuid: `${JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientsGuid}`
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      })
  }),

  passwordChangePostCall: (url, data) => new Promise((resolve, reject) => {
    axios.post(`${apiUrl}api/${url}`, data, {
      headers: {
        'Content-Type': displayText.APPLICATION_JSON,
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve(err.message);
      });
  }),

  deleteFileCall: (url) => new Promise((resolve, reject) => {
    fetch(`${apiUrl}${displayText.API}/${url}`, {
      headers: {
        Authorization: `${displayText.BEARER} ${document.cookie.split(stringManipulationCheck.ASSIGNTO_OPERATOR)[arrayConstants.tokenData]}`,
        ClientsGuid: `${JSON.parse(decryptData(sessionStorageKey.USER_CURRENT_CLIENT_DETAILS))?.clientsGuid}`
      },
      credentials: 'include',
      method: 'POST',
      mode: 'same-origin',
      keepalive: true
    })
      .then((result) => {
        resolve(result);
      })
      .catch((e) => {
        reject(e);
        console.log(e);
      })
  })
};