import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { AppRoute, AuthorizationStatus } from '../../settings';
import { resetGame } from '../../store/actions/game';

type WelcomeScreenProps = {
  errorsCount: number
};


const WelcomeScreen = ({errorsCount}: WelcomeScreenProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);

  return (
    <section className="welcome">
      {/* TODO: add styles for Link */}
      {
        authorizationStatus !== AuthorizationStatus.AUTH
          && <Link to={AppRoute.LOGIN}>Login</Link>
      }
      <div className="welcome__logo">
        <img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83" />
      </div>
      <button
        className="welcome__button"
        onClick={() => {
          dispatch(resetGame());
          navigate(AppRoute.GAME);
        }}
      >
        <span className="visually-hidden">Начать игру</span>
      </button>
      <h2 className="welcome__rules-title">Правила игры</h2>
      <p className="welcome__text">Правила просты:</p>
      <ul className="welcome__rules-list">
        <li>Нужно ответить на все вопросы.</li>
        <li>Можно допустить {errorsCount} ошибки.</li>
      </ul>
      <p className="welcome__text">Удачи!</p>
    </section>
  );
};

export default WelcomeScreen;
