import { useUserAnswers } from '@hooks/use-user-answers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GenreQuestion } from 'types/question';

import GenreQuestionList from '.';

// Mock the useUserAnswers hook
vi.mock('@hooks/use-user-answers', () => ({
  useUserAnswers: vi.fn(),
}));

type MockQuestionItemProps = {
  id: number;
};

// Mock the GenreQuestionItem component
vi.mock('../item', () => ({
  default: ({ id }: MockQuestionItemProps) => (
    <div data-testid={`question-item-${id}`} />
  ),
}));

describe('GenreQuestionList', () => {
  const mockQuestion: GenreQuestion = {
    answers: [
      { genre: 'Rock', src: 'rock.mp3' },
      { genre: 'Jazz', src: 'jazz.mp3' },
      { genre: 'Pop', src: 'pop.mp3' },
      { genre: 'Country', src: 'country.mp3' },
    ],
    genre: 'Rock',
    type: 'genre',
  };

  const mockOnAnswer = vi.fn();
  const mockHandleAnswerChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the hook to return initial state
    vi.mocked(useUserAnswers).mockReturnValue([
      [false, false, false, false],
      mockHandleAnswerChange,
    ]);
  });

  const defaultProps = {
    question: mockQuestion,
    onAnswer: mockOnAnswer,
    renderPlayer: vi.fn(),
  };

  describe('rendering', () => {
    it('should render form with correct accessibility attributes', () => {
      render(<GenreQuestionList {...defaultProps} />);

      const form = screen.getByRole('group');
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute('aria-labelledby', 'genre-question-heading');
      expect(form).toHaveClass('game__tracks');
    });

    it('should render all question items', () => {
      render(<GenreQuestionList {...defaultProps} />);

      mockQuestion.answers.forEach((_answer, index) => {
        const item = screen.getByTestId(`question-item-${index}`);
        expect(item).toBeInTheDocument();
      });
    });

    it('should render submit button with correct initial state', () => {
      render(<GenreQuestionList {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Confirm' });
      expect(submitButton).toBeVisible();
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(submitButton).toHaveAttribute(
        'aria-describedby',
        'submit-helper-text',
      );
    });

    it('should render helper text for submit button', () => {
      render(<GenreQuestionList {...defaultProps} />);

      const helperText = screen.getByText(
        'Please select at least one track before submitting',
      );
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveAttribute('id', 'submit-helper-text');
      expect(helperText).toHaveClass('visually-hidden');
    });
  });

  describe('user interactions', () => {
    it('should enable submit button when answers are selected', () => {
      // Mock hook to return some selected answers
      vi.mocked(useUserAnswers).mockReturnValue([
        [true, false, false, false], // first answer selected
        mockHandleAnswerChange,
      ]);

      render(<GenreQuestionList {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Confirm' });
      expect(submitButton).toBeEnabled();

      const helperText = screen.getByText('Submit your selected answers');
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveClass('visually-hidden');
    });

    it('should call onAnswer when form is submitted', async () => {
      const user = userEvent.setup();

      // Mock hook to return selected answers
      const mockAnswers = [true, false, true, false];
      vi.mocked(useUserAnswers).mockReturnValue([
        mockAnswers,
        mockHandleAnswerChange,
      ]);

      render(<GenreQuestionList {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(mockOnAnswer).toHaveBeenCalledTimes(1);
      expect(mockOnAnswer).toHaveBeenCalledWith(mockQuestion, mockAnswers);
    });
  });
});
