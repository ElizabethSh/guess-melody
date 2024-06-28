import store from '../store';
import { Questions } from './question';

export type InitialState = {
  authorizationStatus: string,
  errors: string[],
  mistakesCount: number
  questions: Questions,
  step: number
};


export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
