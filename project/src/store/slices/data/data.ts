import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '@settings';
import { fetchQuestionAction } from '@store/api-actions';

import { GameData, State } from 'types/state';

const initialState: GameData = {
  questions: [],
  isLoadingData: false,
  isError: false,
};

export const gameQuestionsSlice = createSlice({
  name: NameSpace.Data,
  initialState,
  reducers: {},
  selectors: {
    selectQuestions: (state) => state.questions,
    selectLoadingDataStatus: (state) => state.isLoadingData,
    selectLoadingDataError: (state) => state.isError,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchQuestionAction.pending, (state) => {
        state.isLoadingData = true;
      })
      .addCase(fetchQuestionAction.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.isLoadingData = false;
        state.isError = false;
      })
      .addCase(fetchQuestionAction.rejected, (state) => {
        state.questions = initialState.questions;
        state.isLoadingData = false;
        state.isError = true;
      });
  },
});

export const {
  selectQuestions,
  selectLoadingDataStatus,
  selectLoadingDataError,
} = gameQuestionsSlice.getSelectors(
  (state: State) => state[NameSpace.Data] || initialState,
);
