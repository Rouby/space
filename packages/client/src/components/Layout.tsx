import { Layout as AntLayout } from 'antd';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Header } from '.';
import Routing from '../pages';

const useStyles = createUseStyles({
  header: {
    position: 'fixed',
    zIndex: 1,
    width: '100%',
    display: 'flex',
  },
  content: {
    marginTop: 64,
    position: 'relative',
  },
});

export default function Layout() {
  const classNames = useStyles();

  return (
    <AntLayout>
      <AntLayout.Header className={classNames.header}>
        <Header />
      </AntLayout.Header>
      <AntLayout.Content className={classNames.content}>
        <Routing />
      </AntLayout.Content>
    </AntLayout>
  );
}
