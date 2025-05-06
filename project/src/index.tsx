import React from 'react';
import {createRoot} from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './components/app/app';
// import ToastNotifications from './components/toast-notifications';

import store from './store';
import { fetchQuestionAction, checkAuthAction } from './store/api-actions';

store.dispatch(fetchQuestionAction());
store.dispatch(checkAuthAction());


const root = createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <ToastNotifications /> */}
      <App />
    </Provider>
  </React.StrictMode>
);
