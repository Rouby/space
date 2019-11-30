import * as React from 'react';
import { Helmet } from 'react-helmet';
import { GalaxyView } from '../components';

export default function Galaxy() {
  return (
    <>
      <Helmet>
        <title>Galaxy</title>
      </Helmet>
      <GalaxyView />
    </>
  );
}
