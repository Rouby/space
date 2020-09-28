import { DocumentNode } from 'graphql';
import { QueryConfig, useQuery } from 'react-query';
import { GraphQLError, useGraphQLClient } from './context';
import { isOperationDefinition } from './util';

interface GraphQLQueryOptions<TData, TVariables> extends QueryConfig<TData> {
  variables?: TVariables;
}

export function useGraphQLQuery<
  TData = any,
  TVariables = Record<string, unknown>
>(
  document: DocumentNode,
  {
    variables,
    queryKey,
    ...options
  }:
    | GraphQLQueryOptions<{ data: TData; errors: GraphQLError[] }, TVariables>
    | undefined = {},
) {
  const documentKey = document.definitions.find(isOperationDefinition)?.name
    ?.value;

  const client = useGraphQLClient();

  return useQuery<{ data: TData; errors: GraphQLError[] }>(
    queryKey !== undefined
      ? variables
        ? [documentKey, queryKey, { variables }]
        : [documentKey, queryKey]
      : variables
      ? [documentKey, { variables }]
      : [documentKey],
    async () => client.request(document, variables),
    options,
  );
}
