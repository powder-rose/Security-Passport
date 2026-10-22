import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const productionProject = '/var/www/pasport-bezopasnosty.ru/app/passport-security-base';

const productionRegistry = '/var/www/pasport-bezopasnosty.ru/shared/regulations/regulations.json';

const execFileAsync = promisify(execFile);

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

function hotelRegistryFixture() {
  return {
    version: 1,
    customMetadata: { owner: 'editor' },
    items: [
      {
        number: '447',
        title: 'Постановление Правительства РФ от 13.04.2017 №447',
        documentDate: '2017-04-13',
        reviewNote: 'Сохранить отметку от 13.04.2017 №447',
        reviewedAt: '2026-09-28',
        updatedAt: '2026-09-28T11:57:28.682Z',
        customData: { source: 'production' },
        claims: [
          {
            id: 'hotel.faq.00',
            label: 'Custom FAQ label',
            text: 'Ручной текст: от 13.04.2017 № 447. Другой документ от 13.04.2017 №4470.',
            customData: { retained: true },
          },
          { id: 'hotel.custom', text: 'Дата проверки: 13.04.2017.' },
        ],
      },
      {
        number: '272',
        documentDate: '2015-03-25',
        claims: [{ id: 'crowd.custom', text: 'Ссылка от 13.04.2017 №447 остаётся без изменений.' }],
      },
    ],
  };
}

function runHotelDateCorrection(cwd, args = [], environment = {}) {
  return execFileAsync(
    process.execPath,
    [path.join(projectRoot, 'scripts/fix-hotel-regulation-date.mjs'), ...args],
    {
      cwd,
      env: {
        ...process.env,
        PASSPORT_PROJECT_ROOT: cwd,
        REGULATION_REGISTRY_FILE: '',
        ...environment,
      },
    },
  );
}

test('hotel date correction preserves production data and is idempotent', async t => {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-hotel-date-'));
  t.after(() => fs.rm(temporaryRoot, { recursive: true, force: true }));

  const runtimeFile = path.join(temporaryRoot, 'regulations.json');
  const ignoredFile = path.join(temporaryRoot, 'other-regulations.json');
  const registry = hotelRegistryFixture();
  const original = JSON.stringify(registry) + '\n';

  await fs.writeFile(runtimeFile, original, { mode: 0o600 });
  await fs.writeFile(ignoredFile, original);

  const result = await runHotelDateCorrection(temporaryRoot, [runtimeFile], {
    REGULATION_REGISTRY_FILE: ignoredFile,
  });

  const expected = structuredClone(registry);
  expected.items[0].title = 'Постановление Правительства РФ от 14.04.2017 №447';
  expected.items[0].documentDate = '2017-04-14';
  expected.items[0].claims[0].text =
    'Ручной текст: от 14.04.2017 № 447. Другой документ от 13.04.2017 №4470.';

  const corrected = await fs.readFile(runtimeFile, 'utf8');
  assert.deepEqual(JSON.parse(corrected), expected);
  assert.equal(await fs.readFile(ignoredFile, 'utf8'), original);
  assert.ok(result.stdout.includes(runtimeFile), JSON.stringify(result.stdout));
  assert.match(result.stdout, /Updated regulation 447/);

  if (process.platform !== 'win32') {
    assert.equal((await fs.stat(runtimeFile)).mode & 0o777, 0o600);
  }

  const repeated = await runHotelDateCorrection(temporaryRoot, [], {
    REGULATION_REGISTRY_FILE: runtimeFile,
  });

  assert.equal(await fs.readFile(runtimeFile, 'utf8'), corrected);
  assert.match(repeated.stdout, /no files changed/);
});

test('hotel date correction rejects unexpected registry state without writing', async t => {
  for (const scenario of ['missing', 'duplicate', 'unexpected date']) {
    await t.test(scenario, async t => {
      const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-hotel-invalid-'));
      t.after(() => fs.rm(temporaryRoot, { recursive: true, force: true }));

      const runtimeFile = path.join(temporaryRoot, 'regulations.json');
      const registry = hotelRegistryFixture();

      if (scenario === 'missing') {
        registry.items.shift();
      } else if (scenario === 'duplicate') {
        registry.items.push(structuredClone(registry.items[0]));
      } else {
        registry.items[0].documentDate = '2018-04-13';
      }

      const original = JSON.stringify(registry) + '\n';
      await fs.writeFile(runtimeFile, original);

      await assert.rejects(
        runHotelDateCorrection(temporaryRoot, [runtimeFile]),
        /Expected exactly one regulation 447|Unexpected documentDate/,
      );

      assert.equal(await fs.readFile(runtimeFile, 'utf8'), original);
    });
  }
});

test('hotel date correction requires an explicit existing registry', async t => {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-hotel-target-'));
  t.after(() => fs.rm(temporaryRoot, { recursive: true, force: true }));

  const seedFile = path.join(temporaryRoot, 'data', 'regulations.json');
  const original = JSON.stringify(hotelRegistryFixture()) + '\n';
  await fs.mkdir(path.dirname(seedFile), { recursive: true });
  await fs.writeFile(seedFile, original);

  await assert.rejects(runHotelDateCorrection(temporaryRoot), /Provide a registry path/);
  await assert.rejects(
    runHotelDateCorrection(temporaryRoot, [path.join(temporaryRoot, 'missing.json')]),
    /ENOENT/,
  );

  assert.equal(await fs.readFile(seedFile, 'utf8'), original);
});

function educationRegistryFixture() {
  return {
    version: 1,
    customMetadata: { owner: 'editor' },
    items: [
      {
        number: '1006',
        title: 'Custom education title',
        documentDate: '2019-08-02',
        reviewNote: 'Keep the existing review',
        reviewedAt: '2026-09-28',
        updatedAt: '2026-09-28T11:57:28.682Z',
        customData: { source: 'production' },
        claims: [
          {
            id: 'education.faq.05',
            label: 'Custom category label',
            text: 'Для объектов, подпадающих под ПП РФ №1006, предусмотрены четыре категории опасности. Для объекта с другим нормативным режимом применимые правила необходимо проверять отдельно.',
            customData: { retained: true },
          },
          { id: 'education.custom', text: 'Preserve this manually edited claim.' },
        ],
      },
      {
        number: '1421',
        documentDate: '2019-11-07',
        claims: [{ id: 'education.universities', text: 'Preserve this separate regulation.' }],
      },
    ],
  };
}

function runEducationClaimCorrection(cwd, args = [], environment = {}) {
  return execFileAsync(
    process.execPath,
    [path.join(projectRoot, 'scripts/fix-education-regulation-claims.mjs'), ...args],
    {
      cwd,
      env: {
        ...process.env,
        PASSPORT_PROJECT_ROOT: cwd,
        REGULATION_REGISTRY_FILE: '',
        ...environment,
      },
    },
  );
}

test('education claim correction preserves runtime data and resumes partial updates', async t => {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-education-claims-'));
  t.after(() => fs.rm(temporaryRoot, { recursive: true, force: true }));

  const runtimeFile = path.join(temporaryRoot, 'regulations.json');
  const ignoredFile = path.join(temporaryRoot, 'other-regulations.json');
  const seedBefore = await readProjectFile('data/regulations.json');
  const seed = JSON.parse(seedBefore);
  const approvedClaims = seed.items
    .find(item => String(item.number) === '1006')
    .claims.filter(claim =>
      [
        'education.faq.05',
        'education.faq.15',
        'education.faq.16',
        'education.faq.17',
        'education.faq.18',
      ].includes(claim.id),
    );
  assert.equal(approvedClaims.length, 5);

  const registry = educationRegistryFixture();
  registry.items[0].claims.push({
    ...approvedClaims.find(claim => claim.id === 'education.faq.16'),
    label: 'Custom act copies label',
    customData: { retained: true },
  });

  const original = JSON.stringify(registry) + '\n';
  await fs.writeFile(runtimeFile, original, { mode: 0o600 });
  await fs.writeFile(ignoredFile, original);

  const result = await runEducationClaimCorrection(temporaryRoot, [runtimeFile], {
    REGULATION_REGISTRY_FILE: ignoredFile,
  });

  const expected = structuredClone(registry);
  expected.items[0].claims[0].text = approvedClaims.find(
    claim => claim.id === 'education.faq.05',
  ).text;
  expected.items[0].claims.push(
    ...approvedClaims.filter(claim =>
      ['education.faq.15', 'education.faq.17', 'education.faq.18'].includes(claim.id),
    ),
  );

  const corrected = await fs.readFile(runtimeFile, 'utf8');
  assert.deepEqual(JSON.parse(corrected), expected);
  assert.equal(await fs.readFile(ignoredFile, 'utf8'), original);
  assert.equal(await readProjectFile('data/regulations.json'), seedBefore);
  assert.ok(result.stdout.includes(runtimeFile), JSON.stringify(result.stdout));
  assert.match(result.stdout, /Updated education regulation claims/);

  if (process.platform !== 'win32') {
    assert.equal((await fs.stat(runtimeFile)).mode & 0o777, 0o600);
  }

  const repeated = await runEducationClaimCorrection(temporaryRoot, [], {
    REGULATION_REGISTRY_FILE: runtimeFile,
  });

  assert.equal(await fs.readFile(runtimeFile, 'utf8'), corrected);
  assert.match(repeated.stdout, /no files changed/);
});

test('education claim correction rejects conflicting registry data without writing', async t => {
  const scenarios = [
    'missing regulation',
    'duplicate regulation',
    'unexpected date',
    'missing category claim',
    'duplicate claim',
    'unexpected category text',
    'conflicting new claim',
  ];

  for (const scenario of scenarios) {
    await t.test(scenario, async t => {
      const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-education-invalid-'));
      t.after(() => fs.rm(temporaryRoot, { recursive: true, force: true }));

      const runtimeFile = path.join(temporaryRoot, 'regulations.json');
      const registry = educationRegistryFixture();
      const education = registry.items[0];

      if (scenario === 'missing regulation') {
        registry.items.shift();
      } else if (scenario === 'duplicate regulation') {
        registry.items.push(structuredClone(education));
      } else if (scenario === 'unexpected date') {
        education.documentDate = '2019-08-03';
      } else if (scenario === 'missing category claim') {
        education.claims.shift();
      } else if (scenario === 'duplicate claim') {
        education.claims.push(structuredClone(education.claims[0]));
      } else if (scenario === 'unexpected category text') {
        education.claims[0].text = 'A manual category edit must be reviewed.';
      } else {
        education.claims.push({ id: 'education.faq.17', text: 'Conflicting manual text.' });
      }

      const original = JSON.stringify(registry) + '\n';
      await fs.writeFile(runtimeFile, original);

      await assert.rejects(
        runEducationClaimCorrection(temporaryRoot, [runtimeFile]),
        /Expected exactly one regulation 1006|Unexpected documentDate|Missing existing education category claim|Duplicate regulation 1006 claim|Unexpected text for education claim/,
      );

      assert.equal(await fs.readFile(runtimeFile, 'utf8'), original);
    });
  }
});

test('education claim correction requires an explicit existing target', async t => {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-education-target-'));
  t.after(() => fs.rm(temporaryRoot, { recursive: true, force: true }));

  const seedFile = path.join(temporaryRoot, 'data', 'regulations.json');
  const original = JSON.stringify(educationRegistryFixture()) + '\n';
  await fs.mkdir(path.dirname(seedFile), { recursive: true });
  await fs.writeFile(seedFile, original);

  await assert.rejects(runEducationClaimCorrection(temporaryRoot), /Provide a registry path/);
  await assert.rejects(
    runEducationClaimCorrection(temporaryRoot, [path.join(temporaryRoot, 'missing.json')]),
    /ENOENT/,
  );
  await assert.rejects(
    runEducationClaimCorrection(temporaryRoot, [seedFile, 'unexpected']),
    /Provide a registry path/,
  );

  assert.equal(await fs.readFile(seedFile, 'utf8'), original);
});
