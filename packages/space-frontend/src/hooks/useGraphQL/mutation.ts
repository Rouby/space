import { DocumentNode } from 'graphql';
import { MutationConfig, useMutation } from 'react-query';
import { GraphQLError, useGraphQLClient } from './context';

interface GraphQLMutationOptions<TData, TError>
  extends MutationConfig<TData, TError> {}

export function useGraphQLMutation<
  TData = any,
  TVariables = Record<string, unknown>,
  TError = GraphQLError
>(document: DocumentNode, options?: GraphQLMutationOptions<TData, TError>) {
  const client = useGraphQLClient();

  return useMutation<TData, TError, TVariables>(
    async (variables) => client.request(document, variables),
    options,
  );
}
