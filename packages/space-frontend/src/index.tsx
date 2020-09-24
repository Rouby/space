/// <reference types="react/experimental" />

import * as React from 'react';
import { render } from 'react-dom';
import { QueryCache, ReactQueryCacheProvider, setConsole } from 'react-query';
import { RecoilRoot } from 'recoil';
import { forceRenderStyles } from 'typestyle';
import { App } from './App';
import {
  GraphQLProvider,
  IntlProvider,
  NotificationProvider,
  StyleProvider,
} from './hooks';

setConsole({ log() {}, warn() {}, error() {} });

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      suspense: true,
    },
    mutations: {
      throwOnError: true,
      suspense: false,
    },
  },
});

render(
  <RecoilRoot>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <React.Suspense fallback="Loading app...">
        <IntlProvider>
          <GraphQLProvider>
            <StyleProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </StyleProvider>
          </GraphQLProvider>
        </IntlProvider>
      </React.Suspense>
    </ReactQueryCacheProvider>
  </RecoilRoot>,
  document.getElementById('root'),
);

forceRenderStyles();
