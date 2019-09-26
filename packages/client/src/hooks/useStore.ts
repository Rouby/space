import { reaction } from 'mobx';
import { MobXProviderContext } from 'mobx-react';
import * as React from 'react';

type Store = typeof import('../config/store').default;

export default function useStore<T>(
  accessor: (s: Store) => T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[] = [],
): T {
  const { store }: { store: Store } = React.useContext(MobXProviderContext);

  const [{ val }, setValue] = React.useState(() => ({ val: accessor(store) }));

  React.useEffect(
    () => reaction(() => accessor(store), val => setValue({ val })),
    dependencies,
  );

  return val;
}
