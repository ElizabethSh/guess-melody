import { createSlice } from '@reduxjs/toolkit';

import { AuthorizationStatus, NameSpace } from '../../../settings';
import { State, UserProcess } from '../../../types/state';
import { checkAuthAction, loginAction, logoutAction } from '../../api-actions';

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
  email: null,
};

export const userProcessSlice = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {},
  selectors: {
    selectAuthorizationStatus: (state) => state.authorizationStatus,
    selectUserEmail: (state) => state.email,
  },
  extraReducers(builder) {
    builder
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.email = action.payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.email = null;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.email = action.payload;
      })
      .addCase(loginAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.email = null;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.email = null;
      });
  },
});

export const { selectAuthorizationStatus, selectUserEmail } =
  userProcessSlice.getSelectors(
    (state: State) => state[NameSpace.User] || initialState,
  );
