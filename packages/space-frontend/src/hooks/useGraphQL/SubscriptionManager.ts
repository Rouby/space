import { DocumentNode, print } from 'graphql';
import { GraphQLError } from './GraphQLError';

export class SubscriptionManager {
  #ws: WebSocket | null = null;
  #operations = new Map<
    string,
    {
      operationName: string;
      document: DocumentNode;
      variables: any;
      callback: (
        err: Error | null,
        payload: { data: any; errors: GraphQLError[] },
      ) => void;
    }
  >();
  #data = new Map<string, { data: any; errors: GraphQLError[] }>();
  #promised = new Map<string, Promise<{ data: any; errors: GraphQLError[] }>>();
  #deferred = new Map<
    string,
    (d: { data: any; errors: GraphQLError[] }) => void
  >();
  #queue = new Map<
    string,
    {
      operationName: string;
      document: DocumentNode;
      variables: any;
      callback: (
        err: Error | null,
        payload: { data: any; errors: GraphQLError[] },
      ) => void;
    }
  >();
  #closed = false;

  #url = '';
  #logger: Pick<
    typeof console,
    'info' | 'warn' | 'error' | 'group' | 'groupEnd'
  > = console;

  constructor({
    logger = console,
    url,
  }: { logger?: typeof console | null; url?: string } = {}) {
    this.#logger = logger ?? {
      info() {},
      warn() {},
      error() {},
      group() {},
      groupEnd() {},
    };
    this.#url =
      url ??
      process.env.GRAPHQL_SUBSCRIPTION_ENDPOINT ??
      (process.env.GRAPHQL_ENDPOINT
        ? process.env.GRAPHQL_ENDPOINT.replace(/^http/, 'ws')
        : `${location.protocol === 'https' ? 'wss' : 'ws'}://${
            location.host
          }/graphql`);
  }

  public connect(jwt: string, gameId: string | null) {
    let resumeOperations: {
      key: string;
      operationName: string;
      document: DocumentNode;
      variables: any;
      callback: (
        err: Error | null,
        payload: { data: any; errors: GraphQLError[] },
      ) => void;
    }[] = [];

    if (this.#ws) {
      resumeOperations = [...this.#operations.entries()].map(([key, op]) => ({
        key,
        ...op,
      }));
      this.close(true);
      this.#operations.clear();
      this.#deferred.clear();
      this.#queue.clear();
    }

    this.#logger.info(`Connecting with ${gameId}`);

    const ws = new WebSocket(this.#url, 'graphql-ws');

    if (resumeOperations.length) {
      this.#logger.group('Resuming operations');
      resumeOperations.forEach((op) => {
        this.subscribe(
          op.key,
          op.operationName,
          op.document,
          op.variables,
          op.callback,
        );
      });
      this.#logger.groupEnd();
    }

    ws.addEventListener('open', () => {
      ws.send(
        JSON.stringify({
          type: 'connection_init',
          payload: {
            Authorization: `Bearer ${jwt}`,
            'x-game-id': gameId,
          },
        }),
      );
    });

    ws.addEventListener('close', (ev) => {
      if (ev.code !== 4000 && !this.#closed) {
        this.#logger.info('Lost connection, trying to reconnect in 2500 ms');
        this.#ws = null;
        setTimeout(() => {
          this.connect(jwt, gameId);
        }, 2500);
      }
    });

    ws.addEventListener('message', async ({ data }) => {
      if (
        process.env.NODE_ENV !== 'production' &&
        localStorage.getItem('space.delay')
      ) {
        const delay = localStorage.getItem('space.delay')!;
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            isNaN(+delay) ? Math.random() * 1000 + 1000 : +delay,
          ),
        );
      }

      try {
        const parsed = JSON.parse(data);
        switch (parsed.type) {
          case 'connection_ack':
            if (this.#closed) {
              ws.close(4000, 'closed');
              return;
            }
            this.#ws = ws;
            const queued = [...this.#queue.entries()];
            this.#queue.clear();
            queued.forEach(([key, op]) =>
              this.subscribe(
                key,
                op.operationName,
                op.document,
                op.variables,
                op.callback,
              ),
            );
            break;
          case 'data':
            const cbData = { errors: [], data: {}, ...parsed.payload };
            this.#data.set(parsed.id, cbData);
            const resolve = this.#deferred.get(parsed.id);
            if (resolve) {
              resolve(cbData);
              this.#deferred.delete(parsed.id);
            }
            this.#operations.get(parsed.id)?.callback(null, cbData);
            break;
          case 'complete':
            this.#operations.delete(parsed.id);
            break;
        }
      } catch {}
    });
  }

  public subscribe(
    key: string,
    operationName: string,
    document: DocumentNode,
    variables: any,
    callback: (
      err: Error | null,
      payload: { data: any; errors: GraphQLError[] },
    ) => void,
  ) {
    this.#logger.info(`Subscribing to ${key}`);

    const queuedOrSubscribed =
      this.#operations.get(key) || this.#queue.get(key);

    if (queuedOrSubscribed) {
      this.#logger.info('  Already queued or subscribed, updating callback');
      queuedOrSubscribed.callback = callback;
      return;
    }

    this.#promised.set(
      key,
      new Promise<{ data: any; errors: GraphQLError[] }>((resolve) => {
        this.#deferred.set(key, resolve);
      }),
    );
    if (this.#ws) {
      this.#operations.set(key, {
        operationName,
        document,
        variables,
        callback,
      });
      this.#ws.send(
        JSON.stringify({
          type: 'start',
          id: key,
          payload: {
            operationName,
            query: print(document),
            variables,
          },
        }),
      );
    } else {
      this.#logger.info(`  Subscription enqueued`);
      this.#queue.set(key, { operationName, document, variables, callback });
    }
  }

  public unsubscribe(key: string) {
    this.#logger.info(`Unsubscribed from ${key}`);

    if (this.#operations.has(key)) {
      this.#operations.delete(key);
      if (this.#ws) {
        this.#ws.send(
          JSON.stringify({
            type: 'stop',
            id: key,
          }),
        );
      }
    } else {
      this.#queue.delete(key);
    }
    this.#promised.delete(key);
    this.#deferred.delete(key);
    this.#data.delete(key);
  }

  public getData(key: string) {
    const promise = this.#promised.get(key);
    if (!promise) {
      throw new Error('Requested data of non existend op');
    }
    return this.#data.get(key) ?? promise;
  }

  public close(aboutToResume = false) {
    this.#operations.forEach((_, key) => {
      this.unsubscribe(key);
    });

    this.#closed = !aboutToResume;
    if (this.#ws) {
      this.#ws.close(4000, 'closed');
      this.#ws = null;
    }
  }
}
