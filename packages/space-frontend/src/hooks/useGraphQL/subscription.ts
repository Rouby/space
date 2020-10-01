import { DocumentNode } from 'graphql';
import * as React from 'react';
import {
  QueryConfig,
  QueryKey,
  QueryResult,
  useQuery,
  useQueryCache,
} from 'react-query';
import { GraphQLError, useGraphQLClient } from './context';
import { isOperationDefinition } from './util';

interface GraphQLSubscriptionOptions<TData, TVariables>
  extends Omit<QueryConfig<TData>, 'suspense'> {
  variables?: TVariables;
}

export function useGraphQLSubscription<
  TData = any,
  TVariables = Record<string, unknown>
>(
  document: DocumentNode,
  {
    queryKey,
    variables,
    ...options
  }: GraphQLSubscriptionOptions<
    { data: TData; errors: GraphQLError[] },
    TVariables
  > = {},
) {
  const documentKey = document.definitions.find(isOperationDefinition)?.name
    ?.value;

  const client = useGraphQLClient();

  const key =
    queryKey !== undefined
      ? variables
        ? [documentKey, queryKey, { variables }]
        : [documentKey, queryKey]
      : variables
      ? [documentKey, { variables }]
      : [documentKey];

  const queryCache = useQueryCache();

  const opKey = JSON.stringify(
    queryCache.getResolvedQueryConfig(key).queryKeySerializerFn(queryKey),
  );

  const [unsubscribe] = React.useState(() =>
    client.subscribe<TData, TVariables>(
      opKey,
      document,
      (err, payload) => {
        if (err) {
          // handle fatal error?
        } else {
          queryCache.setQueryData(key, payload);
        }
      },
      variables,
    ),
  );
  React.useEffect(() => () => unsubscribe(), []);

  return {
    queryKey: key as QueryKey,
    ...(useQuery<{ data: TData; errors: GraphQLError[] }>(
      key,
      async () =>
        client
          .getSubscriptionPromise(opKey)
          .then(() => client.getSubscriptionData<TData>(opKey)!),
      options,
    ) as QueryResult<{ data: TData; errors: GraphQLError[] }, any> & {
      data: { data: TData; errors: GraphQLError[] };
    }),
  };
}
