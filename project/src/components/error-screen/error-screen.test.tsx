import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ErrorScreen from './index';

describe('ErrorScreen', () => {
  const user = userEvent.setup();

  const renderErrorScreen = (props = {}) => {
    return render(
      <MemoryRouter>
        <ErrorScreen {...props} />
      </MemoryRouter>,
    );
  };

  it('renders default error screen with default message', () => {
    renderErrorScreen();

    expect(screen.getByTestId('error-screen')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Oops! Something went wrong' }),
    ).toBeVisible();
    expect(
      screen.getByText('Something went wrong while loading the game.'),
    ).toBeVisible();
    expect(
      screen.getByText('Here are a few things you can try:'),
    ).toBeVisible();
    expect(screen.getByText('Check your internet connection')).toBeVisible();
    expect(screen.getByText('Refresh the page')).toBeVisible();
    expect(screen.getByText('Try again in a few moments')).toBeVisible();
  });

  it('renders with custom error message', () => {
    const customMessage = 'Custom error message for testing';
    renderErrorScreen({ message: customMessage });

    expect(screen.getByText(customMessage)).toBeVisible();
    expect(
      screen.queryByText('Something went wrong while loading the game.'),
    ).not.toBeInTheDocument();
  });

  it('renders retry button when onRetry callback is provided', () => {
    const onRetryMock = vi.fn();
    renderErrorScreen({ onRetry: onRetryMock });

    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    expect(retryButton).toBeVisible();
    expect(retryButton).toBeEnabled();
  });

  it('does not render retry button when onRetry callback is not provided', () => {
    renderErrorScreen();

    expect(
      screen.queryByRole('button', { name: /Try Again/i }),
    ).not.toBeInTheDocument();
  });

  it('calls onRetry callback when retry button is clicked', async () => {
    const onRetryMock = vi.fn();
    renderErrorScreen({ onRetry: onRetryMock });

    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    await user.click(retryButton);

    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('renders logo component', () => {
    renderErrorScreen();

    // Logo should be rendered as part of the ErrorScreen (as SVG since we're on root path)
    expect(document.querySelector('.game__logo')).toBeInTheDocument();
  });

  it('renders layout with showLogo set to false', () => {
    renderErrorScreen();

    // Check that the layout structure is present
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders all troubleshooting steps', () => {
    renderErrorScreen();

    const troubleshootingSteps = [
      'Check your internet connection',
      'Refresh the page',
      'Try again in a few moments',
    ];

    troubleshootingSteps.forEach((step) => {
      expect(screen.getByText(step)).toBeVisible();
    });
  });

  it('renders with both custom message and retry handler', async () => {
    const customMessage = 'Network connection failed';
    const onRetryMock = vi.fn();

    renderErrorScreen({ message: customMessage, onRetry: onRetryMock });

    expect(screen.getByText(customMessage)).toBeVisible();
    const retryButton = screen.getByRole('button', { name: /Try Again/i });

    await user.click(retryButton);
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    renderErrorScreen();

    const errorScreen = screen.getByTestId('error-screen');
    expect(errorScreen).toHaveClass('error-screen');

    const title = screen.getByText('Oops! Something went wrong');
    expect(title).toHaveClass('main__title');

    const message = screen.getByText(
      'Something went wrong while loading the game.',
    );
    expect(message).toHaveClass('error-screen__text');

    const rules = screen.getByText('Here are a few things you can try:');
    expect(rules).toHaveClass('error-screen__text');

    const rulesList = screen.getByRole('list');
    expect(rulesList).toHaveClass('error-screen__rules-list');
  });
});
