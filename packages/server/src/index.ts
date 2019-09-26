import { Server } from '@rouby/eventing';
import { log } from './config/logging';
import aggregates from './write';
import lists from './read';
import { OAuth2Client } from 'google-auth-library';
import * as dotenv from 'dotenv';
import { writeFile, readFile } from 'fs';

dotenv.config();

const authClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

const simplePubSub = {
  listeners: [] as Function[],
  publish(data: {}) {
    this.listeners.forEach(cb => cb(data));
  },
  subscribe(cb: Function) {
    this.listeners.push(cb);
  },
};

const fsStore = {
  _events: [] as {}[],
  async load() {
    return (this._events = JSON.parse(
      await new Promise((resolve, reject) =>
        readFile('./eventlog.json', 'utf8', (err, data) =>
          err ? reject(err) : resolve(data),
        ),
      ),
    ));
  },
  async save(event: {}) {
    this._events.push(event);
    await new Promise((resolve, reject) =>
      writeFile('./eventlog.json', JSON.stringify(this._events), err =>
        err ? reject() : resolve(),
      ),
    );
  },
};

new Server({
  queue: simplePubSub,
  events: simplePubSub,
  store: fsStore,
  aggregates,
  lists,
  auth: {
    async verify(idToken: string) {
      const ticket = await authClient.verifyIdToken({
        idToken,
        audience: `${process.env.GOOGLE_CLIENT_ID}`,
      });
      const payload = ticket.getPayload();
      if (payload) {
        return { payload };
      }
      return undefined;
    },
  },
})
  .listen(4000)
  .then(() => {
    log('Listening on :4000');
  });
