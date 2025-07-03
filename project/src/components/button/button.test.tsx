import { render, screen } from '@testing-library/react';

import Button from '.';

describe('Button', () => {
  it('renders with primary variant', () => {
    render(<Button label="Primary Button" />);

    const button = screen.getByRole('button', { name: 'Primary Button' });
    expect(button).toBeVisible();
    expect(button).toHaveClass('button', 'button-primary');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders with secondary variant', () => {
    render(
      <Button label="Secondary Button" variant="secondary" type="submit" />,
    );

    const button = screen.getByRole('button', { name: 'Secondary Button' });
    expect(button).toBeVisible();
    expect(button).toHaveClass('button', 'button-secondary');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders with custom className and disabled', () => {
    render(
      <Button label="Custom Button" className="custom-class" disabled={true} />,
    );

    const button = screen.getByRole('button', { name: 'Custom Button' });
    expect(button).toBeVisible();
    expect(button).toHaveClass('button', 'custom-class');
    expect(button).toBeDisabled();
  });
});
