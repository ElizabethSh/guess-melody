import {
  ArtistQuestion,
  GenreQuestion,
  Question,
  UserAnswer,
  UserArtistQuestionAnswer,
  UserGenreQuestionAnswer,
} from './types/question';
import { AuthorizationStatus,GameType } from './settings';

export const isAnswerCorrect = (question: Question, answer: UserAnswer) => {
  if (question.type === GameType.Artist && typeof answer === 'string') {
    return isArtistAnswerCorrect(question, answer);
  }

  if (question.type === GameType.Genre && Array.isArray(answer)) {
    return isGenreAnswerCorrect(question, answer);
  }

  return false;
};

export const isArtistAnswerCorrect = (
  question: ArtistQuestion,
  userAnswer: UserArtistQuestionAnswer,
) => userAnswer === question.song.artist;

export const isGenreAnswerCorrect = (
  question: GenreQuestion,
  userAnswer: UserGenreQuestionAnswer,
) =>
  userAnswer.every(
    (answer, index) =>
      answer === (question.answers[index].genre === question.genre),
  );

export const isCheckedAuth = (authorizationStatus: AuthorizationStatus) =>
  authorizationStatus === AuthorizationStatus.Unknown;
