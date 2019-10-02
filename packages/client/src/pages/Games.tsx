import * as React from 'react';
import { Helmet } from 'react-helmet';
import { GameList } from '../components';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  content: {
    padding: 24,
    background: '#fff',
    overflow: 'auto',
    height: '100%',
  },
});
export default function Games() {
  const classNames = useStyles();

  return (
    <>
      <Helmet>
        <title>Games</title>
      </Helmet>
      <div className={classNames.content}>
        <GameList />
      </div>
    </>
  );
}
