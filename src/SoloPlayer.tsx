import * as React from 'react';
import Player from './Components/player';
import { MelodyPlayer, BassPlayer } from './System/players';
import { CoreProvider } from './Core/context';
import { useParams } from 'react-router';
import Tutorial from './Components/Tutorial';

const SoloPlayerComponent: React.FC<any> = (props) => {
  const { player, variant } = useParams();
  const soundProcessor = player === 'bass' ? BassPlayer : MelodyPlayer;

  return (
    <CoreProvider AudioProcessor={soundProcessor} {...props}>
      <Player colorFilter={(soundProcessor as any).colorFilter} />
      {
        // @ts-ignore
        variant === 'tutorial' ? <Tutorial /> : null
      }
    </CoreProvider>
  );
}

export default SoloPlayerComponent;
