// import path from 'path';
import http from 'http';
import io from 'socket.io';
import chalk from 'chalk';
import { out } from '@a2r/telemetry';

import { MethodCall } from '../model/sockets';
import { APIStructure } from '../model/api';

import getApi from './getApi';

import { socketPath } from '../settings';

const activeSockets: { [id: string]: io.Socket } = {};

const onDisconnect = (socket: io.Socket): void => {
  delete activeSockets[socket.id];
  out.verbose(
    chalk.white.bold(`Socket disconnected ${chalk.yellow.bold(socket.id)}`),
  );
};

const setup = async (httpServer: http.Server, serverApiPath: string): Promise<void> => {
  const ioServer = io(httpServer, { path: socketPath });

  const api: APIStructure = await getApi(serverApiPath);

  ioServer.on(
    'connection',
    async (socket: io.Socket): Promise<void> => {
      out.verbose(
        chalk.white.bold(`Socket Connected ${chalk.yellow.bold(socket.id)}`),
      );

      activeSockets[socket.id] = socket;

      socket.on(
        '*',
        async (info: MethodCall): Promise<void> => {
          const { id, method, params } = info;
          out.verbose(
            `Socket message received: id ${id}, method: ${method}, params: ${params.length}`,
          );
          const module = api[method];
          if (module) {
            try {
              const result = await module.default(...params);
              socket.emit(id, { o: 1, d: result });
            } catch (ex) {
              socket.emit(id, { o: 0, e: ex.message, s: ex.stack });
            }
          } else {
            socket.emit(id, { o: 0, e: `API method ${method} not found` });
          }
        },
      );

      socket.on('disconnect', (): void => onDisconnect(socket));
    },
  );
};

export default setup;
