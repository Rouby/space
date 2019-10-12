import Debug from 'debug';
import * as uuid from 'uuid/v4';
import * as WebSocket from 'isomorphic-ws';

const log = Debug('eventing');

const defaultOptions = {
  autoReconnect: true,
  keepAlive: 15000 as number | false,
};

export default class Client<
  TRead extends {},
  TWrite extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: { [key: string]: any };
  }
> {
  public readonly lists = new Proxy(
    {} as {
      [P in keyof TRead]: TRead[P];
    },
    {
      get: (_, list) => this.listInterface(list.toString()),
    },
  );

  public readonly aggregates = new Proxy(
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

  public readonly options: typeof defaultOptions;

  public onauthchange?: (auth: boolean) => void;
  public onconnectionchange?: (connected: boolean) => void;

  public get authenticated() {
    return this._authenticated;
  }
  public get myself() {
    return this._myself;
  }

  constructor(
    private readonly address: string,
    options?: Partial<typeof defaultOptions>,
  ) {
    this.options = { ...defaultOptions, ...options };
  }

  private startup: Promise<void> | null = null;
  private keepAliveInterval: NodeJS.Timeout | null = null;
  private deferredStartup: {
    resolve: () => void;
    reject: (reason: Error) => void;
  } | null = null;
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
  private websocket: Promise<WebSocket> = {
    then: async (
      onfulfilled,
      onrejected?: ((err: Error) => void) | undefined | null,
    ) => {
      await this.startup;
      if (this._websocket) {
        onfulfilled && onfulfilled(this._websocket);
        return this._websocket;
      } else {
        onrejected && onrejected(new Error('No websocket available'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Error('No websocket available') as any;
      }
    },
    catch: async (onrejected?: ((err: Error) => void) | undefined | null) => {
      await this.startup;
      if (!this._websocket) {
        onrejected && onrejected(new Error('No websocket available'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Error('No websocket available') as any;
      }
    },
    finally: async onFinally => {
      await this.startup;
      onFinally && onFinally();
      if (this._websocket) {
        return this._websocket;
      } else {
        throw new Error('No websocket available');
      }
    },
    [Symbol.toStringTag]: '[Promise]',
  };
  private _websocket: WebSocket | null = null;
  private _authenticated = false;
  private _myself: { id: string; name: string } | null = null;

  public async setUserToken(token: string) {
    this._authenticated = false;
    const { authenticated, id, name, error } = await this.send({
      type: 'auth',
      payload: token,
    });
    if (error || !authenticated) {
      throw new Error(error || 'Not authenticated.');
    }
    this._authenticated = true;
    this._myself = { id, name };
    this.onauthchange && this.onauthchange(this._authenticated);
  }

  public start() {
    const ws = new WebSocket(this.address);

    if (this.deferredStartup) {
      this.deferredStartup.reject(
        new Error('Socket recreated before connection was established'),
      );
    }
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    this._websocket = null;
    this.startup = new Promise(
      (resolve, reject) => (this.deferredStartup = { resolve, reject }),
    );

    // hack promise resolve value
    ws.onopen = () => {
      log('Connected');

      this.onconnectionchange && this.onconnectionchange(true);
      this.deferredStartup && this.deferredStartup.resolve();
      this._websocket = ws;

      if (this.options.keepAlive !== false) {
        this.keepAliveInterval = setInterval(() => {
          if (ws.readyState === ws.CLOSING || ws.readyState === ws.CLOSED) {
            this.start();
          } else {
            ws.send('ping');
          }
        }, this.options.keepAlive);
      }
    };

    ws.onmessage = msg => {
      if (msg.data === 'pong') {
        return;
      }
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
      log('Disconnected, try to reconnect in 3s...');
      this._authenticated = false;
      this.onauthchange && this.onauthchange(this._authenticated);
      this.onconnectionchange && this.onconnectionchange(false);
      setTimeout(() => this.start(), 3000);
    };

    ws.onerror = err => {
      log('Error %O', err);
      this._authenticated = false;
      this.onauthchange && this.onauthchange(this._authenticated);
    };
  }

  public stop() {
    if (this.deferredStartup) {
      this.deferredStartup.reject(
        new Error('Socket recreated before connection was established'),
      );
    }
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
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
                trace('%s %o', op, query);
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
