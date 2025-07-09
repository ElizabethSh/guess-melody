import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockStore } from 'test-utils/mock-store';

import AudioPlayer from '.';

// Mock HTML5 Audio API
const mockPlay = vi.fn();
const mockPause = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

// Store event listeners so we can trigger them in tests
type EventListener = (event?: Event) => void;
const eventListeners: Record<string, EventListener[]> = {};

// Store references to audio elements created by React
let currentAudioElement: HTMLAudioElement | null = null;

// Override createElement to capture audio elements
const originalCreateElement = document.createElement;
document.createElement = vi.fn((tagName: string) => {
  if (tagName === 'audio') {
    const audioElement = originalCreateElement.call(
      document,
      tagName,
    ) as HTMLAudioElement;

    // Override methods on the actual audio element
    audioElement.play = mockPlay;
    audioElement.pause = mockPause;
    audioElement.addEventListener = vi.fn(
      (event: string, listener: EventListener) => {
        if (!eventListeners[event]) {
          eventListeners[event] = [];
        }
        eventListeners[event].push(listener);
        mockAddEventListener(event, listener);
      },
    );
    audioElement.removeEventListener = vi.fn(
      (event: string, listener: EventListener) => {
        if (eventListeners[event]) {
          const index = eventListeners[event].indexOf(listener);
          if (index > -1) {
            eventListeners[event].splice(index, 1);
          }
        }
        mockRemoveEventListener(event, listener);
      },
    );

    currentAudioElement = audioElement;
    return audioElement;
  }
  return originalCreateElement.call(document, tagName);
});

// Helper functions for tests
const triggerAudioEvent = (eventType: string) => {
  const listeners = eventListeners[eventType];
  if (listeners) {
    const mockEvent = {
      target: currentAudioElement,
      type: eventType,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };
    listeners.forEach((listener) => listener(mockEvent as unknown as Event));
  }
};

const clearEventListeners = () => {
  Object.keys(eventListeners).forEach((key) => {
    eventListeners[key] = [];
  });
  currentAudioElement = null;
};

const defaultProps = {
  isPlaying: false,
  onPlayAudioClick: vi.fn(),
  src: 'test-audio.mp3',
};

// Helper to render with Redux Provider
const renderWithProvider = (props = {}, storeState = {}) => {
  const store = createMockStore(storeState);
  const componentProps = { ...defaultProps, ...props };
  return {
    store,
    ...render(
      <Provider store={store}>
        <AudioPlayer {...componentProps} />
      </Provider>,
    ),
  };
};

describe('AudioPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPlay.mockResolvedValue(undefined);
    clearEventListeners();
  });

  describe('Rendering', () => {
    it('should render pause button when playing', async () => {
      renderWithProvider({ isPlaying: true });

      // Simulate audio loading successfully and wait for state update
      await waitFor(() => {
        triggerAudioEvent('loadeddata');
        const button = screen.getByRole('button');
        expect(button).toBeEnabled();
        expect(button).toHaveClass('track__button--pause');
      });
    });

    it('should render audio element with correct src', () => {
      renderWithProvider({ src: 'test-song.mp3' });

      const audio = document.querySelector('audio');
      expect(audio).toBeInTheDocument();
      expect(audio).toHaveAttribute('src', 'test-song.mp3');
      expect(audio).toHaveAttribute('preload', 'metadata');
    });
  });

  describe('Loading State', () => {
    it('should start with button disabled during loading', () => {
      renderWithProvider();

      const button = screen.getByRole('button');
      expect(button).toHaveClass('track__button--play');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-label', 'Loading audio...');
    });

    it('should enable button when audio loads successfully', async () => {
      renderWithProvider();

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      // Simulate successful audio loading and wait for state update
      await waitFor(() => {
        triggerAudioEvent('loadeddata');
        expect(button).toBeEnabled();
        expect(button).toHaveAttribute('aria-label', 'Play audio');
      });
    });

    it('should reset loading state when src changes', async () => {
      const { rerender, store } = renderWithProvider();

      // Simulate audio loaded and wait for state update
      await waitFor(() => {
        triggerAudioEvent('loadeddata');
        expect(screen.getByRole('button')).toBeEnabled();
      });

      // Change src
      rerender(
        <Provider store={store}>
          <AudioPlayer {...defaultProps} src="new-audio.mp3" />
        </Provider>,
      );

      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Loading audio...',
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle audio loading errors', async () => {
      renderWithProvider();

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      // Simulate audio loading error and wait for state update
      await waitFor(() => {
        triggerAudioEvent('error');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-label', 'Audio unavailable');
      });
    });

    it('should handle play promise rejection', async () => {
      const { store } = renderWithProvider({ isPlaying: true });
      mockPlay.mockRejectedValue(new Error('Play failed'));

      // Simulate audio loaded and wait for error handling
      await waitFor(() => {
        triggerAudioEvent('loadeddata');
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-label', 'Audio unavailable');
      });

      // Also check that a notification was dispatched
      await waitFor(() => {
        const state = store.getState();
        const notifications = state.NOTIFICATIONS.notifications;
        expect(notifications.length).toBeGreaterThan(0);
        expect(notifications).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: 'Playback Error',
              description: 'Failed to play audio. Please try again.',
              type: 'error',
            }),
          ]),
        );
      });
    });
  });

  describe('Playback Control', () => {
    it('should call play when isPlaying becomes true', async () => {
      const { rerender, store } = renderWithProvider();

      // Simulate audio loaded and wait for state update
      await waitFor(() => {
        triggerAudioEvent('loadeddata');
        expect(screen.getByRole('button')).toBeEnabled();
      });

      rerender(
        <Provider store={store}>
          <AudioPlayer {...defaultProps} isPlaying />
        </Provider>,
      );

      await waitFor(() => {
        expect(mockPlay).toHaveBeenCalledTimes(1);
      });
    });

    it('should call pause when isPlaying becomes false', async () => {
      const { rerender, store } = renderWithProvider({ isPlaying: true });

      // Simulate audio loaded and wait for state update
      await waitFor(() => {
        triggerAudioEvent('loadeddata');
        expect(screen.getByRole('button')).toBeEnabled();
      });

      rerender(
        <Provider store={store}>
          <AudioPlayer {...defaultProps} isPlaying={false} />
        </Provider>,
      );

      await waitFor(() => {
        expect(mockPause).toHaveBeenCalledTimes(1);
      });
    });

    it('should not attempt playback while loading', async () => {
      renderWithProvider({ isPlaying: true });

      // Button should be disabled while loading
      expect(screen.getByRole('button')).toBeDisabled();
      expect(mockPlay).not.toHaveBeenCalled();
    });

    it('should not attempt playback when there is an error', async () => {
      renderWithProvider({ isPlaying: true });

      // Simulate audio error and wait for state update
      await waitFor(() => {
        triggerAudioEvent('error');
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-label',
          'Audio unavailable',
        );
      });

      expect(mockPlay).not.toHaveBeenCalled();
    });
  });

  describe('Event Listeners', () => {
    it('should add event listeners on mount', () => {
      renderWithProvider();

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'loadeddata',
        expect.any(Function),
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'error',
        expect.any(Function),
      );
    });

    it('should clean up event listeners when src changes', () => {
      const { rerender, store } = renderWithProvider({ src: 'audio1.mp3' });

      // Check that our component's event listeners are added
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'loadeddata',
        expect.any(Function),
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'error',
        expect.any(Function),
      );

      const initialCallCount = mockAddEventListener.mock.calls.length;

      rerender(
        <Provider store={store}>
          <AudioPlayer {...defaultProps} src="audio2.mp3" />
        </Provider>,
      );

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'loadeddata',
        expect.any(Function),
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'error',
        expect.any(Function),
      );

      // New listeners should be added for the new src
      expect(mockAddEventListener).toHaveBeenCalledTimes(initialCallCount + 2);
    });

    it('should clean up event listeners on unmount', () => {
      const { unmount } = renderWithProvider();

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'loadeddata',
        expect.any(Function),
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'error',
        expect.any(Function),
      );
    });
  });

  describe('User Interaction', () => {
    it('should call onPlayAudioClick when button is clicked', async () => {
      const onPlayAudioClick = vi.fn();
      renderWithProvider({ onPlayAudioClick });

      // Simulate audio loaded to enable button and wait for state update
      await waitFor(() => {
        triggerAudioEvent('loadeddata');
        expect(screen.getByRole('button')).toBeEnabled();
      });

      await userEvent.click(screen.getByRole('button'));

      expect(onPlayAudioClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onPlayAudioClick when button is disabled', async () => {
      const onPlayAudioClick = vi.fn();
      renderWithProvider({ onPlayAudioClick });

      // Button should be disabled while loading
      expect(screen.getByRole('button')).toBeDisabled();

      await userEvent.click(screen.getByRole('button'));

      expect(onPlayAudioClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for different states', async () => {
      const { rerender, store } = renderWithProvider();

      // Loading state
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Loading audio...',
      );

      // Simulate audio loaded and wait for state update
      await waitFor(() => {
        triggerAudioEvent('loadeddata');
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-label',
          'Play audio',
        );
      });

      // Playing state
      rerender(
        <Provider store={store}>
          <AudioPlayer {...defaultProps} isPlaying />
        </Provider>,
      );
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Pause audio',
      );

      // Error state - trigger error and wait for state update
      await waitFor(() => {
        triggerAudioEvent('error');
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-label',
          'Audio unavailable',
        );
      });
    });

    it('should have proper button type', () => {
      renderWithProvider();

      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
  });

  describe('Error Notifications', () => {
    it('should dispatch notification when audio fails to load', async () => {
      const { store } = renderWithProvider();

      // Simulate audio load error and wait for notification dispatch
      await waitFor(() => {
        triggerAudioEvent('error');
        const state = store.getState();
        expect(state.NOTIFICATIONS.notifications).toHaveLength(1);
        expect(state.NOTIFICATIONS.notifications[0]).toMatchObject({
          title: 'Audio Error',
          description: 'Failed to load audio file. Please try again.',
          type: 'error',
        });
      });
    });

    it('should dispatch notification when audio playback fails', async () => {
      const { store } = renderWithProvider({ isPlaying: true });
      mockPlay.mockRejectedValueOnce(new Error('Playback failed'));

      // Simulate audio loaded first
      // Simulate audio loaded first and wait for both loading and playback error
      await waitFor(() => {
        triggerAudioEvent('loadeddata');
        expect(screen.getByRole('button')).toBeEnabled();
      });

      // Wait for the playback error to be caught
      await waitFor(() => {
        const state = store.getState();
        expect(state.NOTIFICATIONS.notifications).toHaveLength(1);
        expect(state.NOTIFICATIONS.notifications[0]).toMatchObject({
          title: 'Playback Error',
          description: 'Failed to play audio. Please try again.',
          type: 'error',
        });
      });
    });
  });
});
