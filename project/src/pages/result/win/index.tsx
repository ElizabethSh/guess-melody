import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { AppRoute } from '../../../settings';
import { resetGame } from '../../../store/actions/game';
import { state } from '../../../types/state';


const WinScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mistakesCount = useSelector((state: state) => state.mistakesCount);
  const questions = useSelector((state: state) => state.questions);

  const onReplyClick = () => {
    dispatch(resetGame())
    navigate(AppRoute.GAME)
  };

  return (
    <section className="result">
      <div className="result-logout__wrapper">
        <Link className="result-logout__link" to={AppRoute.ROOT}>Log out</Link>
      </div>
      <div className="result__logo">
        <img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83" />
      </div>
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
