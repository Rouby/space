import Debug from 'debug';
import * as uuid from 'uuid/v4';
import * as WebSocket from 'ws';
import {
  Aggregate,
  CommandInterface,
  CommandRejected,
  List,
  DomainEvent,
  AggregateConstructorParameters,
} from './lib';

const log = Debug('eventing');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class Server {
  constructor(
    private options: {
      queue: {
        publish(event: DomainEvent): void;
      };
      events: {
        subscribe(callback: (event: DomainEvent) => void): void;
      };
      store: {
        load(): Promise<DomainEvent[]>;
        save(event: DomainEvent): Promise<void>;
      };
      aggregates: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: new (
          ...args: AggregateConstructorParameters
        ) => Aggregate<
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          any
        >;
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lists: { [key: string]: new () => List<any> };
      auth: {
        getUrl: (redirectUri: string) => Promise<string>;
        exchangeCode: (
          redirectUri: string,
          code: string,
        ) => Promise<{
          idToken: string;
          accessToken: string;
          refreshToken?: string | null;
          expiryDate: number;
        }>;
        verifyToken: (
          idToken: string,
        ) => Promise<{ payload: { sub: string; name: string } }>;
      };
    },
  ) {}

  private wss: WebSocket.Server | null = null;
  private events: DomainEvent[] = [];
  private clientAuth = new Map<WebSocket, { id: string; name: string }>();
  private subscriptions = new Map<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { list: List<any>; onUpdate: (data: {}, total: number) => void }
  >();

  async listen(port: number) {
    this.events = [...(await this.options.store.load())];

    this.wss = new WebSocket.Server({
      port,
    });

    this.options.events.subscribe(event => {
      this.events.push(event);
      [...this.subscriptions.values()].forEach(({ list }) =>
        list.handle(event),
      );
    });

    this.wss.on('connection', client => {
      const clientId = uuid();
      const trace = log.extend(clientId, '@');

      trace('Connected');

      client.on('message', async msg => {
        // trace('Message received: %O', msg);
        if (msg === 'ping') {
          client.send('pong');
          return;
        }

        try {
          const { id, type, payload } = JSON.parse(msg.toString());

          switch (type) {
            case 'ssoUrl': {
              const authUrl = await this.options.auth.getUrl(payload);
              client.send(
                JSON.stringify({
                  type: 'response',
                  to: id,
                  payload: authUrl,
                }),
              );
              break;
            }
            case 'ssoCode': {
              try {
                const tokens = await this.options.auth.exchangeCode(
                  payload.redirectUri,
                  payload.code,
                );
                client.send(
                  JSON.stringify({
                    type: 'response',
                    to: id,
                    payload: {
                      tokens,
                    },
                  }),
                );
              } catch (error) {
                trace('Code exchange failed:\n%O', error);
                client.send(
                  JSON.stringify({
                    type: 'response',
                    to: id,
                    payload: {
                      error: error.message,
                    },
                  }),
                );
              }
              break;
            }
            case 'auth': {
              try {
                const ticket = await this.options.auth.verifyToken(payload);
                if (ticket) {
                  trace('User authenticated');
                  this.clientAuth.set(client, {
                    id: ticket.payload.sub,
                    name: ticket.payload.name,
                  });
                  client.send(
                    JSON.stringify({
                      type: 'response',
                      to: id,
                      payload: {
                        authenticated: true,
                        id: ticket.payload.sub,
                        name: ticket.payload.name,
                      },
                    }),
                  );
                } else {
                  throw new Error('No tickets generated.');
                }
              } catch (error) {
                trace('Authenticated failed:\n%O', error);
                client.send(
                  JSON.stringify({
                    type: 'response',
                    to: id,
                    payload: {
                      authenticated: false,
                      error: error.message,
                    },
                  }),
                );
              }
              break;
            }
            case 'request': {
              const { listType, op, query, subscriptionId } = payload;

              try {
                const list = new this.options.lists[listType]();
                if (list.needsAuthorization && !this.clientAuth.has(client)) {
                  client.send(
                    JSON.stringify({
                      type: 'response',
                      to: id,
                      payload: {
                        rejected: true,
                        reason: 'Not authorized to read this list.',
                      },
                    }),
                  );
                  return;
                }
                await list.replay(this.events);
                const onUpdate = (result: {}, total: number) => {
                  client.send(
                    JSON.stringify({
                      type: 'subscription',
                      to: subscriptionId,
                      payload: { result, total },
                    }),
                  );
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const result = await (list as any)[op].call(
                  list,
                  query,
                  onUpdate,
                );
                // TODO restrict results based on access
                if (subscriptionId) {
                  this.subscriptions.set(`${clientId}::${subscriptionId}`, {
                    list,
                    onUpdate,
                  });
                  trace('Subscription started %o', {
                    subscriptionId,
                    listType,
                  });
                } else {
                  client.send(
                    JSON.stringify({
                      type: 'response',
                      to: id,
                      payload: { result },
                    }),
                  );
                }
              } catch (error) {
                trace('Unexpected error\n%O', error);
                client.send(
                  JSON.stringify({
                    type: 'response',
                    to: id,
                    payload: {
                      error,
                    },
                  }),
                );
              }

              break;
            }
            case 'stopSubscription': {
              const { subscriptionId } = payload;
              this.subscriptions.delete(`${clientId}::${subscriptionId}`);
              trace('Subscription stopped %o', {
                subscriptionId,
              });
              break;
            }
            case 'command':
              {
                const { aggregateType, aggregateId, command, data } = payload;

                // first event determines owner of aggregate
                const firstEvent = this.events.find(
                  evt => evt.aggregate.id === aggregateId,
                );
                const aggregate = new this.options.aggregates[aggregateType](
                  aggregateId,
                  // TODO apply state from cache?
                  {},
                  firstEvent ? firstEvent.user : null,
                );
                if (aggregateId) {
                  await aggregate.replay(
                    this.events.filter(evt => evt.aggregate.id === aggregateId),
                  );
                }

                const commandId = uuid();

                const config = Aggregate.getCommandConfig(
                  aggregateType,
                  command,
                );
                if (config.needsAuthorization && !this.clientAuth.has(client)) {
                  client.send(
                    JSON.stringify({
                      type: 'response',
                      to: id,
                      payload: {
                        rejected: true,
                        reason: 'Not authorized to execute command.',
                      },
                    }),
                  );
                  return;
                }
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const user = this.clientAuth.get(client)!;
                const commandInterface: CommandInterface = {
                  events: {
                    publish: (name, data) => {
                      const event = {
                        aggregate: {
                          name: aggregateType,
                          id: aggregate.id,
                        },
                        name: name,
                        id: uuid(),
                        data,
                        user,
                        metadata: {
                          timestamp: Date.now(),
                          causationId: commandId,
                          correlationId: commandId,
                        },
                      };
                      this.options.store
                        .save(event)
                        .then(() => this.options.queue.publish(event));
                    },
                  },
                  user,
                };
                trace('Executing command %s on %s', command, aggregateType);
                try {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  await (aggregate as any)[command].call(
                    aggregate,
                    commandInterface,
                    ...data,
                  );

                  client.send(
                    JSON.stringify({
                      type: 'response',
                      to: id,
                      payload: {
                        rejected: false,
                        aggregate: {
                          id: aggregate.id,
                        },
                      },
                    }),
                  );
                } catch (error) {
                  if (error instanceof CommandRejected) {
                    client.send(
                      JSON.stringify({
                        type: 'response',
                        to: id,
                        payload: {
                          rejected: true,
                          reason: error.message,
                        },
                      }),
                    );
                  } else {
                    trace('Unexpected error\n%O', error);
                    client.send(
                      JSON.stringify({
                        type: 'response',
                        to: id,
                        payload: {
                          error,
                        },
                      }),
                    );
                  }
                }
              }
              break;
          }
        } catch (err) {
          // noop
        }
      });

      client.on('close', () => {
        [...this.subscriptions.keys()]
          .filter(key => key.startsWith(`${clientId}::`))
          .forEach(key => {
            this.subscriptions.delete(key);
            trace('Subscription stopped');
          });
        trace('Disconnected');
      });

      client.on('error', err => {
        trace('Error %O', err);
      });
    });

    const srv = this.wss;
    await new Promise(resolve => {
      srv.on('listening', () => {
        resolve();
      });
    });
  }

  close() {
    if (this.wss) {
      this.wss.close();
    }
  }
}
