import * as path from 'path';
import * as http from 'http';
import * as io from 'socket.io';
import * as chalk from 'chalk';
import { out } from '@a2r/telemetry';

import { MethodCall } from '../model/sockets';

import { socketPath, targetPath, apiPath } from '../settings';

const serverApiPath = path.resolve(process.cwd(), targetPath, apiPath);

const activeSockets: { [id: string]: io.Socket } = {};

const getModulePath = (method: string): string => {
  const modulePath = method.split('.').join('/');
  return `${path.resolve(serverApiPath, modulePath)}.ts`;
};

const onDisconnect = (socket: io.Socket): void => {
  delete activeSockets[socket.id];
  out.verbose(
    chalk.white.bold(`Socket disconnected ${chalk.yellow.bold(socket.id)}`),
  );
};

const setup = (httpServer: http.Server): void => {
  console.log('Sockets setup');
  const ioServer = io(httpServer, { path: socketPath });

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
          const modulePath = getModulePath(method);
          const module = await import(modulePath);
          try {
            const result = await module.default(...params);
            socket.emit(id, { o: 1, d: result });
          } catch (ex) {
            socket.emit(id, { o: 0, e: ex.message, s: ex.stack });
          }
        },
      );

      socket.on('disconnect', (): void => onDisconnect(socket));
    },
  );
};

export default setup;
