import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './components/app/app';

import { AuthorizationStatus, MAX_ERRORS_COUNT } from './settings';
import store from './store';
import { fetchQuestionAction, checkAuthAction } from './store/actions/api-actions';

store.dispatch(fetchQuestionAction());
store.dispatch(checkAuthAction())


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App
        authorizationStatus={AuthorizationStatus.AUTH}
        errorsCount={MAX_ERRORS_COUNT}
      />
    </Provider>
  </React.StrictMode>
);
