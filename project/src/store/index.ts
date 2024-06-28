import { configureStore } from '@reduxjs/toolkit';
import { createAPI } from './../servises/api';

import {reducer} from './reducers/reducer';

const api = createAPI();

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
      serializableCheck: false,
    }),
});

export default store;
