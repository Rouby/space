import { GraphQLClient } from 'graphql-request';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../atoms';

const GraphQLContext = React.createContext(
  new GraphQLClient(`${process.env.GRAPHQL_ENDPOINT}/graphql`),
);

export function GraphQLProvider({ children }: { children: React.ReactNode }) {
  const jwtToken = useRecoilValue(userAtom);
  const graphQLClient = React.useMemo(
    () =>
      new GraphQLClient(`${process.env.GRAPHQL_ENDPOINT}/graphql`, {
        headers: {
          ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        },
      }),
    [jwtToken],
  );

  return (
    <GraphQLContext.Provider value={graphQLClient}>
      {children}
    </GraphQLContext.Provider>
  );
}

export function useGraphQLClient() {
  return React.useContext(GraphQLContext);
}
