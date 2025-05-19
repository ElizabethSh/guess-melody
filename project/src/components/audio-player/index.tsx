import React, { useEffect, useRef, useState } from 'react';

type AudioPlayerProps = {
  isPlaying: boolean;
  onPlayAudioClick: () => void;
  src: string;
};


const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  isPlaying,
  onPlayAudioClick
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    // check if song was loaded
    audioRef.current.addEventListener('loadeddata', () => setIsLoading(false));

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <>
      <button
        className={`track__button track__button--${isPlaying ? 'pause' : 'play'}`}
        disabled={isLoading}
        onClick={onPlayAudioClick}
        type="button"
      />
      <div className="track__status">
        <audio
          ref={audioRef}
          src={src}
        />
      </div>
    </>
  );
};

export default AudioPlayer;
