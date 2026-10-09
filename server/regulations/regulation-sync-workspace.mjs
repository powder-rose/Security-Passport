import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../../', import.meta.url);

const DEFAULT_TRANSACTION_DIRECTORY = fileURLToPath(
  new URL('../../data/.regulation-sync-transactions/', import.meta.url),
);

const MANIFEST_VERSION = 1;

const RECOVERABLE_PHASES = new Set(['preparing', 'prepared', 'committing', 'committed']);

function resolveTargetPath(value) {
  if (value instanceof URL) {
    return fileURLToPath(value);
  }

  return path.resolve(String(value));
}

async function syncDirectory(directory) {
  /*
   * В production используется Linux.
   *
   * После rename синхронизируем директорию,
   * чтобы запись имени файла также дошла до FS.
   *
   * Windows не позволяет надёжно открывать
   * директории как обычные file descriptors,
   * поэтому там эта операция пропускается.
   */
  if (process.platform === 'win32') {
    return;
  }

  let handle;

  try {
    handle = await fs.open(directory, 'r');

    await handle.sync();
  } catch (error) {
    if (error?.code === 'EINVAL' || error?.code === 'ENOTSUP' || error?.code === 'EISDIR') {
      return;
    }

    throw error;
  } finally {
    await handle?.close();
  }
}

async function writeSyncedFile(file, content, { mode = 0o600 } = {}) {
  const directory = path.dirname(file);

  await fs.mkdir(directory, {
    recursive: true,
  });

  let handle;

  try {
    handle = await fs.open(file, 'w', mode);

    await handle.writeFile(content, 'utf8');

    await handle.sync();
  } finally {
    await handle?.close();
  }

  await syncDirectory(directory);
}

async function getTargetMode(target) {
  try {
    const stat = await fs.stat(target);

    return stat.mode & 0o777;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return 0o600;
    }

    throw error;
  }
}

async function durableRename(source, target) {
  await fs.rename(source, target);

  await syncDirectory(path.dirname(target));
}

async function removeTemporaryFile(file) {
  if (!file) {
    return;
  }

  await fs.rm(file, {
    force: true,
  });
}

async function writeManifest(journalDirectory, manifest) {
  const manifestPath = path.join(journalDirectory, 'manifest.json');

  const temporaryManifest = path.join(journalDirectory, 'manifest.json.tmp');

  const content = JSON.stringify(manifest, null, 2) + '\n';

  await writeSyncedFile(temporaryManifest, content, {
    mode: 0o600,
  });

  await durableRename(temporaryManifest, manifestPath);
}

function assertManifest(manifest) {
  if (
    !manifest ||
    typeof manifest !== 'object' ||
    Array.isArray(manifest) ||
    manifest.version !== MANIFEST_VERSION ||
    typeof manifest.id !== 'string' ||
    !manifest.id ||
    !RECOVERABLE_PHASES.has(manifest.phase) ||
    !Array.isArray(manifest.changes)
  ) {
    const error = new Error('INVALID_REGULATION_SYNC_TRANSACTION');

    error.code = 'INVALID_REGULATION_SYNC_TRANSACTION';

    throw error;
  }

  for (const change of manifest.changes) {
    if (
      !change ||
      typeof change !== 'object' ||
      typeof change.target !== 'string' ||
      !change.target ||
      typeof change.backup !== 'string' ||
      !change.backup ||
      (change.temporary !== undefined && typeof change.temporary !== 'string')
    ) {
      const error = new Error('INVALID_REGULATION_SYNC_TRANSACTION_CHANGE');

      error.code = 'INVALID_REGULATION_SYNC_TRANSACTION';

      throw error;
    }
  }
}

async function readManifest(journalDirectory) {
  const manifestPath = path.join(journalDirectory, 'manifest.json');

  const source = await fs.readFile(manifestPath, 'utf8');

  const manifest = JSON.parse(source);

  assertManifest(manifest);

  return manifest;
}

async function atomicReplaceContent(target, content, suffix) {
  const directory = path.dirname(target);

  const temporary = path.join(directory, `.${path.basename(target)}.${suffix}.tmp`);

  const mode = await getTargetMode(target);

  try {
    await writeSyncedFile(temporary, content, {
      mode,
    });

    await durableRename(temporary, target);
  } catch (error) {
    await removeTemporaryFile(temporary);

    throw error;
  }
}

async function restoreEntriesFromBackups(entries, transactionId) {
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index];

    const original = await fs.readFile(entry.backup, 'utf8');

    await atomicReplaceContent(
      entry.target,
      original,
      `regulation-rollback-${transactionId}-${index}`,
    );
  }
}

async function cleanupTransaction(manifest, journalDirectory, transactionDirectory) {
  for (const change of manifest.changes) {
    await removeTemporaryFile(change.temporary);
  }

  await fs.rm(journalDirectory, {
    recursive: true,
    force: true,
  });

  try {
    await syncDirectory(transactionDirectory);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function prepareTransaction(changes, transactionDirectory) {
  await fs.mkdir(transactionDirectory, {
    recursive: true,
  });

  const transactionId = `${Date.now()}-${process.pid}-${randomUUID()}`;

  const journalDirectory = path.join(transactionDirectory, transactionId);

  const backupDirectory = path.join(journalDirectory, 'backups');

  await fs.mkdir(backupDirectory, {
    recursive: true,
  });

  const manifest = {
    version: MANIFEST_VERSION,
    id: transactionId,
    phase: 'preparing',
    changes: changes.map((change, index) => {
      const target = resolveTargetPath(change.url);

      return {
        target,
        backup: path.join(backupDirectory, `${index}.original`),
        temporary: path.join(
          path.dirname(target),
          `.${path.basename(target)}.regulation-sync-${transactionId}-${index}.tmp`,
        ),
      };
    }),
  };

  await writeManifest(journalDirectory, manifest);

  try {
    for (let index = 0; index < changes.length; index += 1) {
      const change = changes[index];

      const manifestChange = manifest.changes[index];

      await writeSyncedFile(manifestChange.backup, change.original, {
        mode: 0o600,
      });

      const mode = await getTargetMode(manifestChange.target);

      await writeSyncedFile(manifestChange.temporary, change.updated, {
        mode,
      });
    }

    manifest.phase = 'prepared';

    await writeManifest(journalDirectory, manifest);
  } catch (error) {
    try {
      await cleanupTransaction(manifest, journalDirectory, transactionDirectory);
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], 'REGULATION_SYNC_PREPARE_CLEANUP_FAILED');
    }

    throw error;
  }

  return {
    journalDirectory,
    manifest,
    transactionDirectory,
  };
}

async function commitPreparedTransaction(transaction) {
  const { journalDirectory, manifest, transactionDirectory } = transaction;

  const applied = [];

  manifest.phase = 'committing';

  await writeManifest(journalDirectory, manifest);

  try {
    for (const change of manifest.changes) {
      await fs.rename(change.temporary, change.target);

      /*
       * С этого момента target уже фактически заменён.
       *
       * Помечаем его применённым до fsync директории,
       * чтобы ошибка после успешного rename также
       * приводила к восстановлению из backup.
       */
      applied.push(change);

      await syncDirectory(path.dirname(change.target));
    }

    /*
     * Только после замены всех файлов
     * транзакция считается зафиксированной.
     */
    manifest.phase = 'committed';

    await writeManifest(journalDirectory, manifest);
  } catch (error) {
    try {
      await restoreEntriesFromBackups(applied, manifest.id);

      await cleanupTransaction(manifest, journalDirectory, transactionDirectory);
    } catch (rollbackError) {
      throw new AggregateError([error, rollbackError], 'REGULATION_SYNC_APPLY_ROLLBACK_FAILED');
    }

    throw error;
  }

  /*
   * После durable committed marker новое состояние
   * уже является официальным.
   *
   * Если cleanup оборвётся, следующий запуск
   * увидит phase=committed и только удалит journal.
   */
  try {
    await cleanupTransaction(manifest, journalDirectory, transactionDirectory);
  } catch {
    // Recovery при следующем старте завершит cleanup.
  }
}

export function createRegulationSyncWorkspace() {
  const entries = new Map();

  async function load(relative, { ignoreMissing = false } = {}) {
    if (entries.has(relative)) {
      return entries.get(relative);
    }

    const url = new URL(relative, ROOT);

    try {
      const original = await fs.readFile(url, 'utf8');

      const entry = {
        relative,
        url,
        original,
        current: original,
      };

      entries.set(relative, entry);

      return entry;
    } catch (error) {
      if (ignoreMissing && error?.code === 'ENOENT') {
        return null;
      }

      throw error;
    }
  }

  return {
    async transform(relative, transform, options) {
      const entry = await load(relative, options);

      if (!entry) {
        return null;
      }

      const before = entry.current;
      const after = transform(before);

      entry.current = after;

      return {
        relative,
        before,
        after,
        changed: after !== before,
      };
    },

    getChanges() {
      return [...entries.values()]
        .filter(entry => entry.current !== entry.original)
        .map(entry => ({
          relative: entry.relative,
          url: entry.url,
          original: entry.original,
          updated: entry.current,
        }));
    },
  };
}

export async function rollbackRegulationSyncChanges(changes) {
  const transactionId = `manual-${process.pid}-${randomUUID()}`;

  for (let index = changes.length - 1; index >= 0; index -= 1) {
    const change = changes[index];

    await atomicReplaceContent(
      resolveTargetPath(change.url),
      change.original,
      `regulation-rollback-${transactionId}-${index}`,
    );
  }
}

export async function recoverRegulationSyncTransactions({
  transactionDirectory = DEFAULT_TRANSACTION_DIRECTORY,
} = {}) {
  let entries;

  try {
    entries = await fs.readdir(transactionDirectory, {
      withFileTypes: true,
    });
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return {
        recoveredTransactions: 0,
        rolledBackTransactions: 0,
        cleanedTransactions: 0,
      };
    }

    throw error;
  }

  let rolledBackTransactions = 0;
  let cleanedTransactions = 0;

  for (const entry of entries
    .filter(item => item.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const journalDirectory = path.join(transactionDirectory, entry.name);

    let manifest;

    try {
      manifest = await readManifest(journalDirectory);
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        /*
         * Повреждённый или неизвестный manifest
         * автоматически не удаляем.
         *
         * В таком состоянии нельзя доказать,
         * были ли уже заменены target-файлы.
         */
        throw error;
      }

      /*
       * manifest.json создаётся и durable-фиксируется
       * до подготовки временных target-файлов и,
       * тем более, до первой замены конечного файла.
       *
       * Поэтому каталог транзакции без manifest
       * является безопасным остатком оборванного
       * начального prepare.
       */
      await fs.rm(journalDirectory, {
        recursive: true,
        force: true,
      });

      await syncDirectory(transactionDirectory);

      cleanedTransactions += 1;

      continue;
    }

    if (manifest.phase === 'committing') {
      await restoreEntriesFromBackups(manifest.changes, manifest.id);

      rolledBackTransactions += 1;
    } else {
      /*
       * preparing/prepared:
       * конечные файлы ещё не менялись.
       *
       * committed:
       * новое состояние уже зафиксировано.
       *
       * В обоих случаях нужен только cleanup.
       */
      cleanedTransactions += 1;
    }

    await cleanupTransaction(manifest, journalDirectory, transactionDirectory);
  }

  return {
    recoveredTransactions: rolledBackTransactions + cleanedTransactions,
    rolledBackTransactions,
    cleanedTransactions,
  };
}

export async function applyRegulationSyncWorkspace(
  workspace,
  { transactionDirectory = DEFAULT_TRANSACTION_DIRECTORY } = {},
) {
  const changes = workspace.getChanges();

  if (changes.length === 0) {
    return {
      changedFiles: 0,
      changes,
    };
  }

  /*
   * Сначала закрываем возможную незавершённую
   * транзакцию от предыдущего процесса.
   */
  await recoverRegulationSyncTransactions({
    transactionDirectory,
  });

  const transaction = await prepareTransaction(changes, transactionDirectory);

  await commitPreparedTransaction(transaction);

  return {
    changedFiles: changes.length,
    changes,
  };
}
