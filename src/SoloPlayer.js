import React from 'react';
import Player from './Interface';
import { MelodyPlayer, BassPlayer } from './System/players';
import { CoreProvider } from './Core/context';

const SoloPlayerComponent = ({ player, ...props }) => {
  const soundProcessor = player === 'bass' ? BassPlayer : MelodyPlayer;
  return (
    <CoreProvider AudioProcessor={soundProcessor} {...props}>
      <Player colorFilter={soundProcessor.colorFilter} />
    </CoreProvider>
  );
}

export default SoloPlayerComponent;
