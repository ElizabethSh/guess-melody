import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Logo from './logo';

describe('Logo component', () => {
  it('should return logo without link on root path', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Logo />
      </MemoryRouter>,
    );
    expect(container.querySelector('.game__logo')).toBeVisible();
    expect(container.querySelector('.game__back')).toBeNull();
  });
  it('should return logo with link on game path', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/game']}>
        <Logo />
      </MemoryRouter>,
    );
    expect(container.querySelector('.game__logo')).toBeVisible();
    expect(container.querySelector('.game__back')).toBeInTheDocument();
  });
});
