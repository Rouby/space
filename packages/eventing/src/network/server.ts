import Debug from 'debug';
import * as uuid from 'uuid/v4';
import * as WebSocket from 'ws';
import { Aggregate, CommandInterface, CommandRejected, List } from '../lib';
import { StoredEvent } from '../lib/StoredEvent';

const log = Debug('eventing');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class Server {
  constructor(
    private options: {
      queue: {
        publish(event: StoredEvent): void;
      };
      events: {
        subscribe(callback: (event: StoredEvent) => void): void;
      };
      store: {
        load(): Promise<StoredEvent[]>;
        save(event: StoredEvent): Promise<void>;
      };
      aggregates: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: new (id?: string, state?: any) => Aggregate<any>;
      };
      lists: { [key: string]: new () => List<{}> };
      auth: {
        verify: (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...args: any[]
        ) => Promise<{ payload: { sub: string } } | undefined>;
      };
    },
  ) {}

  private wss: WebSocket.Server | null = null;
  private events: StoredEvent[] = [];
  private clientAuth = new Map<WebSocket, { id: string }>();

  async listen(port: number) {
    this.events = await this.options.store.load();

    this.wss = new WebSocket.Server({
      port,
    });

    this.options.events.subscribe(event => {
      this.events.push(event);
    });

    this.wss.on('connection', client => {
      const clientId = uuid();
      const trace = log.extend(clientId, '@');

      trace('Connected');

      client.on('message', async msg => {
        // trace('Message received: %O', msg);

        try {
          const { id, type, payload } = JSON.parse(msg.toString());

          switch (type) {
            case 'auth': {
              try {
                const ticket = await this.options.auth.verify(...payload);
                if (ticket) {
                  trace('User authenticated');
                  this.clientAuth.set(client, { id: ticket.payload.sub });
                  client.send(
                    JSON.stringify({
                      type: 'response',
                      to: id,
                      payload: { authenticated: true },
                    }),
                  );
                } else {
                  client.send(
                    JSON.stringify({
                      type: 'response',
                      to: id,
                      payload: { authenticated: false },
                    }),
                  );
                }
              } catch (err) {
                trace('Authenticated failed:\n%O', err);
                client.send(
                  JSON.stringify({
                    type: 'response',
                    to: id,
                    payload: { authenticated: false },
                  }),
                );
              }
              break;
            }
            case 'request': {
              const { listType, op, query } = payload;

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
                list.replay(this.events);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const result = await (list as any)[op].call(list, query);
                // TODO restrict results based on access
                client.send(
                  JSON.stringify({
                    type: 'response',
                    to: id,
                    payload: { result },
                  }),
                );
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
            case 'command':
              {
                const { aggregateType, aggregateId, command, data } = payload;

                const aggregate = new this.options.aggregates[aggregateType](
                  aggregateId,
                  // TODO apply state from cache?
                );
                if (aggregateId) {
                  aggregate.replay(
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
                    publish: data => {
                      const event = {
                        aggregate: {
                          name: aggregateType,
                          id: aggregate.id,
                        },
                        name: data.constructor.name,
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
