import path from 'path';

import { APIStructure, APIModule } from '../model/api';

import { getFilesRecursively } from '../tools/fs';

/**
 * Gets files from API path and builds API module dictionary
 * @param apiPath Server API path
 */
const getApi = async (apiPath: string): Promise<APIStructure> => {
  const files = await getFilesRecursively(apiPath, ['.ts']);
  const modules: { key: string; module: APIModule }[] = await Promise.all(
    files.map(async (filePath) => {
      const relativePath = path
        .relative(apiPath, filePath)
        .replace(/\.ts$/, '')
        .split('/')
        .join('.');
      const module = (await import(filePath)) as APIModule;
      return { key: relativePath, module };
    }),
  );
  return modules.reduce(
    (t, { key, module }): APIStructure => ({
      ...t,
      [key]: module,
    }),
    {},
  );
};

export default getApi;
