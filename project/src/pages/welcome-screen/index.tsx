import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { AppRoute, AuthorizationStatus, MAX_ERRORS_COUNT } from '../../settings';
import { resetGame } from '../../store/game/process/process';
import { selectAuthorizationStatus } from '../../store/user-process/selectors';


const WelcomeScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  return (
    <section className="welcome">
      {/* TODO: add styles for Link */}
      {
        authorizationStatus !== AuthorizationStatus.Auth
          && <Link to={AppRoute.Login}>Login</Link>
      }
      <div className="welcome__logo">
        <img src="img/melody-logo.png" alt="Guess melody" width="186" height="83" />
      </div>
      <button
        className="welcome__button"
        onClick={() => {
          dispatch(resetGame());
          navigate(AppRoute.Game);
        }}
      >
        <span className="visually-hidden">Start the game</span>
      </button>
      <h2 className="welcome__rules-title">The rules of the game</h2>
      <p className="welcome__text">The rules are simple:</p>
      <ul className="welcome__rules-list">
        <li>You need to answer all the questions.</li>
        <li>You can make up to {MAX_ERRORS_COUNT} mistakes.</li>
      </ul>
      <p className="welcome__text">Good luck!</p>
    </section>
  );
};

export default WelcomeScreen;
