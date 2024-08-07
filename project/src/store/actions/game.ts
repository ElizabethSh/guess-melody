import { createAction } from '@reduxjs/toolkit';
import { AppRoute } from '../../settings';
import { AuthorizationStatus, Questions } from '../../types/question';

export const incrementMistakes = createAction('game/incrementMistakes');
export const incrementStep = createAction('game/incrementStep');
export const loadQuestions = createAction<Questions>('data/loadQuestions');
export const requireAuthorisation = createAction<AuthorizationStatus>('user/requireAuthorisation');
export const resetGame = createAction('game/reset');
export const setError = createAction<string>('data/setError');
export const clearError = createAction<string[]>('data/clearError');

export const redirectToRoute = createAction<AppRoute>('game/redirectToRoute');
