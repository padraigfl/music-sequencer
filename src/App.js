import React from 'react';
import Player from './Player';
import { ToneProvider } from './System/Tone';

const App = () => {
  return (
    <ToneProvider>
      <Player />
    </ToneProvider>
  );
}

export default App;