import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@components/button';
import { useAppDispatch, useAppSelector } from '@hooks/use-store';
import { logo, user as userIcon } from '@icons';
import { AppRoute, AuthorizationStatus, MAX_ERRORS_COUNT } from '@settings';
import { logoutAction } from '@store/api-actions';
import { resetGame } from '@store/slices/game-process/game-process';
import {
  selectAuthorizationStatus,
  selectUserEmail,
} from '@store/slices/user/user';

import './welcome-screen.css';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const userEmail = useAppSelector(selectUserEmail);

  return (
    <section className="welcome">
      {authorizationStatus === AuthorizationStatus.Auth ? (
        <div className="welcome__user">
          {userIcon}
          <span className="welcome__email">{userEmail}</span>
          <Button
            className="welcome__logout"
            label="Log out"
            onClick={() => dispatch(logoutAction())}
            variant="secondary"
          />
        </div>
      ) : (
        <Link className="welcome__login link" to={AppRoute.Login}>
          Login
        </Link>
      )}
      <div className="welcome__logo" aria-label="App logo">
        {logo}
      </div>
      <button
        className="welcome__button"
        type="button"
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
