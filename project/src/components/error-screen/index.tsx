import React from 'react';
import Button from '@components/button';
import Layout from '@components/layout';

import './error-screen.css';

export type ErrorScreenProps = {
  message?: string;
  onRetry?: () => void;
};

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message = 'Something went wrong while loading the game.',
  onRetry,
}) => (
  <Layout className="error-screen" data-testid="error-screen">
    <h1 className="main__title">Oops! Something went wrong</h1>
    <p className="error-screen__text">{message}</p>

    <div className="error-screen__rules">
      <p className="error-screen__text">Here are a few things you can try:</p>
      <ul className="error-screen__rules-list">
        <li>Check your internet connection</li>
        <li>Refresh the page</li>
        <li>Try again in a few moments</li>
      </ul>
    </div>

    {onRetry && (
      <Button
        className="error-screen__button"
        label="Try Again"
        onClick={onRetry}
        type="button"
      />
    )}
  </Layout>
);

export default ErrorScreen;
