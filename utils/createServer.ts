import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import chalk from 'chalk';
import { out } from '@a2r/telemetry';

import getApi from './getApi';
import getRestApi from './getRestApi';
import sockets from './sockets';

import { ServerResponse } from '../model/server';

/**
 * Creates HTTP server and inits socket server
 * @param port Port for to listen
 * @param serverApiPath Server API path
 */
const createServer = (
  port: number,
  serverApiPath: string,
): Promise<ServerResponse> => {
  return new Promise<ServerResponse>((resolve): void => {
    const expressServer = express();
    const httpServer = http.createServer(expressServer);

    expressServer.use(bodyParser.urlencoded({ extended: true }));
    expressServer.use(bodyParser.json({ limit: '50mb' }));
    expressServer.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    expressServer.use(cookieParser());
    expressServer.use(cors());

    getApi(serverApiPath).then(async ({ api, setup }) => {
      const restApi = getRestApi(api);
      expressServer.use('/api', restApi);

      const ioServer = sockets(httpServer, api);

      if (setup) {
        try {
          out.info('User server setup found, executing...');
          await setup({ expressServer, httpServer, ioServer, port });
        } catch (ex) {
          out.warn(`Error during user server setup: ${ex.stack || ex.message}`);
        }
      }

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
          close: (): Promise<void> =>
            new Promise((resolveClose) => {
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
