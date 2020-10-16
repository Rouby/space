//@ts-ignore
import { WS } from 'jest-websocket-mock';
import { WebSocket } from 'mock-socket';
import { SubscriptionManager } from '../SubscriptionManager';

global.location = { protocol: 'http', host: 'testhost' } as Location;
global.WebSocket = WebSocket;
global.localStorage = {
  getItem: () => null,
  clear: () => {},
  key: () => null,
  length: 0,
  removeItem: () => {},
  setItem: () => {},
} as Storage;

class GraphQLMockServer extends WS {
  constructor() {
    super('ws://testhost/graphql', { jsonProtocol: true });
    this.on('connection', (socket) =>
      socket.on('message', (data: any) => {
        switch (data.type) {
          case 'connection_init':
            socket.send(JSON.stringify({ type: 'connection_ack' }));
        }
      }),
    );
  }

  stop() {
    this.close();
  }
}

describe('SubManager', () => {
  it('should connect to a graphql server with authorization and game-id as payload', async () => {
    const mockServer = new GraphQLMockServer();

    const sm = new SubscriptionManager({
      url: 'ws://testhost/graphql',
      logger: null,
    });

    sm.connect('token', 'gameId');
    await mockServer.connected;

    expect(mockServer).toReceiveMessage(
      expect.objectContaining({
        payload: { Authorization: 'Bearer token', 'x-game-id': 'gameId' },
      }),
    );

    sm.close();
    mockServer.stop();
  });
});
