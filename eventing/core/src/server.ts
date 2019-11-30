import Debug from 'debug';
import * as uuid from 'uuid/v4';
import * as WebSocket from 'ws';
import {
  Aggregate,
  AggregateConstructorParameters,
  CommandInterface,
  CommandRejected,
  DomainEvent,
  List,
} from './lib';
import { PrivilegesGranted, OwnershipDeclared } from './lib/AuthEvents';
import { reactions } from './lib/Reaction';

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
        verifyToken: (
          idToken: string,
        ) => Promise<{ payload: { sub: string; name: string } }>;
      };
    },
  ) {}

  private wss: WebSocket.Server | null = null;
  private events: DomainEvent[] = [];
  // private eventPermissions: Map<EventId, Set<UserId>> = new Map();
  private clientAuth = new Map<WebSocket, { id: string; name: string }>();
  private subscriptions = new Map<
    string,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      list: List<any>;
      onUpdate: (result: { data: {}[]; total: number } | { data: {} }) => void;
    }
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
      const eventReactions = reactions.get(event.name);
      if (eventReactions) {
        const reactionInterface = {
          aggregates: new Proxy(
            {},
            {
              get: (_, type) => (aggregateId?: string) =>
                this.aggregateInterface(event, type.toString(), aggregateId),
            },
          ),
        };
        eventReactions.forEach(fn => fn(reactionInterface, event));
      }
    });

    this.wss.on('connection', client => {
      const clientId = uuid();
      const trace = log.extend(clientId, '@');
      let hrstart: ReturnType<typeof process.hrtime>;
      const timing = Symbol();
      function startTiming() {
        hrstart = process.hrtime();
        return (msg: string, ...args: unknown[]) => {
          const [
            s,
            ns,
            ms = (s / 1e3 + ns / 1e6).toPrecision(3),
          ] = process.hrtime(hrstart);
          trace(msg, ...args.map(a => (a === timing ? ms : a)));
        };
      }

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
              if (!this.clientAuth.has(client)) {
                client.send(
                  JSON.stringify({
                    type: 'response',
                    to: id,
                    payload: {
                      rejected: true,
                      reason: 'Not authorized.',
                    },
                  }),
                );
                return;
              }

              const { listType, op, query, subscriptionId } = payload;

              try {
                const finishListBuild = startTiming();

                const list = new this.options.lists[listType]();

                await list.replay(this.events);

                finishListBuild(
                  'Building list %s took %d ms',
                  listType,
                  timing,
                );

                if (subscriptionId) {
                  const onUpdate = (
                    result:
                      | {
                          data: {}[];
                          total: number;
                        }
                      | { data: {} },
                  ) => {
                    // TODO restrict results based on access
                    client.send(
                      JSON.stringify({
                        type: 'subscription',
                        to: subscriptionId,
                        payload: { ...result },
                      }),
                    );
                  };
                  // start subscription
                  await list[
                    op as 'findAndSubscribe' | 'findOneAndSubscribe'
                  ].call(list, query, onUpdate);
                  this.subscriptions.set(`${clientId}::${subscriptionId}`, {
                    list,
                    onUpdate,
                  });
                  trace('Subscription started %o', {
                    subscriptionId,
                    listType,
                  });
                } else {
                  const result = await list[op as 'find' | 'findOne'].call(
                    list,
                    query,
                  );
                  // TODO restrict results based on access
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
                if (!this.clientAuth.has(client)) {
                  client.send(
                    JSON.stringify({
                      type: 'response',
                      to: id,
                      payload: {
                        rejected: true,
                        reason: 'Not authorized.',
                      },
                    }),
                  );
                  return;
                }

                const { aggregateType, aggregateId, command, data } = payload;

                const finishAggregateBuild = startTiming();
                const aggregate = await this.getAggregate(
                  aggregateType,
                  aggregateId,
                );
                finishAggregateBuild(
                  'Building aggregate %s took %d ms',
                  aggregateType,
                  timing,
                );

                const commandId = uuid();

                const config = Aggregate.getCommandConfig(
                  aggregateType,
                  command,
                );
                // TODO get real permissions
                const hasPermissions = true;
                if (config.needsAuthorization && !hasPermissions) {
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
                const [commandInterface, storeEvents] = this.commandInterface(
                  user,
                  aggregateType,
                  aggregate.id,
                  commandId,
                  commandId,
                );
                const finishCommandExecution = startTiming();
                try {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  await (aggregate as any)[command].call(
                    aggregate,
                    commandInterface,
                    ...data,
                  );

                  await storeEvents();

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
                } finally {
                  finishCommandExecution(
                    'Executing command %s on %s took %d ms',
                    command,
                    aggregateType,
                    timing,
                  );
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

  private async getAggregate(aggregateType: string, aggregateId?: string) {
    const aggregateEvents = this.events.filter(
      evt => evt.aggregate.id === aggregateId,
    );
    // last OwnershipDeclared event determines owner of aggregate
    const firstEvent = [...aggregateEvents]
      .reverse()
      .find(evt => evt.name === OwnershipDeclared.name) as
      | OwnershipDeclared
      | undefined;
    const aggregate = new this.options.aggregates[aggregateType](
      aggregateId,
      // TODO apply state from cache?
      null,
      firstEvent ? { id: firstEvent.data.newOwnerId } : null,
    );
    if (aggregateId) {
      await aggregate.replay(aggregateEvents);
    }
    return aggregate;
  }

  private aggregateInterface(
    event: DomainEvent,
    aggregateType: string,
    aggregateId?: string,
  ) {
    let promisedAggregate = this.getAggregate(aggregateType, aggregateId);
    const proxy = new Proxy(
      {},
      {
        get: (_, command) => {
          return (...data: unknown[]) => {
            promisedAggregate = promisedAggregate.then(async aggregate => {
              const [commandInterface, storeEvents] = this.commandInterface(
                { id: 'REACTION', name: 'REACTION' },
                aggregateType,
                aggregate.id,
                event.id,
                event.metadata.correlationId,
              );
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await (aggregate as any)[command].call(
                aggregate,
                commandInterface,
                ...data,
              );
              await storeEvents();
              return aggregate;
            });
            return proxy;
          };
        },
      },
    );
    return proxy;
  }

  private commandInterface(
    user: { id: string; name: string },
    aggregateType: string,
    aggregateId: string,
    causationId: string,
    correlationId: string,
  ): [CommandInterface, () => Promise<void>] {
    const publishedEvents: DomainEvent[] = [];
    const commandInterface: CommandInterface = {
      events: {
        publish: (name, data) => {
          publishedEvents.push({
            aggregate: {
              name: aggregateType,
              id: aggregateId,
            },
            name: name,
            id: uuid(),
            data,
            user,
            metadata: {
              timestamp: Date.now(),
              causationId,
              correlationId,
            },
          });
        },
      },
      user: {
        ...user,
        is: usr => !!usr && usr.id === user.id,
        authorize: (...commands) => {
          publishedEvents.push(
            ...commands.map(command => ({
              aggregate: {
                name: aggregateType,
                id: aggregateId,
              },
              name: PrivilegesGranted.name,
              id: uuid(),
              data: {
                command,
              },
              user,
              metadata: {
                timestamp: Date.now(),
                causationId,
                correlationId,
              },
            })),
          );
        },
      },
    };
    return [
      commandInterface,
      async () => {
        for (const event of publishedEvents) {
          await this.options.store.save(event);
          this.options.queue.publish(event);
        }
      },
    ];
  }
}
