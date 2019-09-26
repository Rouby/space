import { Drawer } from 'antd';
import * as React from 'react';
import { Route, Switch } from 'react-router';
import routes, { CanGoBackToCloseDrawer } from '../config/routing';
import { useCurrentRouteConfig, usePathMatch, useStore } from '../hooks';
import SystemOverview from './SystemOverview';

export default function Sidebar() {
  const closeDrawer = useDrawerCloser();

  const drawerOpen = usePathMatch(
    Object.values(routes).flatMap(route => route.sidebarPathnames),
  );

  return (
    <Drawer
      title={
        <Switch>
          <Route
            path={routes.galaxy.sidebars.system.pathname}
            render={() => 'System'}
          />
        </Switch>
      }
      visible={!!drawerOpen}
      onClose={closeDrawer}
      placement="right"
      width={520}
      destroyOnClose
    >
      <Switch>
        <Route
          path={routes.galaxy.sidebars.system.pathname}
          component={SystemOverview}
        />
      </Switch>
    </Drawer>
  );
}

function useDrawerCloser() {
  const routeConfig = useCurrentRouteConfig();

  return useStore(store =>
    store.routing.location.state === CanGoBackToCloseDrawer
      ? store.routing.goBack
      : () =>
          routeConfig &&
          routeConfig.parent &&
          store.routing.replace(routeConfig.parent.link()),
  );
}
