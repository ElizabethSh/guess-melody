import {
  makeFakeArtistQuestion,
  makeFakeGenreQuestion,
} from '../../../mocks/mocks';

import {
  checkUserAnswer,
  gameProcessSlice,
  incrementStep,
  resetGame,
} from './game-process';

const mockArtistQuestion = makeFakeArtistQuestion();
const mockFakeGenreQuestion = makeFakeGenreQuestion();

describe('Reducer: gameProcess', () => {
  it('without additional parameters should return initial state', () => {
    expect(
      gameProcessSlice.reducer(void 0, { type: 'UNKNOWN_ACTION' }),
    ).toEqual({
      step: 0,
      mistakes: 0,
    });
  });

  it('should increment current step by a given value', () => {
    const state = { step: 0, mistakes: 0 };
    expect(gameProcessSlice.reducer(state, incrementStep())).toEqual({
      step: 1,
      mistakes: 0,
    });
  });

  it('should increase number of mistakes with the wrong answer', () => {
    const state = { step: 0, mistakes: 0 };
    const wrongArtistQuestionAnswer = 'unknown';
    const wrongGenreQuestionAnswer = mockFakeGenreQuestion.answers.map(
      (answer) => answer.genre !== mockFakeGenreQuestion.genre,
    );

    expect(
      gameProcessSlice.reducer(
        state,
        checkUserAnswer({
          question: mockArtistQuestion,
          userAnswer: wrongArtistQuestionAnswer,
        }),
      ),
    ).toEqual({ step: 0, mistakes: 1 });

    expect(
      gameProcessSlice.reducer(
        state,
        checkUserAnswer({
          question: mockFakeGenreQuestion,
          userAnswer: wrongGenreQuestionAnswer,
        }),
      ),
    ).toEqual({ step: 0, mistakes: 1 });
  });

  it('should not increase mistakes with the correct answer', () => {
    const state = { step: 0, mistakes: 0 };
    const { artist: correctlyArtistQuestionAnswer } = mockArtistQuestion.song;
    const correctlyGenreQuestionAnswer = mockFakeGenreQuestion.answers.map(
      (answer) => answer.genre === mockFakeGenreQuestion.genre,
    );

    expect(
      gameProcessSlice.reducer(
        state,
        checkUserAnswer({
          question: mockArtistQuestion,
          userAnswer: correctlyArtistQuestionAnswer,
        }),
      ),
    ).toEqual({ step: 0, mistakes: 0 });

    expect(
      gameProcessSlice.reducer(
        state,
        checkUserAnswer({
          question: mockFakeGenreQuestion,
          userAnswer: correctlyGenreQuestionAnswer,
        }),
      ),
    ).toEqual({ step: 0, mistakes: 0 });
  });

  it('should have reset game', () => {
    expect(
      gameProcessSlice.reducer({ step: 5, mistakes: 1 }, resetGame()),
    ).toEqual({
      step: 0,
      mistakes: 0,
    });

    expect(
      gameProcessSlice.reducer({ step: 0, mistakes: 0 }, resetGame()),
    ).toEqual({
      step: 0,
      mistakes: 0,
    });

    expect(
      gameProcessSlice.reducer({ step: 2, mistakes: 0 }, resetGame()),
    ).toEqual({
      step: 0,
      mistakes: 0,
    });
  });
});
