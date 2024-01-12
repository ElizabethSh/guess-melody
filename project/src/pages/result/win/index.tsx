import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';

import { AppRoute, AuthorizationStatus } from '../../../settings';
import { logoutAction } from '../../../store/actions/api-actions';
import { resetGame } from '../../../store/actions/game';
import { state } from '../../../types/state';


const WinScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const mistakesCount = useAppSelector((state: state) => state.mistakesCount);
  const questions = useAppSelector((state: state) => state.questions);
  const authorizationStatus = useAppSelector((state: state) => state.authorizationStatus);

  const onReplyClick = () => {
    dispatch(resetGame())
    navigate(AppRoute.GAME)
  };

  const onLogoutClick = (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    dispatch(logoutAction());
  }

  return (
    <section className="result">
      {
        authorizationStatus === AuthorizationStatus.AUTH
          && (
            <div className="result-logout__wrapper">
              <Link
                className="result-logout__link"
                onClick={(evt: React.MouseEvent<HTMLElement>) => onLogoutClick(evt)}
                to={AppRoute.ROOT}
              >Log out</Link>
            </div>
          )
      }
      <Link className="result__logo" to={AppRoute.ROOT}>
        <img src="img/melody-logo.png" alt="Guess melody" width="186" height="83" />
      </Link>
      <h2 className="result__title">You are a real music lover!</h2>
      <p className="result__total">
        You answered {questions.length - mistakesCount} questions correctly and made {mistakesCount} mistakes
      </p>
      <button
        className="replay"
        onClick={onReplyClick}
        type="button"
      >
        Play again
      </button>
    </section>
  )
};

export default WinScreen;
