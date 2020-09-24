import { DocumentNode, print } from 'graphql';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../atoms';

const GraphQLContext = React.createContext<{
  request<T, V>(document: DocumentNode | string, variables?: V): Promise<T>;
}>({
  async request<T>() {
    return {} as T;
  },
});

class GraphQLError extends Error {
  constructor(
    message: string,
    public errors: { message?: string; errcode?: string; detail?: string }[],
  ) {
    super(message);
  }

  get messageJSX() {
    return this.errors.map((err) => (
      <div key={err.detail ?? err.message}>
        {err.errcode ? `${err.errcode}: ${err.detail}` : err.message}
      </div>
    ));
  }
}

export function GraphQLProvider({ children }: { children: React.ReactNode }) {
  const jwtToken = useRecoilValue(userAtom);
  const graphQLClient = React.useMemo(() => {
    return {
      async request<T, V>(document: DocumentNode | string, variables?: V) {
        document = typeof document === 'string' ? document : print(document);

        const response = await fetch(
          `${process.env.GRAPHQL_ENDPOINT}/graphql`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
            },
            body: JSON.stringify({ query: document, variables }),
          },
        );

        if (!response.ok) {
          throw new GraphQLError('Network error', [
            { errcode: '-1', detail: 'Network error' },
          ]);
        }

        const { data, errors } = await response.json();

        if (data && !errors) {
          // also return errros?
          return data as T;
        }

        throw new GraphQLError('GraphQL error', errors);
      },
    };
  }, [jwtToken]);

  return (
    <GraphQLContext.Provider value={graphQLClient}>
      {children}
    </GraphQLContext.Provider>
  );
}

export function useGraphQLClient() {
  return React.useContext(GraphQLContext);
}
