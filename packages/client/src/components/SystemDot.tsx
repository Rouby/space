import { Empty, Popover } from 'antd';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Route, Switch } from 'react-router';
import { Link } from '.';
import { linkToSystem } from '../config/routing';

const useStyles = createUseStyles({
  container: {
    position: 'absolute',
    left: ({ position }: System) => position.x,
    top: ({ position }: System) => position.y,
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

export default function SystemDot(props: System) {
  const classNames = useStyles(props);

  return (
    <Popover title={props.name} content={<Empty />}>
      <Link to={linkToSystem(props)} className={classNames.container}>
        <Switch>
          <Route
            path={linkToSystem(props)}
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
