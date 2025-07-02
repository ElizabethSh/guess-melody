import { createSlice } from '@reduxjs/toolkit';

import { FIRST_GAME_STEP, NameSpace } from '../../../settings';
import { GameProcess, State } from '../../../types/state';
import { isAnswerCorrect } from '../../../utils';

const initialState: GameProcess = {
  mistakes: 0,
  step: FIRST_GAME_STEP,
};

const STEP_COUNT = 1;

export const gameProcessSlice = createSlice({
  name: NameSpace.Game,
  initialState,
  reducers: {
    incrementStep: (state) => {
      state.step = state.step + STEP_COUNT;
    },
    checkUserAnswer: (state, action) => {
      const { question, userAnswer } = action.payload;
      state.mistakes += Number(!isAnswerCorrect(question, userAnswer));
    },
    resetGame: (state) => {
      state.mistakes = 0;
      state.step = FIRST_GAME_STEP;
    },
  },
  selectors: {
    selectMistakeCount: (state) => state.mistakes,
    selectStep: (state) => state.step,
  },
});

export const { selectMistakeCount, selectStep } = gameProcessSlice.getSelectors(
  (state: State) => state[NameSpace.Game] || initialState,
);

export const { incrementStep, checkUserAnswer, resetGame } =
  gameProcessSlice.actions;
