import Logo from '../../../components/logo/logo';
import Mistakes from '../../../components/mistakes/mistakes';
import GenreQuestionList from '../../../components/genre-question/list';

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
  const { genre } = question;

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
        <GenreQuestionList
          onAnswer={onAnswer}
          question={question}
          renderPlayer={renderPlayer}
        />
      </section>
    </section>
  );
};

export default GenreQuestionScreen;
