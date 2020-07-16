import http from 'http';
import express from 'express';
import chalk from 'chalk';
import { out } from '@a2r/telemetry';

import getApi from './getApi';
import sockets from './sockets';

import { ServerResponse } from '../model/server';
import { APIStructure } from '../model/api';

/**
 * Creates HTTP server and inits socket server
 * @param port Port for to listen
 * @param serverApiPath Server API path
 */
const createServer = (port: number, serverApiPath: string): Promise<ServerResponse> => {
  return new Promise<ServerResponse>((resolve): void => {
    const expressServer = express();
    const httpServer = http.createServer(expressServer);

    getApi(serverApiPath).then((api: APIStructure) => {
      Object.entries(api).forEach(([key, method]) => {
        const apiPath = key.split('.').join('/');
        out.info(`Setting up API REST method ${`/api/${apiPath}`}`);
        expressServer.post(`/api/${apiPath}`, async function handler(req, res) {
          const { params } = req.params;
          const result = await method.default(params);
          res.end(result);
        });
      });
      sockets(httpServer, api);
  
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
  });  
};

export default createServer;
