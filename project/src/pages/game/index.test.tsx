import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { MAX_ERRORS_COUNT, NameSpace } from '@settings';
import { rootReducer } from '@store/root-reducer';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';

import { RenderPlayer } from 'types/question';

import {
  makeFakeArtistQuestion,
  makeFakeGenreQuestion,
} from '../../mocks/mocks';

import GameScreen from './index';

// Mock the Navigate component to track redirects
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return <div data-testid="navigate-redirect" data-to={to} />;
    },
  };
});

// Mock the HOC to avoid audio player complexity in tests
vi.mock('../../hocs/with-audio-player', () => {
  return {
    default: (
      Component: React.ComponentType<{ renderPlayer?: RenderPlayer }>,
    ) => {
      const MockedComponent = (props: { renderPlayer?: RenderPlayer }) => (
        <div data-testid="mocked-audio-player">
          <Component
            {...props}
            renderPlayer={() => <div>Mock Audio Player</div>}
          />
        </div>
      );
      MockedComponent.displayName = `withAudioPlayer(${Component.displayName || Component.name})`;
      return MockedComponent;
    },
  };
});

// Get real initial state from store
const getRealInitialState = () =>
  configureStore({ reducer: rootReducer }).getState();

const renderGameScreen = (stateOverrides = {}) => {
  const realInitialState = getRealInitialState();

  // Deep merge real initial state with overrides
  const mergedState = { ...realInitialState };
  Object.keys(stateOverrides).forEach((key) => {
    const namespaceKey = key as keyof typeof stateOverrides;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mergedState as any)[namespaceKey] = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(mergedState as any)[namespaceKey],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(stateOverrides as any)[namespaceKey],
    };
  });

  return render(
    <Provider store={createMockStore(mergedState)}>
      <MemoryRouter>
        <GameScreen />
      </MemoryRouter>
    </Provider>,
  );
};

describe('GameScreen', () => {
  const mockArtistQuestion = makeFakeArtistQuestion();
  const mockGenreQuestion = makeFakeGenreQuestion();

  describe('Game flow navigation', () => {
    it('should redirect to lose screen when mistakes exceed maximum', () => {
      // Clear previous mock calls
      mockNavigate.mockClear();

      renderGameScreen({
        [NameSpace.Data]: {
          questions: [makeFakeArtistQuestion()], // Add at least one question
        },
        [NameSpace.Game]: {
          mistakes: MAX_ERRORS_COUNT,
        },
      });

      // Should not render any game content since it should redirect
      expect(
        screen.queryByTestId('mocked-audio-player'),
      ).not.toBeInTheDocument();

      // Should render the mocked Navigate component indicating a redirect
      expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();

      // Should redirect to the lose route
      expect(screen.getByTestId('navigate-redirect')).toHaveAttribute(
        'data-to',
        '/lose',
      );

      // Verify the Navigate component was called with the correct route
      expect(mockNavigate).toHaveBeenCalledWith('/lose');
    });

    it('should redirect to result screen when all questions are completed', () => {
      const questions = [mockArtistQuestion, mockGenreQuestion];

      // Clear previous mock calls
      mockNavigate.mockClear();

      renderGameScreen({
        [NameSpace.Data]: {
          questions,
        },
        [NameSpace.Game]: {
          step: questions.length, // Step equals questions length = game completed
        },
      });

      // Should not render any game content since it should redirect
      expect(
        screen.queryByTestId('mocked-audio-player'),
      ).not.toBeInTheDocument();

      // Should render the mocked Navigate component indicating a redirect
      expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();

      // Should redirect to the result route
      expect(screen.getByTestId('navigate-redirect')).toHaveAttribute(
        'data-to',
        '/result',
      );

      // Verify the Navigate component was called with the correct route
      expect(mockNavigate).toHaveBeenCalledWith('/result');
    });
  });

  describe('Artist question rendering', () => {
    it('should render artist question screen for artist question type', () => {
      const artistQuestion = makeFakeArtistQuestion();
      renderGameScreen({
        [NameSpace.Data]: {
          questions: [artistQuestion],
        },
      });

      expect(screen.getByTestId('mocked-audio-player')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Who sings this song?' }),
      ).toBeVisible();
    });

    it('should render artist answers for artist question', () => {
      const artistQuestion = {
        ...makeFakeArtistQuestion(),
        answers: [
          { artist: 'Artist One', picture: 'pic1.jpg' },
          { artist: 'Artist Two', picture: 'pic2.jpg' },
          { artist: 'Artist Three', picture: 'pic3.jpg' },
        ],
      };

      renderGameScreen({
        [NameSpace.Data]: {
          questions: [artistQuestion],
        },
      });

      expect(screen.getByLabelText('Artist One')).toBeVisible();
      expect(screen.getByLabelText('Artist Two')).toBeVisible();
      expect(screen.getByLabelText('Artist Three')).toBeVisible();
    });
  });

  describe('Genre question rendering', () => {
    it('should render genre question screen for genre question type', () => {
      const genreQuestion = {
        ...makeFakeGenreQuestion(),
        genre: 'rock',
      };

      renderGameScreen({
        [NameSpace.Data]: {
          questions: [genreQuestion],
        },
      });

      expect(screen.getByTestId('mocked-audio-player')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Select rock tracks' }),
      ).toBeVisible();
    });

    it('should render genre question form with submit button', () => {
      const genreQuestion = {
        ...makeFakeGenreQuestion(),
        genre: 'jazz',
        answers: [
          { genre: 'jazz', src: 'jazz1.mp3' },
          { genre: 'rock', src: 'rock1.mp3' },
        ],
      };

      renderGameScreen({
        [NameSpace.Data]: {
          questions: [genreQuestion],
        },
      });

      // Should render the form and submit button
      expect(screen.getByRole('button', { name: /confirm/i })).toBeVisible();
      expect(screen.getByRole('group')).toBeInTheDocument();
    });
  });

  describe('Question progression', () => {
    it('should show correct question based on current step', () => {
      const questions = [
        {
          ...makeFakeArtistQuestion(),
          song: { artist: 'Step 0 Artist', src: 'step0.mp3' },
        },
        { ...makeFakeGenreQuestion(), genre: 'step1genre' },
      ];

      // Test step 0 (first question - artist)
      const { rerender } = renderGameScreen({
        [NameSpace.Data]: {
          questions,
        },
      });

      expect(
        screen.getByRole('heading', { name: 'Who sings this song?' }),
      ).toBeVisible();

      // Re-render with step 1 (second question - genre)
      const step1State = getRealInitialState();
      step1State[NameSpace.Data] = {
        ...step1State[NameSpace.Data],
        questions,
      };
      step1State[NameSpace.Game] = {
        ...step1State[NameSpace.Game],
        step: 1,
      };

      rerender(
        <Provider store={createMockStore(step1State)}>
          <MemoryRouter>
            <GameScreen />
          </MemoryRouter>
        </Provider>,
      );

      expect(
        screen.getByRole('heading', { name: 'Select step1genre tracks' }),
      ).toBeVisible();
    });
  });

  describe('Edge cases', () => {
    it('should handle step beyond questions array length', () => {
      const questions = [makeFakeArtistQuestion()];

      // Clear previous mock calls
      mockNavigate.mockClear();

      renderGameScreen({
        [NameSpace.Data]: {
          questions,
        },
        [NameSpace.Game]: {
          step: 5, // Beyond array length
          mistakes: 0,
        },
      });

      // Should not render any game content since it should redirect
      expect(
        screen.queryByTestId('mocked-audio-player'),
      ).not.toBeInTheDocument();

      // Should render the mocked Navigate component indicating a redirect
      expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();

      // Should redirect to the result route (when step >= questions.length)
      expect(screen.getByTestId('navigate-redirect')).toHaveAttribute(
        'data-to',
        '/result',
      );

      // Verify the Navigate component was called with the correct route
      expect(mockNavigate).toHaveBeenCalledWith('/result');
    });

    it('should handle unknown question type gracefully', () => {
      const unknownType = 'unknown' as const;
      const invalidQuestion = {
        type: unknownType,
        invalidProp: 'test',
      };

      // Clear previous mock calls
      mockNavigate.mockClear();

      renderGameScreen({
        [NameSpace.Data]: {
          questions: [
            invalidQuestion as unknown as ReturnType<
              typeof makeFakeArtistQuestion
            >,
          ],
        },
      });

      // Should not render any game content since it should redirect
      expect(
        screen.queryByTestId('mocked-audio-player'),
      ).not.toBeInTheDocument();

      // Should render the mocked Navigate component indicating a redirect
      expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();

      // Should redirect to root route (unknown question type defaults to root)
      expect(screen.getByTestId('navigate-redirect')).toHaveAttribute(
        'data-to',
        '/',
      );

      // Verify the Navigate component was called with the correct route
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Mistake tracking', () => {
    it('should continue game when mistakes are below maximum', () => {
      renderGameScreen({
        [NameSpace.Data]: {
          questions: [makeFakeArtistQuestion()], // Need questions for game to run
        },
        [NameSpace.Game]: {
          mistakes: MAX_ERRORS_COUNT - 1, // One mistake below maximum
        },
      });

      expect(screen.getByTestId('mocked-audio-player')).toBeInTheDocument();
    });

    it('should redirect when mistakes equal maximum', () => {
      // Clear previous mock calls
      mockNavigate.mockClear();

      renderGameScreen({
        [NameSpace.Data]: {
          questions: [makeFakeArtistQuestion()], // Need questions for game state
        },
        [NameSpace.Game]: {
          mistakes: MAX_ERRORS_COUNT,
        },
      });

      // Should not render any game content since it should redirect
      expect(
        screen.queryByTestId('mocked-audio-player'),
      ).not.toBeInTheDocument();

      // Should render the mocked Navigate component indicating a redirect
      expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();

      // Should redirect to the lose route
      expect(screen.getByTestId('navigate-redirect')).toHaveAttribute(
        'data-to',
        '/lose',
      );

      // Verify the Navigate component was called with the correct route
      expect(mockNavigate).toHaveBeenCalledWith('/lose');
    });
  });

  describe('Component integration', () => {
    it('should render with HOC wrapper', () => {
      renderGameScreen({
        [NameSpace.Data]: {
          questions: [makeFakeArtistQuestion()], // Need questions for game to render
        },
      });

      // Verify the HOC wrapper is applied
      expect(screen.getByTestId('mocked-audio-player')).toBeInTheDocument();
    });

    it('should handle both question types through switch statement', () => {
      // Test artist question
      const { rerender } = renderGameScreen({
        [NameSpace.Data]: {
          questions: [makeFakeArtistQuestion()],
        },
      });

      expect(screen.getByText('Who sings this song?')).toBeInTheDocument();

      // Test genre question
      const genreState = getRealInitialState();
      genreState[NameSpace.Data] = {
        ...genreState[NameSpace.Data],
        questions: [{ ...makeFakeGenreQuestion(), genre: 'testgenre' }],
      };

      rerender(
        <Provider store={createMockStore(genreState)}>
          <MemoryRouter>
            <GameScreen />
          </MemoryRouter>
        </Provider>,
      );

      expect(screen.getByText('Select testgenre tracks')).toBeInTheDocument();
    });
  });
});
