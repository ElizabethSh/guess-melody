import { createAction } from '@reduxjs/toolkit';

export const setError = createAction<string>('data/setError');
export const clearError = createAction<string[]>('data/clearError');
