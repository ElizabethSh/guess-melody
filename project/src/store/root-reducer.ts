import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../settings';

import { gameData } from './game/data/data';
import { gameProcess } from './game/process/process';
import { userProcessSlice } from './slices/user-process/user';

export const rootReducer = combineReducers({
  [NameSpace.Data]: gameData.reducer,
  [NameSpace.Game]: gameProcess.reducer,
  [NameSpace.User]: userProcessSlice.reducer,
});
