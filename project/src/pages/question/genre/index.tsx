import React, { FormEvent, useState } from 'react';
import AudioPlayer from '../../../components/audio-player';

import Logo from '../../../components/logo/logo';

import { GenreQuestion, UserGenreQuestionAnswer } from '../../../types/question';


type GenreQuestionProps = {
  question: GenreQuestion;
  onAnswerClick: (question: GenreQuestion, userAnswers: UserGenreQuestionAnswer ) => void;
};


const GenreQuestionScreen = (props: GenreQuestionProps): JSX.Element => {
  const {question, onAnswerClick} = props;
  const [userAnswers, setUserAnswers] = useState([false, false, false, false]);

  // TODO: the first melody should play automatically but browser don't allow that
  const [activePlayer, setActivePlayer] = useState(-1);

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

        <div className="game__mistakes">
          <div className="wrong"></div>
          <div className="wrong"></div>
          <div className="wrong"></div>
        </div>
      </header>

      <section className="game__screen">
        <h2 className="game__title">Выберите {genre} треки</h2>
        <form
          className="game__tracks"
          onSubmit={(evt: FormEvent<HTMLFormElement>) => {
            evt.preventDefault();
            onAnswerClick(question, userAnswers);
          }}
        >
          {
            answers.map((answer, idx) => {
              const key = `${answer.genre}-${idx}`; // TODO: change it after getting data from server
              return (
                <div className="track" key={key}>
                  <AudioPlayer
                    isPlaying={activePlayer === idx}
                    onPlayAudioClick={() => setActivePlayer(idx === activePlayer ? -1 : idx)}
                    src={answer.src}
                  />
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
