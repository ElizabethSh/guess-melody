import React, { useId } from 'react';
import { useAppSelector } from '../../hooks';
import { selectMistakeCount } from '../../store/game/selectors';

const Mistakes: React.FC = () => {
  const mistakesCount = useAppSelector(selectMistakeCount);

  const mistakes = Array.from(Array(mistakesCount).keys());
  const id = useId();

  if (!mistakes.length) {
    return null;
  }

  return (
    <div className="game__mistakes" data-testid="mistake-container">
      {!!mistakes.length && mistakes.map((mistake) => (
        <div className="wrong" key={`${id}-${mistake}`} data-testid="mistake-value"/>
      ))}
    </div>
  );
};

export default Mistakes;
