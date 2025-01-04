import React, { ChangeEvent } from 'react';

import Logo from '../../../components/logo/logo';
import Mistakes from '../../../components/mistakes/mistakes';
import { useAppDispatch } from '../../../hooks';
import { incrementMistakes, incrementStep } from '../../../store/actions/game';

import { ArtistQuestion } from '../../../types/question';


type ArtistQuestionScreenProps = {
  question: ArtistQuestion;
  renderPlayer: (src: string, idx: number) => JSX.Element;
}

const formatString = (string: string) => string.toLowerCase().replace(/\s/g, '');


const ArtistQuestionScreen = (props: ArtistQuestionScreenProps): JSX.Element => {
  const {question, renderPlayer} = props;
  const {answers, song} = question;
  const dispatch = useAppDispatch();

  const onAnswerClick = (artist: string) => {

    if (formatString(artist) === formatString(song.artist)) {
      dispatch(incrementStep());
    } else {
      dispatch(incrementMistakes());
      dispatch(incrementStep());
    }
  };

  return (
    <section className="game game--artist">
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
        <h2 className="game__title">Кто исполняет эту песню?</h2>
        <div className="game__track">
          <div className="track">
            {/* NOTE: don't play song automatically */}
            {renderPlayer(song.src, 0)}
          </div>
        </div>

        <form className="game__artist">
          {
            answers.map((answer) => {
              const {artist, picture} = answer;
              const id = `answer-${artist.split(' ').join('-')}`;

              return (
                <div className="artist" key={artist}>
                  <input
                    className="artist__input visually-hidden"
                    id={id}
                    name="answer"
                    onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                      evt.preventDefault();
                      onAnswerClick(evt.target.value);
                    }}
                    type="radio"
                    value={artist}
                  />
                  <label className="artist__name" htmlFor={id}>
                    <img className="artist__picture" src={picture} alt={artist} />
                    {artist}
                  </label>
                </div>
              );
            })
          }
        </form>
      </section>
    </section>
  );
};

export default ArtistQuestionScreen;
