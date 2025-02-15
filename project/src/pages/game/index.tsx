import React from 'react';
import { Navigate } from 'react-router-dom';

import ArtistQuestionScreen from '../question/artist';
import GenreQuestionScreen from '../question/genre';
import LoseScreen from '../result/lose';
import WinScreen from '../result/win';

import { ArtistQuestion, GenreQuestion } from '../../types/question';
import { AppRoute, GameType, MAX_ERRORS_COUNT } from '../../settings';

import withAudioPlayer from '../../hocs/with-audio-player';
import { useAppSelector } from '../../hooks';

const ArtistQuestionScreenWrapped = withAudioPlayer(ArtistQuestionScreen);
const GenreQuestionScreenWrapped = withAudioPlayer(GenreQuestionScreen);


const GameScreen = () : JSX.Element => {
  const step = useAppSelector((state) => state.step);
  const mistakesCount = useAppSelector((state) => state.mistakesCount);
  const questions = useAppSelector((state) => state.questions);

  // NOTE: If we don't have any questions and mistakes_count < max_mistake_count
  // we redirect user to the win screen
  if (!questions.length || questions.length <= step) {
    return (<Navigate to={AppRoute.Result} />);
  }

  if (mistakesCount >= MAX_ERRORS_COUNT) {
    return <LoseScreen />;
  }

  if (mistakesCount <= MAX_ERRORS_COUNT && questions.length === step) {
    return <WinScreen />;
  }

  const question = questions[step];

  switch (question.type) {

    case GameType.Artist:
      return (
        <ArtistQuestionScreenWrapped
          question={question as ArtistQuestion}
        />
      );

    case GameType.Genre:
      return (
        <GenreQuestionScreenWrapped
          question={question as GenreQuestion}
        />
      );

    default:
      return (<Navigate to={AppRoute.Root} />);
  }
};

export default GameScreen;
