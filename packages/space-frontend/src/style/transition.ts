import { types } from 'typestyle';

export function ease(...properties: string[]): types.NestedCSSProperties {
  return {
    transitionDuration: '200ms',
    transitionProperty: properties.join(','),
  };
}
