import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

import {
  applyRegulationSyncWorkspace,
  rollbackRegulationSyncChanges,
} from '../../server/regulations/regulation-sync-workspace.mjs';

async function createTemporaryDirectory() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'passport-regulation-sync-test-'));
}

function createWorkspace(changes) {
  return {
    getChanges() {
      return changes;
    },
  };
}

test('applyRegulationSyncWorkspace applies all planned file changes', async () => {
  const directory = await createTemporaryDirectory();

  const firstFile = path.join(directory, 'first.txt');
  const secondFile = path.join(directory, 'second.txt');

  try {
    await fs.writeFile(firstFile, 'first-original', 'utf8');
    await fs.writeFile(secondFile, 'second-original', 'utf8');

    const changes = [
      {
        relative: 'first.txt',
        url: pathToFileURL(firstFile),
        original: 'first-original',
        updated: 'first-updated',
      },
      {
        relative: 'second.txt',
        url: pathToFileURL(secondFile),
        original: 'second-original',
        updated: 'second-updated',
      },
    ];

    const result = await applyRegulationSyncWorkspace(createWorkspace(changes));

    assert.equal(result.changedFiles, 2);
    assert.deepEqual(result.changes, changes);

    assert.equal(await fs.readFile(firstFile, 'utf8'), 'first-updated');
    assert.equal(await fs.readFile(secondFile, 'utf8'), 'second-updated');
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('applyRegulationSyncWorkspace rolls back already written files when a later write fails', async () => {
  const directory = await createTemporaryDirectory();

  const firstFile = path.join(directory, 'first.txt');
  const invalidTarget = path.join(directory, 'invalid-target');

  try {
    await fs.writeFile(firstFile, 'first-original', 'utf8');

    await fs.mkdir(invalidTarget);

    const changes = [
      {
        relative: 'first.txt',
        url: pathToFileURL(firstFile),
        original: 'first-original',
        updated: 'first-updated',
      },
      {
        relative: 'invalid-target',
        url: pathToFileURL(invalidTarget),
        original: 'directory-original',
        updated: 'this-write-must-fail',
      },
    ];

    await assert.rejects(
      applyRegulationSyncWorkspace(createWorkspace(changes)),
      error => error?.code === 'EISDIR' || error?.code === 'EACCES' || error?.code === 'EPERM',
    );

    assert.equal(
      await fs.readFile(firstFile, 'utf8'),
      'first-original',
      'The first file must be restored after the second write fails',
    );

    const invalidTargetStat = await fs.stat(invalidTarget);

    assert.equal(invalidTargetStat.isDirectory(), true);
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('rollbackRegulationSyncChanges restores applied files in reverse-safe form', async () => {
  const directory = await createTemporaryDirectory();

  const firstFile = path.join(directory, 'first.txt');
  const secondFile = path.join(directory, 'second.txt');

  try {
    await fs.writeFile(firstFile, 'first-updated', 'utf8');
    await fs.writeFile(secondFile, 'second-updated', 'utf8');

    const changes = [
      {
        relative: 'first.txt',
        url: pathToFileURL(firstFile),
        original: 'first-original',
        updated: 'first-updated',
      },
      {
        relative: 'second.txt',
        url: pathToFileURL(secondFile),
        original: 'second-original',
        updated: 'second-updated',
      },
    ];

    await rollbackRegulationSyncChanges(changes);

    assert.equal(await fs.readFile(firstFile, 'utf8'), 'first-original');
    assert.equal(await fs.readFile(secondFile, 'utf8'), 'second-original');
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});
