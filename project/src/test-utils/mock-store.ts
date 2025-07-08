import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@store/root-reducer';

import { State } from 'types/state';

export const createMockStore = (preloadedState: Partial<State> = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });
