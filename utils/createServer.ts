import http from 'http';
import express from 'express';
import chalk from 'chalk';
import { out } from '@a2r/telemetry';

import { ServerResponse } from '../model/server';

import sockets from './sockets';
import { defaultPort } from '../settings';

/**
 * Creates HTTP server and inits socket server
 * @param port Port for to listen
 * @param serverApiPath Server API path
 */
const createServer = (port = defaultPort, serverApiPath: string): Promise<ServerResponse> => {
  return new Promise<ServerResponse>((resolve): void => {
    const expressServer = express();
    const httpServer = http.createServer(expressServer);  
    sockets(httpServer, serverApiPath);
  
    const listener = httpServer.listen(port, (): void => {
      out.info(
        chalk.white.bold(
          `Listening ${chalk.yellow.bold(
            `http://localhost:${port.toString()}/`,
          )}`,
        ),
      );
      resolve({
        server: listener,
        close: (): Promise<void> => new Promise((resolveClose) => {
          listener.close(() => {
            resolveClose();
          });
        }),
      });
    });
  
    listener.on('close', (): void => {
      out.info(chalk.white.bold('Http server closed'));
    });      
  });  
};

export default createServer;
