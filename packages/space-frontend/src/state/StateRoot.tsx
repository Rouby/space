import * as React from 'react';
import { RecoilRoot, RecoilState, RecoilValue, useRecoilValue } from 'recoil';
import { gameId, jwt, locale } from './atoms';

interface StateRootProps {
  children: React.ReactNode;
}

export function StateRoot({ children }: StateRootProps): React.ReactElement {
  return (
    <RecoilRoot initializeState={initializeState}>
      <Persistence />
      {children}
    </RecoilRoot>
  );
}

const persistedAtoms = [jwt, locale, gameId];

function Persistence() {
  persistedAtoms.forEach(usePersistence);
  return null;
}

function usePersistence(atom: RecoilState<any>) {
  const firstRun = React.useRef(true);
  const value = useRecoilValue(atom);
  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    console.groupCollapsed('Persisting %cspace.%s', 'color: #EE92C2', atom.key);
    console.log(value);
    console.groupEnd();
    serialize(atom, value);
  }, [value]);
}

function initializeState({
  set,
}: {
  set: (recoilVal: RecoilState<any>, newVal: any) => void;
}) {
  console.groupCollapsed('Restoring state');
  persistedAtoms.forEach((atom) => {
    const value = deserialize(atom);
    if (value) {
      set(atom, value);
      console.log('%cspace.%s %o', 'color: #EE92C2', atom.key, value);
    }
  });
  console.groupEnd();
}

function serialize<T>(atom: RecoilState<T>, value: T) {
  localStorage.setItem(`space.${atom.key}`, JSON.stringify(value));
}

function deserialize<T>(atom: RecoilValue<T>): T | null {
  try {
    return JSON.parse(localStorage.getItem(`space.${atom.key}`) ?? 'null');
  } catch (err) {}
  return null;
}
