import { addNotification } from '@store/slices/notifications/notifications';
import { isAxiosError } from 'axios';

import { AppDispatch } from 'types/state';

export type ErrorHandlingConfig = {
  dispatch: AppDispatch;
  action: string;
  defaultMessage: string;
  statusMessages?: {
    [statusCode: number]: {
      title?: string;
      description: string;
      type?: 'error' | 'success' | 'info';
    };
  };
};

/**
 * Handles API errors consistently across all async actions
 * @param error - The error to handle
 * @param config - Configuration for error handling
 */
export const handleApiError = (
  error: unknown,
  config: ErrorHandlingConfig,
): void => {
  if (!isAxiosError(error)) {
    return;
  }

  const { dispatch, action, defaultMessage, statusMessages = {} } = config;
  const status = error.response?.status;

  // Get specific message or use default
  const errorConfig = status ? statusMessages[status] : undefined;
  const title = errorConfig?.title || 'Error';
  const description = errorConfig?.description || defaultMessage;
  const type = errorConfig?.type || 'error';

  dispatch(
    addNotification({
      id: `${action}-${crypto.randomUUID()}`,
      title,
      description,
      type,
    }),
  );
};

/**
 * Common error messages for different HTTP status codes
 */
export const CommonErrorMessages = {
  401: {
    title: 'Unauthorized',
    description: 'Your session has expired. Please log in again.',
    type: 'info' as const,
  },
  403: {
    title: 'Access Denied',
    description: 'You do not have permission to perform this action.',
    type: 'error' as const,
  },
  404: {
    title: 'Not Found',
    description: 'The requested resource was not found.',
    type: 'error' as const,
  },
  500: {
    title: 'Server Error',
    description: 'A server error occurred. Please try again later.',
    type: 'error' as const,
  },
  503: {
    title: 'Service Unavailable',
    description:
      'The service is temporarily unavailable. Please try again later.',
    type: 'error' as const,
  },
} as const;

/**
 * Creates error messages for status codes >= 500
 */
export const getServerErrorMessage = () => CommonErrorMessages[500];

/**
 * Helper to get server status messages (≥500) with optional custom description
 * @param customDescription - Optional custom description for server errors
 * @returns Object with server status codes and their messages
 */
export const getServerStatusMessages = (customDescription?: string) => {
  return Object.fromEntries(
    Object.entries(CommonErrorMessages)
      .filter(([status]) => parseInt(status) >= 500)
      .map(([status, config]) => [
        status,
        {
          ...config,
          description: customDescription || config.description,
        },
      ]),
  );
};
