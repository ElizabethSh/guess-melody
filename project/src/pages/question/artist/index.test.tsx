import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { makeFakeArtistQuestion } from '@mocks/mocks';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ArtistQuestionScreen, { ArtistQuestionScreenProps } from './index';

// Mock PageHeader
vi.mock('../page-header', () => {
  return {
    default: () => <div data-testid="page-header">Page Header</div>,
  };
});

const renderArtistQuestionScreen = (
  props: Partial<ArtistQuestionScreenProps> = {},
) => {
  const defaultProps: ArtistQuestionScreenProps = {
    question: makeFakeArtistQuestion(),
    onAnswer: vi.fn(),
    renderPlayer: vi.fn((src: string, idx: number) => (
      <div data-testid={`player-${idx}`}>Player for {src}</div>
    )),
    ...props,
  };

  return render(
    <Provider store={createMockStore()}>
      <MemoryRouter>
        <ArtistQuestionScreen {...defaultProps} />
      </MemoryRouter>
    </Provider>,
  );
};

describe('ArtistQuestionScreen', () => {
  describe('Component Structure and Rendering', () => {
    it('should render with correct semantic structure and accessibility features', () => {
      renderArtistQuestionScreen();

      // Basic component structure
      const gameSection = document.querySelector('.game.game--artist');
      expect(gameSection).toBeInTheDocument();
      expect(screen.getByTestId('page-header')).toBeInTheDocument();

      // Accessibility - heading and form structure
      const heading = screen.getByRole('heading', {
        name: 'Who sings this song?',
        level: 2,
      });
      expect(heading).toBeVisible();
      expect(heading).toHaveClass('game__title');

      // Form elements
      const form = document.querySelector('.game__artist');
      expect(form).toBeInTheDocument();
    });

    it('should render all artist answer options as radio buttons', () => {
      const question = {
        ...makeFakeArtistQuestion(),
        answers: [
          { artist: 'Artist One', picture: 'pic1.jpg' },
          { artist: 'Artist Two', picture: 'pic2.jpg' },
          { artist: 'Artist Three', picture: 'pic3.jpg' },
        ],
      };

      renderArtistQuestionScreen({ question });

      // Check that all answer options are rendered as radio buttons
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons).toHaveLength(3);

      // Check that each radio button has correct attributes
      radioButtons.forEach((radio, index) => {
        expect(radio).toHaveAttribute('name', 'answer');
        expect(radio).toHaveAttribute('type', 'radio');
        expect(radio).toHaveAttribute('value', question.answers[index].artist);
      });

      // Check that labels are rendered correctly
      expect(screen.getByLabelText('Artist One')).toBeVisible();
      expect(screen.getByLabelText('Artist Two')).toBeVisible();
      expect(screen.getByLabelText('Artist Three')).toBeVisible();
    });

    it('should render artist images with correct alt text', () => {
      const question = {
        ...makeFakeArtistQuestion(),
        answers: [
          { artist: 'John Doe', picture: 'john.jpg' },
          { artist: 'Jane Smith', picture: 'jane.jpg' },
        ],
      };

      renderArtistQuestionScreen({ question });

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'john.jpg');
      expect(images[0]).toHaveAttribute('alt', 'John Doe');
      expect(images[1]).toHaveAttribute('src', 'jane.jpg');
      expect(images[1]).toHaveAttribute('alt', 'Jane Smith');
    });
  });

  describe('Player Integration', () => {
    it('should render player with correct song source', () => {
      const renderPlayer = vi.fn((src: string, idx: number) => (
        <div data-testid={`custom-player-${idx}`}>Custom Player: {src}</div>
      ));

      const question = {
        ...makeFakeArtistQuestion(),
        song: { artist: 'Test Artist', src: 'test-song.mp3' },
      };

      renderArtistQuestionScreen({ renderPlayer, question });

      expect(screen.getByTestId('custom-player-0')).toBeInTheDocument();
      expect(screen.getByTestId('custom-player-0')).toHaveTextContent(
        'Custom Player: test-song.mp3',
      );
      expect(renderPlayer).toHaveBeenCalledWith('test-song.mp3', 0);
    });
  });

  describe('User Interactions', () => {
    it('should call onAnswer when an artist is selected', async () => {
      const user = userEvent.setup();
      const onAnswer = vi.fn();
      const question = {
        ...makeFakeArtistQuestion(),
        answers: [
          { artist: 'Selected Artist', picture: 'pic1.jpg' },
          { artist: 'Other Artist', picture: 'pic2.jpg' },
        ],
      };

      renderArtistQuestionScreen({ onAnswer, question });

      const firstRadio = screen.getByLabelText('Selected Artist');
      await user.click(firstRadio);

      expect(onAnswer).toHaveBeenCalledWith(question, 'Selected Artist');
    });

    it('should handle multiple artist selections correctly', async () => {
      const user = userEvent.setup();
      const onAnswer = vi.fn();
      const question = {
        ...makeFakeArtistQuestion(),
        answers: [
          { artist: 'First Artist', picture: 'pic1.jpg' },
          { artist: 'Second Artist', picture: 'pic2.jpg' },
          { artist: 'Third Artist', picture: 'pic3.jpg' },
        ],
      };

      renderArtistQuestionScreen({ onAnswer, question });

      // Select first artist
      await user.click(screen.getByLabelText('First Artist'));
      expect(onAnswer).toHaveBeenCalledWith(question, 'First Artist');

      // Select second artist
      await user.click(screen.getByLabelText('Second Artist'));
      expect(onAnswer).toHaveBeenCalledWith(question, 'Second Artist');

      expect(onAnswer).toHaveBeenCalledTimes(2);
    });

    it('should handle artists with special characters in names', async () => {
      const user = userEvent.setup();
      const onAnswer = vi.fn();
      const question = {
        ...makeFakeArtistQuestion(),
        answers: [
          { artist: "Guns N' Roses", picture: 'gnr.jpg' },
          { artist: 'AC/DC', picture: 'acdc.jpg' },
          { artist: 'Sigur Rós', picture: 'sigur.jpg' },
        ],
      };

      renderArtistQuestionScreen({ onAnswer, question });

      await user.click(screen.getByLabelText("Guns N' Roses"));
      expect(onAnswer).toHaveBeenCalledWith(question, "Guns N' Roses");

      await user.click(screen.getByLabelText('AC/DC'));
      expect(onAnswer).toHaveBeenCalledWith(question, 'AC/DC');

      await user.click(screen.getByLabelText('Sigur Rós'));
      expect(onAnswer).toHaveBeenCalledWith(question, 'Sigur Rós');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure and associations', () => {
      const question = {
        ...makeFakeArtistQuestion(),
        answers: [{ artist: 'Test Artist', picture: 'test.jpg' }],
      };

      renderArtistQuestionScreen({ question });

      const radio = screen.getByRole('radio');

      // Check proper id
      expect(radio).toHaveAttribute('id', 'answer-Test-Artist');

      // Check that label is properly associated (using getByLabelText confirms the association)
      const labelElement = screen.getByLabelText('Test Artist');
      expect(labelElement).toBe(radio);

      // Check radio is properly hidden but accessible
      expect(radio).toHaveClass('visually-hidden');
    });
  });
});
