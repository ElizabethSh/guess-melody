import React, { FormEvent, useState } from 'react';

import Logo from '../../../components/logo/logo';
import Mistakes from '../../../components/mistakes/mistakes';

import { GenreQuestion, UserGenreQuestionAnswer } from '../../../types/question';


type GenreQuestionProps = {
  question: GenreQuestion;
  onAnswerClick: () => void;
  renderPlayer: (src: string, idx: number) => JSX.Element;
};


const GenreQuestionScreen = (props: GenreQuestionProps): JSX.Element => {
  const {question, onAnswerClick, renderPlayer} = props;
  const [userAnswers, setUserAnswers] = useState([false, false, false, false]);
  const {answers, genre } = question;

  return (
    <section className="game game--genre">
      <header className="game__header">
        <Logo />

        <svg xmlns="http://www.w3.org/2000/svg" className="timer" viewBox="0 0 780 780">
          <circle className="timer__line" cx="390" cy="390" r="370"
            style={{ filter: 'url(#blur)', transform: 'rotate(-90deg) scaleY(-1)', transformOrigin: 'center' }}
          />
        </svg>

        <Mistakes />
      </header>

      <section className="game__screen">
        <h2 className="game__title">Выберите {genre} треки</h2>
        <form
          className="game__tracks"
          onSubmit={(evt: FormEvent<HTMLFormElement>) => {
            evt.preventDefault();
            onAnswerClick();
          }}
        >
          {
            answers.map((answer, idx) => {
              const key = `${answer.genre}-${idx}`; // TODO: change it after getting data from server
              return (
                <div className="track" key={key}>
                  {renderPlayer(answer.src, idx)}
                  <div className="game__answer">
                    <input
                      className="game__input visually-hidden"
                      id={`answer-${idx}`}
                      name="answer"
                      type="checkbox"
                      value={answer.genre}
                    />
                    <label className="game__check" htmlFor={`answer-${idx}`}>Отметить</label>
                  </div>
                </div>
              );
            })
          }
          <button className="game__submit button" type="submit">Ответить</button>
        </form>
      </section>
    </section>
  );
};

export default GenreQuestionScreen;
