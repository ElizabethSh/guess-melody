import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@hooks/use-store';
import { circlePlus, closingCross } from '@icons';
import { CLEAR_MESSAGE_TIMEOUT } from '@settings';
import { clearError } from '@store/actions/game';

import './toast-notifications.css';

const ToastNotifications: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  // const errors = useAppSelector((state) => state.errors);
  const errors: string[] = [];
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timeoutID: ReturnType<typeof setTimeout>;

    if (!isHovered && errors.length) {
      timeoutID = setTimeout(() => {
        const errorMessagesCopy = errors.slice();
        errorMessagesCopy.shift();
        dispatch(clearError(errorMessagesCopy));
      }, CLEAR_MESSAGE_TIMEOUT);
    }

    return () => {
      clearTimeout(timeoutID);
    };
  }, [errors, isHovered, dispatch]);

  const closeErrorToast = (index: number): void => {
    const errorMessagesCopy = errors.slice();
    errorMessagesCopy.splice(index, 1);
    dispatch(clearError(errorMessagesCopy));
  };

  return (
    <div
      className="notifications-list"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {errors.map((error: string, index: number) => (
        <div className="toast" key={error}>
          {circlePlus}
          <p className="toast-text">{error}</p>
          <button
            className="toast-close-button"
            onClick={() => closeErrorToast(index)}
            type="button"
          >
            {closingCross}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotifications;
