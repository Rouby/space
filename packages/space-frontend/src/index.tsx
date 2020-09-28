/// <reference types="react/experimental" />
/// <reference types="react-dom/experimental" />

import * as React from 'react';
import { unstable_createRoot } from 'react-dom';
import { QueryCache, ReactQueryCacheProvider, setConsole } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { forceRenderStyles } from 'typestyle';
import { App } from './App';
import {
  GraphQLProvider,
  IntlProvider,
  NotificationProvider,
  StyleProvider,
} from './hooks';
import { StateRoot } from './state/StateRoot';

const ReactQueryDevtoolsPanel =
  process.env.NODE_ENV === 'production'
    ? null
    : React.lazy(() =>
        import('react-query-devtools').then((d) => ({
          default: d.ReactQueryDevtools,
        })),
      );

setConsole({ log() {}, warn() {}, error() {} });

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      suspense: true,
      retry: 0,
    },
    mutations: {
      throwOnError: true,
      suspense: false,
    },
  },
});

const root = document.getElementById('root');

if (!root) {
  throw new Error('No root element!');
}

unstable_createRoot(root).render(
  <StateRoot>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <React.Suspense fallback="Loading app...">
        <IntlProvider>
          <GraphQLProvider>
            <StyleProvider>
              <NotificationProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </NotificationProvider>
            </StyleProvider>
          </GraphQLProvider>
        </IntlProvider>
      </React.Suspense>
      {ReactQueryDevtoolsPanel && (
        <ReactQueryDevtoolsPanel initialIsOpen={false} />
      )}
    </ReactQueryCacheProvider>
  </StateRoot>,
);

forceRenderStyles();
