/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Cookies from 'universal-cookie';

import { cookieKey } from '../settings';

/**
 * Gets sessionId stored in cookies
 * @param header Request header or Socket handshake header
 */
const getSessionId = (header: any): string | null => {
  const cookies = new Cookies(header);
  return cookies.get(cookieKey);
};

export default getSessionId;
