import React from 'react';
import Player from './Components/player';
import { MelodyPlayer, BassPlayer } from './System/players';
import { CoreProvider } from './Core/context';
import { useParams } from 'react-router';
import Tutorial from './Components/Tutorial';

const SoloPlayerComponent = (props) => {
  const { player, variant } = useParams();
  const soundProcessor = player === 'bass' ? BassPlayer : MelodyPlayer;
  debugger;
  return (
    <CoreProvider AudioProcessor={soundProcessor} {...props}>
      <Player colorFilter={soundProcessor.colorFilter} />
      { variant === 'tutorial' && <Tutorial />}
    </CoreProvider>
  );
}

export default SoloPlayerComponent;
