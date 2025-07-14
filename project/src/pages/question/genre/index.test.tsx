import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { makeFakeGenreQuestion } from '../../../mocks/mocks';

import GenreQuestionScreen, { GenreQuestionProps } from './index';

// Mock PageHeader
vi.mock('../page-header', () => {
  return {
    default: () => <div data-testid="page-header">Page Header</div>,
  };
});

const renderGenreQuestionScreen = (props: Partial<GenreQuestionProps> = {}) => {
  const defaultProps: GenreQuestionProps = {
    question: makeFakeGenreQuestion(),
    onAnswer: vi.fn(),
    renderPlayer: vi.fn((src: string, idx: number) => (
      <div data-testid={`player-${idx}`}>Player for {src}</div>
    )),
    ...props,
  };

  return render(
    <Provider store={createMockStore()}>
      <MemoryRouter>
        <GenreQuestionScreen {...defaultProps} />
      </MemoryRouter>
    </Provider>,
  );
};

describe('GenreQuestionScreen', () => {
  describe('Component Structure and Rendering', () => {
    it('should render with correct semantic structure and accessibility features', () => {
      renderGenreQuestionScreen();

      // Basic component structure
      const gameSection = document.querySelector('.game.game--genre');
      expect(gameSection).toBeInTheDocument();
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByRole('group')).toBeInTheDocument();

      // Accessibility - heading structure
      const title = screen.getByRole('heading', {
        name: /Select .+ tracks/,
        level: 2,
      });
      expect(title).toBeVisible();
      expect(title).toHaveClass('game__title');
    });

    it('should render correct title for different genre types including special characters', () => {
      // Test multiple genre types including special characters
      const genres = [
        'jazz',
        'rock',
        'classical',
        'electronic',
        'Hip-Hop & R&B',
      ];

      genres.forEach((genreType) => {
        const question = { ...makeFakeGenreQuestion(), genre: genreType };
        const { unmount } = renderGenreQuestionScreen({ question });

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          `Select ${genreType} tracks`,
        );

        unmount();
      });
    });
  });

  describe('Props passing', () => {
    it('should pass question prop to GenreQuestionList', () => {
      const question = {
        ...makeFakeGenreQuestion(),
        answers: [
          { genre: 'rock', src: 'rock1.mp3' },
          { genre: 'jazz', src: 'jazz1.mp3' },
          { genre: 'classical', src: 'classical1.mp3' },
        ],
      };

      renderGenreQuestionScreen({ question });

      // Check that all answer options are rendered
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });

    it('should pass onAnswer callback to GenreQuestionList', async () => {
      const user = userEvent.setup();
      const onAnswer = vi.fn();
      const question = makeFakeGenreQuestion();

      renderGenreQuestionScreen({ onAnswer, question });

      // Select at least one answer to enable submit button
      const firstCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(firstCheckbox);

      const submitButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(submitButton);

      expect(onAnswer).toHaveBeenCalledWith(question, expect.any(Array));
    });

    it('should pass renderPlayer function to GenreQuestionList', () => {
      const renderPlayer = vi.fn((src: string, idx: number) => (
        <div data-testid={`custom-player-${idx}`}>Custom Player: {src}</div>
      ));

      const question = {
        ...makeFakeGenreQuestion(),
        answers: [{ genre: 'rock', src: 'test-song.mp3' }],
      };

      renderGenreQuestionScreen({ renderPlayer, question });

      expect(screen.getByTestId('custom-player-0')).toBeInTheDocument();
      expect(screen.getByTestId('custom-player-0')).toHaveTextContent(
        'Custom Player: test-song.mp3',
      );
      expect(renderPlayer).toHaveBeenCalledWith('test-song.mp3', 0);
    });
  });
});
