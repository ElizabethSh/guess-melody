import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';

import { ApiRoute } from '../settings';

import { AuthData, UserData } from '../types/user';
import { Questions } from '../types/question';
import { AppDispatch, State } from '../types/state';

import { dropToken, setToken } from '../servises/token';

export const fetchQuestionAction = createAsyncThunk<
  Questions,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('data/fetchQuestions', async (_arg, { extra: api }) => {
  const { data } = await api.get<Questions>(ApiRoute.Questions);
  return data;
});

export const checkAuthAction = createAsyncThunk<
  string | null,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('user/checkAuth', async (_arg, { dispatch, extra: api }) => {
  const { data } = await api.get(ApiRoute.Login);
  return data.email;
});

export const loginAction = createAsyncThunk<
  string,
  AuthData,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>(
  'user/login',
  async ({ login: email, password }, { dispatch, extra: api }) => {
    const { data } = await api.post<UserData>(ApiRoute.Login, {
      email,
      password,
    });
    setToken(data.token);
    return data.email;
  },
);

export const logoutAction = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('user/logout', async (_arg, { dispatch, extra: api }) => {
  await api.delete(ApiRoute.Logout);
  dropToken();
});
