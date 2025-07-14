import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '@settings';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginScreen from './index';

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

describe('Login Page', () => {
  const renderLogin = (storeState = {}) => {
    const store = createMockStore({
      ...storeState,
    });

    return {
      store,
      ...render(
        <Provider store={store}>
          <MemoryRouter>
            <LoginScreen />
          </MemoryRouter>
        </Provider>,
      ),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render login page with correct title and form', () => {
      renderLogin();

      expect(
        screen.getByText(/would you like to know your result\?/i),
      ).toBeVisible();
      expect(screen.getByText(/please introduce yourself!/i)).toBeVisible();

      expect(screen.getByLabelText(/e-mail/i)).toBeVisible(); // Check for email input
      expect(
        screen.getByLabelText(/password/i, { selector: 'input' }),
      ).toBeVisible(); // Check for password input
      expect(screen.getByRole('button', { name: /log in/i })).toBeVisible();
      expect(screen.getByRole('button', { name: /play again/i })).toBeVisible();
    });

    it('should have correct attributes on play again button', () => {
      renderLogin();

      const playAgainButton = screen.getByRole('button', {
        name: /play again/i,
      });

      expect(playAgainButton).toHaveAttribute('type', 'button');
      expect(playAgainButton).toHaveClass('replay');
    });
  });

  describe('onReplayClick functionality', () => {
    it('should reset game state and navigate to game when play again is clicked', async () => {
      const user = userEvent.setup();
      const { store } = renderLogin({
        GAME: {
          mistakes: 5,
          step: 3,
        },
      });

      const playAgainButton = screen.getByRole('button', {
        name: /play again/i,
      });

      // Verify initial state
      expect(store.getState().GAME.mistakes).toBe(5);
      expect(store.getState().GAME.step).toBe(3);

      await user.click(playAgainButton);

      // Check that navigation was called with correct route
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Game);
      expect(mockNavigate).toHaveBeenCalledTimes(1);

      // Check that the game state was completely reset
      const state = store.getState();
      expect(state.GAME.mistakes).toBe(0);
      expect(state.GAME.step).toBe(0);
    });

    it('should work correctly when game state is already at initial values', async () => {
      const user = userEvent.setup();
      const { store } = renderLogin({
        GAME: {
          mistakes: 0,
          step: 0,
        },
      });

      const playAgainButton = screen.getByRole('button', {
        name: /play again/i,
      });

      await user.click(playAgainButton);

      // Check that navigation was called
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Game);

      // Check that the game state remains at initial values
      const state = store.getState();
      expect(state.GAME.mistakes).toBe(0);
      expect(state.GAME.step).toBe(0);
    });

    it('should reset game state when play again button is clicked', async () => {
      const user = userEvent.setup();
      const { store } = renderLogin({
        GAME: {
          mistakes: 3,
          step: 2,
        },
      });

      const playAgainButton = screen.getByRole('button', {
        name: /play again/i,
      });
      await user.click(playAgainButton);

      // Verify the side effects of resetGame action: state was reset
      const state = store.getState();
      expect(state.GAME.mistakes).toBe(0);
      expect(state.GAME.step).toBe(0);

      // Verify navigation was called
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Game);
    });

    it('should handle multiple rapid clicks correctly', async () => {
      const user = userEvent.setup();
      const { store } = renderLogin({
        GAME: {
          mistakes: 2,
          step: 1,
        },
      });

      const playAgainButton = screen.getByRole('button', {
        name: /play again/i,
      });

      // Click multiple times rapidly
      await user.click(playAgainButton);
      await user.click(playAgainButton);

      // Navigation should be called multiple times
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Game);
      expect(mockNavigate).toHaveBeenCalledTimes(2);

      // State should still be reset correctly
      const state = store.getState();
      expect(state.GAME.mistakes).toBe(0);
      expect(state.GAME.step).toBe(0);
    });
  });

  describe('Navigation effects', () => {
    it('should navigate to result page when user has email and completed all questions', () => {
      renderLogin({
        DATA: {
          questions: Array(5).fill({}),
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          step: 5,
          mistakes: 0,
        },
        USER: {
          email: 'test@mail.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Result);
    });

    it('should navigate to root page when user has email but has not completed all questions', () => {
      renderLogin({
        DATA: {
          questions: Array(5).fill({}),
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          step: 3, // Not completed yet
          mistakes: 1,
        },
        USER: {
          email: 'test@mail.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Root);
    });

    it('should navigate to root page when user has email and no game progress', () => {
      renderLogin({
        DATA: {
          questions: Array(5).fill({}),
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          step: 0,
          mistakes: 0,
        },
        USER: {
          email: 'test@mail.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Root);
    });

    it('should not navigate when user is not logged in (no email)', () => {
      renderLogin({
        DATA: {
          questions: Array(5).fill({}),
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          step: 5,
          mistakes: 0,
        },
        USER: {
          email: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should navigate to result page when user logs in after completing game', () => {
      const { rerender } = renderLogin({
        DATA: {
          questions: Array(5).fill({}),
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          step: 5,
          mistakes: 0,
        },
        USER: {
          email: null, // Initially not logged in
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      });

      // Initially no navigation should happen
      expect(mockNavigate).not.toHaveBeenCalled();

      // Simulate user logging in
      const storeWithEmail = createMockStore({
        DATA: {
          questions: Array(5).fill({}),
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          step: 5,
          mistakes: 0,
        },
        USER: {
          email: 'test@mail.com', // Now logged in
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      rerender(
        <Provider store={storeWithEmail}>
          <MemoryRouter>
            <LoginScreen />
          </MemoryRouter>
        </Provider>,
      );

      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Result);
    });

    it('should handle edge case when step is 0 and questions array is empty', () => {
      renderLogin({
        DATA: {
          questions: [],
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          step: 0,
          mistakes: 0,
        },
        USER: {
          email: 'test@mail.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Root);
    });

    it('should handle case when step is truthy but less than questions length', () => {
      renderLogin({
        DATA: {
          questions: Array(10).fill({}),
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          step: 7, // Less than 10
          mistakes: 2,
        },
        USER: {
          email: 'user@example.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Root);
    });

    it('should handle case when step is greater than questions length', () => {
      renderLogin({
        DATA: {
          questions: Array(5).fill({}),
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          step: 7, // Greater than 5
          mistakes: 1,
        },
        USER: {
          email: 'user@example.com',
          authorizationStatus: AuthorizationStatus.Auth,
        },
      });

      // Should navigate to root since step !== questions.length (strict equality)
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Root);
    });
  });
});
