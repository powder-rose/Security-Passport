import fs from 'node:fs/promises';
import path from 'node:path';

import { readLines } from '../shared/jsonl.mjs';

let leadsFileQueue = Promise.resolve();

function enqueueLeadsFileOperation(operation) {
  const run = leadsFileQueue.then(operation, operation);

  leadsFileQueue = run.catch(() => {});

  return run;
}

export function appendLeadToFile(filePath, lead) {
  return enqueueLeadsFileOperation(async () => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    await fs.appendFile(filePath, `${JSON.stringify(lead)}\n`, {
      encoding: 'utf8',
      mode: 0o600,
    });
  });
}

export function deleteLeadFromFile(filePath, leadId) {
  return enqueueLeadsFileOperation(async () => {
    const id = String(leadId || '').trim();

    if (!id) {
      return {
        deleted: false,
        reason: 'INVALID_ID',
      };
    }

    try {
      await fs.access(filePath);
    } catch (error) {
      if (error?.code === 'ENOENT') {
        return {
          deleted: false,
          reason: 'NOT_FOUND',
        };
      }

      throw error;
    }

    const temporary = `${filePath}.tmp-${process.pid}-${Date.now()}`;
    let temporaryFile = null;
    let deleted = false;

    try {
      temporaryFile = await fs.open(temporary, 'wx', 0o600);

      for await (const line of readLines(filePath)) {
        if (!line.trim()) {
          continue;
        }

        let isTarget = false;

        try {
          const lead = JSON.parse(line);

          isTarget = String(lead?.id || '') === id;
        } catch {
          // Preserve malformed non-empty rows when rewriting the file.
        }

        if (isTarget) {
          deleted = true;
          continue;
        }

        await temporaryFile.write(`${line}\n`);
      }

      await temporaryFile.close();
      temporaryFile = null;

      if (!deleted) {
        await fs.rm(temporary, {
          force: true,
        });

        return {
          deleted: false,
          reason: 'NOT_FOUND',
        };
      }

      await fs.rename(temporary, filePath);

      return {
        deleted: true,
      };
    } catch (error) {
      if (temporaryFile) {
        try {
          await temporaryFile.close();
        } catch {
          // Preserve the original operation error.
        }
      }

      await fs.rm(temporary, {
        force: true,
      });

      throw error;
    }
  });
}
