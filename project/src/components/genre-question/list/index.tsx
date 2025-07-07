import React, { FormEvent, useMemo } from 'react';
import Button from '@components/button';
import { useUserAnswers } from '@hooks/use-user-answers';

import { GenreQuestion } from 'types/question';

import GenreQuestionItem from '../item';

type GenreQuestionListProps = {
  question: GenreQuestion;
  onAnswer: (question: GenreQuestion, answers: boolean[]) => void;
  renderPlayer: (src: string, playerIndex: number) => JSX.Element;
};

const GenreQuestionList: React.FC<GenreQuestionListProps> = ({
  question,
  onAnswer,
  renderPlayer,
}) => {
  const { answers } = question;
  const [userAnswers, handleAnswerChange] = useUserAnswers(question);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onAnswer(question, userAnswers);
  };

  const hasSelectedAnswers = useMemo(
    () => userAnswers.some((answer) => answer === true),
    [userAnswers],
  );

  return (
    <form
      className="game__tracks"
      onSubmit={handleSubmit}
      role="group"
      aria-labelledby="genre-question-heading"
    >
      <div id="genre-question-heading" className="visually-hidden">
        Select all tracks that belong to the {question.genre} genre
      </div>

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
        disabled={!hasSelectedAnswers}
        label="Confirm"
        type="submit"
        aria-describedby="submit-helper-text"
      />

      <div id="submit-helper-text" className="visually-hidden">
        {hasSelectedAnswers
          ? 'Submit your selected answers'
          : 'Please select at least one track before submitting'}
      </div>
    </form>
  );
};

export default GenreQuestionList;
