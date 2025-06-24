import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPage from '.';

describe('Error Page', () => {
  it('should render correctly', () => {
    const onButtonClick = vi.fn();
    render(<ErrorPage onButtonClick={onButtonClick} />);

    expect(screen.getByRole('heading', { name: 'Error' })).toBeVisible();
    expect(
      screen.getByText('Something went wrong. Please try again.'),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  });

  it('should call onButtonClick when button is clicked', async () => {
    const user = userEvent.setup();
    const onButtonClick = vi.fn();
    render(<ErrorPage onButtonClick={onButtonClick} />);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });
});
