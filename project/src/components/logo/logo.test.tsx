import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import Logo from './logo';

describe('Logo component', () => {
  const renderLogo = (variant?: 'primary' | 'secondary') => {
    return render(
      <MemoryRouter>
        <Logo variant={variant} />
      </MemoryRouter>,
    );
  };

  it('should render logo as a link element', () => {
    const { container } = renderLogo();
    expect(container.querySelector('.game__logo')).toBeInTheDocument();
    expect(container.querySelector('.game__back')).toBeInTheDocument();
  });

  it('should render with primary variant by default', () => {
    const { container } = renderLogo();
    expect(container.querySelector('.logo-primary')).toBeInTheDocument();
    expect(container.querySelector('.logo-secondary')).toBeNull();
  });

  it('should render with primary variant when explicitly set', () => {
    const { container } = renderLogo('primary');
    expect(container.querySelector('.logo-primary')).toBeInTheDocument();
    expect(container.querySelector('.logo-secondary')).toBeNull();
  });

  it('should render with secondary variant when specified', () => {
    const { container } = renderLogo('secondary');
    expect(container.querySelector('.logo-secondary')).toBeInTheDocument();
    expect(container.querySelector('.logo-primary')).toBeNull();
  });

  it('should have correct link attributes', () => {
    const { container } = renderLogo();
    const link = container.querySelector('.game__back');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should have accessible visually hidden text', () => {
    const { container } = renderLogo();
    const visuallyHiddenText = container.querySelector('.visually-hidden');
    expect(visuallyHiddenText).toBeInTheDocument();
    expect(visuallyHiddenText).toHaveTextContent('Play again');
  });
});
