// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DomainEvent<
  TName extends string = any,
  TData = unknown,
  THasUser = false
> {
  aggregate!: {
    name: string;
    id: string;
  };
  name!: TName;
  id!: string;
  data!: TData;
  user!: THasUser extends true
    ? {
        id: string;
        name: string;
      }
    : { id: string; name: string } | null;
  metadata!: {
    timestamp: number;
    causationId: string;
    correlationId: string;
  };
}
