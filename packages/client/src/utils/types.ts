export type Uncertain<T extends string | number> = { min: T; max: T };

export interface Position {
  x: number;
  y: number;
}
