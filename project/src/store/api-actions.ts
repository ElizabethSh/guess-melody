import { createAsyncThunk } from '@reduxjs/toolkit';
import { dropToken, setToken } from '@services/token';
import { ApiRoute } from '@settings';
import { AxiosInstance } from 'axios';

import { Questions } from 'types/question';
import { AppDispatch, State } from 'types/state';
import { AuthData, UserData } from 'types/user';

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
    state: State;
    extra: AxiosInstance;
  }
>('user/checkAuth', async (_arg, { extra: api }) => {
  const { data } = await api.get(ApiRoute.Login);
  return data.email;
});

export const loginAction = createAsyncThunk<
  string,
  AuthData,
  {
    state: State;
    extra: AxiosInstance;
  }
>('user/login', async ({ login: email, password }, { extra: api }) => {
  const { data } = await api.post<UserData>(ApiRoute.Login, {
    email,
    password,
  });
  setToken(data.token);
  return data.email;
});

export const logoutAction = createAsyncThunk<
  void,
  undefined,
  {
    state: State;
    extra: AxiosInstance;
  }
>('user/logout', async (_arg, { extra: api }) => {
  await api.delete(ApiRoute.Logout);
  dropToken();
});
