import DomainEvent from './DomainEvent';

export type StoredEvent = {
  aggregate: {
    name: string;
    id: string;
  };
  name: string;
  id: string;
  data: DomainEvent;
  user: {
    id: string;
  };
  metadata: {
    timestamp: number;
    causationId: string;
    correlationId: string;
  };
};
