import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks';
import { AppRoute } from '../../../settings';
import { resetGame } from '../../../store/slices/game-process/game-process';
import Logo from '../../../components/logo/logo';

const LoseScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onReplyClick = () => {
    dispatch(resetGame());
    navigate(AppRoute.Game);
  };

  return (
    <section className="result">
      <div className="result__logo">
        <Logo />
      </div>
      <h2 className="result__title">What a pity!</h2>
      <p className="result__total result__total--fail">
        You&apos;ve run out of attempts. Never mind, you&apos;ll be lucky next
        time!
      </p>
      <button className="replay" type="button" onClick={onReplyClick}>
        Try again
      </button>
    </section>
  );
};

export default LoseScreen;
