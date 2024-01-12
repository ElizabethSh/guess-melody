import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosInstance } from 'axios';

import { ApiRoute, AuthorizationStatus } from '../../settings'

import { AuthData, UserData } from './../../types/user';
import { Questions } from '../../types/question';
import { AppDispatch, State } from '../../types/state';

import { loadQuestions, requireAuthorisation } from './game';
import { dropToken } from '../../servises/token';


export const fetchQuestionAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'data/fetchQuestions',
  async (_arg, {dispatch, extra: api}) => {
    const {data} = await api.get<Questions>(ApiRoute.QUESTIONS);
    dispatch(loadQuestions(data));
  },
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'user/checkAuthStatus',
  async (_arg, { dispatch, extra: api}) => {
    try {
      await api.get(ApiRoute.LOGIN);
      dispatch(requireAuthorisation(AuthorizationStatus.AUTH))
    } catch {
      dispatch(requireAuthorisation(AuthorizationStatus.NO_AUTH))
    }
  }
);

export const loginAction = createAsyncThunk<void, AuthData, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'user/login',
  async ({ email, password }, { dispatch, extra: api }) => {
    const data = await api.post<UserData>(ApiRoute.LOGIN, { email, password });
    // TODO: save token to the localStorage
    dispatch(requireAuthorisation(AuthorizationStatus.AUTH));
  }
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'user/logout',
 async (_arg, { dispatch, extra: api }) => {
  await api.delete(ApiRoute.LOGOUT);
  dropToken();
  dispatch(requireAuthorisation(AuthorizationStatus.NO_AUTH));
 }
);
