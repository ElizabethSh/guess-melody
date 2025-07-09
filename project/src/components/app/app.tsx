import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRoute } from '@settings';

import Loader from '../loader';

const GameScreen = React.lazy(() => import('@pages/game'));
const LoginScreen = React.lazy(() => import('@pages/login'));
const LoseScreen = React.lazy(() => import('@pages/result/lose'));
const NotFoundScreen = React.lazy(() => import('@pages/not-found'));
const PrivateRoute = React.lazy(() => import('@components/private-route'));
const WelcomeScreen = React.lazy(() => import('@pages/welcome-screen'));
const WinScreen = React.lazy(() => import('@pages/result/win'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path={AppRoute.Root} key="root" element={<WelcomeScreen />} />
        <Route path={AppRoute.Login} key="login" element={<LoginScreen />} />
        <Route
          path={AppRoute.Result}
          element={
            <PrivateRoute>
              <WinScreen />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Lose}
          key="result-lose"
          element={<LoseScreen />}
        />
        <Route path={AppRoute.Game} key="game" element={<GameScreen />} />
        <Route path="*" key="not-found" element={<NotFoundScreen />} />
      </Routes>
    </Suspense>
  );
};

export default App;
