import Client from '@space/server/src/client';

export default new Client(
  process.env.REACT_APP_BACKEND_URL || 'ws://localhost:4000',
);
