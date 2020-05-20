import path from 'path';
import io from 'socket.io-client';
import waitForExpect from 'wait-for-expect';
import generateId from 'shortid';

import { MethodCall, SocketMessage } from '../../../model/sockets';

import { start, stop } from '../../../index';

import { socketPath } from '../../../settings';

const port = 4003;
const serverApiPath = path.resolve(__dirname, '../../mocks/api');

/**
 * Setup WS & HTTP servers
 */
beforeAll(async () => {
  await start(port, serverApiPath);
});

/**
 * Socket calling ping and receiving proper response
 */
test('Socket ping', async (): Promise<void> => {
  const socket = io(`http://localhost:${port}`, {
    autoConnect: true,
    path: socketPath,
  });
  await waitForExpect(async (): Promise<void> => {
    expect(socket.connected).toBe(true);
  });

  console.log('Socket connected');

  const id = generateId();

  let response: SocketMessage | null = null;

  socket.on(id, (res: SocketMessage): void => {
    socket.off(id);
    response = res;
  });

  const call: MethodCall = {
    id,
    method: 'ping',
    params: [],
  };
  
  socket.emit('*', call);

  await waitForExpect(async (): Promise<void> => {
    expect(response).toBeTruthy();
    expect(response.o).toBe(true);
    expect(response.e).toBeFalsy();
    expect(response.s).toBeFalsy();
    expect(response.d).toBe('pong');
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
