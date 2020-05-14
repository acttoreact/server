// import * as http from 'http';
// import * as express from 'express';
// import * as io from 'socket.io';
import { start } from '../../../index';

test('Should init when jest forced disabled', async (): Promise<void> => {
  console.log('Starting server');
  const serverResponse = start();
  expect(serverResponse).toHaveProperty('server');
  expect(serverResponse).toHaveProperty('close');
});

// test('Server start', (): void => {
//   console.log('Server start');
//   const expressServer = express();
//   const httpServer = http.createServer(expressServer);

//   console.log('Calling sockets setup');
//   const ioServer = io(httpServer, { path: '/ws' });
//   const listener = httpServer.listen(4000, (): void => {
//     console.log('Server listening');
//   });

//   expect(ioServer).toBeTruthy();
//   expect(listener).toBeTruthy();
// });