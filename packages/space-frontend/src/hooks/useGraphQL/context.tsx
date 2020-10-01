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
  ): { data: T; errors: GraphQLError[] } | undefined;
  getSubscriptionPromise(key: string): Promise<void>;
}>({
  async request<T>() {
    return {} as T;
  },
  subscribe() {
    return () => {};
  },
  getSubscriptionData<T>() {
    return {} as T;
  },
  async getSubscriptionPromise() {},
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
  const jwt = useRecoilValue(atoms.jwt);
  const resetJwt = useResetRecoilState(atoms.jwt);

  const graphQLClient = React.useMemo(() => {
    const ws = new WebSocket(
      process.env.GRAPHQL_SUBSCRIPTION_ENDPOINT ?? '/',
      'graphql-ws',
    );

    const operations = new Map<
      string,
      {
        cb: (payload: { data: any; errors?: GraphQLError[] }) => void;
        latestData?: any;
        promise: Promise<void>;
        resolve?: () => void;
      }
    >();

    ws.addEventListener('open', () => {
      ws.send(
        JSON.stringify({
          type: 'connection_init',
          payload: {
            Authorization: `Bearer ${jwt}`,
          },
        }),
      );
    });

    ws.addEventListener('message', async ({ data }) => {
      if (process.env.NODE_ENV === 'development') {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 1000 + 1000),
        );
      }

      try {
        data = JSON.parse(data);
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
      } catch {}
    });

    return {
      async request<T, V>(document: DocumentNode, variables?: V) {
        const response = await fetch(process.env.GRAPHQL_ENDPOINT ?? '/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify({ query: print(document), variables }),
        });

        if (process.env.NODE_ENV === 'development') {
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

          ws.send(
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
        }

        return () => {
          ws.send(
            JSON.stringify({
              type: 'stop',
              id: key,
            }),
          );
          operations.delete(key);
        };
      },
      getSubscriptionData(key: string) {
        return operations.get(key)?.latestData;
      },
      getSubscriptionPromise(key: string) {
        return operations.get(key)?.promise!;
      },
    };
  }, [jwt]);

  return (
    <GraphQLContext.Provider value={graphQLClient}>
      {children}
    </GraphQLContext.Provider>
  );
}

export function useGraphQLClient() {
  return React.useContext(GraphQLContext);
}
