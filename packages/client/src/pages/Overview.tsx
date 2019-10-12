import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Dashboard } from '../components';

export default function Overview() {
  return (
    <>
      <Helmet>
        <title>Overview</title>
      </Helmet>
      <Dashboard />
    </>
  );
}
