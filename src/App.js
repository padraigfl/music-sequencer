import React from 'react';
import Player from './Player';
import { ToneProvider } from './System/context';

const App = () => {
  return (
    <ToneProvider>
      <Player />
    </ToneProvider>
  );
}

export default App;