import { DocumentNode, print } from 'graphql';
import * as React from 'react';
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
  ): () => void;
  getSubscriptionData<T>(
    key: string,
  ): Promise<{ data: T; errors: GraphQLError[] }>;
}>({
  async request<T>() {
    return {} as T;
  },
  subscribe() {
    return () => {};
  },
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

  const fetchRef = useFetchRef();
  const wsRef = useWebSocketRef();

  const graphQLClient = React.useMemo(() => {
    const operations = new Map<
      string,
      {
        cb: (payload: { data: any; errors?: GraphQLError[] }) => void;
        latestData?: any;
        promise: Promise<void>;
        resolve?: () => void;
      }
    >();

    wsRef.current.onmessage = async (data) => {
      if (process.env.NODE_ENV !== 'production') {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 1000 + 1000),
        );
      }

      switch (data.type) {
        case 'data':
          const op = operations.get(data.id);
          if (op) {
            op.resolve?.();
            delete op.resolve;
            op.latestData = data.payload;
            op.cb(data.payload);
          }
          break;
        case 'complete':
          operations.delete(data.id);
          break;
      }
    };

    return {
      async request<T, V>(document: DocumentNode, variables?: V) {
        const response = await fetchRef.current(
          JSON.stringify({ query: print(document), variables }),
        );

        if (process.env.NODE_ENV !== 'production') {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 1000 + 1000),
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
        cb: (
          err: Error | null,
          payload: { data: T; errors: GraphQLError[] },
        ) => void,
        variables?: V,
      ) {
        const op = operations.get(key);
        if (op) {
          op.cb = (payload) => cb?.(null, { errors: [], ...payload });
        } else {
          const operationName =
            document.definitions.find(isOperationDefinition)?.name?.value ??
            'unknown';

          let resolve: () => void = () => void 0;
          const promise = new Promise<void>((r) => (resolve = r));

          operations.set(key, {
            cb: (payload) => cb?.(null, { errors: [], ...payload }),
            promise,
            resolve,
          });

          wsRef.current.send({
            type: 'start',
            id: key,
            payload: {
              operationName,
              query: print(document),
              variables,
            },
          });
        }

        return () => {
          wsRef.current.send({
            type: 'stop',
            id: key,
          });
          operations.delete(key);
        };
      },
      getSubscriptionData(key: string) {
        const op = operations.get(key)!;
        return op.promise.then(() => op.latestData);
      },
    };
  }, []);

  return (
    <GraphQLContext.Provider value={graphQLClient}>
      {children}
    </GraphQLContext.Provider>
  );
}

export function useGraphQLClient() {
  return React.useContext(GraphQLContext);
}

function useFetchRef() {
  const jwt = useRecoilValue(atoms.jwt);
  const gameId = useRecoilValue(atoms.gameId);

  const requestQueue = React.useRef<
    {
      body: string;
      resolve: (resp: Response) => void;
      reject: (err: Error) => void;
    }[]
  >([]);
  const ref = React.useRef<(body: string) => Promise<Response>>(
    async (body) =>
      new Promise((resolve, reject) => {
        requestQueue.current.push({ body, resolve, reject });
      }),
  );

  React.useEffect(() => {
    ref.current = (body) =>
      fetch(process.env.GRAPHQL_ENDPOINT ?? '/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          ...(gameId ? { 'X-Game-Id': gameId } : {}),
        },
        body,
      });
    if (requestQueue.current.length > 0) {
      requestQueue.current.forEach(({ body, resolve, reject }) =>
        ref.current(body).then(resolve, reject),
      );
      requestQueue.current = [];
    }
  }, [jwt]);

  return ref;
}

// TODO this should ideally resume operations after a reconnect

function useWebSocketRef() {
  const jwt = useRecoilValue(atoms.jwt);
  const gameId = useRecoilValue(atoms.gameId);

  const sendQueue = React.useRef<any[]>([]);
  const wsRef = React.useRef<{
    send: (data: any) => void;
    onmessage: (data: any) => void;
  }>({
    send: (data) => sendQueue.current.push(data),
    onmessage: () => {},
  });
  const [i, setI] = React.useState(0);

  React.useEffect(() => {
    const ws = new WebSocket(
      process.env.GRAPHQL_SUBSCRIPTION_ENDPOINT ?? '/graphql',
      'graphql-ws',
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

    let mounted = true;
    ws.addEventListener('close', () => {
      wsRef.current.send = (data) => sendQueue.current.push(data);
      setTimeout(() => {
        if (mounted) {
          setI((i) => i + 1);
        }
      }, Math.min(10000, 1000 * i));
    });

    ws.addEventListener('message', ({ data }) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'connection_ack') {
          sendQueue.current.forEach((data) => wsRef.current.send(data));
          sendQueue.current = [];
        }
        wsRef.current.onmessage(parsed);
      } catch {}
    });

    wsRef.current.send = (data) => {
      ws.send(JSON.stringify(data));
    };

    return () => {
      mounted = false;
      ws.close();
    };
  }, [jwt, gameId, i]);

  return wsRef;
}
