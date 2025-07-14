import { ChangeEvent } from 'react';

import {
  ArtistQuestion,
  RenderPlayer,
  UserArtistQuestionAnswer,
} from 'types/question';

import PageHeader from '../page-header';

type ArtistQuestionScreenProps = {
  question: ArtistQuestion;
  renderPlayer: RenderPlayer;
  onAnswer: (
    question: ArtistQuestion,
    userAnswer: UserArtistQuestionAnswer,
  ) => void;
};

const ArtistQuestionScreen: React.FC<ArtistQuestionScreenProps> = ({
  onAnswer,
  question,
  renderPlayer,
}) => {
  const { answers, song } = question;

  return (
    <section className="game game--artist">
      <PageHeader />
      <section className="game__screen">
        <h2 className="game__title">Who sings this song?</h2>
        <div className="game__track">
          <div className="track">
            {/* NOTE: it doesn't play song automatically */}
            {renderPlayer(song.src, 0)}
          </div>
        </div>

        <form className="game__artist">
          {answers.map((answer) => {
            const { artist, picture } = answer;
            const id = `answer-${artist.split(' ').join('-')}`;

            return (
              <div className="artist" key={artist}>
                <input
                  className="artist__input visually-hidden"
                  id={id}
                  name="answer"
                  onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                    evt.preventDefault();
                    onAnswer(question, answer.artist);
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
          })}
        </form>
      </section>
    </section>
  );
};

export default ArtistQuestionScreen;
