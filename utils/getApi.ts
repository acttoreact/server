import path from 'path';
import { getFilesRecursively } from '@a2r/fs';

import { APIStructure, APIModule } from '../model/api';

import { apiFileExtension } from '../settings';

/**
 * Gets files from API path and builds API module dictionary
 * @param apiPath Server API path
 */
const getApi = async (apiPath: string): Promise<APIStructure> => {
  const files = await getFilesRecursively(apiPath, [`.${apiFileExtension}`]);
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
  return modules.reduce(
    (t, { key, module }): APIStructure => ({
      ...t,
      [key]: module,
    }),
    {},
  );
};

export default getApi;
