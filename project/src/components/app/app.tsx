import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import ArtistQuestion from '../../pages/question/artist';
import GenreQuestion from '../../pages/question/genre';
import Login from '../../pages/login';
import LoseScreen from '../../pages/result/lose';
import NotFoundPage from '../../pages/not-found';
import SuccessScreen from '../../pages/result/success';
import WelcomeScreen from '../../pages/welcome-screen';

import { AppRoute, AuthorizationStatus } from '../../settings';


type AppProps = {
  errorsCount: number,
  authorizationStatus: AuthorizationStatus
};


function App({errorsCount, authorizationStatus}: AppProps): JSX.Element {
  let routes = [
    <Route path={AppRoute.ROOT} key='root' element={<WelcomeScreen errorsCount={errorsCount} />} />,
    <Route path={AppRoute.ARTIST} key='artist-question' element={<ArtistQuestion />} />,
    <Route path={AppRoute.GENRE} key='genre-question' element={<GenreQuestion />} />,
    <Route path={AppRoute.LOSE} key='result-lose' element={<LoseScreen />} />,
    <Route path="*" key='not-found' element={<NotFoundPage />} />
  ];

  if (authorizationStatus === AuthorizationStatus.AUTH) {
    routes = routes.concat([
      <Route path={AppRoute.RESULT} key='result-win' element={<SuccessScreen />} />,
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
