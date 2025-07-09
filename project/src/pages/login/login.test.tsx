import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute } from '@settings';
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
      expect(screen.getByLabelText(/password/i)).toBeVisible(); // Check for password input
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
    it('should navigate to result page if step equals questions length', () => {
      renderLogin({
        DATA: {
          questions: Array(5).fill({}),
        },
        GAME: {
          step: 5,
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Result);
    });

    it('should navigate to root page if user email is present', () => {
      renderLogin({
        USER: {
          email: 'test@mail.com',
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Root);
    });
  });
});
