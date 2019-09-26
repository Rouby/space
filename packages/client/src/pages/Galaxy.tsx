import * as React from 'react';
import { Helmet } from 'react-helmet';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    background: 'black',
    height: '100%',
    position: 'relative',
  },
});

export default function Galaxy() {
  const classNames = useStyles();

  return (
    <>
      <Helmet>
        <title>Galaxy</title>
      </Helmet>
      <div className={classNames.container}>Hello galaxy</div>
    </>
  );
}
