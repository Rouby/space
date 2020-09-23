import { DocumentNode } from 'graphql';
import { MutationConfig, useMutation } from 'react-query';
import { useGraphQLClient } from './context';

interface GraphQLMutationOptions<TData> extends MutationConfig<TData> {}

export function useGraphQLMutation<
  TData = any,
  TVariables = Record<string, unknown>
>(document: DocumentNode, options?: GraphQLMutationOptions<TData>) {
  const client = useGraphQLClient();

  return useMutation<TData, unknown, TVariables>(
    async (variables) => client.request(document, variables),
    options,
  );
}
