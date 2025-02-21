import {FormEvent} from 'react';

import { useUserAnswers } from '../../../hooks/use-user-answers';
import {GenreQuestion, UserGenreQuestionAnswer} from '../../../types/question';
import GenreQuestionItem from '../item';

type GenreQuestionListProps = {
  question: GenreQuestion;
  onAnswer: (question: GenreQuestion, answers: UserGenreQuestionAnswer) => void;
  renderPlayer: (src: string, playerIndex: number) => JSX.Element;
};

function GenreQuestionList(props: GenreQuestionListProps) {
  const {question, onAnswer, renderPlayer} = props;
  const {answers} = question;
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

      <button className="game__submit button" type="submit">Ответить</button>
    </form>
  );
}

export default GenreQuestionList;
