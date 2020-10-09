import { DocumentNode, print } from 'graphql';
import * as React from 'react';
import { MdTimer } from 'react-icons/md';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { atoms } from '../../state';
import { isOperationDefinition } from './util';

const GraphQLContext = React.createContext<{
  request<T, V>(
    document: DocumentNode,
    variables?: V,
  ): Promise<{ data: T; errors: GraphQLError[] }>;
  subscribe<T, V>(
    key: string,
    document: DocumentNode,
    cb: (
      err: Error | null,
      payload: { data: T; errors: GraphQLError[] },
    ) => void,
    variables?: V,
  ): void;
  unsubscribe(key: string): void;
  getSubscriptionData<T>(
    key: string,
  ):
    | Promise<{ data: T; errors: GraphQLError[] }>
    | { data: T; errors: GraphQLError[] };
}>({
  async request<T>() {
    return {} as T;
  },
  subscribe() {},
  unsubscribe() {},
  async getSubscriptionData<T>() {
    return {} as T;
  },
});

export class GraphQLError extends Error {
  constructor(
    message: string,
    public errors: { message?: string; errcode?: string; detail?: string }[],
  ) {
    super(message);
  }

  get messageJSX() {
    return this.errors.map((err) => (
      <div key={err.detail ?? err.message}>
        {err.errcode
          ? `${err.errcode}: ${err.detail ?? err.message}`
          : err.message}
      </div>
    ));
  }
}

export function GraphQLProvider({ children }: { children: React.ReactNode }) {
  const resetJwt = useResetRecoilState(atoms.jwt);

  const sendRequest = useFetch();
  const subscriptionManager = useSubscriptionManager();

  const graphQLClient = React.useMemo(() => {
    return {
      async request<T, V>(document: DocumentNode, variables?: V) {
        const response = await sendRequest(
          JSON.stringify({ query: print(document), variables }),
        );

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

        if (!response.ok) {
          if (response.status === 401) {
            resetJwt();
            throw new GraphQLError('Auth error', [
              { errcode: '-1', detail: 'Auth error' },
            ]);
          }

          throw new GraphQLError('Network error', [
            { errcode: '-1', detail: 'Network error' },
          ]);
        }

        const { data, errors } = await response.json();

        return { data, errors } as { data: T; errors: GraphQLError[] };
      },
      subscribe<T, V>(
        key: string,
        document: DocumentNode,
        callback: (
          err: Error | null,
          payload: { data: T; errors: GraphQLError[] },
        ) => void,
        variables?: V,
      ) {
        const operationName =
          document.definitions.find(isOperationDefinition)?.name?.value ??
          'unknown';

        subscriptionManager.subscribe(
          key,
          operationName,
          document,
          variables,
          callback,
        );
      },
      unsubscribe(key: string) {
        subscriptionManager.unsubscribe(key);
      },
      getSubscriptionData(key: string) {
        return subscriptionManager.getData(key);
      },
    };
  }, [sendRequest, subscriptionManager]);

  return (
    <GraphQLContext.Provider value={graphQLClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && <DelayToggle />}
    </GraphQLContext.Provider>
  );
}

function DelayToggle() {
  const [active, setActive] = React.useState(
    !!localStorage.getItem('space.delay'),
  );

  return (
    <div
      onClick={() =>
        setActive((a) => {
          if (a) {
            localStorage.removeItem('space.delay');
          } else {
            localStorage.setItem('space.delay', 'enabled');
          }
          return !a;
        })
      }
      style={{
        position: 'fixed',
        cursor: 'pointer',
        bottom: 0,
        left: 48,
        margin: '0.5rem 0.5rem -0.25rem 0.5rem',
        fontSize: 40,
        opacity: active ? 1 : 0.5,
      }}
    >
      <MdTimer />
    </div>
  );
}

export function useGraphQLClient() {
  return React.useContext(GraphQLContext);
}

function useFetch() {
  const jwt = useRecoilValue(atoms.jwt);
  const gameId = useRecoilValue(atoms.gameId);

  return React.useCallback(
    (body: string) =>
      fetch(process.env.GRAPHQL_ENDPOINT ?? '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          ...(gameId ? { 'X-Game-Id': gameId } : {}),
        },
        body,
      }),
    [jwt, gameId],
  );
}

function useSubscriptionManager() {
  const jwt = useRecoilValue(atoms.jwt);
  const gameId = useRecoilValue(atoms.gameId);

  const [subscriptionManager] = React.useState(() => new SubscriptionManager());

  React.useEffect(() => {
    if (jwt) {
      subscriptionManager.connect(jwt, gameId);
    }
  }, [jwt, gameId]);

  return subscriptionManager;
}

class SubscriptionManager {
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

  #logger = console;

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
      this.#operations.forEach((op, key) => this.#queue.set(key, op));
      this.close();
      this.#closed = false;
    }

    this.#logger.info(`Connecting with ${gameId}`);
    if (resumeOperations.length) {
      this.#logger.group('Resuming operations');
      resumeOperations.forEach((op) => this.#logger.info(`${op.key}`));
      this.#logger.groupEnd();
    }

    const ws = new WebSocket(
      process.env.GRAPHQL_SUBSCRIPTION_ENDPOINT ?? '/graphql',
      'graphql-ws',
    );

    resumeOperations.forEach((op) =>
      this.subscribe(
        op.key,
        op.operationName,
        op.document,
        op.variables,
        op.callback,
      ),
    );

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
      if (ev.code !== 4000) {
        this.#ws = null;
        this.#operations.forEach((op, key) => this.#queue.set(key, op));
        this.#operations.clear();
        this.#deferred.clear();
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
            this.#queue.forEach((op, key) =>
              this.subscribe(
                key,
                op.operationName,
                op.document,
                op.variables,
                op.callback,
              ),
            );
            this.#queue.clear();
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

    if (this.#operations.has(key)) {
      this.#operations.get(key)!.callback = callback;
      return;
    }
    if (this.#queue.has(key)) {
      this.#queue.get(key)!.callback = callback;
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

  public close() {
    this.#operations.forEach((_, key) => {
      this.unsubscribe(key);
    });

    this.#closed = true;
    if (this.#ws) {
      this.#ws.close(4000, 'closed');
      this.#ws = null;
    }
  }
}
