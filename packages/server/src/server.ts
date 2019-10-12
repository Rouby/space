import { Server } from '@rouby/eventing';
import { log } from './config/logging';
import aggregates from './write';
import lists from './read';
import { OAuth2Client } from 'google-auth-library';
import * as dotenv from 'dotenv';
import { writeFile, readFile, existsSync } from 'fs';

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
    if (!existsSync('./eventlog.json')) {
      return (this._events = []);
    }
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
      writeFile('./eventlog.json', JSON.stringify(this._events, null, 2), err =>
        err ? reject() : resolve(),
      ),
    );
  },
};

const googleAuth = {
  async getUrl(redirectUri: string) {
    return authClient.generateAuthUrl({
      // eslint-disable-next-line @typescript-eslint/camelcase
      redirect_uri: redirectUri,
      scope: ['profile'],
    });
  },
  async exchangeCode(redirectUri: string, code: string) {
    try {
      const {
        tokens: {
          id_token: idToken,
          access_token: accessToken,
          refresh_token: refreshToken,
          expiry_date: expiryDate,
        },
      } = await authClient.getToken({
        code,
        // eslint-disable-next-line @typescript-eslint/camelcase
        redirect_uri: redirectUri,
      });
      if (idToken && accessToken && expiryDate) {
        return {
          idToken,
          accessToken,
          refreshToken,
          expiryDate,
        };
      }

      throw new Error('No valid tokens generated.');
    } catch (err) {
      throw new Error(
        (err.response && err.response.data && err.response.data.error) ||
          err.message,
      );
    }
  },
  async verifyToken(idToken: string) {
    try {
      const ticket = await authClient.verifyIdToken({
        idToken,
        audience: `${process.env.GOOGLE_CLIENT_ID}`,
      });
      const payload = ticket.getPayload();
      if (payload && payload.name) {
        return { payload: { sub: payload.sub, name: payload.name } };
      }
      throw new Error('Could not validate token.');
    } catch (err) {
      throw new Error(
        (err.response && err.response.data && err.response.data.error) ||
          err.message,
      );
    }
  },
};

new Server({
  queue: simplePubSub,
  events: simplePubSub,
  store: fsStore,
  aggregates,
  lists,
  auth: googleAuth,
})
  .listen(4000)
  .then(() => {
    log('Listening on :4000');
  });
