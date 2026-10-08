import { createReadStream } from 'node:fs';
import readline from 'node:readline';

export async function* readLines(filePath) {
  const stream = createReadStream(filePath, {
    encoding: 'utf8',
  });

  const lines = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  try {
    for await (const line of lines) {
      yield line;
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  } finally {
    lines.close();
    stream.destroy();
  }
}

export async function* readJsonLines(filePath) {
  for await (const line of readLines(filePath)) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    try {
      yield JSON.parse(trimmed);
    } catch {
      // A malformed row must not break processing of the remaining file.
    }
  }
}
