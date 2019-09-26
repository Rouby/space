import * as pathToRegExp from 'path-to-regexp';
import * as React from 'react';
import { useStore } from '../hooks';

export default function usePathMatch(
  pathOrPaths: string | string[],
  exact = false,
) {
  const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];

  const regexps = React.useMemo(() => {
    const keys: pathToRegExp.Key[] = [];
    return paths.map(
      path =>
        [pathToRegExp(path, keys, { end: exact }), keys] as [
          pathToRegExp.PathRegExp,
          pathToRegExp.Key[],
        ],
    );
  }, [...paths, exact]);

  const pathname = useStore(store => store.routing.location.pathname);

  return regexps
    .map(([pathRegExp, keys]) => {
      const result = pathRegExp.exec(pathname);
      if (result) {
        return [
          result[0],
          result
            .slice(1)
            .reduce((acc, val, idx) => ({ ...acc, [keys[idx].name]: val }), {}),
        ];
      }
      return null;
    })
    .find(Boolean);
}
