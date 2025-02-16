
import {createSlice} from '@reduxjs/toolkit';

import { fetchQuestionAction } from '../../api-actions';
import { NameSpace } from '../../../settings';
import { GameData } from '../../../types/state';

const initialState: GameData = {
  questions: [],
  isDataLoaded:false,
};

export const gameData = createSlice({
  name: NameSpace.Data,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchQuestionAction.pending, (state) => {
        state.isDataLoaded = true;
      })
      .addCase(fetchQuestionAction.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.isDataLoaded = false;
      });
  }
});
