import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import NotFoundPage from '.';

describe('Page: NotFound', () => {
  it('should render correctly', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '404' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Sorry, the page you are looking for doesn’t exist or has been moved.',
      ),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Go back to the main page' }),
    ).toBeVisible();
  });
});
