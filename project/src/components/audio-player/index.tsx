import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@hooks/use-store';
import { addNotification } from '@store/slices/notifications/notifications';

export type AudioPlayerProps = {
  isPlaying: boolean;
  onPlayAudioClick: () => void;
  src: string;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  isPlaying,
  onPlayAudioClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useAppDispatch();

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleLoadedData = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      dispatch(
        addNotification({
          id: `audio-load-error-${Date.now()}`,
          title: 'Audio Error',
          description: 'Failed to load audio file. Please try again.',
          type: 'error' as const,
        }),
      );
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
    };
  }, [src, dispatch]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isLoading || hasError) {
      return;
    }

    const handlePlayback = async () => {
      try {
        if (isPlaying) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch {
        setHasError(true);
        dispatch(
          addNotification({
            id: `audio-playback-error-${Date.now()}`,
            title: 'Playback Error',
            description: 'Failed to play audio. Please try again.',
            type: 'error' as const,
          }),
        );
      }
    };

    handlePlayback();
  }, [isPlaying, isLoading, hasError, dispatch]);

  const getButtonLabel = () => {
    if (hasError) return 'Audio unavailable';
    if (isLoading) return 'Loading audio...';
    return isPlaying ? 'Pause audio' : 'Play audio';
  };

  return (
    <>
      <button
        className={`track__button track__button--${isPlaying ? 'pause' : 'play'}`}
        disabled={isLoading || hasError}
        onClick={onPlayAudioClick}
        type="button"
        aria-label={getButtonLabel()}
      />
      <div className="track__status">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio ref={audioRef} src={src} preload="metadata" />
      </div>
    </>
  );
};

export default AudioPlayer;
