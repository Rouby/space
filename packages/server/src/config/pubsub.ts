import { Client } from '@elastic/elasticsearch';
import { createClient, Callback } from 'redis';

const store = new Client({ node: 'http://localhost:9200' });
const publisher = createClient();
const subscriber = createClient();

export async function publish(event: Event) {
  const body = { ...event, timestamp: new Date().toISOString() };
  await store.index({ index: 'events', body });
  publisher.publish('events', JSON.stringify(body));
}

export function subscribe(callback: (evt: Event) => void) {
  const fn: Callback<string> = (err, str) => {
    if (err) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { timestamp, ...event } = JSON.parse(str);
    callback(event);
  };
  subscriber.subscribe('events', fn);
  return () => {
    subscriber.unsubscribe('events', fn);
  };
}
