import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';


// TODO: add lazy load
import GameScreen from '../../pages/game';
import Login from '../../pages/login';
import LoseScreen from '../../pages/result/lose';
import NotFoundPage from '../../pages/not-found';
import WelcomeScreen from '../../pages/welcome-screen';
import WinScreen from '../../pages/result/win';

import { AppRoute, AuthorizationStatus } from '../../settings';
import { useAppSelector } from '../../hooks';


type AppProps = {
  errorsCount: number;
};


function App({errorsCount}: AppProps): JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);

  let routes = [
    <Route path={AppRoute.ROOT} key='root' element={<WelcomeScreen errorsCount={errorsCount} />} />,
    <Route path={AppRoute.GAME} key='game' element={<GameScreen />} />,
    <Route path={AppRoute.LOSE} key='result-lose' element={<LoseScreen />} />,
    <Route path="*" key='not-found' element={<NotFoundPage />} />
  ];

  // FIXME: user don't have an access to the '/result' even if he is autorized
  if (authorizationStatus === AuthorizationStatus.AUTH) {
    routes = routes.concat([
      <Route path={AppRoute.RESULT} key='result-win' element={<WinScreen />} />,
      <Route path={AppRoute.LOGIN} key='login-navigate' element={<Navigate replace to={AppRoute.ROOT} />} />,
    ]);
  } else {
    routes = routes.concat([
      <Route path={AppRoute.LOGIN} key='login' element={<Login />} />,
      <Route path={AppRoute.RESULT} key='login-navigate' element={<Navigate replace to={AppRoute.LOGIN} />} />
    ]);
  }

  return (
    <BrowserRouter>
      <Routes>
        {routes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
