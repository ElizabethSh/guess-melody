import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/use-store';
import ArtistQuestionScreen from '@pages/question/artist';
import GenreQuestionScreen from '@pages/question/genre';
import { AppRoute, GameType, MAX_ERRORS_COUNT } from '@settings';
import { selectQuestions } from '@store/slices/data/data';
import {
  checkUserAnswer,
  incrementStep,
  selectMistakeCount,
  selectStep,
} from '@store/slices/game-process/game-process';

import { Question, UserAnswer } from 'types/question';

import withAudioPlayer from '../../hocs/with-audio-player';

const ArtistQuestionScreenWrapped = withAudioPlayer(ArtistQuestionScreen);
const GenreQuestionScreenWrapped = withAudioPlayer(GenreQuestionScreen);

const GameScreen: React.FC = () => {
  const mistakesCount = useAppSelector(selectMistakeCount);
  const questions = useAppSelector(selectQuestions);
  const step = useAppSelector(selectStep);
  const dispatch = useAppDispatch();

  // Redirect to Lose screen if mistakes count exceeds maximum allowed
  if (mistakesCount >= MAX_ERRORS_COUNT) {
    return <Navigate to={AppRoute.Lose} />;
  }

  // Early return for game completion
  if (step >= questions.length) {
    return <Navigate to={AppRoute.Result} />;
  }

  const onUserAnswer = (questionItem: Question, userAnswer: UserAnswer) => {
    dispatch(incrementStep());
    dispatch(checkUserAnswer({ question: questionItem, userAnswer }));
  };

  const question = questions[step];

  switch (question.type) {
    case GameType.Artist:
      return (
        <ArtistQuestionScreenWrapped
          key={step}
          question={question}
          onAnswer={onUserAnswer}
        />
      );

    case GameType.Genre:
      return (
        <GenreQuestionScreenWrapped
          key={step}
          question={question}
          onAnswer={onUserAnswer}
        />
      );

    default:
      return <Navigate to={AppRoute.Root} />;
  }
};

export default GameScreen;
