import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import Logo from './logo';

describe('Logo component', () => {
  const renderLogo = (path: string, variant?: 'primary' | 'secondary') => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Logo variant={variant} />
      </MemoryRouter>,
    );
  };
  it('should return logo without link on root path', () => {
    const { container } = renderLogo('/');
    expect(container.querySelector('.game__logo')).toBeInTheDocument();
    expect(container.querySelector('.game__back')).toBeNull();
  });

  it('should return logo with link on game path', () => {
    const { container } = renderLogo('/game');
    expect(container.querySelector('.game__logo')).toBeInTheDocument();
    expect(container.querySelector('.game__back')).toBeInTheDocument();
  });

  it('should render with primary variant by default', () => {
    const { container } = renderLogo('/game');
    expect(container.querySelector('.logo-primary')).toBeInTheDocument();
    expect(container.querySelector('.logo-secondary')).toBeNull();
  });

  it('should render with primary variant when explicitly set', () => {
    const { container } = renderLogo('/game', 'primary');
    expect(container.querySelector('.logo-primary')).toBeInTheDocument();
    expect(container.querySelector('.logo-secondary')).toBeNull();
  });

  it('should render with secondary variant when specified', () => {
    const { container } = renderLogo('/game', 'secondary');
    expect(container.querySelector('.logo-secondary')).toBeInTheDocument();
    expect(container.querySelector('.logo-primary')).toBeNull();
  });

  it('should render plain logo without variant classes on root path', () => {
    const { container } = renderLogo('/', 'secondary');
    expect(container.querySelector('.logo-primary')).toBeNull();
    expect(container.querySelector('.logo-secondary')).toBeNull();
    expect(container.querySelector('.game__back')).toBeNull();
  });
});
