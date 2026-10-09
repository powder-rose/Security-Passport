import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

import {
  applyRegulationSyncWorkspace,
  recoverRegulationSyncTransactions,
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

test('recoverRegulationSyncTransactions rolls back a transaction interrupted during commit', async () => {
  const directory = await createTemporaryDirectory();

  const firstFile = path.join(directory, 'first.txt');
  const secondFile = path.join(directory, 'second.txt');

  const transactionDirectory = path.join(directory, '.transactions');
  const transactionId = 'interrupted-transaction';
  const journalDirectory = path.join(transactionDirectory, transactionId);
  const backupDirectory = path.join(journalDirectory, 'backups');

  try {
    await fs.writeFile(firstFile, 'first-updated', 'utf8');
    await fs.writeFile(secondFile, 'second-original', 'utf8');

    await fs.mkdir(backupDirectory, {
      recursive: true,
    });

    const firstBackup = path.join(backupDirectory, '0.original');
    const secondBackup = path.join(backupDirectory, '1.original');

    await fs.writeFile(firstBackup, 'first-original', 'utf8');
    await fs.writeFile(secondBackup, 'second-original', 'utf8');

    await fs.writeFile(
      path.join(journalDirectory, 'manifest.json'),
      JSON.stringify(
        {
          version: 1,
          id: transactionId,
          phase: 'committing',
          changes: [
            {
              target: firstFile,
              backup: firstBackup,
            },
            {
              target: secondFile,
              backup: secondBackup,
            },
          ],
        },
        null,
        2,
      ) + '\n',
      'utf8',
    );

    await recoverRegulationSyncTransactions({
      transactionDirectory,
    });

    assert.equal(
      await fs.readFile(firstFile, 'utf8'),
      'first-original',
      'A file already replaced before the crash must be rolled back',
    );

    assert.equal(
      await fs.readFile(secondFile, 'utf8'),
      'second-original',
      'A file not yet replaced must remain at its original version',
    );

    await assert.rejects(fs.stat(journalDirectory), error => error?.code === 'ENOENT');
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('recoverRegulationSyncTransactions preserves a transaction already marked committed', async () => {
  const directory = await createTemporaryDirectory();

  const targetFile = path.join(directory, 'target.txt');

  const transactionDirectory = path.join(directory, '.transactions');
  const transactionId = 'committed-transaction';
  const journalDirectory = path.join(transactionDirectory, transactionId);
  const backupDirectory = path.join(journalDirectory, 'backups');

  try {
    await fs.writeFile(targetFile, 'committed-value', 'utf8');

    await fs.mkdir(backupDirectory, {
      recursive: true,
    });

    const backupFile = path.join(backupDirectory, '0.original');

    await fs.writeFile(backupFile, 'original-value', 'utf8');

    await fs.writeFile(
      path.join(journalDirectory, 'manifest.json'),
      JSON.stringify(
        {
          version: 1,
          id: transactionId,
          phase: 'committed',
          changes: [
            {
              target: targetFile,
              backup: backupFile,
            },
          ],
        },
        null,
        2,
      ) + '\n',
      'utf8',
    );

    await recoverRegulationSyncTransactions({
      transactionDirectory,
    });

    assert.equal(
      await fs.readFile(targetFile, 'utf8'),
      'committed-value',
      'A committed transaction must not be rolled back after restart',
    );

    await assert.rejects(fs.stat(journalDirectory), error => error?.code === 'ENOENT');
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('recoverRegulationSyncTransactions cleans an incomplete journal without a manifest', async () => {
  const directory = await createTemporaryDirectory();

  const transactionDirectory = path.join(directory, '.transactions');
  const journalDirectory = path.join(transactionDirectory, 'incomplete-transaction');

  try {
    await fs.mkdir(journalDirectory, {
      recursive: true,
    });

    /*
     * Имитируем crash во время первой durable-записи manifest:
     * каталог транзакции уже существует,
     * manifest.json ещё не появился.
     */
    await fs.writeFile(path.join(journalDirectory, 'manifest.json.tmp'), '{"version":1', 'utf8');

    const result = await recoverRegulationSyncTransactions({
      transactionDirectory,
    });

    assert.equal(result.recoveredTransactions, 1);
    assert.equal(result.rolledBackTransactions, 0);
    assert.equal(result.cleanedTransactions, 1);

    await assert.rejects(fs.stat(journalDirectory), error => error?.code === 'ENOENT');
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('recoverRegulationSyncTransactions cleans a prepared transaction without changing targets', async () => {
  const directory = await createTemporaryDirectory();

  const targetFile = path.join(directory, 'target.txt');

  const transactionDirectory = path.join(directory, '.transactions');
  const journalDirectory = path.join(transactionDirectory, 'prepared-transaction');
  const backupDirectory = path.join(journalDirectory, 'backups');

  try {
    await fs.writeFile(targetFile, 'original-value', 'utf8');

    await fs.mkdir(backupDirectory, {
      recursive: true,
    });

    const backupFile = path.join(backupDirectory, '0.original');

    const temporaryFile = path.join(directory, '.target.txt.prepared.tmp');

    await fs.writeFile(backupFile, 'original-value', 'utf8');

    await fs.writeFile(temporaryFile, 'prepared-value', 'utf8');

    await fs.writeFile(
      path.join(journalDirectory, 'manifest.json'),
      JSON.stringify(
        {
          version: 1,
          id: 'prepared-transaction',
          phase: 'prepared',
          changes: [
            {
              target: targetFile,
              backup: backupFile,
              temporary: temporaryFile,
            },
          ],
        },
        null,
        2,
      ) + '\n',
      'utf8',
    );

    const result = await recoverRegulationSyncTransactions({
      transactionDirectory,
    });

    assert.equal(result.recoveredTransactions, 1);
    assert.equal(result.rolledBackTransactions, 0);
    assert.equal(result.cleanedTransactions, 1);

    assert.equal(
      await fs.readFile(targetFile, 'utf8'),
      'original-value',
      'Prepared transaction must not modify the final target',
    );

    await assert.rejects(fs.stat(temporaryFile), error => error?.code === 'ENOENT');

    await assert.rejects(fs.stat(journalDirectory), error => error?.code === 'ENOENT');
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('applyRegulationSyncWorkspace removes transaction journal after a successful commit', async () => {
  const directory = await createTemporaryDirectory();

  const targetFile = path.join(directory, 'target.txt');
  const transactionDirectory = path.join(directory, '.transactions');

  try {
    await fs.writeFile(targetFile, 'original-value', 'utf8');

    const changes = [
      {
        relative: 'target.txt',
        url: pathToFileURL(targetFile),
        original: 'original-value',
        updated: 'updated-value',
      },
    ];

    await applyRegulationSyncWorkspace(createWorkspace(changes), {
      transactionDirectory,
    });

    assert.equal(await fs.readFile(targetFile, 'utf8'), 'updated-value');

    assert.deepEqual(
      await fs.readdir(transactionDirectory),
      [],
      'Successful commit must not leave transaction journals behind',
    );
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('applyRegulationSyncWorkspace removes transaction journal after rollback', async () => {
  const directory = await createTemporaryDirectory();

  const firstFile = path.join(directory, 'first.txt');
  const invalidTarget = path.join(directory, 'invalid-target');
  const transactionDirectory = path.join(directory, '.transactions');

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
        updated: 'invalid-update',
      },
    ];

    await assert.rejects(
      applyRegulationSyncWorkspace(createWorkspace(changes), {
        transactionDirectory,
      }),
      error => error?.code === 'EISDIR' || error?.code === 'EACCES' || error?.code === 'EPERM',
    );

    assert.equal(await fs.readFile(firstFile, 'utf8'), 'first-original');

    assert.deepEqual(
      await fs.readdir(transactionDirectory),
      [],
      'Rolled-back transaction must not leave transaction journals behind',
    );
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});
