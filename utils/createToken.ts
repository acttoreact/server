import { sign } from 'jsonwebtoken';
import { A2RUserTokenInfo } from 'a2r';

import { secretKey } from '../settings';

/**
 * Creates and returns user token
 * @param info User info to be stored in token
 */
const createToken = (info: A2RUserTokenInfo): string => sign(info, secretKey);

export default createToken;
