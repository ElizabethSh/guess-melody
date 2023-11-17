import { createAction } from '@reduxjs/toolkit';

export const incrementMistakes = createAction('game/incrementMistakes');
export const incrementStep = createAction('game/incrementStep');
export const loadQuestions = createAction('data/loadQuestions');
export const resetGame = createAction('game/reset');
