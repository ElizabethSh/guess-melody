import React, { ChangeEvent, FormEvent, useState } from 'react';

import Logo from '../../../components/logo/logo';
import Mistakes from '../../../components/mistakes/mistakes';
import { useAppDispatch } from '../../../hooks';
import { incrementMistakes, incrementStep } from '../../../store/actions/game';

import { GenreQuestion, UserGenreQuestionAnswer } from '../../../types/question';


type GenreQuestionProps = {
  question: GenreQuestion;
  renderPlayer: (src: string, idx: number) => JSX.Element;
};


const GenreQuestionScreen = (props: GenreQuestionProps): JSX.Element => {
  const {question, renderPlayer} = props;
  const [userAnswers, setUserAnswers] = useState<UserGenreQuestionAnswer>([false, false, false, false]);
  const dispatch = useAppDispatch();
  const {answers, genre } = question;

  const onSubmitClick = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const isAnswerCorrect = userAnswers
      .filter((answer) => typeof answer === 'string')
      .every((answer) => answer === genre);

    if (isAnswerCorrect) {
      dispatch(incrementStep());
    } else {
      dispatch(incrementMistakes());
      dispatch(incrementStep());
    }
  };


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
            onSubmitClick(evt);
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
                      checked={Boolean(userAnswers[idx])}
                      id={`answer-${idx}`}
                      name="answer"
                      type="checkbox"
                      value={answer.genre}
                      onChange={({target}: ChangeEvent<HTMLInputElement>) => {
                        setUserAnswers([...userAnswers.slice(0, idx), target.value, ...userAnswers.slice(idx + 1)]);
                      }}
                    />
                    <label className="game__check" htmlFor={`answer-${idx}`}>Отметить</label>
                  </div>
                </div>
              );
            })
          }
          {/* TODO: disable button if nothing is selected */}
          <button
            className="game__submit button"
            type="submit"
          >
            Ответить
          </button>
        </form>
      </section>
    </section>
  );
};

export default GenreQuestionScreen;
