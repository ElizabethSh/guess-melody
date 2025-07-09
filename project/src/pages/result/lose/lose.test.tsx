import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute } from '@settings';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoseScreen from './index';

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

describe('LoseScreen Component', () => {
  const renderWithProvider = (storeState = {}) => {
    const store = createMockStore({
      GAME: {
        mistakes: 3,
        step: 5,
        ...storeState,
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <LoseScreen />
        </MemoryRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render lose screen with correct title and description', () => {
      renderWithProvider();

      expect(
        screen.getByRole('heading', { name: 'What a pity!', level: 2 }),
      ).toBeVisible();
      expect(screen.getByText(/you've run out of attempts/i)).toBeVisible();
      expect(
        screen.getByText(/never mind, you'll be lucky next time!/i),
      ).toBeVisible();
    });

    it('should render try again button', () => {
      renderWithProvider();

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeVisible();
      expect(tryAgainButton).toHaveAttribute('type', 'button');
    });
  });

  describe('User Interactions', () => {
    it('should reset game and navigate to game screen when try again button is clicked', async () => {
      const user = userEvent.setup();
      const customStore = createMockStore({
        GAME: {
          mistakes: 3,
          step: 5,
        },
      });

      render(
        <Provider store={customStore}>
          <MemoryRouter>
            <LoseScreen />
          </MemoryRouter>
        </Provider>,
      );

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      await user.click(tryAgainButton);

      // Verify the effect: game state should be reset to initial values
      const state = customStore.getState();
      expect(state.GAME.mistakes).toBe(0);
      expect(state.GAME.step).toBe(0); // FIRST_GAME_STEP from settings

      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Game);
    });
  });

  describe('Layout Integration', () => {
    it('should render within Layout component with correct className', () => {
      const { container } = renderWithProvider();

      const layoutSection = container.querySelector('section.game');
      expect(layoutSection).toBeInTheDocument();

      const mainElement = container.querySelector('.game__screen.result');
      expect(mainElement).toBeInTheDocument();
    });

    it('should render logo in header by default', () => {
      const { container } = renderWithProvider();

      const header = container.querySelector('.game__header');
      expect(header).toBeInTheDocument();

      const logo = container.querySelector('.game__logo');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithProvider();

      const heading = screen.getByRole('heading', {
        name: 'What a pity!',
        level: 2,
      });
      expect(heading).toHaveClass('main__title');
    });

    it('should have accessible button', () => {
      renderWithProvider();

      const button = screen.getByRole('button', { name: /try again/i });
      expect(button).toBeVisible();
      expect(button).toBeEnabled();
    });

    it('should have proper text content for screen readers', () => {
      renderWithProvider();

      expect(screen.getByText('What a pity!')).toBeVisible();
      expect(screen.getByText(/you've run out of attempts/i)).toBeVisible();
      expect(
        screen.getByText(/never mind, you'll be lucky next time!/i),
      ).toBeVisible();
    });
  });
});
