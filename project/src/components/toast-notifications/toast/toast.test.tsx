import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Notification } from 'types/notification';

import ToastNotification from '.';

describe('Toast Notification', () => {
  const renderToastNotification = (notification: Notification, index = 0) => {
    return render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <ToastNotification notification={notification} index={index} />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should render success notification', () => {
    const notification: Notification = {
      id: 'success',
      title: 'Success',
      description: 'Operation completed successfully.',
      type: 'success',
    };
    renderToastNotification(notification);

    const toastNotification = screen.getByRole('status');
    expect(toastNotification).toBeVisible();
    expect(toastNotification).toHaveClass('toast', 'toast-success');
    expect(toastNotification).toHaveAttribute('aria-live', 'polite');
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
    renderToastNotification(notification);

    const toastNotification = screen.getByRole('alert');
    expect(toastNotification).toBeVisible();
    expect(toastNotification).toHaveClass('toast', 'toast-error');
    expect(toastNotification).toHaveAttribute('aria-live', 'assertive');
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
    renderToastNotification(notification);

    const toastNotification = screen.getByRole('status');
    expect(toastNotification).toBeVisible();
    expect(toastNotification).toHaveClass('toast', 'toast-info');
    expect(toastNotification).toHaveAttribute('aria-live', 'polite');
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
    renderToastNotification(notification);

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeVisible();
    expect(closeButton).toHaveAttribute('aria-label', 'Close notification');

    await user.click(closeButton);
    waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});
