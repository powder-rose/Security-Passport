import fs from 'node:fs/promises';
import path from 'node:path';

const DOCUMENTATION_FILES = ['README_DEV.md', 'README.md'];

export async function readAdminDocumentation(projectRoot) {
  for (const filename of DOCUMENTATION_FILES) {
    const documentationPath = path.resolve(projectRoot, filename);

    try {
      const [markdown, stats] = await Promise.all([
        fs.readFile(documentationPath, 'utf8'),
        fs.stat(documentationPath),
      ]);

      return {
        filename,
        markdown,
        updatedAt: stats.mtime.toISOString(),
      };
    } catch (error) {
      if (error?.code === 'ENOENT') {
        continue;
      }

      throw error;
    }
  }

  const error = new Error('Admin documentation file not found');

  error.code = 'ADMIN_DOCUMENTATION_NOT_FOUND';

  throw error;
}
