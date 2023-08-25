import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

import ArtistQuestionScreen from '../question/artist';
import GenreQuestionScreen from '../question/genre';

import { ArtistQuestion, GenreQuestion, Questions } from '../../types/question';
import { AppRoute, GameType } from '../../settings';

import withAudioPlayer from '../../hocs/with-audio-player';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { incrementStep } from '../../store/actions/game';

const ArtistQuestionScreenWrapped = withAudioPlayer(ArtistQuestionScreen);
const GenreQuestionScreenWrapped = withAudioPlayer(GenreQuestionScreen);


type GameScreenProps = {
  questions: Questions;
};


const GameScreen = ({questions}: GameScreenProps) : JSX.Element => {
  const step = useAppSelector((state) => state.step);

  const dispatch = useAppDispatch();

  // NOTE: if we don't have questions we send user to the main page
  // TODO: we should check mistakes count and send user
  // to WinScreen or LoseScreen
  if (!questions.length || questions.length <= step) {
    return (<Navigate to={AppRoute.ROOT} />);
  }

  const question = questions[step];

  switch (question.type) {

    case GameType.ARTIST:
      return (
        <ArtistQuestionScreenWrapped
          question={question as ArtistQuestion}
          onAnswerClick={() => dispatch(incrementStep)}
        />
      );

    case GameType.GENRE:
      return (
        <GenreQuestionScreenWrapped
          question={question as GenreQuestion}
          onAnswerClick={() => dispatch(incrementStep)}
        />
      );

    default:
      return (<Navigate to={AppRoute.ROOT} />);
  }
};

export default GameScreen;
