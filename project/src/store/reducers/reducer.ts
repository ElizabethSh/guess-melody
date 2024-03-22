import { createReducer } from '@reduxjs/toolkit';

import {
  incrementMistakes,
  loadQuestions,
  incrementStep,
  resetGame,
  requireAuthorisation
} from './../actions/game';

import { AuthorizationStatus, FIRST_GAME_STEP } from './../../settings';
import { InitialState } from '../../types/state';

const STEP_GAP = 1;

const initialState: InitialState = {
  authorizationStatus: AuthorizationStatus.UNKNOWN,
  mistakesCount: 0,
  questions: [],
  step: FIRST_GAME_STEP
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
    });
});

export {reducer};
