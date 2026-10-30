import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));

export async function installPrerenderDependencies(root) {
  for (const directory of ['server', 'shared', 'scripts/lib']) {
    await fs.cp(path.join(repositoryRoot, directory), path.join(root, directory), {
      recursive: true,
    });
  }
  await fs.symlink(
    path.join(repositoryRoot, 'node_modules'),
    path.join(root, 'node_modules'),
    process.platform === 'win32' ? 'junction' : 'dir',
  );
}
