import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/use-store';
import ErrorPage from '@pages/error';
import { AppRoute, AuthorizationStatus } from '@settings';
import { fetchQuestionAction } from '@store/api-actions';
import {
  selectLoadingDataError,
  selectLoadingDataStatus,
} from '@store/slices/data/data';
import { selectAuthorizationStatus } from '@store/slices/user/user';

import Loader from '../loader';

const GameScreen = React.lazy(() => import('@pages/game'));
const Login = React.lazy(() => import('@pages/login'));
const LoseScreen = React.lazy(() => import('@pages/result/lose'));
const NotFoundPage = React.lazy(() => import('@pages/not-found'));
const PrivateRoute = React.lazy(() => import('@components/private-route'));
const WelcomeScreen = React.lazy(() => import('@pages/welcome-screen'));
const WinScreen = React.lazy(() => import('@pages/result/win'));

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isLoadingData = useAppSelector(selectLoadingDataStatus);
  const isLoadingDataError = useAppSelector(selectLoadingDataError);

  if (
    authorizationStatus === AuthorizationStatus.Unknown ||
    (isLoadingData && !isLoadingDataError)
  ) {
    return <Loader />;
  }

  if (isLoadingDataError) {
    return <ErrorPage onButtonClick={() => dispatch(fetchQuestionAction())} />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path={AppRoute.Root} key="root" element={<WelcomeScreen />} />,
        <Route path={AppRoute.Login} key="login" element={<Login />} />,
        <Route
          path={AppRoute.Result}
          element={
            <PrivateRoute authorizationStatus={authorizationStatus}>
              <WinScreen />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Lose}
          key="result-lose"
          element={<LoseScreen />}
        />
        ,
        <Route path={AppRoute.Game} key="game" element={<GameScreen />} />,
        <Route path="*" key="not-found" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
