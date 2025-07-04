import React from 'react';
import { useAppDispatch } from '@hooks/use-store';
import { removeNotification } from '@store/slices/notifications/notifications';
import { circleCheck, circlePlus, closingCross, info as infoIcon } from 'icons';

import { Notification } from 'types/notification';

import './toast.css';

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

  const icon = {
    error: circlePlus,
    success: circleCheck,
    info: infoIcon,
  };

  const closeNotification = (index: number): void => {
    dispatch(removeNotification(index));
  };

  return (
    <div className={`toast toast-${type}`} role="status">
      {icon[type]}
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
