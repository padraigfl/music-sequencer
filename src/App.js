import React, { useMemo } from 'react';
import { Router, Route, Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
import Menu from './Components/Menu';
import Tutorial from './Components/Tutorial';

const SoloPlayerComponent = React.lazy(() => import('./SoloPlayer'));

const history = createBrowserHistory();

const LazyPlayer = (props) => (
  <React.Suspense fallback={'HI'}>
    <SoloPlayerComponent {...props} />
  </React.Suspense>
)

const App = () => {
  return (
    <Router history={history}>
      <Route path={['/solo/:player/:variant', '/solo/:player']}>
        <LazyPlayer />
      </Route>
      <Route path="/" exact>
        <Menu />
      </Route>
    </Router>
  );
}

export default App;