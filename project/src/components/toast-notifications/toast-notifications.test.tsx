import { Provider } from 'react-redux';
import { CLEAR_MESSAGE_TIMEOUT } from '@settings';
import { addNotification } from '@store/slices/notifications/notifications';
import { createMockStore } from '@test-utils/mock-store';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { Notification } from 'types/notification';

import ToastNotifications from './index';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Success',
    description: 'Success message',
  },
  {
    id: '2',
    type: 'error',
    title: 'Error',
    description: 'Error message',
  },
  {
    id: '3',
    type: 'info',
    title: 'Info',
    description: 'Info message',
  },
];

describe('ToastNotifications', () => {
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockStore = createMockStore({
      NOTIFICATIONS: {
        notifications: [],
        isHovered: false,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <ToastNotifications />
      </Provider>,
    );
  };

  describe('Rendering and Accessibility', () => {
    it('should not render when there are no notifications', () => {
      renderComponent();

      expect(screen.queryByLabelText('Notifications')).not.toBeInTheDocument();
    });

    it('should render notifications list with proper attributes and ARIA', () => {
      mockStore.dispatch(addNotification(mockNotifications[0]));
      renderComponent();

      const notificationsList = screen.getByLabelText('Notifications');
      expect(notificationsList).toBeInTheDocument();
      expect(notificationsList).toHaveClass('notifications-list');
      expect(notificationsList).toHaveAttribute('aria-label', 'Notifications');
      expect(notificationsList).toHaveAttribute('aria-live', 'polite');
    });

    it('should render all notifications in the list', () => {
      mockNotifications.forEach((notification) => {
        mockStore.dispatch(addNotification(notification));
      });
      renderComponent();

      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  describe('Auto-dismiss functionality', () => {
    it('should automatically remove the first notification after timeout', () => {
      mockNotifications.forEach((notification) => {
        mockStore.dispatch(addNotification(notification));
      });
      renderComponent();

      // Verify all notifications are present
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(CLEAR_MESSAGE_TIMEOUT);
      });

      // First notification should be removed
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });

    it('should continue removing notifications until none remain', () => {
      mockStore.dispatch(addNotification(mockNotifications[0]));
      renderComponent();

      expect(screen.getByText('Success message')).toBeInTheDocument();

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(CLEAR_MESSAGE_TIMEOUT);
      });

      // Component should not render when no notifications remain
      expect(screen.queryByLabelText('Notifications')).not.toBeInTheDocument();
    });

    it('should not auto-dismiss when notifications list is hovered', () => {
      // Set the store to hovered state first
      mockStore = createMockStore({
        NOTIFICATIONS: {
          notifications: [],
          isHovered: true,
        },
      });

      mockStore.dispatch(addNotification(mockNotifications[0]));
      renderComponent();

      expect(screen.getByText('Success message')).toBeInTheDocument();

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(CLEAR_MESSAGE_TIMEOUT);
      });

      // Notification should still be present
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  describe('Hover interactions', () => {
    it('should handle mouse enter/leave events and update hover state', () => {
      mockStore.dispatch(addNotification(mockNotifications[0]));
      renderComponent();

      const notificationsList = screen.getByLabelText('Notifications');

      // Test mouse enter
      fireEvent.mouseEnter(notificationsList);
      expect(mockStore.getState().NOTIFICATIONS.isHovered).toBe(true);

      // Test mouse leave
      fireEvent.mouseLeave(notificationsList);
      expect(mockStore.getState().NOTIFICATIONS.isHovered).toBe(false);
    });

    it('should pause auto-dismiss during hover and resume after unhover', () => {
      mockNotifications.forEach((notification) => {
        mockStore.dispatch(addNotification(notification));
      });
      renderComponent();

      const notificationsList = screen.getByLabelText('Notifications');

      // Hover over notifications
      fireEvent.mouseEnter(notificationsList);

      // Fast-forward time while hovered
      act(() => {
        vi.advanceTimersByTime(CLEAR_MESSAGE_TIMEOUT);
      });

      // All notifications should still be present
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();

      // Unhover
      fireEvent.mouseLeave(notificationsList);

      // Fast-forward time after unhover
      act(() => {
        vi.advanceTimersByTime(CLEAR_MESSAGE_TIMEOUT);
      });

      // First notification should now be removed
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  describe('Timer cleanup', () => {
    it('should clear timeout when component unmounts', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      mockStore.dispatch(addNotification(mockNotifications[0]));

      const { unmount } = renderComponent();

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should clear previous timeout when notifications change', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      mockStore.dispatch(addNotification(mockNotifications[0]));

      renderComponent();

      // Add another notification to trigger effect re-run
      act(() => {
        mockStore.dispatch(addNotification(mockNotifications[1]));
      });

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid notification additions gracefully', () => {
      renderComponent();

      // Rapidly add multiple notifications
      act(() => {
        mockNotifications.forEach((notification) => {
          mockStore.dispatch(addNotification(notification));
        });
      });

      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });
});
