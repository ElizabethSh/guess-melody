import React from 'react';
import GenreQuestionList from '@components/genre-question/list';

import { GenreQuestion, UserGenreQuestionAnswer } from 'types/question';

import PageHeader from '../page-header';

type GenreQuestionProps = {
  onAnswer: (
    question: GenreQuestion,
    userAnswer: UserGenreQuestionAnswer,
  ) => void;
  question: GenreQuestion;
  renderPlayer: (src: string, idx: number) => JSX.Element;
};

const GenreQuestionScreen: React.FC<GenreQuestionProps> = ({
  onAnswer,
  question,
  renderPlayer,
}) => {
  const { genre } = question;

  return (
    <section className="game game--genre">
      <PageHeader />
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
