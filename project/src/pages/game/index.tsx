import React from 'react';
import { Navigate } from 'react-router-dom';

import ArtistQuestionScreen from '../question/artist';
import GenreQuestionScreen from '../question/genre';

import { Question, UserAnswer } from '../../types/question';
import { AppRoute, GameType, MAX_ERRORS_COUNT } from '../../settings';

import withAudioPlayer from '../../hocs/with-audio-player';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectMistakeCount, selectQuestions, selectStep } from '../../store/game/selectors';
import { checkUserAnswer, incrementStep } from '../../store/game/process/process';

const ArtistQuestionScreenWrapped = withAudioPlayer(ArtistQuestionScreen);
const GenreQuestionScreenWrapped = withAudioPlayer(GenreQuestionScreen);


const GameScreen: React.FC = () => {
  const mistakesCount = useAppSelector(selectMistakeCount);
  const questions = useAppSelector(selectQuestions);
  const step = useAppSelector(selectStep);
  const dispatch = useAppDispatch();

  if (mistakesCount >= MAX_ERRORS_COUNT) {
    return <Navigate to={AppRoute.Lose} />;
  }

  const question = questions[step];
  if (step >= questions.length || !question) {
    return <Navigate to={AppRoute.Result} />;
  }

  if (step >= questions.length || !question) {
    return <Navigate to={AppRoute.Result} />;
  }

  const onUserAnswer = (questionItem: Question, userAnswer: UserAnswer) => {
    dispatch(incrementStep());
    dispatch(checkUserAnswer({question: questionItem, userAnswer}));
  };

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
      return (<Navigate to={AppRoute.Root} />);
  }
};

export default GameScreen;
