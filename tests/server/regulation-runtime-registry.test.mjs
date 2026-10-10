import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const productionProject = '/var/www/pasport-bezopasnosty.ru/app/passport-security-base';

const productionRegistry = '/var/www/pasport-bezopasnosty.ru/shared/regulations/regulations.json';

async function readProjectFile(relative) {
  return fs.readFile(path.join(projectRoot, relative), 'utf8');
}

test('regulation registry path is resolved through one shared contract', async () => {
  const source = await readProjectFile('shared/regulations/registry-path.js');

  assert.match(source, /resolveRegulationRegistryPath/);

  assert.match(source, /REGULATION_REGISTRY_FILE/);

  assert.match(
    source,
    /data.*regulations\.json/s,
    'The tracked registry must remain available as the local/CI seed fallback',
  );
});

test('registry resolver prefers an explicit runtime file and otherwise falls back to the seed', async () => {
  const modulePath = path.join(projectRoot, 'shared/regulations/registry-path.js');

  const { resolveRegulationRegistryPath } = await import(pathToFileURL(modulePath).href);

  assert.equal(
    resolveRegulationRegistryPath({
      env: {},
      projectRoot,
    }),
    path.join(projectRoot, 'data', 'regulations.json'),
  );

  const runtimeFile = path.join(projectRoot, '.tmp-runtime-regulations.json');

  assert.equal(
    resolveRegulationRegistryPath({
      env: {
        REGULATION_REGISTRY_FILE: runtimeFile,
      },
      projectRoot,
    }),
    runtimeFile,
  );
});
test('backend regulation consumers do not hardcode the tracked registry', async () => {
  for (const relative of [
    'server/regulations/admin-regulations.mjs',
    'server/regulations/regulation-publisher.mjs',
    'server/regulations/regulation-reminders.mjs',
  ]) {
    const source = await readProjectFile(relative);

    assert.match(
      source,
      /resolveRegulationRegistryPath/,
      `${relative} must use the shared registry resolver`,
    );

    assert.doesNotMatch(
      source,
      /path\.join\([^)]*['"]data['"][^)]*['"]regulations\.json['"]/s,
      `${relative} must not hardcode data/regulations.json`,
    );
  }

  const admin = await readProjectFile('server/regulations/admin-regulations.mjs');

  assert.match(
    admin,
    /workspace\.transform\(\s*FILE/,
    'Admin saves must transform the selected runtime registry',
  );

  assert.doesNotMatch(
    admin,
    /workspace\.transform\(\s*['"]data\/regulations\.json['"]/,
    'Admin saves must never write the tracked seed directly',
  );
});

test('frontend builds consume the configurable registry instead of importing the seed directly', async () => {
  const vite = await readProjectFile('vite.config.js');

  const claims = await readProjectFile('src/data/regulationClaims.js');

  const hotel = await readProjectFile('src/pages/HotelPage/hotelPageData.js');

  assert.match(vite, /resolveRegulationRegistryPath/);

  assert.match(vite, /@regulations-registry/);

  assert.match(claims, /@regulations-registry/);

  assert.doesNotMatch(claims, /data\/regulations\.json/);

  assert.match(hotel, /@regulations-registry/);

  assert.doesNotMatch(hotel, /data\/regulations\.json/);
});

test('regulations QA validates the selected runtime registry', async () => {
  const source = await readProjectFile('scripts/qa-regulations.mjs');

  assert.match(source, /resolveRegulationRegistryPath/);

  assert.doesNotMatch(
    source,
    /const\s+REGISTRY_FILE\s*=\s*path\.join\([^;]*data[^;]*regulations\.json/s,
  );
});

test('production deploy seeds and builds from the persistent shared registry', async () => {
  const deploy = await readProjectFile('scripts/deploy-federal.sh');

  const pm2 = await readProjectFile('deploy/pm2/ecosystem.config.cjs');

  assert.match(deploy, /shared\/regulations\/regulations\.json/);

  assert.match(
    deploy,
    /\[\s*!\s+-s\s+"\$\{REGULATION_REGISTRY_FILE\}"\s*\]/,
    'Deploy must seed the runtime registry only when it is absent',
  );

  assert.match(
    deploy,
    /data\/regulations\.json/,
    'The tracked seed must be used for first-time initialization',
  );

  assert.match(
    deploy,
    /REGULATION_REGISTRY_FILE=.*npm run build/s,
    'Production build must consume the persistent runtime registry',
  );

  assert.match(
    pm2,
    new RegExp(
      `REGULATION_REGISTRY_FILE:\\s*['"]${productionRegistry.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      )}['"]`,
    ),
  );

  assert.match(
    pm2,
    new RegExp(
      `PASSPORT_PROJECT_ROOT:\\s*['"]${productionProject.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      )}['"]`,
    ),
  );
});

test('blog publication carries the runtime regulation registry into prerender', async () => {
  const source = await readProjectFile('scripts/publish-blog.sh');

  assert.match(source, /shared\/regulations\/regulations\.json/);

  assert.match(source, /REGULATION_REGISTRY_FILE=.*node scripts\/prerender\.mjs/s);
});
test('regulation reminder service receives the persistent registry', async () => {
  const service = await readProjectFile('deploy/systemd/passport-regulation-reminders.service');

  assert.match(
    service,
    /Environment=REGULATION_REGISTRY_FILE=\/var\/www\/pasport-bezopasnosty\.ru\/shared\/regulations\/regulations\.json/,
  );
});

test('admin metadata saves mutate only the selected runtime registry', async () => {
  const trackedSeedFile = path.join(projectRoot, 'data', 'regulations.json');

  const trackedSeedBefore = await fs.readFile(trackedSeedFile, 'utf8');

  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-regulation-runtime-'));

  const temporaryProjectRoot = path.join(temporaryRoot, 'project');

  const runtimeFile = path.join(temporaryRoot, 'shared', 'regulations', 'regulations.json');

  await fs.mkdir(temporaryProjectRoot, {
    recursive: true,
  });

  await fs.mkdir(path.dirname(runtimeFile), {
    recursive: true,
  });

  await fs.writeFile(runtimeFile, trackedSeedBefore, 'utf8');

  const previousProjectRoot = process.env.PASSPORT_PROJECT_ROOT;

  const previousRegistryFile = process.env.REGULATION_REGISTRY_FILE;

  process.env.PASSPORT_PROJECT_ROOT = temporaryProjectRoot;

  process.env.REGULATION_REGISTRY_FILE = runtimeFile;

  try {
    const adminModule = path.join(projectRoot, 'server', 'regulations', 'admin-regulations.mjs');

    const moduleUrl = `${pathToFileURL(adminModule).href}` + `?runtime-registry-test=${Date.now()}`;

    const { saveRegulationBundle } = await import(moduleUrl);

    const registry = JSON.parse(await fs.readFile(runtimeFile, 'utf8'));

    const target = registry.items.find(
      item => item?.topic && Array.isArray(item.claims) && item.claims.length > 0,
    );

    assert.ok(target, 'Expected a regulation with topic claims');

    const nextReviewNote = `runtime-registry-test-${Date.now()}`;

    const topicClaims = registry.items
      .filter(item => item.topic === target.topic)
      .flatMap(item =>
        (item.claims || []).map(claim => ({
          number: String(item.number),
          id: claim.id,
          text: claim.text,
        })),
      );

    await saveRegulationBundle({
      mode: 'update',
      selected: String(target.number),

      regulation: {
        topic: target.topic,
        number: String(target.number),
        title: target.title,
        edition: target.edition || '',
        officialUrl: target.officialUrl || '',
        reviewNote: nextReviewNote,
        documentDate: target.documentDate || null,
        reviewStatus: target.reviewStatus,
        reviewedAt: target.reviewedAt || null,
        reviewDueDate: target.reviewDueDate || null,

        claims: target.claims.map(claim => ({
          id: claim.id,
          text: claim.text,
          ...(claim.label
            ? {
                label: claim.label,
              }
            : {}),
        })),
      },

      topicClaims,
    });

    const runtimeAfter = JSON.parse(await fs.readFile(runtimeFile, 'utf8'));

    const updated = runtimeAfter.items.find(item => String(item.number) === String(target.number));

    assert.equal(
      updated.reviewNote,
      nextReviewNote,
      'Runtime registry must contain the saved metadata',
    );

    assert.notEqual(
      await fs.readFile(runtimeFile, 'utf8'),
      trackedSeedBefore,
      'Runtime registry must actually change',
    );

    assert.equal(
      await fs.readFile(trackedSeedFile, 'utf8'),
      trackedSeedBefore,
      'Tracked seed must remain byte-for-byte unchanged',
    );
  } finally {
    if (previousProjectRoot === undefined) {
      delete process.env.PASSPORT_PROJECT_ROOT;
    } else {
      process.env.PASSPORT_PROJECT_ROOT = previousProjectRoot;
    }

    if (previousRegistryFile === undefined) {
      delete process.env.REGULATION_REGISTRY_FILE;
    } else {
      process.env.REGULATION_REGISTRY_FILE = previousRegistryFile;
    }

    await fs.rm(temporaryRoot, {
      recursive: true,
      force: true,
    });
  }
});
