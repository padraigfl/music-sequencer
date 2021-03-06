import * as React from 'react';
import { Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import Menu from './Components/Menu';
import styled, { keyframes } from 'styled-components';
import Plans from './Components/Plans';
import About from './Components/About';

const SoloPlayerComponent = React.lazy(() => import('./SoloPlayer'));

const history = createBrowserHistory();

const loadingKeyframe = keyframes`
  0% {
    content: 'Loading.';
  }
  33% {
    content: 'Loading..';
  }
  66% {
    content: 'Loading...';
  }
  100% {
    content: 'Loading';
  }
`
const Fallback = styled('div')`
  background-color: #ddd;
  position: relative;
  width: 200px;
  height: 200px;
  &::after {
    content: '';
    font-size: 20px;
    position: absolute;
    top: 0px;
    left: 0px;
    padding: 20px;
    animation: ${loadingKeyframe} 0.2s linear infinite;
  }
`;
const LazyPlayer = (props) => (
  <React.Suspense fallback={<Fallback />}>
    <SoloPlayerComponent {...props} />
  </React.Suspense>
)

const App = () => {
  return (
    <Router history={history}>
      <Route path={['/solo/:player/:variant', '/solo/:player']}>
        <LazyPlayer />
      </Route>
      <Route path="/simultaneous">
        <Plans />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/" exact>
        <Menu />
      </Route>
    </Router>
  );
}

export default App;