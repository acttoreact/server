import { Router } from 'express';
import { out } from '@a2r/telemetry';
import { setContext } from 'a2r';

import getSessionId from './getSessionId';

import { APIStructure } from '../model/api';

/**
 * Gets REST API Express router
 * @param api API structure
 */
const getRestApi = (api: APIStructure): Router => {
  const router = Router();

  Object.entries(api).forEach(([key, method]) => {
    const apiPath = key.split('.').join('/');
    out.info(`Setting up API REST method ${`/api/${apiPath}`}`);
    router.post(`/${apiPath}`, async function handler(req, res) {
      out.info(`Method /api/${apiPath} called`);
      const { params } = req.body;
      const header = req.headers && req.headers.cookie;
      const sessionId = getSessionId(header);
      setContext({ sessionId });
      const result = await method.default(...params);
      setContext(false);
      res.end(result);
    });
  });

  return router;
}

export default getRestApi;