import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { AppRoute, AuthorizationStatus } from '../../../settings';
import { logoutAction } from '../../../store/api-actions';

import { selectAuthorizationStatus } from '../../../store/slices/user/user';
import { selectQuestions } from '../../../store/slices/data/data';
import {
  resetGame,
  selectMistakeCount,
} from '../../../store/slices/game-process/game-process';
import Logo from '../../../components/logo/logo';

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
      <Logo />
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
