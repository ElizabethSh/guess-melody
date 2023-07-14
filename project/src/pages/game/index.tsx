import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

import ArtistQuestionScreen from '../question/artist';
import GenreQuestionScreen from '../question/genre';

import { ArtistQuestion, GenreQuestion, Questions } from '../../types/question';
import { AppRoute, GameType } from '../../settings';

import withAudioPlayer from '../../hocs/with-audio-player';

const ArtistQuestionScreenWrapped = withAudioPlayer(ArtistQuestionScreen);
const GenreQuestionScreenWrapped = withAudioPlayer(GenreQuestionScreen);


type GameScreenProps = {
  questions: Questions;
};


const GameScreen = ({questions}: GameScreenProps) : JSX.Element => {
  const [step, setStep] = useState(0);

  // NOTE: if we don't have questions we send user to the main page
  // TODO: we should check mistakes count and send user
  // to WinScreen or LoseScreen
  if (!questions.length || questions.length <= step) {
    return (<Navigate to={AppRoute.ROOT} />);
  }

  // TODO: should check if answer is correct
  const answerClickHandler = (prevStep: number): void => {
    setStep(prevStep + 1);
  };

  const question = questions[step];

  switch (question.type) {

    case GameType.ARTIST:
      return (
        <ArtistQuestionScreenWrapped
          question={question as ArtistQuestion}
          onAnswerClick={() => answerClickHandler(step)}
        />
      );

    case GameType.GENRE:
      return (
        <GenreQuestionScreenWrapped
          question={question as GenreQuestion}
          onAnswerClick={() => answerClickHandler(step)}
        />
      );

    default:
      return (<Navigate to={AppRoute.ROOT} />);
  }
};

export default GameScreen;
