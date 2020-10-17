import * as React from 'react';

export function useClickOutside<T extends HTMLElement>(callback: () => void) {
  const ref = React.useRef<T>(null);
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.target && !ref.current?.contains(e.target as Node)) {
        callbackRef.current();
      }
    }
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  return ref;
}
