import { makeFakeGenreQuestion } from '@mocks/mocks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GenreQuestionAnswer, RenderPlayer } from 'types/question';

import GenreQuestionItem from '.';

describe('Genre Question Item', () => {
  const fakeQuestion = makeFakeGenreQuestion();
  const mockAnswer: GenreQuestionAnswer = fakeQuestion.answers[0];

  const renderPlayer: RenderPlayer = (path: string, playerIndex: number) => (
    <audio src={path} data-testid={`player-${playerIndex}`}>
      <track kind="captions" src="" label="No captions available" />
    </audio>
  );

  const defaultProps = {
    id: 1,
    answer: mockAnswer,
    renderPlayer,
    onChange: vi.fn(),
    userAnswer: false,
  };

  describe('rendering', () => {
    it('should render checkbox input with correct attributes', () => {
      render(<GenreQuestionItem {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('id', 'answer-1');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
      expect(checkbox).toHaveAttribute('name', 'answer');
      expect(checkbox).toHaveAttribute('value', 'answer-1');
      expect(checkbox).toHaveAttribute(
        'aria-describedby',
        'answer-1-description',
      );
      expect(checkbox).not.toBeChecked();
    });

    it('should render checkbox as checked when userAnswer is true', () => {
      const props = {
        ...defaultProps,
        userAnswer: true,
      };
      render(<GenreQuestionItem {...props} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should render description element with correct content', () => {
      render(<GenreQuestionItem {...defaultProps} />);

      const description = screen.getByText(
        `${mockAnswer.genre} music track for genre question`,
      );
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('id', 'answer-1-description');
    });
  });

  it('should render label with correct text and htmlFor attribute', () => {
    const props = {
      ...defaultProps,
      id: 2,
    };

    render(<GenreQuestionItem {...props} />);

    const label = screen.getByText('Select');
    expect(label).toBeVisible();
    expect(label).toHaveAttribute('for', 'answer-2');
  });

  it('should render audio player with correct props', () => {
    const props = {
      ...defaultProps,
      id: 3,
    };

    render(<GenreQuestionItem {...props} />);

    const audioPlayer = screen.getByTestId('player-3');
    expect(audioPlayer).toBeInTheDocument();
    expect(audioPlayer).toHaveAttribute('src', mockAnswer.src);
  });

  it('should call onChange with correct parameters when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const props = {
      ...defaultProps,
      id: 5,
      onChange,
    };
    render(<GenreQuestionItem {...props} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(5, true);
  });
});
