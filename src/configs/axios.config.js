import axios from 'axios';

/** config axios */
const axiosConfig = axios.create({}); // config axios

/** config request */
// axiosConfig.interceptors.request

/** config response */
// axiosConfig.interceptors.response

export const postHttp = async (url, params = {}) => {
  /** post method with pure function */
  const res = await axios.post(url, params);
  return res;
};

export const getHttp = async (url) => {
  /** get method pure function */
  const res = await axios.get(url);
  return res;
};

export const putHttp = async (url, params = {}) => {
  /** put with specific url and params */
  const res = await axios.put(url, params);
  return res;
};

export const deleteHttp = async (url) => {
  /** delete get 204 code status */
  const res = await axios.delete(url);
  return res;
};