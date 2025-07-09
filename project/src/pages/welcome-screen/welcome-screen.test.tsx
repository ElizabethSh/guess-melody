import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute, AuthorizationStatus, MAX_ERRORS_COUNT } from '@settings';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WelcomeScreen from './index';

// Mock the navigate function
const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('WelcomeScreen', () => {
  const renderWelcomeScreen = (storeState = {}) => {
    const store = createMockStore({
      DATA: {
        questions: Array(5).fill({}),
        isLoadingData: false,
        isError: false,
      },
      ...storeState,
    });

    return {
      store,
      ...render(
        <Provider store={store}>
          <MemoryRouter>
            <WelcomeScreen />
          </MemoryRouter>
        </Provider>,
      ),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render welcome screen with logo and start button', () => {
      renderWelcomeScreen();

      expect(
        screen.getByRole('button', { name: /start the game/i }),
      ).toBeVisible();
      expect(screen.getByLabelText(/app logo/i)).toBeVisible();
    });

    it('should render game rules with correct error count', () => {
      renderWelcomeScreen();

      expect(
        screen.getByRole('heading', { name: /the rules of the game/i }),
      ).toBeVisible();
      expect(screen.getByText(/the rules are simple:/i)).toBeVisible();
      expect(
        screen.getByText(/you need to answer all the questions/i),
      ).toBeVisible();
      expect(
        screen.getByText(`You can make up to ${MAX_ERRORS_COUNT} mistakes.`),
      ).toBeVisible();
      expect(screen.getByText(/good luck!/i)).toBeVisible();
    });
  });

  describe('Authentication UI', () => {
    it('should show login link when user is not authenticated', () => {
      renderWelcomeScreen({
        USER: {
          email: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      });

      const loginLink = screen.getByRole('link', { name: /login/i });
      expect(loginLink).toBeVisible();
      expect(loginLink).toHaveAttribute('href', AppRoute.Login);
      expect(loginLink).toHaveClass('welcome__login', 'link');
    });

    it('should handle unknown authorization status (shows login link)', () => {
      renderWelcomeScreen({
        USER: {
          email: null,
          authorizationStatus: AuthorizationStatus.Unknown,
        },
      });

      // Should show login link (default behavior for non-Auth status)
      expect(screen.getByRole('link', { name: /login/i })).toBeVisible();
      expect(
        screen.queryByRole('button', { name: /log out/i }),
      ).not.toBeInTheDocument();
    });

    it('should show user info and logout button when user is authenticated', () => {
      renderWelcomeScreen({
        USER: {
          email: 'test@example.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      expect(screen.getByText('test@example.com')).toBeVisible();
      expect(screen.getByRole('button', { name: /log out/i })).toBeVisible();
      expect(
        screen.queryByRole('link', { name: /login/i }),
      ).not.toBeInTheDocument();
    });

    it('should render user email with correct styling', () => {
      renderWelcomeScreen({
        USER: {
          email: 'user@test.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      const emailElement = screen.getByText('user@test.com');
      expect(emailElement).toHaveClass('welcome__email');
    });

    it('should render logout button with correct properties', () => {
      renderWelcomeScreen({
        USER: {
          email: 'test@example.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      expect(logoutButton).toHaveClass('welcome__logout');
    });
  });

  describe('Start Game Functionality', () => {
    it('should navigate to game page when start button is clicked', async () => {
      const user = userEvent.setup();

      renderWelcomeScreen();

      const startButton = screen.getByRole('button', {
        name: /start the game/i,
      });
      await user.click(startButton);

      // Check that navigation was called
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Game);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should have correct button attributes', () => {
      renderWelcomeScreen();

      const startButton = screen.getByRole('button', {
        name: /start the game/i,
      });
      expect(startButton).toHaveAttribute('type', 'button');
      expect(startButton).toHaveClass('welcome__button');
    });

    it('should handle multiple rapid clicks correctly', async () => {
      const user = userEvent.setup();
      renderWelcomeScreen();

      const startButton = screen.getByRole('button', {
        name: /start the game/i,
      });

      await user.click(startButton);
      await user.click(startButton);

      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Game);
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Logout Functionality', () => {
    it('should render logout button when user is authenticated', async () => {
      renderWelcomeScreen({
        USER: {
          email: 'test@example.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      expect(logoutButton).toBeVisible();
      expect(logoutButton).toHaveClass('welcome__logout');
    });

    it('should not show logout button when user is not authenticated', () => {
      renderWelcomeScreen({
        USER: {
          email: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      });

      expect(
        screen.queryByRole('button', { name: /log out/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels', () => {
      renderWelcomeScreen();

      expect(screen.getByLabelText(/app logo/i)).toBeVisible();
    });

    it('should have visually hidden text for start button', () => {
      renderWelcomeScreen();

      const hiddenText = screen.getByText(/start the game/i);
      expect(hiddenText).toHaveClass('visually-hidden');
    });

    it('should have proper heading hierarchy', () => {
      renderWelcomeScreen();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('The rules of the game');
      expect(heading).toHaveClass('welcome__rules-title');
    });

    it('should have proper list structure for rules', () => {
      renderWelcomeScreen();

      const rulesList = screen.getByRole('list');
      expect(rulesList).toHaveClass('welcome__rules-list');

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });
  });

  describe('Integration', () => {
    it('should show correct UI for authenticated user', async () => {
      renderWelcomeScreen({
        USER: {
          email: 'player@example.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      // Verify user UI is shown
      expect(screen.getByText('player@example.com')).toBeVisible();
      expect(screen.getByRole('button', { name: /log out/i })).toBeVisible();
      expect(
        screen.queryByRole('link', { name: /login/i }),
      ).not.toBeInTheDocument();

      // Verify game can still be started
      expect(
        screen.getByRole('button', { name: /start the game/i }),
      ).toBeVisible();
    });
  });
});
