import * as React from 'react';
import { render, hydrate } from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';

render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./App', () =>
    hydrate(<App />, document.getElementById('root')),
  );
}
