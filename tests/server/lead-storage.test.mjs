import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { deleteLeadFromFile } from '../../server/leads/lead-storage.mjs';

async function createTemporaryDirectory() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'passport-lead-storage-test-'));
}

test('deleteLeadFromFile removes only the requested lead and preserves remaining rows', async () => {
  const directory = await createTemporaryDirectory();
  const file = path.join(directory, 'leads.jsonl');

  const first = JSON.stringify({
    id: 'lead-1',
    name: 'Первый',
  });

  const second = JSON.stringify({
    id: 'lead-2',
    name: 'Второй',
  });

  const third = JSON.stringify({
    id: 'lead-3',
    name: 'Третий',
  });

  try {
    await fs.writeFile(file, `${first}\n${second}\n${third}\n`, 'utf8');

    const result = await deleteLeadFromFile(file, 'lead-2');

    assert.deepEqual(result, {
      deleted: true,
    });

    const content = await fs.readFile(file, 'utf8');

    assert.equal(content, `${first}\n${third}\n`);
    assert.doesNotMatch(content, /lead-2/);
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('deleteLeadFromFile preserves malformed non-empty JSONL rows', async () => {
  const directory = await createTemporaryDirectory();
  const file = path.join(directory, 'leads.jsonl');

  const first = JSON.stringify({
    id: 'lead-1',
  });

  const target = JSON.stringify({
    id: 'lead-2',
  });

  const malformed = '{"id":"broken"';

  const third = JSON.stringify({
    id: 'lead-3',
  });

  try {
    await fs.writeFile(file, `${first}\n${malformed}\n${target}\n${third}\n`, 'utf8');

    const result = await deleteLeadFromFile(file, 'lead-2');

    assert.deepEqual(result, {
      deleted: true,
    });

    const content = await fs.readFile(file, 'utf8');

    assert.equal(content, `${first}\n${malformed}\n${third}\n`);
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('deleteLeadFromFile leaves the file unchanged when lead is not found', async () => {
  const directory = await createTemporaryDirectory();
  const file = path.join(directory, 'leads.jsonl');

  const original = [
    JSON.stringify({
      id: 'lead-1',
    }),
    '{"malformed":',
    JSON.stringify({
      id: 'lead-2',
    }),
    '',
  ].join('\n');

  try {
    await fs.writeFile(file, original, 'utf8');

    const result = await deleteLeadFromFile(file, 'missing-lead');

    assert.deepEqual(result, {
      deleted: false,
      reason: 'NOT_FOUND',
    });

    const content = await fs.readFile(file, 'utf8');

    assert.equal(content, original);
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('deleteLeadFromFile handles invalid ids and missing storage without creating files', async () => {
  const directory = await createTemporaryDirectory();
  const missingFile = path.join(directory, 'missing.jsonl');

  try {
    const invalid = await deleteLeadFromFile(missingFile, '   ');

    assert.deepEqual(invalid, {
      deleted: false,
      reason: 'INVALID_ID',
    });

    const missing = await deleteLeadFromFile(missingFile, 'lead-1');

    assert.deepEqual(missing, {
      deleted: false,
      reason: 'NOT_FOUND',
    });

    await assert.rejects(fs.access(missingFile), error => error?.code === 'ENOENT');
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});
