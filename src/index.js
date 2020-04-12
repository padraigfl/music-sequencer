import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const wrapper = document.getElementById('app');

if (wrapper) {
  ReactDOM.render(<App />, wrapper);
}
