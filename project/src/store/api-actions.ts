import { createAsyncThunk } from '@reduxjs/toolkit';
import { dropToken, setToken } from '@services/token';
import { ApiRoute, AuthorizationStatus } from '@settings';
import { AxiosInstance, isAxiosError } from 'axios';

import { Questions } from 'types/question';
import { AppDispatch, State } from 'types/state';
import { AuthData, UserData } from 'types/user';

import { addNotification } from './slices/notifications/notifications';

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
  { status: AuthorizationStatus; email: string | null },
  undefined,
  {
    state: State;
    extra: AxiosInstance;
  }
>('user/checkAuth', async (_arg, { dispatch, extra: api }) => {
  try {
    const { data } = await api.get(ApiRoute.Login);
    return {
      status: AuthorizationStatus.Auth,
      email: data.email,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      let notification = {
        id: error.code || 'unknown_error',
        title: 'An error occurred',
        description: 'Please try again later.',
        type: 'error',
      };
      if (error.response?.status === 401) {
        notification = {
          id: error.code || 'unauthorized',
          title: 'Unauthorized',
          description: "Only authorized users can view the game's results.",
          type: 'info',
        };
      }
      dispatch(addNotification(notification));
    }
    return { status: AuthorizationStatus.NoAuth, email: null };
  }
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
