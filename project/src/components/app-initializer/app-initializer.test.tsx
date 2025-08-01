import { Provider } from 'react-redux';
import { NameSpace } from '@settings';
import { fetchQuestionAction } from '@store/api-actions';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { State } from 'types/state';

import AppInitializer from '.';

vi.mock('@components/error-screen', () => ({
  default: ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div data-testid="error-screen">
      <p>{message}</p>
      <button onClick={onRetry} data-testid="retry-button">
        Try Again
      </button>
    </div>
  ),
}));

// Mock the API actions to return simple action objects
vi.mock('@store/api-actions', () => ({
  fetchQuestionAction: vi.fn(() => ({ type: 'fetchQuestionAction' })),
  checkAuthAction: vi.fn(() => ({ type: 'checkAuthAction' })),
}));

// Only mock the slices that have complex extraReducers to avoid async action issues
vi.mock('@store/slices/data/data', () => ({
  gameQuestionsSlice: {
    reducer: (
      state = { questions: [], isLoadingData: false, isError: false },
    ) => state,
  },
  selectQuestions: (state: State) => state[NameSpace.Data]?.questions || [],
  selectLoadingDataStatus: (state: State) =>
    state[NameSpace.Data]?.isLoadingData || false,
  selectLoadingDataError: (state: State) =>
    state[NameSpace.Data]?.isError || false,
}));

vi.mock('@store/slices/user/user', () => ({
  userProcessSlice: {
    reducer: (state = { authorizationStatus: 'AUTH', email: null }) => state,
  },
  selectAuthorizationStatus: (state: State) =>
    state[NameSpace.User]?.authorizationStatus || 'AUTH',
  selectUserEmail: (state: State) => state[NameSpace.User]?.email || null,
}));

const TestChild = () => <div data-testid="app-content">App Content</div>;

const renderWithProvider = (storeState = {}) => {
  const store = createMockStore(storeState);
  return render(
    <Provider store={store}>
      <AppInitializer>
        <TestChild />
      </AppInitializer>
    </Provider>,
  );
};

describe('AppInitializer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    it('should show loader when data is being fetched', () => {
      renderWithProvider({
        [NameSpace.Data]: {
          questions: [],
          isLoadingData: true,
          isError: false,
        },
      });

      expect(screen.getByText('Loading...')).toBeVisible();
      expect(screen.queryByTestId('app-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-screen')).not.toBeInTheDocument();
    });
  });

  describe('error states', () => {
    it('should show error screen when there is a fetch error', () => {
      renderWithProvider({
        [NameSpace.Data]: {
          questions: [],
          isLoadingData: false,
          isError: true,
        },
      });

      expect(screen.getByTestId('error-screen')).toBeInTheDocument();
      expect(
        screen.getByText(/Failed to load game questions/),
      ).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByTestId('app-content')).not.toBeInTheDocument();
    });

    it('should show error screen when no questions are available', () => {
      renderWithProvider();

      expect(screen.getByTestId('error-screen')).toBeInTheDocument();
      expect(
        screen.getByText(/No game questions available/),
      ).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByTestId('app-content')).not.toBeInTheDocument();
    });

    it('should dispatch fetchQuestionAction when retry button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProvider();

      // Clear the mock to only count calls from the retry button click
      vi.clearAllMocks();

      const retryButton = screen.getByTestId('retry-button');
      await user.click(retryButton);

      expect(fetchQuestionAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('success state', () => {
    it('should render children when questions are loaded successfully', () => {
      renderWithProvider({
        [NameSpace.Data]: {
          questions: [
            {
              type: 'artist',
              song: { artist: 'Test Artist', src: 'test.mp3' },
              answers: [],
            },
          ],
          isLoadingData: false,
          isError: false,
        },
      });

      expect(screen.getByTestId('app-content')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-screen')).not.toBeInTheDocument();
    });
  });
});
