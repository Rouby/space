import type { Server } from 'bun';
import { logger } from './logger';

const server: Server = Bun.serve({
  port: 3000,
  async fetch(request) {
    if (
      server.upgrade(request, {
        // TODO get user id?
        data: {},
      })
    ) {
      return;
    }

    const path = new URL(request.url).pathname;
    const file = Bun.file(
      '.' + (path.endsWith('/') ? `${path}index.html` : path),
    );
    return new Response(file);
  },
  websocket: {
    async message(ws, message) {
      const data = JSON.parse(message.toString());

      logger.info(data, 'received message');
    },
    async open(ws) {
      logger.info({}, 'open ws');
    },
    async close(ws, _code, _reason) {
      logger.info({}, 'close ws');
    },
    drain(_ws) {},
  },
});

logger.info({ port: server.port }, 'server started');
