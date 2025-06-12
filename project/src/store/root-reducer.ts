import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../settings';

import { gameQuestionsSlice } from './slices/data/data';

import { userProcessSlice } from './slices/user/user';
import { gameProcessSlice } from './slices/game-process/game-process';

export const rootReducer = combineReducers({
  [NameSpace.Data]: gameQuestionsSlice.reducer,
  [NameSpace.Game]: gameProcessSlice.reducer,
  [NameSpace.User]: userProcessSlice.reducer,
});
