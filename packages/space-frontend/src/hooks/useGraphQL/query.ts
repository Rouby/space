import { DefinitionNode, DocumentNode, OperationDefinitionNode } from 'graphql';
import { QueryConfig, useQuery } from 'react-query';
import { GraphQLError, useGraphQLClient } from './context';

interface GraphQLQueryOptions<TData, TError, TVariables>
  extends QueryConfig<TData, TError> {
  variables?: TVariables;
}

export function useGraphQLQuery<
  TData = any,
  TVariables = Record<string, unknown>,
  TError = GraphQLError
>(
  document: DocumentNode,
  {
    variables,
    ...options
  }: GraphQLQueryOptions<TData, TError, TVariables> | undefined = {},
) {
  const documentKey = document.definitions.find(isOperationDefinition)?.name
    ?.value;

  const client = useGraphQLClient();

  return useQuery<TData, TError>(
    [documentKey, { variables }],
    async () => client.request(document, variables),
    options,
  );
}

function isOperationDefinition(
  x: DefinitionNode,
): x is OperationDefinitionNode {
  return x.kind === 'OperationDefinition';
}
