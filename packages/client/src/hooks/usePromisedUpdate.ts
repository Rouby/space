import * as React from 'react';

export default function usePromisedUpdate<T extends unknown[]>(
  fn: (...args: T) => Promise<unknown>,
  minDelay = 150,
): [boolean, (...args: T) => unknown] {
  const [inFlight, setInFlight] = React.useState(false);
  return [
    inFlight,
    async (...args: T) => {
      const timeout = setTimeout(() => setInFlight(true), minDelay);
      try {
        await fn(...args);
      } finally {
        clearTimeout(timeout);
        setInFlight(false);
      }
    },
  ];
}
