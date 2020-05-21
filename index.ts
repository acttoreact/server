import path from 'path';

import { ServerResponse } from './model/server';

import { isJest } from './tools/isJest';
import createServer from './utils/createServer';

import { defaultPort, targetPath, apiPath } from './settings';

const defaultServerApiPath = path.resolve(__dirname, targetPath, apiPath);
console.log('default server api path', defaultServerApiPath);

let server: ServerResponse | null = null;

/**
 * Returns server response instance
 */
export const getServer = (): ServerResponse | null => {
  return server;
};

/**
 * Stop server (if running)
 */
export const stop = async (): Promise<void> => {
  if (server) {
    await server.close();
    server = null;
  }
};

/**
 * Start of the project
 */
export const start = async (
  port = defaultPort,
  serverApiPath = defaultServerApiPath,
): Promise<ServerResponse> => {
  await stop();
  server = await createServer(port, serverApiPath);
  return server;
};

/**
 * Stops server (if running) and starts again
 */
export const restart = start;

if (!isJest()) {
  start();
}
