import {combineReducers} from '@reduxjs/toolkit';
import {NameSpace} from '../settings';

import { gameData } from './game/slices/data';
import { gameProcess } from './game/slices/process';
import { userProcess } from './user-process/slice';

export const rootReducer = combineReducers({
  [NameSpace.Data]: gameData.reducer,
  [NameSpace.Game]: gameProcess.reducer,
  [NameSpace.User]: userProcess.reducer,
});
