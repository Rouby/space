// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DomainEvent<TName extends string = any, TData = unknown> {
  aggregate!: {
    name: string;
    id: string;
  };
  name!: TName;
  id!: string;
  data!: TData;
  user!: {
    id: string;
  };
  metadata!: {
    timestamp: number;
    causationId: string;
    correlationId: string;
  };
}
