import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import App from './App';
import { icons } from './assets/icons';
import store from './store';
import * as serviceWorker from './serviceWorker';

React.icons = icons;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
serviceWorker.unregister();
