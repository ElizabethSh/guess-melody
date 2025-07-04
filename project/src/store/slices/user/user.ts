import { createSlice } from '@reduxjs/toolkit';
import { AuthorizationStatus, NameSpace } from '@settings';
import { checkAuthAction, loginAction, logoutAction } from '@store/api-actions';

import { State, UserProcess } from 'types/state';

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
        state.authorizationStatus = action.payload.status;
        state.email = action.payload.email;
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
