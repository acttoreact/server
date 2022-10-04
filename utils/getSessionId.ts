/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IncomingHttpHeaders } from 'http';
import Cookies from 'universal-cookie';

import { cookieKey } from '../settings';

/**
 * Gets sessionId stored in cookies
 * @param header Request header or Socket handshake header
 */
const getSessionId = (
  requestHeaders: IncomingHttpHeaders,
  handshakeHeaders?: IncomingHttpHeaders,
): string | null => {
  if (handshakeHeaders?.['a2r-session-id']) {
    return handshakeHeaders['a2r-session-id'] as string;
  }
  if (requestHeaders['a2r-session-id']) {
    return requestHeaders['a2r-session-id'] as string;
  }
  const cookies = new Cookies(
    handshakeHeaders?.cookie || requestHeaders.cookie,
  );
  return cookies.get(cookieKey);
};

export default getSessionId;
