import { createSlice } from '@reduxjs/toolkit';

import { fetchQuestionAction } from '../../api-actions';
import { NameSpace } from '../../../settings';
import { GameData, State } from '../../../types/state';

const initialState: GameData = {
  questions: [],
  isDataLoaded: false,
};

export const gameQuestionsSlice = createSlice({
  name: NameSpace.Data,
  initialState,
  reducers: {},
  selectors: {
    selectQuestions: (state) => state.questions,
    selectLoadedDataStatus: (state) => state.isDataLoaded,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchQuestionAction.pending, (state) => {
        state.isDataLoaded = true;
      })
      .addCase(fetchQuestionAction.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.isDataLoaded = false;
      });
  },
});

export const { selectQuestions, selectLoadedDataStatus } =
  gameQuestionsSlice.getSelectors(
    (state: State) => state[NameSpace.Data] || initialState,
  );
