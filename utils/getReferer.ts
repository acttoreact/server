/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Cookies from 'universal-cookie';

import { refererKey } from '../settings';

/**
 * Gets sessionId stored in cookies
 * @param header Request header or Socket handshake header
 */
const getReferer = (header: any): string => {
  const cookies = new Cookies(header);
  return cookies.get(refererKey) || '';
};

export default getReferer;
