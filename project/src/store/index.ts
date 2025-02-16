import { configureStore } from '@reduxjs/toolkit';
import { createAPI } from './../servises/api';
import { rootReducer } from './root-reducer';

const api = createAPI();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
      serializableCheck: false,
    }),
});

export default store;
