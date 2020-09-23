/// <reference types="react/experimental" />

import * as React from 'react';
import { render } from 'react-dom';
import { RecoilRoot } from 'recoil';
import { forceRenderStyles } from 'typestyle';
import { App } from './App';
import { GraphQLProvider, NotificationProvider, StyleProvider } from './hooks';

render(
  <RecoilRoot>
    <GraphQLProvider>
      <StyleProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </StyleProvider>
    </GraphQLProvider>
  </RecoilRoot>,
  document.getElementById('root'),
);

forceRenderStyles();
