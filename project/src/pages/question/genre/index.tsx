import React from 'react';
import GenreQuestionList from '@components/genre-question/list';

import {
  GenreQuestion,
  RenderPlayer,
  UserGenreQuestionAnswer,
} from 'types/question';

import PageHeader from '../page-header';

type GenreQuestionProps = {
  onAnswer: (
    question: GenreQuestion,
    userAnswer: UserGenreQuestionAnswer,
  ) => void;
  question: GenreQuestion;
  renderPlayer: RenderPlayer;
};

const GenreQuestionScreen: React.FC<GenreQuestionProps> = ({
  onAnswer,
  question,
  renderPlayer,
}) => (
  <section className="game game--genre">
    <PageHeader />
    <section className="game__screen">
      <h2 className="game__title">Select {question.genre} tracks</h2>
      <GenreQuestionList
        onAnswer={onAnswer}
        question={question}
        renderPlayer={renderPlayer}
      />
    </section>
  </section>
);

export default GenreQuestionScreen;
