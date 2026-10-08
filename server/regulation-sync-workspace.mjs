import fs from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);

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

export async function applyRegulationSyncWorkspace(workspace) {
  const changes = workspace.getChanges();

  for (const change of changes) {
    await fs.writeFile(change.url, change.updated, 'utf8');
  }

  return {
    changedFiles: changes.length,
    changes,
  };
}
