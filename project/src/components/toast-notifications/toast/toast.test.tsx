import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Notification } from 'types/notification';

import ToastNotification from '.';

describe('ToastNotification', () => {
  const renderToastNotification = (notification: Notification, index = 0) => {
    const store = createMockStore();
    return {
      store,
      ...render(
        <Provider store={store}>
          <MemoryRouter>
            <ToastNotification notification={notification} index={index} />
          </MemoryRouter>
        </Provider>,
      ),
    };
  };

  const createNotificationPayload = (
    type: Notification['type'],
    overrides: Partial<Notification> = {},
  ): Notification => {
    const baseNotifications = {
      success: {
        id: `success-${Date.now()}`,
        title: 'Success',
        description: 'Operation completed successfully.',
        type: 'success' as const,
      },
      error: {
        id: `error-${Date.now()}`,
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        type: 'error' as const,
      },
      info: {
        id: `info-${Date.now()}`,
        title: 'Information',
        description: 'Here is some useful information.',
        type: 'info' as const,
      },
    };

    return {
      ...baseNotifications[type],
      ...overrides,
    };
  };

  describe('Rendering', () => {
    it('should render success notification with correct attributes and icon', () => {
      const notification = createNotificationPayload('success', {
        title: 'Operation Successful',
        description: 'Your action was completed successfully.',
      });
      renderToastNotification(notification);

      const toast = screen.getByRole('status');
      expect(toast).toBeVisible();
      expect(toast).toHaveClass('toast', 'toast-success');
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('role', 'status');

      expect(screen.getByText('Operation Successful')).toBeVisible();
      expect(
        screen.getByText('Your action was completed successfully.'),
      ).toBeVisible();
      expect(
        screen.getByRole('button', { name: 'Close notification' }),
      ).toBeVisible();

      // Check that success icon is rendered
      expect(document.querySelector('.circle-check')).toBeInTheDocument();
    });

    it('should render error notification with assertive aria-live and correct icon', () => {
      const notification = createNotificationPayload('error');
      renderToastNotification(notification);

      const toast = screen.getByRole('alert');
      expect(toast).toBeVisible();
      expect(toast).toHaveClass('toast', 'toast-error');
      expect(toast).toHaveAttribute('aria-live', 'assertive');
      expect(toast).toHaveAttribute('role', 'alert');

      expect(screen.getByText('Error')).toBeVisible();
      expect(
        screen.getByText('Something went wrong. Please try again.'),
      ).toBeVisible();

      // Check that error icon is rendered
      expect(document.querySelector('.circle-plus')).toBeInTheDocument();
    });

    it('should render info notification with polite aria-live and correct icon', () => {
      const notification = createNotificationPayload('info');
      renderToastNotification(notification);

      const toast = screen.getByRole('status');
      expect(toast).toBeVisible();
      expect(toast).toHaveClass('toast', 'toast-info');
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('role', 'status');

      expect(screen.getByText('Information')).toBeVisible();
      expect(
        screen.getByText('Here is some useful information.'),
      ).toBeVisible();

      // Check that info icon is rendered
      expect(document.querySelector('.info')).toBeInTheDocument();
    });

    it('should have proper semantic HTML structure', () => {
      const notification = createNotificationPayload('success', {
        title: 'Test Title',
        description: 'Test Description',
      });
      renderToastNotification(notification);

      // Check proper heading structure
      const title = screen.getByRole('heading', {
        name: 'Test Title',
        level: 6,
      });
      expect(title).toHaveClass('toast-title');

      // Check description is in a paragraph
      const description = screen.getByText('Test Description');
      expect(description).toHaveClass('toast-text');
    });
  });

  describe('User Interactions', () => {
    it('should handle close button interactions and dispatch removeNotification action', async () => {
      const user = userEvent.setup();
      const notification = createNotificationPayload('info');
      const testIndex = 2;

      // Create a store with a spy on dispatch
      const store = createMockStore();
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      render(
        <Provider store={store}>
          <MemoryRouter>
            <ToastNotification notification={notification} index={testIndex} />
          </MemoryRouter>
        </Provider>,
      );

      const closeButton = screen.getByRole('button', {
        name: 'Close notification',
      });
      const toast = screen.getByRole('status');

      // Verify button properties and notification is visible
      expect(closeButton).toBeVisible();
      expect(closeButton).toHaveAttribute('type', 'button');
      expect(toast).toBeVisible();

      await user.click(closeButton);
      // Verify the removeNotification action was dispatched with correct index
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'NOTIFICATIONS/removeNotification',
        payload: testIndex,
      });

      dispatchSpy.mockRestore();
    });
  });
});
