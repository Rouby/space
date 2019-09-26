import { createClient } from 'redis';

const cache = createClient();

export async function get<T>(key: string) {
  return new Promise<T>((resolve, reject) =>
    cache.get(key, (err, val) =>
      err ? reject(err) : resolve(JSON.parse(val || 'null') as T),
    ),
  );
}

export async function set<T>(key: string, value: T) {
  return new Promise<T>((resolve, reject) =>
    cache.set(key, JSON.stringify(value), err =>
      err ? reject(err) : resolve(),
    ),
  );
}
