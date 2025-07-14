import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '@settings';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WinScreen from './index';

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

describe('WinScreen Component', () => {
  const mockQuestions = [
    {
      type: 'artist' as const,
      song: { artist: 'Artist 1', src: 'song1.mp3' },
      answers: [
        { artist: 'Artist 1', picture: 'pic1.jpg' },
        { artist: 'Artist 2', picture: 'pic2.jpg' },
      ],
    },
    {
      type: 'genre' as const,
      genre: 'rock',
      answers: [
        { genre: 'rock', src: 'rock.mp3' },
        { genre: 'pop', src: 'pop.mp3' },
      ],
    },
  ];

  const renderWithProvider = (storeState = {}) => {
    const store = createMockStore({
      DATA: {
        questions: mockQuestions,
        isLoadingData: false,
        isError: false,
      },
      GAME: {
        mistakes: 0,
        step: 2,
      },
      ...storeState,
    });

    return {
      store,
      ...render(
        <Provider store={store}>
          <MemoryRouter>
            <WinScreen />
          </MemoryRouter>
        </Provider>,
      ),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render win screen with correct title', () => {
      renderWithProvider();

      expect(
        screen.getByRole('heading', {
          name: 'You are a real music lover!',
          level: 2,
        }),
      ).toBeVisible();
    });

    it('should render play again button', () => {
      renderWithProvider();

      const playAgainButton = screen.getByRole('button', {
        name: /play again/i,
      });
      expect(playAgainButton).toBeVisible();
      expect(playAgainButton).toHaveAttribute('type', 'button');
      expect(playAgainButton).toHaveClass('replay', 'result__button');
    });

    it('should render correct results message with questions and mistakes', () => {
      renderWithProvider({
        GAME: {
          mistakes: 1,
          step: 2,
        },
      });

      expect(
        screen.getByText(
          'You answered 1 questions correctly and made 1 mistake',
        ),
      ).toBeVisible();
    });

    it('should render correct results message with multiple mistakes', () => {
      renderWithProvider({
        GAME: {
          mistakes: 2,
          step: 2,
        },
      });

      expect(
        screen.getByText(
          'You answered 0 questions correctly and made 2 mistakes',
        ),
      ).toBeVisible();
    });

    it('should render no questions message when no questions available', () => {
      renderWithProvider({
        DATA: {
          questions: [],
          isLoadingData: false,
          isError: false,
        },
      });

      expect(screen.getByText('No questions were answered.')).toBeVisible();
    });

    it('should render no questions message when step is 0', () => {
      renderWithProvider({
        GAME: {
          mistakes: 0,
          step: 0,
        },
      });

      expect(screen.getByText('No questions were answered.')).toBeVisible();
    });

    it('should handle edge case where mistakes exceed questions', () => {
      renderWithProvider({
        GAME: {
          mistakes: 5,
          step: 2,
        },
      });

      expect(
        screen.getByText(
          'You answered 0 questions correctly and made 5 mistakes',
        ),
      ).toBeVisible();
    });
  });

  describe('Authentication Section', () => {
    it('should not render logout button when user is not authenticated', () => {
      renderWithProvider({
        USER: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          email: null,
        },
      });

      expect(
        screen.queryByRole('button', { name: 'Log out' }),
      ).not.toBeInTheDocument();
    });

    it('should render logout button when user is authenticated', () => {
      renderWithProvider({
        USER: {
          authorizationStatus: AuthorizationStatus.Auth,
          email: 'test@example.com',
        },
      });

      const logoutButton = screen.queryByRole('button', { name: 'Log out' });
      expect(logoutButton).toBeVisible();
    });

    it('should not render logout button when authorization status is unknown', () => {
      renderWithProvider({
        USER: {
          authorizationStatus: AuthorizationStatus.Unknown,
          email: null,
        },
      });

      expect(
        screen.queryByRole('button', { name: 'Log out' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should reset game and navigate to game screen when play again button is clicked', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProvider({
        GAME: {
          mistakes: 2,
          step: 2,
        },
      });

      const playAgainButton = screen.getByRole('button', {
        name: /play again/i,
      });
      await user.click(playAgainButton);

      // Verify the effect: game state should be reset to initial values
      const state = store.getState();
      expect(state.GAME.mistakes).toBe(0);
      expect(state.GAME.step).toBe(0);

      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Game);
    });

    it('should logout and navigate to root when logout button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider({
        USER: {
          authorizationStatus: AuthorizationStatus.Auth,
          email: 'test@example.com',
        },
      });

      const logoutButton = screen.getByText('Log out');
      await user.click(logoutButton);

      // Verify navigation occurs
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Root);

      // Note: The actual logout action is async and its state changes
      // are tested separately in the user slice tests
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

    it('should render auth section when user is authenticated', () => {
      const { container } = renderWithProvider({
        USER: {
          authorizationStatus: AuthorizationStatus.Auth,
          email: 'test@example.com',
        },
      });

      const authSection = container.querySelector('.result__logout-wrapper');
      expect(authSection).toBeInTheDocument();
    });
  });

  describe('Result Message Logic', () => {
    it('should calculate correct answers correctly', () => {
      renderWithProvider({
        DATA: {
          questions: mockQuestions, // 2 questions
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          mistakes: 0,
          step: 2,
        },
      });

      expect(
        screen.getByText(
          'You answered 2 questions correctly and made 0 mistakes',
        ),
      ).toBeVisible();
    });

    it('should handle case with perfect score', () => {
      renderWithProvider({
        DATA: {
          questions: [mockQuestions[0]], // 1 question
          isLoadingData: false,
          isError: false,
        },
        GAME: {
          mistakes: 0,
          step: 1,
        },
      });

      expect(
        screen.getByText(
          'You answered 1 questions correctly and made 0 mistakes',
        ),
      ).toBeVisible();
    });

    it('should use singular form for single mistake', () => {
      renderWithProvider({
        GAME: {
          mistakes: 1,
          step: 2,
        },
      });

      expect(
        screen.getByText(
          'You answered 1 questions correctly and made 1 mistake',
        ),
      ).toBeVisible();
    });

    it('should use plural form for multiple mistakes', () => {
      renderWithProvider({
        GAME: {
          mistakes: 2,
          step: 2,
        },
      });

      expect(
        screen.getByText(
          'You answered 0 questions correctly and made 2 mistakes',
        ),
      ).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithProvider();

      const heading = screen.getByRole('heading', {
        name: 'You are a real music lover!',
        level: 2,
      });
      expect(heading).toHaveClass('main__title');
    });

    it('should have accessible play again button', () => {
      renderWithProvider();

      const button = screen.getByRole('button', { name: /play again/i });
      expect(button).toBeVisible();
      expect(button).toBeEnabled();
    });

    it('should have accessible logout button when authenticated', () => {
      renderWithProvider({
        USER: {
          authorizationStatus: AuthorizationStatus.Auth,
          email: 'test@example.com',
        },
      });

      const logoutButton = screen.getByRole('button', { name: 'Log out' });
      expect(logoutButton).toBeVisible();
      expect(logoutButton.closest('button')).toBeEnabled();
    });

    it('should have proper text content for screen readers', () => {
      renderWithProvider();

      expect(screen.getByText('You are a real music lover!')).toBeVisible();
      expect(
        screen.getByText(/you answered \d+ questions correctly/i),
      ).toBeVisible();
    });
  });
});
