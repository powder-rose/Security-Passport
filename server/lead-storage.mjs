import fs from 'node:fs/promises';
import path from 'node:path';

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

    let content = '';

    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (error) {
      if (error?.code === 'ENOENT') {
        return {
          deleted: false,
          reason: 'NOT_FOUND',
        };
      }

      throw error;
    }

    const lines = content.split('\n');
    const kept = [];
    let deleted = false;

    for (const line of lines) {
      if (!line.trim()) continue;

      let isTarget = false;

      try {
        const lead = JSON.parse(line);

        isTarget = String(lead?.id || '') === id;
      } catch {
        // Повреждённую строку не удаляем.
      }

      if (isTarget) {
        deleted = true;
        continue;
      }

      kept.push(line);
    }

    if (!deleted) {
      return {
        deleted: false,
        reason: 'NOT_FOUND',
      };
    }

    const temporary = `${filePath}.tmp-${process.pid}-${Date.now()}`;

    await fs.writeFile(temporary, kept.length ? `${kept.join('\n')}\n` : '', {
      encoding: 'utf8',
      mode: 0o600,
    });

    await fs.rename(temporary, filePath);

    return {
      deleted: true,
    };
  });
}
