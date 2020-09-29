import { DocumentNode, print } from 'graphql';
import * as React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { atoms } from '../../state';

const GraphQLContext = React.createContext<{
  request<T, V>(
    document: DocumentNode | string,
    variables?: V,
  ): Promise<{ data: T; errors: GraphQLError[] }>;
}>({
  async request<T>() {
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
  const jwt = useRecoilValue(atoms.jwt);
  const resetJwt = useResetRecoilState(atoms.jwt);

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
              ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
            },
            body: JSON.stringify({ query: document, variables }),
          },
        );

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
