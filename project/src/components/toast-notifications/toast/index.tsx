import React from 'react';
import { useAppDispatch } from '@hooks/use-store';
import {
  circleCheck,
  circlePlus,
  closingCross,
  info as infoIcon,
} from '@icons';
import { removeNotification } from '@store/slices/notifications/notifications';

import { Notification } from 'types/notification';

import './toast.css';

const NOTIFICATION_ICONS = {
  error: circlePlus,
  success: circleCheck,
  info: infoIcon,
} as const;

export type ToastNotificationProps = {
  notification: Notification;
  index: number;
};

const ToastNotification: React.FC<ToastNotificationProps> = ({
  notification,
  index,
}) => {
  const dispatch = useAppDispatch();
  const { title, description, type } = notification;

  const closeNotification = (index: number): void => {
    dispatch(removeNotification(index));
  };

  return (
    <div
      className={`toast toast-${type}`}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {NOTIFICATION_ICONS[type]}
      <h6 className="toast-title">{title}</h6>
      <p className="toast-text">{description}</p>
      <button
        aria-label="Close notification"
        className="toast-close-button"
        onClick={() => closeNotification(index)}
        type="button"
      >
        {closingCross}
      </button>
    </div>
  );
};

export default ToastNotification;
