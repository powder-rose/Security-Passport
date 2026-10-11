import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function readProjectFile(relative) {
  return fs.readFile(path.join(projectRoot, relative), 'utf8');
}

test('existing regulation structural fields are immutable through admin saves', async () => {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-regulation-structure-'));

  const temporaryProjectRoot = path.join(temporaryRoot, 'project');

  const sourceFile = path.join(temporaryProjectRoot, 'src', 'sample.js');

  const runtimeFile = path.join(temporaryRoot, 'shared', 'regulations', 'regulations.json');

  const sourceBefore =
    "export const regulation = 'Постановление Правительства РФ от 13.04.2017 №447';\n";

  const registryBefore = {
    version: 1,

    items: [
      {
        number: '447',
        title: 'Постановление Правительства РФ от 13.04.2017 №447',

        topic: 'hotel',

        documentDate: '2017-04-13',

        edition: '',

        officialUrl: '',

        reviewStatus: 'needs_review',

        reviewedAt: null,

        reviewDueDate: null,

        reviewNote: '',

        occurrences: [
          {
            file: 'src/sample.js',
            line: 1,
          },
        ],

        claims: [
          {
            id: 'hotel.faq.00',
            label: 'FAQ',
            text: 'Исходный нормативный ответ',
          },
        ],

        contentUpdatedAt: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  };

  await fs.mkdir(path.dirname(sourceFile), {
    recursive: true,
  });

  await fs.mkdir(path.dirname(runtimeFile), {
    recursive: true,
  });

  await fs.writeFile(sourceFile, sourceBefore, 'utf8');

  const registrySourceBefore = JSON.stringify(registryBefore, null, 2) + '\n';

  await fs.writeFile(runtimeFile, registrySourceBefore, 'utf8');

  const previousProjectRoot = process.env.PASSPORT_PROJECT_ROOT;

  const previousRegistryFile = process.env.REGULATION_REGISTRY_FILE;

  process.env.PASSPORT_PROJECT_ROOT = temporaryProjectRoot;

  process.env.REGULATION_REGISTRY_FILE = runtimeFile;

  try {
    const adminModule = path.join(projectRoot, 'server', 'regulations', 'admin-regulations.mjs');

    const moduleUrl =
      `${pathToFileURL(adminModule).href}` + `?structural-update-test=${Date.now()}`;

    const { saveRegulationBundle } = await import(moduleUrl);

    const operation = saveRegulationBundle({
      mode: 'update',

      selected: '447',

      regulation: {
        number: '448',

        title: 'Постановление Правительства РФ от 14.04.2017 №448',

        topic: 'hotel',

        documentDate: '2017-04-14',

        edition: '',

        officialUrl: '',

        reviewStatus: 'needs_review',

        reviewedAt: null,

        reviewDueDate: null,

        reviewNote: '',

        claims: [
          {
            id: 'hotel.faq.00',
            label: 'FAQ',
            text: 'Исходный нормативный ответ',
          },
        ],
      },

      topicClaims: [
        {
          number: '447',
          id: 'hotel.faq.00',
          text: 'Исходный нормативный ответ',
        },
      ],
    });

    await assert.rejects(
      operation,
      error => error instanceof TypeError && /номер|назван|дат/i.test(String(error.message)),
      'Structural fields of an existing regulation must be rejected',
    );

    assert.equal(
      await fs.readFile(sourceFile, 'utf8'),
      sourceBefore,
      'Admin structural edit must not rewrite source files',
    );

    assert.equal(
      await fs.readFile(runtimeFile, 'utf8'),
      registrySourceBefore,
      'Rejected structural edit must not mutate runtime registry',
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

test('admin update path does not own source-code synchronization planners', async () => {
  const source = await readProjectFile('server/regulations/admin-regulations.mjs');

  assert.doesNotMatch(source, /planRegulationNumberSync/);

  assert.doesNotMatch(source, /planRegulationTitleSync/);

  assert.doesNotMatch(source, /planRegulationDateSync/);
});

test('existing regulation structural fields are locked in the admin UI', async () => {
  const source = await readProjectFile(
    'src/admin/pages/RegulationsPage/components/quiz/RegulationsQuizField.jsx',
  );

  assert.match(
    source,
    /number[\s\S]*title[\s\S]*documentDate/,
    'UI must explicitly identify all structural fields',
  );

  assert.match(source, /!isCreating/, 'Structural lock must apply only to existing regulations');

  assert.match(source, /disabled=/, 'Existing structural inputs must be disabled');
});

test('new regulation creation still accepts its structural fields', async () => {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-regulation-create-'));

  const temporaryProjectRoot = path.join(temporaryRoot, 'project');

  const runtimeFile = path.join(temporaryRoot, 'shared', 'regulations', 'regulations.json');

  await fs.mkdir(temporaryProjectRoot, {
    recursive: true,
  });

  await fs.mkdir(path.dirname(runtimeFile), {
    recursive: true,
  });

  const registryBefore = {
    version: 1,
    items: [],
  };

  await fs.writeFile(runtimeFile, JSON.stringify(registryBefore, null, 2) + '\n', 'utf8');

  const previousProjectRoot = process.env.PASSPORT_PROJECT_ROOT;

  const previousRegistryFile = process.env.REGULATION_REGISTRY_FILE;

  process.env.PASSPORT_PROJECT_ROOT = temporaryProjectRoot;

  process.env.REGULATION_REGISTRY_FILE = runtimeFile;

  try {
    const adminModule = path.join(projectRoot, 'server', 'regulations', 'admin-regulations.mjs');

    const moduleUrl =
      `${pathToFileURL(adminModule).href}` + `?structural-create-test=${Date.now()}`;

    const { saveRegulationBundle } = await import(moduleUrl);

    const result = await saveRegulationBundle({
      mode: 'create',
      selected: '',

      regulation: {
        number: '65535',

        title: 'Постановление Правительства РФ от 10.10.2026 №65535',

        topic: 'hotel',

        documentDate: '2026-10-10',

        edition: '',

        officialUrl: '',

        reviewStatus: 'needs_review',

        reviewedAt: null,

        reviewDueDate: null,

        reviewNote: '',

        claims: [],
      },

      topicClaims: [],
    });

    assert.equal(result.created, true);

    assert.equal(result.regulation.number, '65535');

    assert.equal(result.regulation.title, 'Постановление Правительства РФ от 10.10.2026 №65535');

    assert.equal(result.regulation.documentDate, '2026-10-10');

    const registryAfter = JSON.parse(await fs.readFile(runtimeFile, 'utf8'));

    assert.equal(registryAfter.items.length, 1);

    assert.equal(registryAfter.items[0].number, '65535');

    assert.equal(
      registryAfter.items[0].title,
      'Постановление Правительства РФ от 10.10.2026 №65535',
    );

    assert.equal(registryAfter.items[0].documentDate, '2026-10-10');
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
