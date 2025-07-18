import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '@settings';

import { gameQuestionsSlice } from './slices/data/data';
import { gameProcessSlice } from './slices/game-process/game-process';
import { notificationsSlice } from './slices/notifications/notifications';
import { userProcessSlice } from './slices/user/user';

export const rootReducer = combineReducers({
  [NameSpace.Data]: gameQuestionsSlice.reducer,
  [NameSpace.Game]: gameProcessSlice.reducer,
  [NameSpace.Notifications]: notificationsSlice.reducer,
  [NameSpace.User]: userProcessSlice.reducer,
});
