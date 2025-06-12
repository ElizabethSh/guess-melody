import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppRoute, AuthorizationStatus } from '../../settings';
import { useAppSelector } from '../../hooks';
import Loader from '../loader';
import { selectAuthorizationStatus } from '../../store/slices/user/user';
import { selectLoadedDataStatus } from '../../store/slices/data/data';

const GameScreen = React.lazy(() => import('../../pages/game'));
const Login = React.lazy(() => import('../../pages/login'));
const LoseScreen = React.lazy(() => import('../../pages/result/lose'));
const NotFoundPage = React.lazy(() => import('../../pages/not-found'));
const PrivateRoute = React.lazy(() => import('../private-route'));
const WelcomeScreen = React.lazy(() => import('../../pages/welcome-screen'));
const WinScreen = React.lazy(() => import('../../pages/result/win'));

const App: React.FC = () => {
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isDataLoaded = useAppSelector(selectLoadedDataStatus);

  if (authorizationStatus === AuthorizationStatus.Unknown || isDataLoaded) {
    return <Loader />;
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
