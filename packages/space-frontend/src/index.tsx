import * as React from 'react';
import { render } from 'react-dom';
import { setConsole } from 'react-query';
import { RecoilRoot } from 'recoil';
import { App } from './App';
import { GraphQLProvider, NotificationProvider } from './hooks';

setConsole({ log() {}, warn() {}, error() {} });

render(
  <RecoilRoot>
    <GraphQLProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </GraphQLProvider>
  </RecoilRoot>,
  document.getElementById('root'),
);
