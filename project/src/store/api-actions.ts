import { createAsyncThunk } from '@reduxjs/toolkit';
import { dropToken, setToken } from '@services/token';
import { ApiRoute, AuthorizationStatus } from '@settings';
import { AxiosInstance } from 'axios';

import { Questions } from 'types/question';
import { AppDispatch, State } from 'types/state';
import { AuthData, UserData } from 'types/user';
import { CommonErrorMessages, handleApiError } from 'utils/error-handling';

export const fetchQuestionAction = createAsyncThunk<
  Questions,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('data/fetchQuestions', async (_arg, { dispatch, extra: api }) => {
  try {
    const { data } = await api.get<Questions>(ApiRoute.Questions);
    return data;
  } catch (error) {
    handleApiError(error, {
      dispatch,
      action: 'fetch-questions',
      defaultMessage: 'Failed to load questions. Please try again.',
      statusMessages: {
        404: {
          title: 'Questions Not Found',
          description: 'Questions not found. Please contact support.',
        },
        ...Object.fromEntries(
          Object.entries(CommonErrorMessages)
            .filter(([status]) => parseInt(status) >= 500)
            .map(([status, config]) => [
              status,
              {
                ...config,
                description: 'Server error. Please try again later.',
              },
            ]),
        ),
      },
    });

    // Re-throw the error so it can still be caught by the component if needed
    throw error;
  }
});

export const checkAuthAction = createAsyncThunk<
  { status: AuthorizationStatus; email: string | null },
  undefined,
  {
    dispatch: AppDispatch;
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
    handleApiError(error, {
      dispatch,
      action: 'check-auth',
      defaultMessage: 'Authentication check failed. Please try again.',
      statusMessages: {
        401: {
          title: 'Unauthorized',
          description: 'Only authorized users can view the game results.',
          type: 'info',
        },
        404: {
          title: 'Service Unavailable',
          description:
            'Authentication service not found. Please contact support.',
        },
        ...Object.fromEntries(
          Object.entries(CommonErrorMessages)
            .filter(([status]) => parseInt(status) >= 500)
            .map(([status, config]) => [
              status,
              {
                ...config,
                description: 'Server error. Please try again later.',
              },
            ]),
        ),
      },
    });

    return { status: AuthorizationStatus.NoAuth, email: null };
  }
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
    try {
      const { data } = await api.post<UserData>(ApiRoute.Login, {
        email,
        password,
      });
      setToken(data.token);
      return data.email;
    } catch (error) {
      handleApiError(error, {
        dispatch,
        action: 'login',
        defaultMessage: 'Login failed. Please try again.',
        statusMessages: {
          401: {
            title: 'Login Failed',
            description:
              'Invalid credentials. Please check your email and password.',
          },
          404: {
            title: 'Service Unavailable',
            description: 'Login service not found. Please contact support.',
          },
          ...Object.fromEntries(
            Object.entries(CommonErrorMessages)
              .filter(([status]) => parseInt(status) >= 500)
              .map(([status, config]) => [
                status,
                {
                  ...config,
                  description: 'Server error. Please try again later.',
                },
              ]),
          ),
        },
      });

      // Re-throw the error so it can still be caught by the component if needed
      throw error;
    }
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
  try {
    await api.delete(ApiRoute.Logout);
    dropToken();
  } catch (error) {
    handleApiError(error, {
      dispatch,
      action: 'logout',
      defaultMessage: 'Logout failed. Please try again.',
      statusMessages: {
        404: {
          title: 'Service Unavailable',
          description: 'Logout service not found. Please contact support.',
        },
        ...Object.fromEntries(
          Object.entries(CommonErrorMessages)
            .filter(([status]) => parseInt(status) >= 500)
            .map(([status, config]) => [
              status,
              {
                ...config,
                description: 'Server error. Please try again later.',
              },
            ]),
        ),
      },
    });

    // Even if logout fails on server, we should still drop the token locally
    dropToken();

    // Re-throw the error so it can still be caught by the component if needed
    throw error;
  }
});
