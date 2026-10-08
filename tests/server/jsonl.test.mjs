import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { readJsonLines, readLines } from '../../server/shared/jsonl.mjs';

async function collect(iterable) {
  const values = [];

  for await (const value of iterable) {
    values.push(value);
  }

  return values;
}

async function createTemporaryDirectory() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'passport-jsonl-test-'));
}

test('readJsonLines streams valid rows and skips malformed rows', async () => {
  const directory = await createTemporaryDirectory();

  const file = path.join(directory, 'records.jsonl');

  try {
    await fs.writeFile(
      file,
      ['{"id":1}', '', 'broken-json', '{"id":2,"name":"Тест"}', '   ', '{"id":3}', ''].join('\n'),
      'utf8',
    );

    const rows = await collect(readJsonLines(file));

    assert.deepEqual(rows, [
      {
        id: 1,
      },
      {
        id: 2,
        name: 'Тест',
      },
      {
        id: 3,
      },
    ]);
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('readJsonLines treats a missing file as an empty stream', async () => {
  const directory = await createTemporaryDirectory();

  try {
    const rows = await collect(readJsonLines(path.join(directory, 'missing.jsonl')));

    assert.deepEqual(rows, []);
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('readLines preserves raw non-empty and empty lines', async () => {
  const directory = await createTemporaryDirectory();

  const file = path.join(directory, 'raw.jsonl');

  try {
    await fs.writeFile(file, 'first\n\nthird\n', 'utf8');

    const lines = await collect(readLines(file));

    assert.deepEqual(lines, ['first', '', 'third']);
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});
