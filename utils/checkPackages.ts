import path from 'path';
import { out } from '@a2r/telemetry';
import { writeFile } from '@a2r/fs'

import exec from '../tools/exec';

const workingDirectory = process.cwd();

const checkPackages = async (): Promise<void> => {
  const packageJsonPath = path.resolve(workingDirectory, 'package.json');
  const packageJson = await import(packageJsonPath);
  const { dependencies } = packageJson;
  const serverPackageJsonPath = path.resolve(workingDirectory, 'server', 'package.json');
  const serverPackageJson = await import(serverPackageJsonPath);
  const { dependencies: serverDependencies } = serverPackageJson;
  let needsUpdate = false;
  const newDependencies = { ...dependencies };
  Object.entries(serverDependencies).forEach(([lib, version]) => {
    if (newDependencies[lib] !== version) {
      needsUpdate = true;
      newDependencies[lib] = version;
    }
  });
  if (needsUpdate) {
    out.info('Updating packages');
    const content = {
      ...packageJson,
      dependencies: newDependencies,
    };
    await writeFile(packageJsonPath, JSON.stringify(content, null, 2));
    await exec('npm', ['install']);
  } else {
    out.info('Packages are up to date');
  }
};

(async function check(): Promise<void> {
  await checkPackages();
  out.info('Packages checked');
})();