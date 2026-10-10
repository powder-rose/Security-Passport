import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const runtimeSensitiveFiles = [
  'server/index.mjs',
  'server/analytics/statistics.mjs',
  'server/leads/admin-leads.mjs',
  'server/articles/blog-publication.mjs',
  'server/regulations/admin-regulations.mjs',
  'server/regulations/regulation-publisher.mjs',
  'server/regulations/regulation-sync-workspace.mjs',
];

test('project root resolver separates immutable runtime code from mutable workspace', async () => {
  const modulePath = path.join(repoRoot, 'server', 'shared', 'project-root.mjs');

  const moduleUrl = pathToFileURL(modulePath).href + `?test=${Date.now()}`;

  const { resolveProjectRoot } = await import(moduleUrl);

  const explicitWorkspace = path.join(repoRoot, 'test-workspace-explicit');

  const fallbackWorkspace = path.join(repoRoot, 'test-workspace-cwd');

  assert.equal(
    resolveProjectRoot({
      env: {
        PASSPORT_PROJECT_ROOT: explicitWorkspace,
      },
      cwd: fallbackWorkspace,
    }),
    path.resolve(explicitWorkspace),
  );

  assert.equal(
    resolveProjectRoot({
      env: {},
      cwd: fallbackWorkspace,
    }),
    path.resolve(fallbackWorkspace),
  );
});

test('runtime-sensitive backend modules use the shared mutable workspace root contract', async () => {
  for (const relative of runtimeSensitiveFiles) {
    const source = await fs.readFile(path.join(repoRoot, relative), 'utf8');

    assert.match(
      source,
      /resolveProjectRoot/,
      `${relative} must resolve mutable project paths through resolveProjectRoot`,
    );
  }
});
