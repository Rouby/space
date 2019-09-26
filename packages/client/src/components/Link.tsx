import * as React from 'react';
import { useStore } from '../hooks';
import { LocationDescriptorObject } from 'history';

export interface LinkProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  to: string | LocationDescriptorObject;
  children: React.ReactNode;
}

export default function Link({ to, children, onClick, ...props }: LinkProps) {
  const push = useStore(store => store.routing.push);

  return (
    <a
      {...props}
      onClick={(...args) => {
        typeof to === 'string' ? push(to) : push(to);
        onClick && onClick(...args);
      }}
    >
      {children}
    </a>
  );
}
