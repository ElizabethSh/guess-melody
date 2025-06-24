import { userProcessSlice } from './user';
import { UserProcess } from '../../../types/state';

import { checkAuthAction, loginAction, logoutAction } from '../../api-actions';
import { AuthorizationStatus } from '../../../settings';

describe('Reducer: user', () => {
  let state: UserProcess;

  beforeEach(() => {
    state = { authorizationStatus: AuthorizationStatus.Unknown, email: null };
  });

  it('without additional parameters should return initial state', () => {
    expect(
      userProcessSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' }),
    ).toEqual({
      authorizationStatus: AuthorizationStatus.Unknown,
      email: null,
    });
  });

  describe('checkAuthAction test', () => {
    it('should update authorizationStatus to "AUTH" if checkAuthAction fulfilled', () => {
      expect(
        userProcessSlice.reducer(state, {
          type: checkAuthAction.fulfilled.type,
        }),
      ).toEqual({ authorizationStatus: AuthorizationStatus.Auth });
    });
    it('should update authorizationStatus to "NO_AUTH" if checkAuthAction rejected', () => {
      expect(
        userProcessSlice.reducer(state, {
          type: checkAuthAction.rejected.type,
        }),
      ).toEqual({
        authorizationStatus: AuthorizationStatus.NoAuth,
        email: null,
      });
    });
  });

  describe('loginAction test', () => {
    it('should update authorizationStatus to "AUTH" if loginAction fulfilled', () => {
      expect(
        userProcessSlice.reducer(state, { type: loginAction.fulfilled.type }),
      ).toEqual({ authorizationStatus: AuthorizationStatus.Auth });
    });
    it('should update authorizationStatus to "NO_AUTH" if loginAction rejected', () => {
      expect(
        userProcessSlice.reducer(state, { type: loginAction.rejected.type }),
      ).toEqual({
        authorizationStatus: AuthorizationStatus.NoAuth,
        email: null,
      });
    });
  });

  describe('logoutAction test', () => {
    it('should update authorizationStatus to "NO_AUTH" if logoutAction fulfilled', () => {
      expect(
        userProcessSlice.reducer(state, { type: logoutAction.fulfilled.type }),
      ).toEqual({
        authorizationStatus: AuthorizationStatus.NoAuth,
        email: null,
      });
    });
  });
});
