import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { readAdminDocumentation } from '../../server/shared/admin-documentation.mjs';

async function createWorkspace() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'passport-admin-docs-'));
}

test('admin documentation prefers README_DEV when available', async () => {
  const workspace = await createWorkspace();

  try {
    await fs.writeFile(path.join(workspace, 'README.md'), '# Public README\n');

    await fs.writeFile(path.join(workspace, 'README_DEV.md'), '# Internal README\n');

    const result = await readAdminDocumentation(workspace);

    assert.equal(result.filename, 'README_DEV.md');
    assert.equal(result.markdown, '# Internal README\n');
    assert.match(result.updatedAt, /^\d{4}-\d{2}-\d{2}T/);
  } finally {
    await fs.rm(workspace, {
      recursive: true,
      force: true,
    });
  }
});

test('admin documentation falls back to tracked README', async () => {
  const workspace = await createWorkspace();

  try {
    await fs.writeFile(path.join(workspace, 'README.md'), '# Repository README\n');

    const result = await readAdminDocumentation(workspace);

    assert.equal(result.filename, 'README.md');
    assert.equal(result.markdown, '# Repository README\n');
  } finally {
    await fs.rm(workspace, {
      recursive: true,
      force: true,
    });
  }
});

test('admin documentation reports missing documentation explicitly', async () => {
  const workspace = await createWorkspace();

  try {
    await assert.rejects(readAdminDocumentation(workspace), error => {
      assert.equal(error.code, 'ADMIN_DOCUMENTATION_NOT_FOUND');

      return true;
    });
  } finally {
    await fs.rm(workspace, {
      recursive: true,
      force: true,
    });
  }
});
