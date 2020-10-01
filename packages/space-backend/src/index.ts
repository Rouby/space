import { run, TaskList } from 'graphile-worker';
import { createServer } from 'http';
import { postgraphile } from 'postgraphile';
import { config } from './config';
import * as taskList from './tasks';

const connectionString = 'postgres://localhost:5432/space';

createServer(postgraphile(connectionString, 'space', config)).listen(
  5000,
  () => {
    console.log('Server listening on port 5000');
  },
);

run({
  connectionString,
  concurrency: 5,
  noHandleSignals: false,
  taskList: taskList as TaskList,
});
