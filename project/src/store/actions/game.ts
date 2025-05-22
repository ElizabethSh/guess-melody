import { createAction } from '@reduxjs/toolkit';
import { AppRoute } from '../../settings';
import { AuthorizationStatus } from '../../types/user';

export const incrementMistakes = createAction('game/incrementMistakes');
export const requireAuthorisation = createAction<AuthorizationStatus>(
  'user/requireAuthorisation',
);
export const setError = createAction<string>('data/setError');
export const clearError = createAction<string[]>('data/clearError');

export const redirectToRoute = createAction<AppRoute>('game/redirectToRoute');
