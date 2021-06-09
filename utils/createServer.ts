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

import { apiPrefix, aliveEndpoint } from '../settings';

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
    expressServer.use(cors({ credentials: true }));
    expressServer.use(cookieParser());

    getApi(serverApiPath).then(async ({ api, setup }) => {
      const restApiRouter = getRestApi(api);
      const ioServer = sockets(httpServer, api);

      if (setup) {
        try {
          out.info('User server setup found, executing...');
          await setup({ expressServer, httpServer, ioServer, port, apiPrefix });
        } catch (ex) {
          out.info(`Error during user server setup: ${ex.stack || ex.message}`);
        }
      }

      expressServer.use(apiPrefix, restApiRouter);
      expressServer.use(aliveEndpoint, async function handler(_, res) {
        return res.status(200).json(true);
      });

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
