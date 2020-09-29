import { DocumentNode } from 'graphql';
import { MutationConfig, useMutation } from 'react-query';
import { useUser } from '../../state';
import { GraphQLError, useGraphQLClient } from './context';
import { isOperationDefinition } from './util';

interface GraphQLMutationOptions<TData, TVariables>
  extends MutationConfig<TData, GraphQLError, TVariables> {}

export function useGraphQLMutation<
  TData = any,
  TVariables = Record<string, unknown>
>(
  document: DocumentNode,
  options?: GraphQLMutationOptions<
    { data: TData; errors: GraphQLError[] },
    TVariables
  >,
) {
  const client = useGraphQLClient();

  const needsUserId = document.definitions
    .filter(isOperationDefinition)
    .flatMap((n) => n.variableDefinitions)
    .some((v) => v?.variable.name.value === 'currentUserId');

  const user = useUser();

  return useMutation<
    { data: TData; errors: GraphQLError[] },
    GraphQLError,
    TVariables
  >(
    async (variables) =>
      client.request(
        document,
        needsUserId ? { ...variables, currentUserId: user?.id } : variables,
      ),
    options,
  );
}
