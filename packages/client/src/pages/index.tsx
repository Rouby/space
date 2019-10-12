import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router';
import routing from '../config/routing';
import { useStore } from '../hooks';
import Sidebar from '../sidebar';
import Galaxy from './Galaxy';
import Games from './Games';
import NotFound from './NotFound';
import Overview from './Overview';
import Welcome from './Welcome';

export default function Routing() {
  const authenticated = useStore(stores => stores.general.authenticated);
  const inGame = useStore(stores => !!stores.general.gameId);

  return (
    <>
      <Helmet defaultTitle="Space" titleTemplate="Space – %s" />
      {authenticated ? (
        inGame ? (
          <InGameRouting />
        ) : (
          <UserRouting />
        )
      ) : (
        <AnonymousRouting />
      )}
      <Sidebar />
    </>
  );
}

function AnonymousRouting() {
  return (
    <Switch>
      <Route path="/" exact component={Welcome} />
      <Route component={NotFound} />
    </Switch>
  );
}

function UserRouting() {
  return (
    <Switch>
      <Route path={routing.games.pathname} component={Games} />
      <Route component={NotFound} />
    </Switch>
  );
}

function InGameRouting() {
  return (
    <Switch>
      <Route path={routing.galaxy.pathname} component={Galaxy} />
      <Route path={routing.overview.pathname} component={Overview} />
      <Route component={NotFound} />
    </Switch>
  );
}
