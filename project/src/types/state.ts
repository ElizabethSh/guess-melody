import { AuthorizationStatus } from '../settings';
import store from '../store';
import { Questions } from './question';

export type InitialState = {
  authorizationStatus: AuthorizationStatus.Auth | AuthorizationStatus.NoAuth | AuthorizationStatus.Unknown,
  errors: string[],
  isDataLoaded: boolean
  mistakesCount: number
  questions: Questions,
  step: number,
};


export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
