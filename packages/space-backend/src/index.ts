import { createServer } from 'http';
import { postgraphile } from 'postgraphile';
import { config } from './config';

createServer(
  postgraphile('postgres://localhost:5432/space', 'space', config),
).listen(5000, () => {
  console.log('Server listening on port 5000');
});
