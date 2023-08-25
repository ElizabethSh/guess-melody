import { createReducer } from "@reduxjs/toolkit";
import { incrementStep } from "../actions/game";

import { FIRST_GAME_STEP } from './../../settings';

const STEP_GAP = 1;

const initialState = {
  mistakes: 0,
  step: FIRST_GAME_STEP
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(incrementStep, (state) => {
      state.step = state.step + STEP_GAP;
    })
});

export {reducer};
