import waitForExpect from 'wait-for-expect';

import { setForceDisableJestDetection } from '../../../tools/isJest';

/**
 * Disabling Jest detection
 */
beforeAll(() => {
  setForceDisableJestDetection(true);
});

/**
 * When jest disabled, importing index should start server automatically
 */
test('Should init when jest forced disabled', async (): Promise<void> => {
  const index = await import('../../../index');
  await waitForExpect(async (): Promise<void> => {
    expect(index.getServer()).not.toBe(null);
  });
  await index.stop();
  expect(index.getServer()).toBe(null);
});

/**
 * Enabling Jest detection back
 */
afterAll(() => {
  setForceDisableJestDetection(false);
});