/* eslint-disable @typescript-eslint/no-explicit-any */
import { Empty, Popover } from 'antd';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Route, Switch } from 'react-router';
import { Link } from '.';
import routing from '../config/routing';

const useStyles = createUseStyles({
  container: {
    position: 'absolute',
    left: ({ position }: any) => position.x,
    top: ({ position }: any) => position.y,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    cursor: 'pointer',
    background: 'yellow',
  },
  active: {
    background: 'red',
  },
});

export default function SystemDot(props: any) {
  const classNames = useStyles(props);

  return (
    <Popover title={props.name} content={<Empty />}>
      <Link
        to={routing.galaxy.sidebars.system.link(props)}
        className={classNames.container}
      >
        <Switch>
          <Route
            path={routing.galaxy.sidebars.system.link(props).pathname}
            render={() => (
              <div className={[classNames.dot, classNames.active].join(' ')} />
            )}
          />
          <Route render={() => <div className={classNames.dot} />} />
        </Switch>
      </Link>
    </Popover>
  );
}
