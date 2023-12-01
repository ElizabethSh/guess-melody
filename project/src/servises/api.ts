import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { getToken } from './token';

const BASE_URL = ' https://10.react.pages.academy/guess-melody';
const REQUEST_TIMEOUT = 5000;

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders
}


export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AdaptAxiosRequestConfig) => {
      const token = getToken();

      if (token) {
        config.headers['x-token'] = token;
      }

      return config;
    }
  );

  return api;
};
