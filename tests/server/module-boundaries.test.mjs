import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SERVER_ROOT = path.join(ROOT, 'server');
const SRC_ROOT = path.join(ROOT, 'src');

const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.mjs']);

const IMPORT_PATTERN = /(?:\bfrom\s+|\bimport\s*\()\s*['"]([^'"]+)['"]/g;

async function collectSourceFiles(directory) {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(fullPath)));
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function resolveRepositoryImport(importer, specifier) {
  if (specifier.startsWith('.')) {
    return path.resolve(path.dirname(importer), specifier);
  }

  if (specifier.startsWith('src/')) {
    return path.resolve(ROOT, specifier);
  }

  if (specifier.startsWith('server/')) {
    return path.resolve(ROOT, specifier);
  }

  return null;
}

function isInside(target, directory) {
  const relative = path.relative(directory, target);

  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function findCrossBoundaryImports(sourceRoot, forbiddenRoot) {
  const files = await collectSourceFiles(sourceRoot);
  const violations = [];

  for (const file of files) {
    const source = await fs.readFile(file, 'utf8');

    for (const match of source.matchAll(IMPORT_PATTERN)) {
      const specifier = match[1];
      const resolved = resolveRepositoryImport(file, specifier);

      if (resolved && isInside(resolved, forbiddenRoot)) {
        violations.push({
          file: path.relative(ROOT, file),
          specifier,
        });
      }
    }
  }

  return violations;
}

test('server does not import frontend src modules', async () => {
  const violations = await findCrossBoundaryImports(SERVER_ROOT, SRC_ROOT);

  assert.deepEqual(violations, [], `server -> src imports found: ${JSON.stringify(violations)}`);
});

test('frontend src does not import server modules', async () => {
  const violations = await findCrossBoundaryImports(SRC_ROOT, SERVER_ROOT);

  assert.deepEqual(violations, [], `src -> server imports found: ${JSON.stringify(violations)}`);
});
