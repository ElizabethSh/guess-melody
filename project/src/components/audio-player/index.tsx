import React, { useRef } from 'react';

type AudioPlayerProps = {
  src: string;
  autoplay?: boolean;
};


const AudioPlayer = ({src, autoplay}: AudioPlayerProps): JSX.Element => {
  const audioRef = useRef(null);

  return (
    <>
      <button
        className="track__button track__button--play"
        type="button"
      />
      <div className="track__status">
        <audio src={src} autoPlay={autoplay} />
      </div>
    </>
  );
};

export default AudioPlayer;
