import path from 'path';
import { getFilesRecursively } from '@a2r/fs';

import {
  APIInfo,
  APIStructure,
  APIModule,
  ServerSetupModule,
} from '../model/api';

import { apiFileExtension, serverSetupFileName } from '../settings';

/**
 * Gets files from API path and builds API module dictionary
 * @param apiPath Server API path
 */
const getApi = async (apiPath: string): Promise<APIInfo> => {
  let setup = null;
  const files = await getFilesRecursively(apiPath, [`.${apiFileExtension}`]);
  const setupPath = path.resolve(apiPath, serverSetupFileName);

  const setupIndex = files.findIndex((f) => f === setupPath);
  if (setupIndex !== -1) {
    files.splice(setupIndex, 1);
    setup = ((await import(setupPath)) as ServerSetupModule)?.default || null;
  }

  const modules: { key: string; module: APIModule }[] = await Promise.all(
    files.map(async (filePath) => {
      const relativePath = path
        .relative(apiPath, filePath)
        .replace(new RegExp(`\\.${apiFileExtension}$`), '')
        .split('/')
        .join('.');
      const module = (await import(filePath)) as APIModule;
      return { key: relativePath, module };
    }),
  );

  const api = modules.reduce(
    (t, { key, module }): APIStructure => ({
      ...t,
      [key]: module,
    }),
    {},
  );

  return {
    api,
    setup,
  };
};

export default getApi;
