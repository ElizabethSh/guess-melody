import { AuthorizationStatus } from '@settings';
import store from '@store/index';

import { Notification } from 'types/notification';

import { Questions } from './question';

export type GameData = {
  questions: Questions;
  isLoadingData: boolean;
  isError: boolean;
};

export type GameProcess = {
  mistakes: number;
  step: number;
};

export type NotificationsState = {
  notifications: Notification[];
  isHovered: boolean;
};

export type UserProcess = {
  authorizationStatus: AuthorizationStatus;
  email: string | null;
};

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
