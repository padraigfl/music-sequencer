import React from 'react';
import Tone from 'tone';
import Player from './Interface';
import { ToneProvider } from './Core/context';
import { MelodyPlayer, BassPlayer } from './System/players';
window.Tone = Tone;

let AudioProcessor = BassPlayer;
AudioProcessor = MelodyPlayer;

const App = () => {
  return (
    <ToneProvider AudioProcessor={AudioProcessor}>
      <Player colorFilter={AudioProcessor.colorFilter} />
    </ToneProvider>
  );
}

export default App;