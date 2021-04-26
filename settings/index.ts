import dotenv from 'dotenv';

import { isJest } from '../tools/isJest';

dotenv.config();

/**
 * Default port
 */
export const defaultPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 80;

/**
 * Running in development mode
 */
export const dev = process.env.NODE_ENV === 'development';

/**
 * Session cookie key
 */
export const cookieKey = process.env.COOKIE_KEY || 'a2r_sessionId';

/**
 * User token cookie key
 */
export const userTokenKey = process.env.USER_TOKEN_KEY || 'a2r_userToken';

/**
 * User token cookie key
 */
export const refererKey = process.env.REFERER_KEY || 'a2r_referer';

/**
 * API module file extension
 */
export const apiFileExtension = dev || isJest() ? 'ts' : 'js';

/**
 * Default socket path
 */
export const socketPath = process.env.SOCKET_PATH || '/ws';

/**
 * REST API Prefix
 */
export const apiPrefix = process.env.API_PREFIX || '/a2r';

/**
 * Alive endpoint
 */
export const aliveEndpoint = process.env.ALIVE_ENDPOINT || '/alive';

/**
 * Health endpoint
 */
export const healthEndpoint = process.env.HEALTH_ENDPOINT || '/health';

/**
 * Reserved file name for server setup
 */
export const serverSetupFileName = process.env.SERVER_SETUP_FILE_NAME || '_setup';

/**
 * Default target path for watchers, should contain `api` and `model` folders
 */
export const targetPath = process.env.TARGET_PATH || 'server';

/**
 * Default api path inside main target path
 */
export const apiPath = process.env.API_PATH || 'api';

/**
 * Secret key for token sign
 */
export const secretKey = process.env.SECRET_KEY || 'a2r_secret_key';
