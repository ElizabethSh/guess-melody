import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@components/layout';
import { useAppDispatch } from '@hooks/use-store';
import { AppRoute } from '@settings';
import { resetGame } from '@store/slices/game-process/game-process';

import './lose.css';

const LoseScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onReplayClick = () => {
    dispatch(resetGame());
    navigate(AppRoute.Game);
  };

  return (
    <Layout className="result">
      <h2 className="main__title">What a pity!</h2>
      <p className="result__total">
        You&apos;ve run out of attempts. Never mind, you&apos;ll be lucky next
        time!
      </p>
      <button
        className="replay result__button"
        type="button"
        onClick={onReplayClick}
      >
        Try again
      </button>
    </Layout>
  );
};

export default LoseScreen;
