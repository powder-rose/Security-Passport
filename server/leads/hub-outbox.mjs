import fs from 'node:fs/promises';
import path from 'node:path';

let queue = Promise.resolve();

// Never acknowledge the public form before its immutable delivery copy is durable.
export function appendHubOutbox(filePath, lead) {
  if (!filePath) return Promise.resolve();
  const action = async () => {
    await fs.mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 });
    const handle = await fs.open(filePath, 'a', 0o600);
    try {
      await handle.writeFile(`${JSON.stringify(lead)}\n`, 'utf8');
      await handle.sync();
    } finally {
      await handle.close();
    }
    if (process.platform !== 'win32') {
      const directory = await fs.open(path.dirname(filePath), 'r');
      try {
        await directory.sync();
      } finally {
        await directory.close();
      }
    }
  };
  const result = queue.then(action, action);
  queue = result.catch(() => {});
  return result;
}
