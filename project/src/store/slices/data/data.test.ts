import {
  makeFakeArtistQuestion,
  makeFakeGenreQuestion,
} from '../../../mocks/mocks';
import { fetchQuestionAction } from '../../api-actions';

import { gameQuestionsSlice } from './data';

const questions = [makeFakeArtistQuestion(), makeFakeGenreQuestion()];

describe('Reducer: gameData', () => {
  it('without additional parameters should return initial state', () => {
    expect(
      gameQuestionsSlice.reducer(void 0, { type: 'UNKNOWN_ACTION' }),
    ).toEqual({
      questions: [],
      isLoadingData: false,
      isError: false,
    });
  });

  it('should update questions by load questions', () => {
    const state = { questions: [], isLoadingData: false, isError: false };
    expect(
      gameQuestionsSlice.reducer(state, {
        type: fetchQuestionAction.fulfilled.type,
        payload: questions,
      }),
    ).toEqual({ questions, isLoadingData: false, isError: false });
  });
});
