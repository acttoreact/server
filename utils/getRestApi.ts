import { Router } from 'express';
import { out } from '@a2r/telemetry';
import { A2RContext, setContext } from 'a2r';

import { APIStructure } from '../model/api';

import getSessionId from './getSessionId';
import getUserToken from './getUserToken';
import getTokenInfo from './getTokenInfo';
import getReferer from './getReferer';

import { apiPrefix } from 'settings';

/**
 * Gets REST API Express router
 * @param api API structure
 */
const getRestApi = (api: APIStructure): Router => {
  const router = Router();

  Object.entries(api).forEach(([key, method]) => {
    const apiPath = key.split('.').join('/');
    out.info(`Setting up API REST method ${apiPrefix}/${apiPath}`);
    router.post(`/${apiPath}`, async function handler(req, res) {
      const { params } = req.body;
      try {
        const header = req.headers?.cookie;
        const sessionId = getSessionId(header);
        const userToken = getUserToken(header);
        const ips: string[] = Array.from(
          new Set([
            req.ip,
            ...(req.ips || []),
            req.socket.remoteAddress,
            req.headers['x-forwarded-for'],
            req.headers['x-real-ip'],
          ].filter((s): boolean => !!s) as string[]),
        );
        const referer = getReferer(header);
        const context: A2RContext = { sessionId, ips, referer };
        const userInfo = getTokenInfo(userToken);
        if (userInfo) {
          context.userInfo = userInfo;
        }
        setContext(context);
        const result = await method.default(...(params || []));
        setContext(false);
        return res.status(200).json(result);
      } catch (ex) {
        const error = `Error at request ${apiPrefix}/${apiPath} ${
          params ? `with params :${JSON.stringify(params)}` : 'without params'
        } => ${ex.stack || ex.message}`;
        out.error(error);
        return res.status(500).json(error);
      }
    });
  });

  return router;
};

export default getRestApi;
