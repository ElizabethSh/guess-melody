import React, { useCallback } from 'react';
import ErrorScreen from '@components/error-screen';
import Loader from '@components/loader';
import { useAppDispatch, useAppSelector } from '@hooks/use-store';
import { AuthorizationStatus } from '@settings';
import { fetchQuestionAction } from '@store/api-actions';
import {
  selectLoadingDataError,
  selectLoadingDataStatus,
  selectQuestions,
} from '@store/slices/data/data';
import { selectAuthorizationStatus } from '@store/slices/user/user';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectLoadingDataStatus);
  const hasError = useAppSelector(selectLoadingDataError);
  const questions = useAppSelector(selectQuestions);
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const handleRetry = useCallback(() => {
    dispatch(fetchQuestionAction());
  }, [dispatch]);

  // Show loading screen while fetching data
  if (
    authorizationStatus === AuthorizationStatus.Unknown ||
    (isLoading && !hasError)
  ) {
    return <Loader />;
  }

  // Show error screen if there was an error
  if (hasError) {
    return (
      <ErrorScreen
        message="Failed to load game questions. Please check your internet connection and try again."
        onRetry={handleRetry}
      />
    );
  }

  // Show error screen if no questions were loaded
  if (!isLoading && !hasError && questions.length === 0) {
    return (
      <ErrorScreen
        message="No game questions available. Please try again later."
        onRetry={handleRetry}
      />
    );
  }

  // Render the app if everything is loaded successfully
  return <>{children}</>;
};

export default AppInitializer;
