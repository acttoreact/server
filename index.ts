import path from 'path';

import { ServerResponse } from './model/server';

import { isJest } from './tools/isJest';
import createServer from './utils/createServer';

import { targetPath, apiPath } from './settings';

const defaultServerApiPath = path.resolve(process.cwd(), targetPath, apiPath);

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
  port?: number,
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
