import React, { FormEvent, useState } from 'react';

import Logo from '../../../components/logo/logo';

import { ArtistQuestion, UserArtistQuestionAnswer } from '../../../types/question';


type ArtistQuestionScreenProps = {
  onAnswerClick: (question: ArtistQuestion, userAnswer: UserArtistQuestionAnswer) => void;
  question: ArtistQuestion;
  renderPlayer: (src: string, idx: number) => JSX.Element;
}


const ArtistQuestionScreen = ({question, onAnswerClick, renderPlayer}: ArtistQuestionScreenProps): JSX.Element => {
  const {answers, song} = question;
  const [userAnswer, setUserAnswer] = useState('');

  return (
    <section className="game game--artist">
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
        <h2 className="game__title">Кто исполняет эту песню?</h2>
        <div className="game__track">
          <div className="track">
            {/* TODO: browser doesn't allow to play song automatically */}
            {renderPlayer(song.src, -1)}
          </div>
        </div>

        <form className="game__artist">
          {
            answers.map((answer, index) => {
              const {artist, picture} = answer;
              const key = `${artist}-${index}`; // TODO: change it after getting data from server
              return (
                <div className="artist" key={key}>
                  <input
                    className="artist__input visually-hidden"
                    id="answer-1"
                    name="answer"
                    onChange={(evt: FormEvent<HTMLInputElement>) => {
                      evt.preventDefault();
                      onAnswerClick(question, userAnswer);
                    }}
                    type="radio"
                    value="artist-1"
                  />
                  <label className="artist__name" htmlFor="answer-1">
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
