import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse
} from 'axios';
import {StatusCodes} from 'http-status-codes';

import store from '../store';
import { setError } from '../store/actions/game';

import { getToken } from './token';


const BASE_URL = 'https://13.design.htmlacademy.pro./guess-melody1';
const REQUEST_TIMEOUT = 5000;


interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders
}

type DetailMessageType = {
  type: string;
  message: string;
}

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: true,
  [StatusCodes.NOT_FOUND]: true,
};

const shouldDispalyError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];


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

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      if (error.response && shouldDispalyError(error.response)) {
        const detailMessage = error.response.data;
        store.dispatch(setError(detailMessage.message));
      }
    }
  );

  return api;
};
