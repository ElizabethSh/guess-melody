import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { AppRoute, AuthorizationStatus } from '../../../settings';
import { logoutAction } from '../../../store/api-actions';

import { resetGame } from '../../../store/game/process/process';
import { selectMistakeCount } from '../../../store/game/selectors';
import { selectAuthorizationStatus } from '../../../store/slices/user/user';
import { selectQuestions } from '../../../store/slices/data/data';

const WinScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const mistakesCount = useAppSelector(selectMistakeCount);
  const questions = useAppSelector(selectQuestions);
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const onReplyClick = () => {
    dispatch(resetGame());
    navigate(AppRoute.Game);
  };

  const onLogoutClick = (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    dispatch(logoutAction());
  };

  return (
    <section className="result">
      {authorizationStatus === AuthorizationStatus.Auth && (
        <div className="result-logout__wrapper">
          <Link
            className="result-logout__link"
            onClick={(evt) => onLogoutClick(evt)}
            to={AppRoute.Root}
          >
            Log out
          </Link>
        </div>
      )}
      <Link className="result__logo" to={AppRoute.Root}>
        <img
          src="img/melody-logo.png"
          alt="Guess melody"
          width="186"
          height="83"
        />
      </Link>
      <h2 className="result__title">You are a real music lover!</h2>
      <p className="result__total">
        You answered {questions.length - mistakesCount} questions correctly and
        made {mistakesCount} {mistakesCount === 1 ? 'mistake' : 'mistakes'}
      </p>
      <button className="replay" onClick={onReplyClick} type="button">
        Play again
      </button>
    </section>
  );
};

export default WinScreen;
