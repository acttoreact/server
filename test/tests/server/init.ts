import { start, stop } from '../../../index';
import { ServerResponse } from '../../../model/server';

const port = 4001;

let serverResponse: ServerResponse;

/**
 * Setup WS & HTTP servers
 */
beforeAll(async () => {
  serverResponse = await start(port);
});

/**
 * Server Response should have server instance and close method
 */
test('Should init when jest forced disabled', async (): Promise<void> => {
  expect(serverResponse).toHaveProperty('server');
  expect(serverResponse).toHaveProperty('close');
});

/**
 * Stops server
 */
afterAll(async () => {
  await stop();
});
