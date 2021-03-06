import io from 'socket.io-client';
import waitForExpect from 'wait-for-expect';

import { start, stop } from '../../../index';

import { socketPath } from '../../../settings';

const port = 4002;
let socket: SocketIOClient.Socket | null = null;

/**
 * Setup WS & HTTP servers
 */
beforeAll(async () => {
  await start(port);
});

/**
 * Socket should connect
 */
test('Socket connection', async (): Promise<void> => {
  socket = io(`http://localhost:${port}`, {
    autoConnect: true,
    path: socketPath,
  });
  await waitForExpect(async (): Promise<void> => {
    expect(socket.connected).toBe(true);
  });
  socket.close();
  await waitForExpect(async (): Promise<void> => {
    expect(socket.connected).toBe(false);
  });
});

/**
 * Stops server
 */
afterAll(async () => {
  await stop();
});
