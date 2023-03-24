import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/app/app';

import { AuthorizationStatus, MAX_ERRORS_COUNT } from './settings';
import {questions} from './mocks/questions';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <App
      authorizationStatus={AuthorizationStatus.AUTH}
      errorsCount={MAX_ERRORS_COUNT}
      questions={questions}
    />
  </React.StrictMode>,
);
