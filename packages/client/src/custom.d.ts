declare module '@andywer/style-api-jss';

declare module '@andywer/style-hook' {
  import { CSSProperties } from 'react';

  export function useStyles<T>(
    styles: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependencies?: any[],
  ): { [P in keyof T]: string };
}

declare module 'mobx-router';

// eslint-disable-next-line no-var
declare var module: {
  hot?: { accept: (path: string, callback: Function) => void };
};
