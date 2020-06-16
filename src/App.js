import React from 'react';
import { Router, Route } from 'react-router';
import Player from './Interface';
import { createBrowserHistory } from 'history';
import { CoreProvider } from './Core/context';
import { MelodyPlayer, BassPlayer } from './System/players';

let AudioProcessor = BassPlayer;
AudioProcessor = MelodyPlayer;

const getSoloPlayerComponent = soundProcessor => (props) => {
  return (
    <CoreProvider AudioProcessor={soundProcessor} {...props}>
      <Player colorFilter={soundProcessor.colorFilter} />
    </CoreProvider>
  );
}

const history = createBrowserHistory();

const Bass = getSoloPlayerComponent(BassPlayer);
const Melody = getSoloPlayerComponent(MelodyPlayer);

const App = () => {
  return (
    <Router history={history}>
      <Route path="/bass" component={Bass} />
      <Route path="/melody" component={Melody} />
      <Route path="/(melody|bass)/menu">
        <button onClick={() => history.push('/bass')}>Bass</button>
        <button onClick={() => history.push('/melody')}>Melody</button>
      </Route> 
      <Route path="/" exact>
        <button onClick={() => history.push('/bass')}>Bass</button>
        <button onClick={() => history.push('/melody')}>Melody</button>
      </Route>
    </Router>
  );
}

export default App;