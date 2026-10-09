import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

const execFileAsync = promisify(execFile);

const projectRoot = path.resolve(new URL('../..', import.meta.url).pathname);

const cleanupScript = path.join(projectRoot, 'scripts', 'cleanup-release-storage.sh');

async function createWorkspace() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-retention-'));

  await fs.mkdir(path.join(root, 'releases'));
  await fs.mkdir(path.join(root, 'release-runtime'));

  return root;
}

async function createRelease(root, name) {
  const release = path.join(root, 'releases', name);

  await fs.mkdir(release);

  return release;
}

async function createRuntime(root, name) {
  const runtime = path.join(root, 'release-runtime', name);

  await fs.mkdir(runtime);

  return runtime;
}

async function createRuntimeLink(root, name, target) {
  await fs.symlink(target, path.join(root, 'release-runtime', name));
}

async function setCurrent(root, release) {
  await fs.symlink(release, path.join(root, 'current'));
}

async function runCleanup(root, { keep = 5, dryRun = false } = {}) {
  const args = dryRun ? ['--dry-run'] : [];

  return execFileAsync('bash', [cleanupScript, ...args], {
    env: {
      ...process.env,
      PASSPORT_SITE_ROOT: root,
      PASSPORT_KEEP_RELEASES: String(keep),
    },
  });
}

async function listNames(directory) {
  return (await fs.readdir(directory)).sort();
}

test('release retention keeps current release and shared runtime target', async () => {
  const root = await createWorkspace();

  try {
    const oldFull = await createRelease(root, '20261001-010000');

    const sharedFull = await createRelease(root, '20261001-020000');

    const oldBlog = await createRelease(root, '20261001-025000-blog');

    const blogOne = await createRelease(root, '20261001-030000-blog');

    const blogTwo = await createRelease(root, '20261001-040000-blog');

    const blogThree = await createRelease(root, '20261001-050000-blog');

    const oldRuntime = await createRuntime(root, '20261001-010000');

    const sharedRuntime = await createRuntime(root, '20261001-020000');

    await createRuntimeLink(root, '20261001-025000-blog', sharedRuntime);

    await createRuntimeLink(root, '20261001-030000-blog', sharedRuntime);

    await createRuntimeLink(root, '20261001-040000-blog', sharedRuntime);

    await createRuntimeLink(root, '20261001-050000-blog', sharedRuntime);

    await setCurrent(root, blogTwo);

    await runCleanup(root, {
      keep: 3,
    });

    assert.deepEqual(
      await listNames(path.join(root, 'releases')),
      [path.basename(blogOne), path.basename(blogTwo), path.basename(blogThree)].sort(),
    );

    assert.equal(
      await fs
        .stat(sharedRuntime)
        .then(() => true)
        .catch(() => false),
      true,
    );

    assert.equal(
      await fs
        .stat(oldRuntime)
        .then(() => true)
        .catch(() => false),
      false,
    );

    assert.equal(
      await fs
        .lstat(path.join(root, 'release-runtime', path.basename(oldBlog)))
        .then(() => true)
        .catch(() => false),
      false,
    );

    assert.equal(
      await fs
        .stat(oldFull)
        .then(() => true)
        .catch(() => false),
      false,
    );

    assert.equal(
      await fs
        .stat(sharedFull)
        .then(() => true)
        .catch(() => false),
      false,
    );
  } finally {
    await fs.rm(root, {
      recursive: true,
      force: true,
    });
  }
});

test('release retention dry-run does not modify storage', async () => {
  const root = await createWorkspace();

  try {
    const releaseOne = await createRelease(root, '20261001-010000');

    const releaseTwo = await createRelease(root, '20261001-020000');

    const releaseThree = await createRelease(root, '20261001-030000');

    await createRuntime(root, '20261001-010000');

    await createRuntime(root, '20261001-020000');

    await createRuntime(root, '20261001-030000');

    await setCurrent(root, releaseThree);

    const beforeReleases = await listNames(path.join(root, 'releases'));

    const beforeRuntimes = await listNames(path.join(root, 'release-runtime'));

    const { stdout } = await runCleanup(root, {
      keep: 2,
      dryRun: true,
    });

    assert.match(stdout, /DRY-RUN remove release: 20261001-010000/);

    assert.deepEqual(await listNames(path.join(root, 'releases')), beforeReleases);

    assert.deepEqual(await listNames(path.join(root, 'release-runtime')), beforeRuntimes);

    assert.equal(
      await fs
        .stat(releaseOne)
        .then(() => true)
        .catch(() => false),
      true,
    );

    assert.equal(
      await fs
        .stat(releaseTwo)
        .then(() => true)
        .catch(() => false),
      true,
    );
  } finally {
    await fs.rm(root, {
      recursive: true,
      force: true,
    });
  }
});
