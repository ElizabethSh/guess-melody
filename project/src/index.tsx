import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '@components/app/app';
import AppInitializer from '@components/app-initializer';
import ToastNotifications from '@components/toast-notifications';

import store from './store';

import './styles.css';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppInitializer>
          <App />
          <ToastNotifications />
        </AppInitializer>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
