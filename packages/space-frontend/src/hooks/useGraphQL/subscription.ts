import { DocumentNode } from 'graphql';
import * as React from 'react';
import { GraphQLError, useGraphQLClient } from './context';
import { isOperationDefinition } from './util';

export function useGraphQLSubscription<
  TData = any,
  TVariables = Record<string, unknown>
>(
  document: DocumentNode,
  { queryKey, variables }: { queryKey?: string; variables?: TVariables } = {},
) {
  const documentKey = document.definitions.find(isOperationDefinition)?.name
    ?.value;

  const client = useGraphQLClient();

  const key = JSON.stringify(
    queryKey !== undefined
      ? variables
        ? [documentKey, queryKey, { variables }]
        : [documentKey, queryKey]
      : variables
      ? [documentKey, { variables }]
      : [documentKey],
  );

  const promiseRef = React.useRef<Promise<void>>();
  const resolveRef = React.useRef<() => void>();
  const promise =
    promiseRef.current ??
    new Promise((resolve) => (resolveRef.current = resolve));
  promiseRef.current = promise;

  const [data, setData] = React.useState<
    | {
        data: TData;
        errors: GraphQLError[];
      }
    | undefined
  >(() => client.getSubscriptionData(key));
  const [unsubscribe] = React.useState(() =>
    client.subscribe<TData, TVariables>(
      key,
      document,
      (err, payload) => {
        if (err) {
          // handle fatal error?
        } else {
          setData(payload);
          resolveRef.current?.();
        }
      },
      variables,
    ),
  );
  React.useEffect(() => () => unsubscribe(), []);

  console.log(data, client.getSubscriptionPromise(key), key);
  if (!data) {
    throw client.getSubscriptionPromise(key);
  }

  return {
    data,
  };
}
