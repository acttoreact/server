import * as http from 'http';
import * as express from 'express';
import * as chalk from 'chalk';
import { out } from '@a2r/telemetry';

import { ServerResponse } from '../model/server';

import sockets from './sockets';
import { defaultPort } from '../settings';

const createServer = (port = defaultPort): ServerResponse => {
  const expressServer = express();
  const httpServer = http.createServer(expressServer);

  console.log('Calling sockets setup');
  sockets(httpServer);

  const listener = httpServer.listen(port, (): void => {
    out.info(
      chalk.white.bold(
        `Listening ${chalk.yellow.bold(
          `http://localhost:${port.toString()}/`,
        )}`,
      ),
    );
  });

  listener.on('close', (): void => {
    out.info(chalk.white.bold('Http server closed'));
  });

  return {
    server: listener,
    close: (): void => {
      listener.close();
    },
  };
};

export default createServer;
