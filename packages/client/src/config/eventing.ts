import Client from '@space/server/src/client';

const client = new Client(
  process.env.REACT_APP_BACKEND_URL || 'ws://localhost:4000',
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((window as any).__client) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__client.stop();
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).__client = client;

export default client;
