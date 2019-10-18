import 'reflect-metadata';

type ReactionHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  i: ReactionInterface<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any,
) => void;

export const reactions = new Map<string, (ReactionHandler)[]>();

export function Reaction<P extends string>(
  target: { [O in P]: ReactionHandler },
  propertyKey: P,
) {
  const [, type] = Reflect.getMetadata(
    'design:paramtypes',
    target,
    propertyKey,
  );
  if (!reactions.has(type.name)) {
    reactions.set(type.name, []);
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  reactions.get(type.name)!.push(target[propertyKey]);
}

export interface ReactionInterface<T> {
  aggregates: T;
}
