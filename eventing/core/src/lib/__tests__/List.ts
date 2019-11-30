import List, { Projection } from '../List';
import { DomainEvent } from '../DomainEvent';

function generateEvent(name: string) {
  return {
    name,
    aggregate: { id: '', name: '' },
    data: {},
    id: '',
    metadata: { causationId: '', correlationId: '', timestamp: 0 },
    user: { id: '', name: '' },
  };
}

describe('A List', () => {
  class SomeEvent extends DomainEvent {}
  class AnotherEvent extends DomainEvent {}
  class RandomEvent extends DomainEvent {}

  class ConcreteList extends List<{
    id: string;
    owner: { id: string; name: string };
  }> {
    @Projection
    onEvent(evt: SomeEvent) {
      evt; //
    }

    @Projection
    onAnotherEvent(evt: AnotherEvent) {
      evt; //
    }
  }

  it('should handle an event with a registered projection', async () => {
    const list = new ConcreteList();
    const event = generateEvent(SomeEvent.name);

    const spy = jest.spyOn(list, 'onEvent');

    expect(await list.handle(event)).toBe(true);
    expect(spy).toHaveBeenCalledWith(event);
  });

  it('should not handle an event without a registered projection', async () => {
    const list = new ConcreteList();
    const event = generateEvent(RandomEvent.name);

    expect(await list.handle(event)).toBe(false);
  });

  it('should replay multiple events in correct order', async () => {
    const list = new ConcreteList();
    const events = [
      generateEvent(SomeEvent.name),
      generateEvent(AnotherEvent.name),
      generateEvent(SomeEvent.name),
    ];

    const spy = jest.spyOn(list, 'onEvent');
    const spyAnother = jest.spyOn(list, 'onAnotherEvent');

    await list.replay(events);
    expect(spy).toHaveBeenCalledWith(events[0]);
    expect(spyAnother).toHaveBeenCalledWith(events[1]);
    expect(spy).toHaveBeenCalledWith(events[2]);

    const [firstSpyCall, secondSpyCall, firstAnotherCall] = [
      ...spy.mock.invocationCallOrder,
      ...spyAnother.mock.invocationCallOrder,
    ];

    expect(firstSpyCall).toBeLessThan(firstAnotherCall);
    expect(firstAnotherCall).toBeLessThan(secondSpyCall);
  });
});
