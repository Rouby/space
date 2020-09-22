import { DefinitionNode, DocumentNode, OperationDefinitionNode } from 'graphql';
import { QueryConfig, useQuery } from 'react-query';
import { useGraphQLClient } from './context';

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
    ...options
  }: GraphQLQueryOptions<TData, TVariables> | undefined = {},
) {
  const documentKey = document.definitions.find(isOperationDefinition)?.name
    ?.value;

  const client = useGraphQLClient();

  return useQuery<TData>(
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
