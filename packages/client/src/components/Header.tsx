import { Button, Menu, Popover } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createUseStyles } from 'react-jss';
import { EndTurnButton, Link, NotificationList } from '.';
import routes from '../config/routing';
import { usePathMatch } from '../hooks';

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

  const pathMatch = usePathMatch([
    routes.overview.pathname,
    routes.galaxy.pathname,
  ]);

  return (
    <>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={pathMatch ? [pathMatch[0] as string] : []}
        className={classNames.menu}
      >
        <Menu.Item key={routes.overview.pathname}>
          <Link to={routes.overview.pathname}>
            <FormattedMessage id="header.overview" defaultMessage="Overview" />
          </Link>
        </Menu.Item>
        <Menu.Item key={routes.galaxy.pathname}>
          <Link to={routes.galaxy.pathname}>
            <FormattedMessage id="header.galaxy" defaultMessage="Galaxy" />
          </Link>
        </Menu.Item>
      </Menu>
      <Popover
        placement="bottomRight"
        content={<NotificationList />}
        trigger="click"
      >
        <Button
          type="primary"
          size="large"
          className={classNames.cta}
          shape="circle"
          icon="bell"
        />
      </Popover>
      <EndTurnButton className={classNames.cta} />
    </>
  );
}
