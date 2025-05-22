import { AuthorizationStatus as AuthStatus } from '../settings';

export type AuthorizationStatus = AuthStatus;

export type AuthData = {
  login: string;
  password: string;
};

export type UserData = {
  id: number;
  email: string;
  token: string;
};
