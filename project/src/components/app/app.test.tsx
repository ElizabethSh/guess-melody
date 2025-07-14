import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { makeFakeArtistQuestion, makeFakeGenreQuestion } from '@mocks/mocks';
import { AuthorizationStatus, NameSpace } from '@settings';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';

import App from './app';

const renderWithProvider = (initialEntries?: string[], storeState = {}) => {
  return render(
    <Provider store={createMockStore(storeState)}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </Provider>,
  );
};

describe('App component', () => {
  it('should render welcome screen on root path', async () => {
    renderWithProvider(['/']);

    // Since WelcomeScreen is lazy loaded, we should see the Suspense fallback first
    expect(screen.getByText('Loading...')).toBeVisible();

    // After the lazy component loads, we should see the welcome screen
    expect(
      await screen.findByRole('heading', { name: 'The rules of the game' }),
    ).toBeVisible();
  });

  it('should render login screen on login path', async () => {
    renderWithProvider(['/login']);

    // Should show Suspense fallback initially
    expect(screen.getByText('Loading...')).toBeVisible();

    // After lazy loading, should show login screen
    expect(
      await screen.findByRole('heading', {
        name: /Would you like to know your result\?/i,
      }),
    ).toBeVisible();
  });

  it('should render protected content (WinScreen) with PrivateRoute', async () => {
    renderWithProvider(['/result'], {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        email: 'test@example.com',
      },
    });

    // Should show Suspense fallback initially for lazy-loaded components
    expect(screen.getByText('Loading...')).toBeVisible();

    // After lazy loading, should show win screen (protected by PrivateRoute)
    expect(
      await screen.findByRole('heading', {
        name: 'You are a real music lover!',
      }),
    ).toBeVisible();
  });

  it('should render game screen on game path', async () => {
    // Generate mock questions using the mock utility functions
    const mockQuestions = [makeFakeGenreQuestion(), makeFakeArtistQuestion()];

    renderWithProvider(['/game'], {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        email: 'test@example.com',
      },
      [NameSpace.Data]: {
        questions: mockQuestions,
      },
    });

    // Should show Suspense fallback initially
    expect(screen.getByText('Loading...')).toBeVisible();

    // After lazy loading, should show game screen with genre question (first question in mock)
    expect(
      await screen.findByRole('heading', { name: /Select .* tracks/i }),
    ).toBeVisible();
  });

  it('should render lose screen on lose path', async () => {
    renderWithProvider(['/lose']);

    // Should show Suspense fallback initially
    expect(screen.getByText('Loading...')).toBeVisible();

    // After lazy loading, should show lose screen
    expect(
      await screen.findByRole('heading', { name: 'What a pity!' }),
    ).toBeVisible();
  });

  it('should render not found screen for unknown routes', async () => {
    renderWithProvider(['/unknown-route']);

    // Should show Suspense fallback initially
    expect(screen.getByText('Loading...')).toBeVisible();

    // After lazy loading, should show not found screen
    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeVisible();
  });
});
