import { createReducer } from '@reduxjs/toolkit';

import {
  incrementMistakes,
  loadQuestions,
  incrementStep,
  resetGame,
  requireAuthorisation,
  setError,
  clearError,
} from './../actions/game';

import { AuthorizationStatus, FIRST_GAME_STEP } from './../../settings';
import { InitialState } from '../../types/state';

const STEP_GAP = 1;

const initialState: InitialState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  errors: [],
  isDataLoaded: false,
  mistakesCount: 0,
  questions: [],
  step: FIRST_GAME_STEP,
};

const reducer = createReducer(initialState, (builder) => {

  builder
    .addCase(incrementStep, (state) => {
      state.step = state.step + STEP_GAP;
    })
    .addCase(resetGame, (state) => {
      state.mistakesCount = 0;
      state.step = FIRST_GAME_STEP;
    })
    .addCase(incrementMistakes, (state) => {
      state.mistakesCount = state.mistakesCount + 1;
    })
    .addCase(loadQuestions, (state, action) => {
      state.questions = action.payload;
    })
    .addCase(requireAuthorisation, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setError, (state, action) => {
      const errorsCopy = state.errors.slice();
      errorsCopy.push(action.payload);
      state.errors = errorsCopy;
    })
    .addCase(clearError, (state, action) => {
      state.errors = action.payload;
    });
});

export {reducer};
