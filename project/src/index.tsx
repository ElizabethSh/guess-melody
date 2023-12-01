import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './components/app/app';

import { AuthorizationStatus, MAX_ERRORS_COUNT } from './settings';
import store from './store';
import { fetchQuestionAction } from './store/actions/api-actions';

store.dispatch(fetchQuestionAction());


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
