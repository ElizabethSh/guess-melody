import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { AuthorizationStatus, NameSpace } from '@settings';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen, waitFor } from '@testing-library/react';

import App from './app';

const renderWithProvider = (storeState = {}, initialEntries?: string[]) => {
  const store = createMockStore(storeState);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </Provider>,
  );
};

describe('App component', () => {
  it('should render loader when authorization status is unknown', () => {
    renderWithProvider();
    expect(screen.getByText('Loading...')).toBeVisible();
  });
  it('should render loader when data is loading', () => {
    renderWithProvider({
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        email: null,
      },
      [NameSpace.Data]: { questions: [], isLoadingData: true, isError: false },
    });
    expect(screen.getByText('Loading...')).toBeVisible();
  });
  it('should render welcome screen on root path', () => {
    renderWithProvider(
      {
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          email: null,
        },
      },
      ['/'],
    );
    // Since WelcomeScreen is lazy loaded, we should see the Suspense fallback first
    expect(screen.getByText('Loading...')).toBeVisible();
    // After the lazy component loads, we should see the welcome screen
    waitFor(() => {
      expect(screen.getByText('The rules of the game')).toBeVisible();
    });
  });
});
