import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ARTICLE_CALLBACK_INTERESTS,
  LEAD_SOURCE_ARTICLE_CALLBACK,
} from '../../shared/contracts/lead.js';

import { createLeadIntake } from '../../server/leads/lead-intake.mjs';

import { createRequest, createResponse, withMutedConsole } from './http-test-utils.mjs';

function createValidLeadBody(requestId = 'request-success-001') {
  return {
    source: 'passport-security-final-cta',

    requestId,

    submittedAt: '2026-10-08T10:00:00.000Z',

    page: ' https://pasport-bezopasnosty.ru/test/ ',

    referrer: ' https://example.com/source/ ',

    attribution: {
      utm_source: ' test ',
    },

    data: {
      name: ' Иван ',
      phone: ' +79990000000 ',
      email: ' test@example.com ',
      company: ' Компания ',
      object: ' Объект ',
      consent: true,
    },
  };
}

test('lead intake normalizes a valid lead and deduplicates requestId', async () => {
  const delivered = [];

  const intake = createLeadIntake({
    leadDelivery: {
      async deliverLead(lead) {
        delivered.push(lead);

        return {
          ok: true,
          results: [],
        };
      },
    },

    env: {
      LEAD_RATE_WINDOW_MS: '600000',

      LEAD_RATE_MAX: '100',

      LEAD_DEDUPE_TTL_MS: '86400000',
    },
  });

  const body = createValidLeadBody();

  const first = createResponse();

  await withMutedConsole('info', () =>
    intake.handleLead(
      createRequest({
        body,
      }),
      first,
    ),
  );

  assert.equal(first.statusCode, 201);

  assert.equal(first.body?.ok, true);

  assert.equal(first.body?.requestId, 'request-success-001');

  assert.equal(delivered.length, 1);

  const [lead] = delivered;

  assert.equal(lead.requestId, 'request-success-001');

  assert.equal(lead.source, 'passport-security-final-cta');

  assert.equal(lead.page, 'https://pasport-bezopasnosty.ru/test/');

  assert.equal(lead.referrer, 'https://example.com/source/');

  assert.equal(lead.attribution.utm_source, 'test');

  assert.equal(lead.data.name, 'Иван');

  assert.equal(lead.data.phone, '+79990000000');

  assert.equal(lead.site.slug, 'russia');

  assert.equal(lead.meta.ip, '203.0.113.10');

  assert.equal(lead.meta.userAgent, 'Mozilla/5.0 Test Browser');

  const duplicate = createResponse();

  await intake.handleLead(
    createRequest({
      body,
    }),
    duplicate,
  );

  assert.equal(duplicate.statusCode, 200);

  assert.equal(duplicate.body?.duplicate, true);

  assert.equal(duplicate.body?.requestId, 'request-success-001');

  assert.equal(delivered.length, 1);
});

test('lead honeypot returns accepted spam response without delivery', async () => {
  let calls = 0;

  const intake = createLeadIntake({
    leadDelivery: {
      async deliverLead() {
        calls += 1;

        return {
          ok: true,
        };
      },
    },

    env: {
      LEAD_RATE_MAX: '100',
    },
  });

  const response = createResponse();

  await intake.handleLead(
    createRequest({
      body: {
        source: 'passport-security-final-cta',

        requestId: 'request-spam-001',

        data: {
          website: 'https://spam.example',

          name: 'Bot',

          phone: '+70000000000',

          consent: true,
        },
      },
    }),
    response,
  );

  assert.equal(response.statusCode, 202);

  assert.equal(response.body?.ok, true);

  assert.equal(response.body?.error, undefined);

  assert.equal(calls, 0);
});

test('failed delivery releases requestId for a retry', async () => {
  let calls = 0;

  const intake = createLeadIntake({
    leadDelivery: {
      async deliverLead() {
        calls += 1;

        return {
          ok: false,
          results: [],
        };
      },
    },

    env: {
      LEAD_RATE_MAX: '100',
    },
  });

  const body = createValidLeadBody('failed-delivery-retry');

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const response = createResponse();

    await intake.handleLead(
      createRequest({
        body,
      }),
      response,
    );

    assert.equal(response.statusCode, 503);

    assert.equal(response.body?.error, 'NO_DELIVERY_CHANNEL_AVAILABLE');
  }

  assert.equal(calls, 2);
});

test('lead rate limiter blocks requests over the configured maximum', () => {
  const intake = createLeadIntake({
    leadDelivery: {
      async deliverLead() {
        return {
          ok: true,
        };
      },
    },

    env: {
      LEAD_RATE_WINDOW_MS: '600000',

      LEAD_RATE_MAX: '2',
    },
  });

  const request = createRequest({
    ip: '203.0.113.30',
  });

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    let nextCalled = false;

    intake.rateLimit(request, createResponse(), () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  }

  let nextCalled = false;

  const blocked = createResponse();

  intake.rateLimit(request, blocked, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);

  assert.equal(blocked.statusCode, 429);

  assert.equal(blocked.body?.error, 'TOO_MANY_REQUESTS');

  assert.ok(blocked.headers['Retry-After']);
});

test('article callback accepts a phone-only contact and deduplicates submissions', async () => {
  const delivered = [];

  const intake = createLeadIntake({
    leadDelivery: {
      async deliverLead(lead) {
        delivered.push(lead);

        return { ok: true };
      },
    },
    env: {
      LEAD_RATE_MAX: '100',
    },
  });

  const body = {
    source: LEAD_SOURCE_ARTICLE_CALLBACK,
    requestId: 'article-callback-valid-001',
    page: 'https://pasport-bezopasnosty.ru/blog/hotel-article/',
    data: {
      interest: ARTICLE_CALLBACK_INTERESTS[0],
      name: '',
      phone: '+7 (999) 123-45-67',
      articleTitle: 'Hotel security passport',
      consent: true,
      website: '',
    },
  };

  const first = createResponse();

  await withMutedConsole('info', () => intake.handleLead(createRequest({ body }), first));

  assert.equal(first.statusCode, 201);
  assert.equal(first.body?.ok, true);
  assert.equal(delivered.length, 1);

  assert.equal(delivered[0].source, LEAD_SOURCE_ARTICLE_CALLBACK);
  assert.equal(delivered[0].data.name, '');
  assert.equal(delivered[0].data.phone, '+7 (999) 123-45-67');
  assert.equal(delivered[0].data.interest, ARTICLE_CALLBACK_INTERESTS[0]);
  assert.equal(delivered[0].data.articleTitle, 'Hotel security passport');
  assert.equal(delivered[0].page, 'https://pasport-bezopasnosty.ru/blog/hotel-article/');

  const duplicate = createResponse();

  await intake.handleLead(createRequest({ body }), duplicate);

  assert.equal(duplicate.statusCode, 200);
  assert.equal(duplicate.body?.duplicate, true);
  assert.equal(delivered.length, 1);
});

test('article callback rejects invalid or spam submissions before delivery', async () => {
  const delivered = [];

  const intake = createLeadIntake({
    leadDelivery: {
      async deliverLead(lead) {
        delivered.push(lead);

        return { ok: true };
      },
    },
    env: {
      LEAD_RATE_MAX: '100',
    },
  });

  const validData = {
    interest: ARTICLE_CALLBACK_INTERESTS[0],
    name: '',
    phone: '+7 (999) 123-45-67',
    articleTitle: 'Hotel security passport',
    consent: true,
    website: '',
  };

  const cases = [
    {
      label: 'Missing phone',
      changes: { phone: '' },
      status: 400,
      error: 'PHONE_REQUIRED',
    },
    {
      label: 'Invalid phone',
      changes: { phone: '+7 (999) 12' },
      status: 400,
      error: 'INVALID_ARTICLE_CALLBACK',
    },
    {
      label: 'Missing consent',
      changes: { consent: false },
      status: 400,
      error: 'CONSENT_REQUIRED',
    },
    {
      label: 'Unknown interest',
      changes: { interest: 'invalid' },
      status: 400,
      error: 'INVALID_ARTICLE_CALLBACK',
    },
    {
      label: 'Invalid name',
      changes: { name: '123' },
      status: 400,
      error: 'INVALID_ARTICLE_CALLBACK',
    },
    {
      label: 'Spam honeypot',
      changes: { website: 'https://spam.example' },
      status: 202,
      error: undefined,
    },
  ];

  for (const [index, scenario] of cases.entries()) {
    const response = createResponse();

    await intake.handleLead(
      createRequest({
        body: {
          source: LEAD_SOURCE_ARTICLE_CALLBACK,
          requestId: `article-callback-invalid-${index}`,
          data: {
            ...validData,
            ...scenario.changes,
          },
        },
      }),
      response,
    );

    assert.equal(response.statusCode, scenario.status, scenario.label);
    assert.equal(response.body?.error, scenario.error, scenario.label);
    assert.equal(delivered.length, 0, scenario.label);
  }
});
