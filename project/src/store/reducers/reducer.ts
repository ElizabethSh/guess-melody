import { createReducer } from "@reduxjs/toolkit";
import { incrementStep, resetGame } from "../actions/game";

import { FIRST_GAME_STEP } from './../../settings';

const STEP_GAP = 1;

const initialState = {
  mistakesCount: 0,
  step: FIRST_GAME_STEP
};

const reducer = createReducer(initialState, (builder) => {

  builder
  .addCase(incrementStep, (state) => {
      console.log('builder');
      state.step = state.step + STEP_GAP;
    })
    .addCase(resetGame, (state) => {
      state.mistakesCount = 0;
      state.step = FIRST_GAME_STEP;
    })
});

export {reducer};
