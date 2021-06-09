import { verify } from 'jsonwebtoken';
import { A2RUserTokenInfo } from 'a2r';
import { out } from '@a2r/telemetry';

import { secretKey } from '../settings';

/**
 * Verifies and returns decode payload stored in a token
 * @param token User token
 */
const getTokenInfo = (token?: string): A2RUserTokenInfo | null => {
  if (!token) {
    return null;
  }
  try {
    return verify(token, secretKey) as A2RUserTokenInfo;
  } catch (ex) {
    out.info(`Error verifying user token\n${ex.stack || ex.message}`);
    return null;
  }
};

export default getTokenInfo;
