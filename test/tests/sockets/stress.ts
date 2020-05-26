import path from 'path';
import io from 'socket.io-client';
import waitForExpect from 'wait-for-expect';

import { MethodCall, SocketMessage } from '../../../model/sockets';

import { start, stop } from '../../../index';

import { socketPath } from '../../../settings';

const port = 4004;
const serverApiPath = path.resolve(__dirname, '../../mocks/api');

const sockets = 5;
const calls = 10;
const timeout = 30000;

/**
 * Setup WS & HTTP servers
 */
beforeAll(async () => {
  await start(port, serverApiPath);
});

/**
 * Socket calling ping and receiving proper response
 */
test('Socket server stress', async (): Promise<void> => {
  let index = 1;
  jest.setTimeout(timeout);
  await Promise.all(Array(sockets).fill(true).map(async () => {
    const socket = io(`http://localhost:${port}`, {
      autoConnect: true,
      path: socketPath,
    });
    await waitForExpect(async (): Promise<void> => {
      expect(socket.connected).toBe(true);
    });

    await Promise.all(Array(calls).fill(true).map(() => {
      const id = `${index++}`;
  
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
    
      return waitForExpect((): void => {
        expect(response).toBeTruthy();
        expect(response.o).toBeTruthy();
        expect(response.e).toBeFalsy();
        expect(response.s).toBeFalsy();
        expect(response.d).toBe('pong');
      });
    }));
  
    socket.close();
    return waitForExpect((): void => {
      expect(socket.connected).toBe(false);
    });
  }));
});


/**
 * Stops server
 */
afterAll(async () => {
  await stop();
});
