import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/use-store';
import { CLEAR_MESSAGE_TIMEOUT } from '@settings';
import {
  removeNotification,
  selectIsHovered,
  selectNotifications,
  setIsHovered,
} from '@store/slices/notifications/notifications';

import ToastNotification from './toast';

import './toast-notifications.css';

const ToastNotifications: React.FC = (): React.ReactElement | null => {
  const notifications = useAppSelector(selectNotifications);
  const isHovered = useAppSelector(selectIsHovered);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timeoutID: ReturnType<typeof setTimeout> | null = null;

    // Auto-dismiss the oldest notification if not hovered
    if (!isHovered && notifications.length) {
      timeoutID = setTimeout(() => {
        // Always remove the first notification (oldest)
        dispatch(removeNotification(0));
      }, CLEAR_MESSAGE_TIMEOUT);
    }

    return () => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    };
  }, [notifications, isHovered, dispatch]);

  // Early return for better performance
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className="notifications-list"
      aria-label="Notifications"
      aria-live="polite"
      onMouseEnter={() => dispatch(setIsHovered(true))}
      onMouseLeave={() => dispatch(setIsHovered(false))}
    >
      {notifications.map((notification, index) => (
        <ToastNotification
          key={notification.id}
          index={index}
          notification={notification}
        />
      ))}
    </div>
  );
};

export default ToastNotifications;
