/* eslint no-param-reassign: ["error", { "props": false }] */

import http from 'http';
import io from 'socket.io';
import chalk from 'chalk';
import Cookies from 'universal-cookie';
import { out } from '@a2r/telemetry';

import { A2RSocket, MethodCall } from '../model/sockets';
import { APIStructure } from '../model/api';

import { socketPath } from '../settings';

const activeSockets: { [id: string]: io.Socket } = {};

const onDisconnect = (socket: io.Socket): void => {
  delete activeSockets[socket.id];
  out.verbose(
    chalk.white.bold(`Socket disconnected ${chalk.yellow.bold(socket.id)}`),
  );
};

const setup = async (
  httpServer: http.Server,
  api: APIStructure,
): Promise<void> => {
  const ioServer = io(httpServer, { path: socketPath });

  ioServer.on(
    'connection',
    async (socket: A2RSocket): Promise<void> => {
      out.verbose(
        chalk.white.bold(`Socket Connected ${chalk.yellow.bold(socket.id)}`),
      );

      const cookieKey = 'a2r_sessionId';
      const header = socket.handshake.headers && socket.handshake.headers.cookie;
      const cookies = new Cookies(header);
      const sessionId = cookies.get(cookieKey);
      socket.sessionId = sessionId;

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
              // setContext
              const result = await module.default(...params);
              // setContext(false)
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
