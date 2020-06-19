import React from 'react';
import { Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';

const SoloPlayerComponent = React.lazy(() => import('./SoloPlayer'));

const history = createBrowserHistory();

const getLazyPlayer = (player) => (props) => (
  <React.Suspense fallback={() => 'HI'}>
    <SoloPlayerComponent player={player} {...props} />
  </React.Suspense>
)

const App = () => {
  return (
    <Router history={history}>
      <Route path="/bass" component={getLazyPlayer('bass')} />
      <Route path="/melody" component={getLazyPlayer()} />
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