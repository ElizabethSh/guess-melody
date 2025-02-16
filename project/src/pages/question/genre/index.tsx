import { ChangeEvent, FormEvent, useState } from 'react';

import Logo from '../../../components/logo/logo';
import Mistakes from '../../../components/mistakes/mistakes';

import { GenreQuestion, UserGenreQuestionAnswer } from '../../../types/question';


type GenreQuestionProps = {
  question: GenreQuestion;
  renderPlayer: (src: string, idx: number) => JSX.Element;
  onAnswer: (question: GenreQuestion, userAnswer: UserGenreQuestionAnswer) => void;
};


const GenreQuestionScreen = ({
  question,
  renderPlayer,
  onAnswer
}: GenreQuestionProps): JSX.Element => {
  const defaultAnswers: boolean [] = [false, false, false, false];
  const [userAnswers, setUserAnswers] = useState<UserGenreQuestionAnswer>(defaultAnswers);

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
        <h2 className="game__title">Select {genre} tracks</h2>
        <form
          className="game__tracks"
          onSubmit={(evt: FormEvent<HTMLFormElement>) => {
            evt.preventDefault();
            onAnswer(question, userAnswers);
          }}
        >
          {
            answers.map((answer, idx) => {
              const key = `${answer.genre}-${idx}`;
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
                        setUserAnswers([
                          ...userAnswers.slice(0, idx),
                          target.value,
                          ...userAnswers.slice(idx + 1)
                        ]);
                      }}
                    />
                    <label className="game__check" htmlFor={`answer-${idx}`}>Check</label>
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
            Confirm
          </button>
        </form>
      </section>
    </section>
  );
};

export default GenreQuestionScreen;
