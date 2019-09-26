import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router';
import routes from '../config/routing';
import Sidebar from '../sidebar';
import Galaxy from './Galaxy';
import NotFound from './NotFound';
import Overview from './Overview';

export default function Routing() {
  return (
    <>
      <Helmet defaultTitle="Space" titleTemplate="Space – %s" />
      <Switch>
        <Route path={routes.galaxy.pathname} component={Galaxy} />
        <Route path={routes.overview.pathname} component={Overview} />
        <Route component={NotFound} />
      </Switch>
      <Sidebar />
    </>
  );
}
