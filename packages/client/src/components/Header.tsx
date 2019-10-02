import { Menu } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createUseStyles } from 'react-jss';
import { Link } from '.';
import routing from '../config/routing';
import { usePathMatch, useStore } from '../hooks';

const useStyles = createUseStyles({
  menu: {
    flex: '1 1 auto',
    lineHeight: '64px',
  },
  cta: {
    margin: '0 8px',
    alignSelf: 'center',
  },
});

export default function Header() {
  const classNames = useStyles();

  const client = useStore(stores => stores.general.client);
  const authenticated = useStore(stores => stores.general.authenticated);
  const authenticate = useStore(stores => stores.general.authenticate);
  const inGame = false;

  React.useEffect(() => {
    window.gapi.load('auth2', () => {
      window.gapi.signin2.render('google-signin', {
        onsuccess: user => {
          authenticate(user.getAuthResponse().id_token);
        },
        onfailure: reason => {
          console.log('failure', reason);
        },
      });
    });
  }, []);

  return (
    <>
      {authenticated ? (
        inGame ? (
          <InGameMenu />
        ) : (
          <UserMenu />
        )
      ) : (
        <AnonymousMenu />
      )}
      {!authenticated && <div id="google-signin" className={classNames.cta} />}
    </>
  );
}

function AnonymousMenu() {
  const classNames = useStyles();

  const pathMatch = usePathMatch([
    routing.overview.pathname,
    routing.galaxy.pathname,
  ]);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={pathMatch ? [pathMatch[0] as string] : []}
      className={classNames.menu}
    >
      <Menu.Item key={routing.about.pathname}>
        <Link to={routing.about.pathname}>
          <FormattedMessage id="header.about" defaultMessage="About" />
        </Link>
      </Menu.Item>
    </Menu>
  );
}

function UserMenu() {
  const classNames = useStyles();

  const pathMatch = usePathMatch([
    routing.overview.pathname,
    routing.galaxy.pathname,
  ]);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={pathMatch ? [pathMatch[0] as string] : []}
      className={classNames.menu}
    >
      <Menu.Item key={routing.games.pathname}>
        <Link to={routing.games.pathname}>
          <FormattedMessage id="header.games" defaultMessage="Games" />
        </Link>
      </Menu.Item>
    </Menu>
  );
}

function InGameMenu() {
  const classNames = useStyles();

  const pathMatch = usePathMatch([
    routing.overview.pathname,
    routing.galaxy.pathname,
  ]);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={pathMatch ? [pathMatch[0] as string] : []}
      className={classNames.menu}
    >
      <Menu.Item key={routing.overview.pathname}>
        <Link to={routing.overview.pathname}>
          <FormattedMessage id="header.overview" defaultMessage="Overview" />
        </Link>
      </Menu.Item>
      <Menu.Item key={routing.galaxy.pathname}>
        <Link to={routing.galaxy.pathname}>
          <FormattedMessage id="header.galaxy" defaultMessage="Galaxy" />
        </Link>
      </Menu.Item>
    </Menu>
  );
}
