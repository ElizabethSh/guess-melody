import {ComponentType, useState} from 'react';
import AudioPlayer from '../components/audio-player';


type withAudioPlayerProps = {
  renderPlayer: (src: string, idx: number) => void;
}


const withAudioPlayer = <T extends object>(Component: ComponentType<T>): ComponentType<Omit<T, keyof withAudioPlayerProps>> => {

  type ComponentProps = Omit<T, keyof withAudioPlayerProps>

  const WithAudioPlayer = (props: ComponentProps): JSX.Element => {
    const [activePlayer, setActivePlayer] = useState(-1);

    return (
      <Component
        {...props as T}
        renderPlayer = {(src: 'string', idx: 'number') => {
          const index = Number(idx);
          return (
            <AudioPlayer
              isPlaying={index === activePlayer}
              onPlayAudioClick={() => setActivePlayer(index === activePlayer ? -1 : index)}
              src={src}
            />
          );
        }}
      />
    );
  };

  return WithAudioPlayer;
};

export default withAudioPlayer;
