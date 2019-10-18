export class DomainEvent<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TName extends string = any,
  TData = unknown
> {
  aggregate!: {
    name: string;
    id: string;
  };
  name!: TName;
  id!: string;
  data!: TData;
  user!: {
    id: string;
    name: string;
  };
  metadata!: {
    timestamp: number;
    causationId: string;
    correlationId: string;
  };
}
