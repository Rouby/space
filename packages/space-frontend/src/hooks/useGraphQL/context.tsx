import { DocumentNode, print } from 'graphql';
import * as React from 'react';
import { MdTimer } from 'react-icons/md';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { atoms } from '../../state';
import { GraphQLError } from './GraphQLError';
import { SubscriptionManager } from './SubscriptionManager';
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
