import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '@components/app/app';
import { checkAuthAction, fetchQuestionAction } from '@store/api-actions';

// import ToastNotifications from './components/toast-notifications';
import store from './store';

import './styles.css';

store.dispatch(fetchQuestionAction());
store.dispatch(checkAuthAction());

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        {/* <ToastNotifications /> */}
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
