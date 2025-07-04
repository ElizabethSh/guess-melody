import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@store/root-reducer';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Notification } from 'types/notification';

import ToastNotification from '.';

describe('Toast Notification', () => {
  let store: ReturnType<typeof configureStore>;
  beforeEach(() => {
    const preloadedState = {};
    store = configureStore({ reducer: rootReducer, preloadedState });
  });

  it('should render success notification', () => {
    const notification: Notification = {
      id: 'success',
      title: 'Success',
      description: 'Operation completed successfully.',
      type: 'success',
    };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToastNotification notification={notification} index={0} />
        </MemoryRouter>
      </Provider>,
    );

    const toastNotification = screen.getByRole('status');

    expect(toastNotification).toBeVisible();
    expect(screen.getByRole('status')).toHaveClass('toast-success');
    expect(screen.getByText('Success')).toBeVisible();
    expect(screen.getByText('Operation completed successfully.')).toBeVisible();
  });

  it('should render error notification', () => {
    const notification: Notification = {
      id: 'error',
      title: 'Error',
      description: 'An error occurred.',
      type: 'error',
    };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToastNotification notification={notification} index={0} />
        </MemoryRouter>
      </Provider>,
    );

    const toastNotification = screen.getByRole('status');

    expect(toastNotification).toBeVisible();
    expect(screen.getByRole('status')).toHaveClass('toast-error');
    expect(screen.getByText('Error')).toBeVisible();
    expect(screen.getByText('An error occurred.')).toBeVisible();
  });

  it('should render info notification', () => {
    const notification: Notification = {
      id: 'info',
      title: 'Info',
      description: 'This is an informational message.',
      type: 'info',
    };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToastNotification notification={notification} index={0} />
        </MemoryRouter>
      </Provider>,
    );

    const toastNotification = screen.getByRole('status');

    expect(toastNotification).toBeVisible();
    expect(screen.getByRole('status')).toHaveClass('toast-info');
    expect(screen.getByText('Info')).toBeVisible();
    expect(screen.getByText('This is an informational message.')).toBeVisible();
  });

  it('should close notification when close button is clicked', async () => {
    const user = userEvent.setup();
    const notification: Notification = {
      id: 'info',
      title: 'Info toast',
      description: 'This notification will be closed.',
      type: 'info',
    };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ToastNotification notification={notification} index={0} />
        </MemoryRouter>
      </Provider>,
    );

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeVisible();
    expect(closeButton).toHaveAttribute('aria-label', 'Close notification');

    await user.click(closeButton);
    waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});
