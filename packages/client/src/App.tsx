import { Provider } from 'mobx-react';
import * as React from 'react';
import { JssProvider } from 'react-jss';
import { Router } from 'react-router';
import IntlProvider from './components/IntlProvider';
import Layout from './components/Layout';
import history from './config/history';
import store from './config/store';

export default function App() {
  return (
    <Provider store={store}>
      <JssProvider>
        <IntlProvider>
          <Router history={history}>
            <Layout />
          </Router>
        </IntlProvider>
      </JssProvider>
    </Provider>
  );
}
