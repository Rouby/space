import Debug from 'debug';
import * as uuid from 'uuid/v4';
import * as WebSocket from 'isomorphic-ws';

const log = Debug('eventing');

const defaultOptions = {
  // autoReconnect: true,
};

export default class Client<
  TRead extends {},
  TWrite extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: { [key: string]: any };
  }
> {
  readonly lists = new Proxy(
    {} as {
      [P in keyof TRead]: TRead[P];
    },
    {
      get: (_, list) => this.listInterface(list.toString()),
    },
  );

  readonly aggregates = new Proxy(
    {} as {
      [P in keyof TWrite]: (
        id?: string,
      ) => {
        [O in keyof TWrite[P]]: TWrite[P][O];
      };
    },
    {
      get: (_, type) => (aggregateId?: string) =>
        this.aggregateInterface(type.toString(), aggregateId),
    },
  );

  readonly options: typeof defaultOptions;
  onauthchange?: (auth: boolean) => void;
  get authenticated() {
    return this._authenticated;
  }

  constructor(
    private readonly address: string,
    options?: typeof defaultOptions,
  ) {
    this.options = { ...defaultOptions, ...options };
    this.deferredStartup = { resolve: () => {}, reject: () => {} };
    this.websocket = new Promise(
      (resolve, reject) => (this.deferredStartup = { resolve, reject }),
    );
  }

  private deferredStartup: {
    resolve: (ws: WebSocket) => void;
    reject: (reason: Error) => void;
  };
  private deferredMessages = new Map<
    string,
    {
      resolve: (payload: {}) => void;
      reject: (reason: Error) => void;
    }
  >();
  private subscriptions = new Map<
    string,
    { list: string; onUpdate: (data: {}[], total: number) => void }
  >();
  private websocket: Promise<WebSocket>;
  private _authenticated = false;

  async getAuthUrl(redirectUri: string) {
    log('Generating auth url');
    return (await this.send({
      type: 'ssoUrl',
      payload: redirectUri,
    })) as string;
  }

  async exchangeCode(redirectUri: string, code: string) {
    log('Exchanging code for tokens');
    const { tokens, error } = await this.send({
      type: 'ssoCode',
      payload: { redirectUri, code },
    });
    if (error) {
      throw new Error(error);
    }
    return tokens as {
      idToken: string;
      accessToken: string;
      refreshToken: string;
      expiryDate: number;
    };
  }

  async setUserToken(token: string) {
    this._authenticated = false;
    const { authenticated, error } = await this.send({
      type: 'auth',
      payload: token,
    });
    if (error || !authenticated) {
      throw new Error(error || 'Not authenticated.');
    }
    this._authenticated = true;
    this.onauthchange && this.onauthchange(this._authenticated);
  }

  async start() {
    const ws = new WebSocket(this.address);

    ws.onopen = () => {
      log('Connected');

      this.deferredStartup.resolve(ws);
    };

    ws.onmessage = msg => {
      try {
        const { type, to, payload } = JSON.parse(msg.data.toString());

        switch (type) {
          case 'subscription': {
            const sub = this.subscriptions.get(to);
            if (sub) {
              log.extend(sub.list, '@').extend(to)(
                'New data arrived %o',
                payload,
              );
              sub.onUpdate(payload.result, payload.total);
            }
            break;
          }
          case 'response':
            {
              const { rejected, reason, error } = payload;
              const deferred = this.deferredMessages.get(to);
              if (deferred) {
                if (error || rejected) {
                  deferred.reject(error || reason);
                } else {
                  deferred.resolve(payload);
                }
              }
            }
            break;
        }
      } catch (err) {
        // noop
      }
    };

    ws.onclose = () => {
      log('Disconnected');
      this._authenticated = false;
      this.onauthchange && this.onauthchange(this._authenticated);
    };

    ws.onerror = err => {
      log('Error %O', err);
      this._authenticated = false;
      this.onauthchange && this.onauthchange(this._authenticated);
    };
  }

  close() {
    this.websocket.then(ws => ws.close());
  }

  private async send<T>(data: T) {
    const ws = await this.websocket;
    const msgId = uuid();
    ws.send(
      JSON.stringify({
        ...data,
        id: msgId,
      }),
    );
    const response = await new Promise((resolve, reject) => {
      this.deferredMessages.set(msgId, { resolve, reject });
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response as any;
  }

  private listInterface(list: string) {
    const trace = log.extend(list.toString(), '@');
    return new Proxy(
      {},
      {
        get: (_, op) =>
          op.toString().endsWith('AndSubscribe')
            ? (query: {}, onUpdate: (list: {}[]) => void) => {
                const subscriptionId = uuid();
                trace.extend(subscriptionId)('%s %O', op, query);
                this.subscriptions.set(subscriptionId, { list, onUpdate });
                this.send({
                  type: 'request',
                  payload: {
                    listType: list,
                    op,
                    query,
                    subscriptionId,
                  },
                });
                return () => {
                  this.subscriptions.delete(subscriptionId);
                  this.send({
                    type: 'stopSubscription',
                    payload: {
                      subscriptionId,
                    },
                  });
                };
              }
            : async (query: {}) => {
                trace('%s %O', op, query);
                const { result } = await this.send({
                  type: 'request',
                  payload: {
                    listType: list,
                    op,
                    query,
                  },
                });
                return result;
              },
      },
    );
  }

  private aggregateInterface(aggregateType: string, aggregateId?: string) {
    return new Proxy(
      {},
      {
        get: (_, command) =>
          this.commandInterface(aggregateType, command.toString(), aggregateId),
      },
    );
  }

  private commandInterface(
    aggregateType: string,
    command: string,
    aggregateId?: string,
  ) {
    const trace = log.extend(
      `${aggregateType}${aggregateId ? `:${aggregateId}` : ''}`,
      '@',
    );
    return async (...data: unknown[]) => {
      trace('%s %O', command, data);
      const { aggregate } = await this.send({
        type: 'command',
        payload: {
          aggregateType,
          aggregateId,
          command,
          data,
        },
      });
      return aggregate;
    };
  }
}
