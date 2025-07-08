import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute } from '@settings';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import Login from './index';

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
    const store = createMockStore(storeState);

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );
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

    it('should handle play again button click', async () => {
      const user = userEvent.setup();
      renderLogin();

      const playAgainButton = screen.getByRole('button', {
        name: /play again/i,
      });
      await user.click(playAgainButton);

      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Game);
    });
  });

  it('should navigate to result page if step equals questions length', () => {
    renderLogin({
      DATA: {
        questions: Array(5).fill({}), // Mock 5 questions
      },
      GAME: {
        step: 5, // Step equals questions length
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
