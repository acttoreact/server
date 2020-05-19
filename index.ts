import { ServerResponse } from './model/server';

import { isJest } from './tools/isJest';
import createServer from './utils/createServer';

let server: ServerResponse | null = null;

/**
 * Stop server (if running)
 */
export const stop = (): void => {
  if (server) {
    server.close();
    server = null;
  }
}

/**
 * Start of the project
 */
export const start = async (port?: number): Promise<ServerResponse> => {
  console.log('Server start');
  stop();
  server = await createServer(port);
  return server;
}

/**
 * Stops server (if running) and starts again
 */
export const restart = start;

if (!isJest()) {
  start();
}
