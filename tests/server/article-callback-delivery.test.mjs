import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import test from 'node:test';

import nodemailer from 'nodemailer';

import {
  ARTICLE_CALLBACK_INTERESTS,
  LEAD_SOURCE_ARTICLE_CALLBACK,
} from '../../shared/contracts/lead.js';

import { createLeadDelivery } from '../../server/leads/lead-delivery.mjs';
import { createLeadIntake } from '../../server/leads/lead-intake.mjs';

import { createRequest, createResponse, withMutedConsole } from './http-test-utils.mjs';

test('article callback reaches email and admin with its source context', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-article-callback-'));
  const leadsFile = path.join(root, 'leads.jsonl');
  const previousLeadsFile = process.env.LEADS_FILE;
  const sentMessages = [];

  const interest = ARTICLE_CALLBACK_INTERESTS[0];
  const articleTitle = 'Паспорт безопасности гостиницы';
  const articleUrl = 'https://pasport-bezopasnosty.ru/blog/pasport-bezopasnosti-gostinicy/';
  const phone = '+7 (999) 123-45-67';

  try {
    t.mock.method(nodemailer, 'createTransport', () => ({
      async sendMail(message) {
        sentMessages.push(message);

        return {
          accepted: ['manager@example.test'],
        };
      },
    }));

    const leadDelivery = createLeadDelivery({
      backupEnabled: true,
      leadsFile,
      env: {
        SMTP_HOST: 'smtp.example.test',
        SMTP_USER: 'sender@example.test',
        SMTP_PASS: 'test-only',
        LEAD_EMAIL_FROM: 'sender@example.test',
        LEAD_EMAIL_TO: 'manager@example.test',
      },
    });

    const leadIntake = createLeadIntake({
      leadDelivery,
      env: {
        LEAD_RATE_MAX: '100',
      },
    });

    const body = {
      source: LEAD_SOURCE_ARTICLE_CALLBACK,
      requestId: 'article-callback-delivery-test-001',
      page: articleUrl,
      attribution: {
        utm_source: 'seo',
      },
      data: {
        interest,
        articleTitle,
        name: '',
        phone,
        consent: true,
        website: '',
      },
    };

    const response = createResponse();

    await withMutedConsole('info', () => leadIntake.handleLead(createRequest({ body }), response));

    assert.equal(response.statusCode, 201);
    assert.equal(response.body?.ok, true);

    assert.equal(sentMessages.length, 1);

    const [email] = sentMessages;

    assert.equal(email.to, 'manager@example.test');
    assert.equal(email.subject, 'Новая заявка: обратный звонок из статьи');

    assert.ok(email.text.includes('ОБРАТНЫЙ ЗВОНОК ИЗ СТАТЬИ'));
    assert.ok(email.text.includes(`Что хочет выяснить: ${interest}`));
    assert.ok(email.text.includes(`Название статьи: ${articleTitle}`));
    assert.ok(email.text.includes(`Телефон: ${phone}`));
    assert.ok(email.text.includes(`Страница: ${articleUrl}`));

    const savedLines = (await fs.readFile(leadsFile, 'utf8')).trim().split('\n');

    assert.equal(savedLines.length, 1);

    const savedLead = JSON.parse(savedLines[0]);

    assert.equal(savedLead.source, LEAD_SOURCE_ARTICLE_CALLBACK);
    assert.equal(savedLead.data.name, '');
    assert.equal(savedLead.data.phone, phone);
    assert.equal(savedLead.data.interest, interest);
    assert.equal(savedLead.data.articleTitle, articleTitle);
    assert.equal(savedLead.page, articleUrl);
    assert.equal(savedLead.attribution.utm_source, 'seo');

    process.env.LEADS_FILE = leadsFile;

    const { getAdminLeadsPage } = await import('../../server/leads/admin-leads.mjs');

    const result = await getAdminLeadsPage({
      limit: 10,
    });

    assert.equal(result.pagination.total, 1);
    assert.equal(result.leads.length, 1);

    const [adminLead] = result.leads;

    assert.equal(adminLead.sourceTitle, 'Статья / звонок');
    assert.equal(adminLead.name, '');
    assert.equal(adminLead.phone, phone);
    assert.equal(adminLead.interest, interest);
    assert.equal(adminLead.articleTitle, articleTitle);
    assert.equal(adminLead.articleUrl, articleUrl);

    const searchResult = await getAdminLeadsPage({
      search: 'гостиницы',
      limit: 10,
    });

    assert.equal(searchResult.pagination.total, 1);
    assert.equal(searchResult.leads[0].sourceTitle, 'Статья / звонок');
  } finally {
    if (previousLeadsFile === undefined) {
      delete process.env.LEADS_FILE;
    } else {
      process.env.LEADS_FILE = previousLeadsFile;
    }

    await fs.rm(root, {
      recursive: true,
      force: true,
    });
  }
});
