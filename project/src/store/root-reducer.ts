import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../settings';

import { gameData } from './game/data/data';
import { gameProcess } from './game/process/process';
import { userProcessSlice } from './user-process/user-process';

export const rootReducer = combineReducers({
  [NameSpace.Data]: gameData.reducer,
  [NameSpace.Game]: gameProcess.reducer,
  [NameSpace.User]: userProcessSlice.reducer,
});
