import fs from 'fs';
import util from 'util';
import path from 'path';

/**
 * Read a directory.
 * @param {fs.PathLike} path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param {{ encoding: BufferEncoding; withFileTypes?: false; } | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex"} options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, 'utf8' is used
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