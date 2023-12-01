import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../../settings';
import { resetGame } from '../../../store/actions/game';


const LoseScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onReplyClick = () => {
    dispatch(resetGame())
    navigate(AppRoute.GAME)
  };

  return (
    <section className="result">
      <div className="result__logo">
        <img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83" />
      </div>
      <h2 className="result__title">What a pity!</h2>
      <p className="result__total result__total--fail">
        You've run out of attempts. Never mind, you'll be lucky next time!
      </p>
      <button
        className="replay"
        type="button"
        onClick={onReplyClick}
      >
        Try again
      </button>
    </section>
  );
};

export default LoseScreen;
