import { useState } from 'react';
import AudioPlayer from '../components/audio-player';


const withAudioPlayer = (Component): JSX.Element => {

  const WithAudioPlayer = (props) => {
    const [activePlayer, setActivePlayer] = useState(-1);

    return (
      <Component
        {...props}
        renderPlayer = {(src, idx) => (
          <AudioPlayer
            isPlaying={idx === activePlayer}
            src={src}
            onPlayAudioClick={() => setActivePlayer(idx === activePlayer ? -1 : idx)}
          />
        )}
      />
    );
  };

  return WithAudioPlayer;
};

export default withAudioPlayer;
