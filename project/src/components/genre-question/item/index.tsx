import React, { ChangeEvent } from 'react';

import { GenreQuestionAnswer } from 'types/question';

type GenreQuestionItemProps = {
  answer: GenreQuestionAnswer;
  id: number;
  onChange: (id: number, value: boolean) => void;
  renderPlayer: (path: string, playerIndex: number) => JSX.Element;
  userAnswer: boolean;
};

const GenreQuestionItem: React.FC<GenreQuestionItemProps> = ({
  answer,
  id,
  onChange,
  renderPlayer,
  userAnswer,
}) => (
  <div className="track">
    {renderPlayer(answer.src, id)}
    <div className="game__answer">
      <input
        className="game__input visually-hidden"
        type="checkbox"
        name="answer"
        value={`answer-${id}`}
        id={`answer-${id}`}
        checked={userAnswer}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
          const value = target.checked;
          onChange(id, value);
        }}
        aria-describedby={`answer-${id}-description`}
      />
      <label className="game__check" htmlFor={`answer-${id}`}>
        Select
      </label>
    </div>
  </div>
);

export default GenreQuestionItem;
