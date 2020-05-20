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
    expect(response.o).toBeTruthy();
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
 * When calling a non-existing method, we should get an error
 */
test('Non-existing API method', async (): Promise<void> => {
  const socket = io(`http://localhost:${port}`, {
    autoConnect: true,
    path: socketPath,
  });
  await waitForExpect(async (): Promise<void> => {
    expect(socket.connected).toBe(true);
  });

  const id = generateId();

  let response: SocketMessage | null = null;

  socket.on(id, (res: SocketMessage): void => {
    socket.off(id);
    response = res;
  });

  const call: MethodCall = {
    id,
    method: 'wrong',
    params: [],
  };
  
  socket.emit('*', call);

  await waitForExpect(async (): Promise<void> => {
    expect(response).toBeTruthy();
    expect(response.o).toBeFalsy();
    expect(response.e).toBe(`API method ${call.method} not found`);
    expect(response.d).toBeFalsy();
  });

  socket.close();
  await waitForExpect(async (): Promise<void> => {
    expect(socket.connected).toBe(false);
  });
});

/**
 * Error treatment when using API methods
 */
test('API method error', async (): Promise<void> => {
  const socket = io(`http://localhost:${port}`, {
    autoConnect: true,
    path: socketPath,
  });
  await waitForExpect(async (): Promise<void> => {
    expect(socket.connected).toBe(true);
  });

  const id = generateId();

  let response: SocketMessage | null = null;

  socket.on(id, (res: SocketMessage): void => {
    socket.off(id);
    response = res;
  });

  const call: MethodCall = {
    id,
    method: 'tools.first',
    params: [],
  };
  
  socket.emit('*', call);

  await waitForExpect(async (): Promise<void> => {
    expect(response).toBeTruthy();
    expect(response.o).toBeFalsy();
    expect(response.d).toBeFalsy();
    expect(response.e).toBeTruthy();
    expect(response.s).toBeTruthy();
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
