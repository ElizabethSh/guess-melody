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

    expect(
      screen.getByRole('heading', { name: '404', level: 1 }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Page not found', level: 2 }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Sorry, the page you are looking for doesn’t exist or has been moved.',
      ),
    ).toBeVisible();

    // should have link to main page with correct href
    const mainPageLink = screen.getByRole('link', {
      name: 'Go back to the main page',
    });
    expect(mainPageLink).toBeVisible();
    expect(mainPageLink).toHaveAttribute('href', '/');
  });
});
