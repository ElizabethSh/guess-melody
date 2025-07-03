import React from 'react';
import { FormEvent } from 'react';
import Button from '@components/button';
import { useUserAnswers } from '@hooks/use-user-answers';

import { GenreQuestion, UserGenreQuestionAnswer } from 'types/question';

import GenreQuestionItem from '../item';

type GenreQuestionListProps = {
  question: GenreQuestion;
  onAnswer: (question: GenreQuestion, answers: UserGenreQuestionAnswer) => void;
  renderPlayer: (src: string, playerIndex: number) => JSX.Element;
};

const GenreQuestionList: React.FC<GenreQuestionListProps> = ({
  question,
  onAnswer,
  renderPlayer,
}) => {
  const { answers } = question;
  const [userAnswers, handleAnswerChange] = useUserAnswers(question);

  return (
    <form
      className="game__tracks"
      onSubmit={(evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        onAnswer(question, userAnswers);
      }}
    >
      {answers.map((answer, id) => {
        const keyValue = `${id}-${answer.src}`;
        return (
          <GenreQuestionItem
            answer={answer}
            id={id}
            key={keyValue}
            onChange={handleAnswerChange}
            renderPlayer={renderPlayer}
            userAnswer={userAnswers[id]}
          />
        );
      })}

      <Button
        className="game__submit"
        disabled={!userAnswers.some((answer) => answer === true)}
        label="Confirm"
        type="submit"
      />
    </form>
  );
};

export default GenreQuestionList;
