import { isJest } from '../tools/isJest';

/**
 * Default port
 */
export const defaultPort = 4000;

/**
 * Running in development mode
 */
export const dev = process.env.NODE_ENV === 'development';

/**
 * Session cookie key
 */
export const cookieKey = process.env.COOKIE_KEY || 'a2r_sessionId';

/**
 * API module file extension
 */
export const apiFileExtension = dev || isJest() ? 'ts' : 'js';

/**
 * Default socket path
 */
export const socketPath = '/ws';

/**
 * Default target path for watchers, should contain `api` and `model` folders
 */
export const targetPath = 'server';

/**
 * Default api path inside main target path
 */
export const apiPath = 'api';
