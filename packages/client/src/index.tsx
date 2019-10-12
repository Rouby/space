import { message } from 'antd';
import 'antd/dist/antd.css';
import * as React from 'react';
import { hydrate, render } from 'react-dom';
import App from './App';

render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./App', () =>
    hydrate(<App />, document.getElementById('root')),
  );
}

window.addEventListener('unhandledrejection', event => {
  message.error(`${event.reason}`, 3);
});
