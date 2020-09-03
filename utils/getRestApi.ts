import { Router } from 'express';
import { out } from '@a2r/telemetry';
import { A2RContext, setContext } from 'a2r';

import getSessionId from './getSessionId';
import getUserToken from './getUserToken';
import getTokenInfo from './getTokenInfo';

import { APIStructure } from '../model/api';

/**
 * Gets REST API Express router
 * @param api API structure
 */
const getRestApi = (api: APIStructure): Router => {
  const router = Router();

  Object.entries(api).forEach(([key, method]) => {
    const apiPath = key.split('.').join('/');
    out.info(`Setting up API REST method /api/${apiPath}`);
    router.post(`/${apiPath}`, async function handler(req, res) {
      const { params } = req.body;
      const header = req.headers?.cookie;
      const sessionId = getSessionId(header);
      const userToken = getUserToken(header);
      const context: A2RContext = { sessionId };
      const userInfo = getTokenInfo(userToken);
      if (userInfo) {
        context.userInfo = userInfo;
      }
      setContext(context);
      const result = await method.default(...params);
      setContext(false);
      return res.status(200).json(result);
    });
  });

  return router;
}

export default getRestApi;