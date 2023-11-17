import { createReducer } from '@reduxjs/toolkit';
import { questions } from '../../mocks/questions';

import {
  incrementMistakes,
  loadQuestions,
  incrementStep,
  resetGame
} from './../actions/game';

import { FIRST_GAME_STEP } from './../../settings';

const STEP_GAP = 1;

const initialState = {
  mistakesCount: 0,
  questions,
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
    });
});

export {reducer};
