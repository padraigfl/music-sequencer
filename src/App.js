import React from 'react';
import Tone from 'tone';
import { Router, Switch, Route } from 'react-router';
import Player from './Interface';
import { createBrowserHistory } from 'history';
import { ToneProvider } from './Core/context';
import { MelodyPlayer, BassPlayer } from './System/players';
window.Tone = Tone;

let AudioProcessor = BassPlayer;
AudioProcessor = MelodyPlayer;

const getSoloPlayerComponent = soundProcessor => (props) => {
  return (
    <ToneProvider AudioProcessor={soundProcessor} history={props.history}>
      <Player colorFilter={soundProcessor.colorFilter} />
    </ToneProvider>
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
      <Route path="/" exact>{history.push('/melody') }</Route>
    </Router>
  );
}

export default App;