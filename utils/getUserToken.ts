/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Cookies from 'universal-cookie';

import { userTokenKey } from '../settings';

/**
 * Gets userToken stored in cookies
 * @param header Request header or Socket handshake header
 */
const getUserToken = (header: any): string | null => {
  const cookies = new Cookies(header);
  return cookies.get(userTokenKey);
};

export default getUserToken;
