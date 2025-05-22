import { useState } from 'react';
import { GenreQuestion } from '../types/question';

type ResultUserAnswers = [boolean[], (id: number, value: boolean) => void];

export const useUserAnswers = (question: GenreQuestion): ResultUserAnswers => {
  const answersCount = question.answers.length;

  const [answers, setAnswers] = useState<boolean[]>(
    Array.from({ length: answersCount }, () => false),
  );

  const handleAnswerChange = (id: number, value: boolean) => {
    const userAnswers = answers.slice(0);
    userAnswers[id] = value;
    setAnswers(userAnswers);
  };

  return [answers, handleAnswerChange];
};
