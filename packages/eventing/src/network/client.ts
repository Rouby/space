import Debug from 'debug';
import * as uuid from 'uuid/v4';
import * as WebSocket from 'ws';

const log = Debug('eventing');

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

  constructor(private readonly address: string) {
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
  private websocket: Promise<WebSocket>;

  async setUserToken(token: string) {
    await this.send({
      type: 'auth',
      payload: [token],
    });
  }

  async start() {
    const ws = new WebSocket(this.address);

    ws.on('open', () => {
      log('Connected');

      this.deferredStartup.resolve(ws);
    });

    ws.on('message', msg => {
      // log('Message received: %O', msg);

      try {
        const { type, to, payload } = JSON.parse(msg.toString());

        switch (type) {
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
    });

    ws.on('close', () => {
      log('Disconnected');
    });

    ws.on('error', err => {
      log('Error %O', err);
    });
  }

  close() {
    this.websocket.then(ws => ws.close());
  }

  private async send<T>(data: T) {
    const ws = await this.websocket;
    const msgId = uuid();
    await new Promise((resolve, reject) =>
      ws.send(
        JSON.stringify({
          ...data,
          id: msgId,
        }),
        err => (err ? reject(err) : resolve()),
      ),
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
        get: (_, op) => async (query: {}) => {
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
