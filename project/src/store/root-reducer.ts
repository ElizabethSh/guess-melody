import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../settings';

import { gameQuestionsSlice } from './slices/data/data';
import { gameProcess } from './game/process/process';
import { userProcessSlice } from './slices/user/user';

export const rootReducer = combineReducers({
  [NameSpace.Data]: gameQuestionsSlice.reducer,
  [NameSpace.Game]: gameProcess.reducer,
  [NameSpace.User]: userProcessSlice.reducer,
});
