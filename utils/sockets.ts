/* eslint no-param-reassign: ["error", { "props": false }] */

import http from 'http';
import io, { Socket } from 'socket.io';
import chalk from 'chalk';
import { out } from '@a2r/telemetry';
import { setContext, A2RUserTokenInfo, A2RContext } from 'a2r';

import getSessionId from './getSessionId';
import createToken from './createToken';
import getTokenInfo from './getTokenInfo';

import { A2RSocket, MethodCall } from '../model/sockets';
import { APIStructure } from '../model/api';

import { socketPath } from '../settings';
import getUserToken from './getUserToken';

/**
 * Active sockets dictionary (by socket ID)
 */
const activeSockets: { [id: string]: Socket } = {};

/**
 * Socket disconnection handler
 * @param Socket socket
 */
const onDisconnect = (socket: Socket): void => {
  delete activeSockets[socket.id];
  out.verbose(
    chalk.white.bold(`Socket disconnected ${chalk.yellow.bold(socket.id)}`),
  );
};

/**
 * Server sockets setup
 * @param httpServer HTTP Server
 * @param api API Structure
 */
const setup = (
  httpServer: http.Server,
  api: APIStructure,
): io.Server => {
  const ioServer = io(httpServer, { path: socketPath });

  ioServer.on(
    'connection',
    async (socket: Socket): Promise<void> => {
      out.info(
        chalk.white.bold(`Socket Connected ${chalk.yellow.bold(socket.id)}`),
      );

      const header = socket.handshake.headers?.cookie;
      const sessionId = getSessionId(header);
      const userToken = getUserToken(header);
      (socket as A2RSocket).sessionId = sessionId;
      if (userToken) {
        (socket as A2RSocket).userToken = userToken;
      }

      activeSockets[socket.id] = socket;

      socket.on(
        '*',
        async (info: MethodCall): Promise<void> => {
          const { id, method, params } = info;
          // out.verbose(
          //   `Socket message received: sessionId ${socket.sessionId}, userToken ${socket.userToken} id ${id}, method: ${method}`,
          // );
          const module = api[method];
          if (module) {
            try {
              const context: A2RContext = { sessionId };
              const userInfo = getTokenInfo((socket as A2RSocket).userToken);
              if (userInfo) {
                context.userInfo = userInfo;
              }
              setContext(context);
              const result = await module.default(...params);
              setContext(false);
              socket.emit(id, { o: 1, d: result });
            } catch (ex) {
              socket.emit(id, { o: 0, e: ex.message, s: ex.stack });
            }
          } else {
            socket.emit(id, { o: 0, e: `API method ${method} not found` });
          }
        },
      );

      socket.on('a2r_login', (id: string, info: A2RUserTokenInfo): void => {
        const token = createToken(info);
        (socket as A2RSocket).userToken = token;
        socket.emit(id, token);
      });

      socket.on('a2r_logout', (id: string, token?: string): void => {
        if (!token || (socket as A2RSocket).userToken === token) {
          delete (socket as A2RSocket).userToken;
        }
        socket.emit(id);
      });

      socket.on('disconnect', (): void => onDisconnect(socket));
    },
  );

  return ioServer;
};

export default setup;
