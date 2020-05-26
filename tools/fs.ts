import fs from 'fs';
import util from 'util';
import path from 'path';

/**
 * Read a directory.
 */
export const readDir = util.promisify(fs.readdir);

/**
 * Gets files recursively
 * @param folderPath Path to get files from
 */
export const getFilesRecursively = async (
  folderPath: string,
  extName?: string[],
): Promise<string[]> => {
  const contents = await readDir(folderPath, {
    encoding: 'utf8',
    withFileTypes: true,
  });
  const files = await Promise.all(
    contents.map(
      async (content): Promise<string[]> => {
        if (content.isDirectory()) {
          const folderFiles = await getFilesRecursively(
            path.resolve(folderPath, content.name),
            extName,
          );
          return folderFiles;
        }
        const ext = path.extname(content.name);
        if (!extName || !extName.length || extName.indexOf(ext) !== -1) {
          return [path.resolve(folderPath, content.name)];
        }
        return [];
      },
    ),
  );
  return files.reduce((t, f) => [...t, ...f], []);
};