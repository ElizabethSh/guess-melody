import React from 'react';
import { useAppSelector } from '../../hooks';

const Mistakes = () => {
  const mistakesCount = useAppSelector((state) => state.mistakesCount);
  const mistakes = Array.from(Array(mistakesCount).keys());

  return (
    <div className="game__mistakes">
      {!!mistakes.length && mistakes.map((mistake, index) => (
        <div className="wrong" key={`${index - mistake}`} />
      ))}
    </div>
  );

};

export default Mistakes;
