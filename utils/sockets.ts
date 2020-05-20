import path from 'path';
import http from 'http';
import io from 'socket.io';
import chalk from 'chalk';
import { out } from '@a2r/telemetry';

import { MethodCall } from '../model/sockets';

import { socketPath } from '../settings';

const activeSockets: { [id: string]: io.Socket } = {};

const getModulePath = (method: string, serverApiPath: string): string => {
  const modulePath = method.split('.').join('/');
  return `${path.resolve(serverApiPath, modulePath)}.ts`;
};

const onDisconnect = (socket: io.Socket): void => {
  delete activeSockets[socket.id];
  out.verbose(
    chalk.white.bold(`Socket disconnected ${chalk.yellow.bold(socket.id)}`),
  );
};

const setup = (httpServer: http.Server, serverApiPath: string): void => {
  const ioServer = io(httpServer, { path: socketPath });

  ioServer.on(
    'connection',
    async (socket: io.Socket): Promise<void> => {
      console.log('Socket connected', socket.id);
      out.verbose(
        chalk.white.bold(`Socket Connected ${chalk.yellow.bold(socket.id)}`),
      );

      activeSockets[socket.id] = socket;

      socket.on(
        '*',
        async (info: MethodCall): Promise<void> => {
          const { id, method, params } = info;
          console.log('Socket message', id, method, params.length);
          out.verbose(
            `Socket message received: id ${id}, method: ${method}, params: ${params.length}`,
          );
          const modulePath = getModulePath(method, serverApiPath);
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

  console.log('Socket server ready');
};

export default setup;
