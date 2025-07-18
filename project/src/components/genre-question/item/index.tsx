import React, { ChangeEvent } from 'react';

import { GenreQuestionAnswer, RenderPlayer } from 'types/question';

type GenreQuestionItemProps = {
  answer: GenreQuestionAnswer;
  id: number;
  onChange: (id: number, value: boolean) => void;
  renderPlayer: RenderPlayer;
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
      <div id={`answer-${id}-description`} className="visually-hidden">
        {answer.genre} music track for genre question
      </div>
    </div>
  </div>
);

export default GenreQuestionItem;
