import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/button';
import Layout from '@components/layout';
import { useAppDispatch, useAppSelector } from '@hooks/use-store';
import { AppRoute, AuthorizationStatus } from '@settings';
import { logoutAction } from '@store/api-actions';
import { selectQuestions } from '@store/slices/data/data';
import {
  resetGame,
  selectMistakeCount,
  selectStep,
} from '@store/slices/game-process/game-process';
import { selectAuthorizationStatus } from '@store/slices/user/user';

import './win.css';

const WinScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const mistakesCount = useAppSelector(selectMistakeCount);
  const questions = useAppSelector(selectQuestions);
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const correctAnswers = Math.max(0, questions.length - mistakesCount);
  const totalQuestions = questions.length;
  const step = useAppSelector(selectStep);

  const onReplayClick = () => {
    dispatch(resetGame());
    navigate(AppRoute.Game);
  };

  const onLogoutClick = () => {
    dispatch(logoutAction());
    navigate(AppRoute.Root);
  };

  const renderAuthSection = () => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      return null;
    }

    return (
      <div className="result-logout__wrapper">
        <Button
          className="result__logout"
          label="Log out"
          onClick={onLogoutClick}
          variant="secondary"
        />
      </div>
    );
  };

  const getResultMessage = () => {
    return !totalQuestions || !step
      ? 'No questions were answered.'
      : `You answered ${correctAnswers} questions correctly and made ${mistakesCount} ${mistakesCount === 1 ? 'mistake' : 'mistakes'}`;
  };

  return (
    <Layout authSection={renderAuthSection()} className="result">
      <h2 className="main__title">You are a real music lover!</h2>
      <p className="result__total">{getResultMessage()}</p>
      <button
        className="replay result__button"
        onClick={onReplayClick}
        type="button"
      >
        Play again
      </button>
    </Layout>
  );
};

export default WinScreen;
