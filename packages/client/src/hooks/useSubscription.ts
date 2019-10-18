import * as React from 'react';

export default function useSubscription<T, Q>(
  fn: (q: Q, u: (d: T) => void) => () => void,
  query: Q | null,
  deps: unknown[],
) {
  const [data, setData] = React.useState<T | undefined>(undefined);
  React.useEffect(() => {
    if (query) {
      return fn(query, data => {
        setData(data);
      });
    } else {
      setData(undefined);
      return;
    }
  }, deps);
  return data;
}
