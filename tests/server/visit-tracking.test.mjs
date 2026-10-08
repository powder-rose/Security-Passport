import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createVisitTracking } from '../../server/analytics/visit-tracking.mjs';

import { createRequest, createResponse, withMutedConsole } from './http-test-utils.mjs';

async function createTemporaryDirectory() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'passport-visit-test-'));
}

function createVisitRequest({
  sessionId,
  ip = '203.0.113.50',
  userAgent = 'Mozilla/5.0 Visit Test',
  attribution = {},
} = {}) {
  return createRequest({
    ip,

    headers: {
      'user-agent': userAgent,
    },

    body: {
      sessionId,
      path: '/visit-test/',
      referrer: '',
      attribution,
    },
  });
}

test('concurrent duplicate visits persist exactly one row', async () => {
  const directory = await createTemporaryDirectory();

  const file = path.join(directory, 'visits.jsonl');

  try {
    const tracking = createVisitTracking({
      visitsFile: file,

      env: {
        VISIT_DEDUPE_TTL_MS: '1800000',

        VISIT_RATE_WINDOW_MS: '600000',

        VISIT_RATE_MAX: '100',
      },
    });

    const responses = Array.from(
      {
        length: 25,
      },
      () => createResponse(),
    );

    await Promise.all(
      responses.map(response =>
        tracking.handleVisit(
          createVisitRequest({
            sessionId: 'same-concurrent-session',
          }),
          response,
        ),
      ),
    );

    const created = responses.filter(
      response => response.statusCode === 201 && response.body?.ok === true,
    );

    const duplicates = responses.filter(
      response => response.statusCode === 200 && response.body?.duplicate === true,
    );

    assert.equal(created.length, 1);

    assert.equal(duplicates.length, 24);

    const rows = (await fs.readFile(file, 'utf8'))
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line));

    assert.equal(rows.length, 1);

    assert.equal(rows[0].sessionId, 'same-concurrent-session');

    assert.equal(rows[0].site.slug, 'russia');

    assert.equal(rows[0].meta.userAgent, 'Mozilla/5.0 Visit Test');
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('failed visit persistence releases dedupe reservation and rate slot', async () => {
  const directory = await createTemporaryDirectory();

  const invalidTarget = path.join(directory, 'target-directory');

  await fs.mkdir(invalidTarget);

  try {
    const tracking = createVisitTracking({
      visitsFile: invalidTarget,

      env: {
        VISIT_DEDUPE_TTL_MS: '1800000',

        VISIT_RATE_WINDOW_MS: '600000',

        VISIT_RATE_MAX: '1',
      },
    });

    await withMutedConsole('error', async () => {
      for (let attempt = 1; attempt <= 2; attempt += 1) {
        const response = createResponse();

        await tracking.handleVisit(
          createVisitRequest({
            sessionId: 'retry-after-failure',
          }),
          response,
        );

        assert.equal(response.statusCode, 500);

        assert.equal(response.body?.error, 'VISIT_WRITE_FAILED');
      }
    });
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('bot visits are ignored and browser visits keep dedupe and rate limiting', async () => {
  const directory = await createTemporaryDirectory();

  const file = path.join(directory, 'visits.jsonl');

  try {
    const tracking = createVisitTracking({
      visitsFile: file,

      env: {
        VISIT_DEDUPE_TTL_MS: '1800000',

        VISIT_RATE_WINDOW_MS: '600000',

        VISIT_RATE_MAX: '1',
      },
    });

    const bot = createResponse();

    await tracking.handleVisit(
      createVisitRequest({
        sessionId: 'bot-session-001',

        userAgent: 'Googlebot',
      }),
      bot,
    );

    assert.equal(bot.statusCode, 200);

    assert.equal(bot.body?.reason, 'BOT_VISIT');

    const first = createResponse();

    await tracking.handleVisit(
      createVisitRequest({
        sessionId: 'browser-session-001',
      }),
      first,
    );

    assert.equal(first.statusCode, 201);

    const duplicate = createResponse();

    await tracking.handleVisit(
      createVisitRequest({
        sessionId: 'browser-session-001',
      }),
      duplicate,
    );

    assert.equal(duplicate.statusCode, 200);

    assert.equal(duplicate.body?.duplicate, true);

    const limited = createResponse();

    await tracking.handleVisit(
      createVisitRequest({
        sessionId: 'browser-session-002',
      }),
      limited,
    );

    assert.equal(limited.statusCode, 200);

    assert.equal(limited.body?.reason, 'VISIT_RATE_LIMITED');

    const rows = (await fs.readFile(file, 'utf8')).trim().split('\n').filter(Boolean);

    assert.equal(rows.length, 1);
  } finally {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  }
});
