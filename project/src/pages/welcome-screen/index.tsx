import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { AppRoute, AuthorizationStatus, MAX_ERRORS_COUNT } from '../../settings';
import { resetGame } from '../../store/game/process/process';
import { selectAuthorizationStatus } from '../../store/user-process/selectors';
import { user as userIcon } from '../../icons';
import { logoutAction } from '../../store/api-actions';

import './welcome-screen.css';


const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  return (
    <section className="welcome">
      {
        authorizationStatus === AuthorizationStatus.Auth
          ? (
            <div className='welcome__user'>
              {userIcon}
              {/* TODO: add e-mail instead of logged in */}
              <span className='welcome__email'>Logged in</span>
              <button
                className='welcome__logout button'
                onClick={() => dispatch(logoutAction())}
                type='button'
              >
                Log out
              </button>
            </div>)
          : <Link className='welcome__login button' to={AppRoute.Login}>Login</Link>
      }
      <div className="welcome__logo">
        <img src="img/melody-logo.png" alt="Guess melody logo" width="186" height="83" />
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
