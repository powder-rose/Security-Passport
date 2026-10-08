import fs from 'node:fs/promises';

const ROOT = new URL('../../', import.meta.url);

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
  for (const change of [...changes].reverse()) {
    await fs.writeFile(change.url, change.original, 'utf8');
  }
}

export async function applyRegulationSyncWorkspace(workspace) {
  const changes = workspace.getChanges();
  const applied = [];

  try {
    for (const change of changes) {
      await fs.writeFile(change.url, change.updated, 'utf8');
      applied.push(change);
    }
  } catch (error) {
    try {
      await rollbackRegulationSyncChanges(applied);
    } catch (rollbackError) {
      throw new AggregateError([error, rollbackError], 'REGULATION_SYNC_APPLY_ROLLBACK_FAILED');
    }

    throw error;
  }

  return {
    changedFiles: changes.length,
    changes,
  };
}
