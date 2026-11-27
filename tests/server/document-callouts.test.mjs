import assert from 'node:assert/strict';
import test from 'node:test';

import { sanitizeArticleContent } from '../../server/articles/article-html.mjs';
import { getArticleDocument } from '../../server/articles/article-documents.mjs';
import { renderArticleDocumentMarkup } from '../../src/features/articles/documents/articleDocumentMarkup.js';
import { createLeadIntake } from '../../server/leads/lead-intake.mjs';
import { buildLeadText } from '../../server/leads/lead-delivery.mjs';
import { LEAD_SOURCE_DOCUMENT_REQUEST } from '../../shared/contracts/lead.js';
import { createRequest, createResponse, withMutedConsole } from './http-test-utils.mjs';

const sampleContent = `
  <p>Перед документом</p>
  <section data-passport-document="1" data-title="Акт &amp; протокол">
    <h2>Заголовок документа</h2>
    <p>Текст <strong>образца</strong>.</p>
    <table><tbody><tr><td>Акт</td></tr></tbody></table>
    <img src="https://example.com/image.webp" alt="Скан">
  </section>
  <section data-passport-document="1" data-title="Приказ">
    <p>Текст приказа</p>
  </section>
  <p>После документа</p>
`;

function sampleArticle(status = 'published') {
  return {
    status,
    title: 'Документы по безопасности объекта',
    slug: 'dokumenty-bezopasnosti',
    content: sanitizeArticleContent(sampleContent),
  };
}

test('document callout survives sanitization with nested blocks but no executable content', () => {
  const content = sanitizeArticleContent(`
    <section data-passport-document="1" data-title="Акт" onclick="alert(1)">
      <p>Описание</p><script>alert('unsafe')</script>
      <table><tbody><tr><td>Сведения</td></tr></tbody></table>
    </section>
  `);

  assert.match(content, /<section data-passport-document="1" data-title="Акт">/);
  assert.match(content, /<table>/);
  assert.doesNotMatch(content, /onclick|script|alert/i);
});

test('public document rendering contains semantic disclosure and request action', () => {
  const output = renderArticleDocumentMarkup(sampleArticle().content);

  assert.equal((output.match(/class="passport-document"/g) || []).length, 2);
  assert.match(output, /data-document-request="1"/);
  assert.match(output, /data-document-request="2"/);
  assert.match(output, /<details class="passport-document__details">/);
  assert.match(output, /Акт &amp; протокол/);
  assert.doesNotMatch(output, /data-document-copy/);
  assert.match(renderArticleDocumentMarkup(sampleArticle().content, true), /data-document-copy/);
});

test('document title and URL are derived from published article, not the client', () => {
  const article = sampleArticle();
  const first = getArticleDocument(article, 1);
  const second = getArticleDocument(article, 2);

  assert.equal(first.documentTitle, 'Акт & протокол');
  assert.equal(second.documentTitle, 'Приказ');
  assert.equal(first.articleTitle, article.title);
  assert.equal(first.articleSlug, article.slug);
  assert.match(first.articleUrl, /#passport-document-1$/);
  assert.equal(getArticleDocument(article, 3), null);
  assert.equal(getArticleDocument(sampleArticle('draft'), 1), null);
  assert.equal(getArticleDocument(article, 0), null);
  assert.equal(getArticleDocument(article, 1.5), null);
});

function leadBody(data = {}) {
  return {
    source: LEAD_SOURCE_DOCUMENT_REQUEST,
    requestId: 'document-test-' + Math.random().toString(16).slice(2),
    page: 'https://pasport-bezopasnosty.ru/blog/dokumenty-bezopasnosti/',
    data: {
      name: 'Иван Иванов',
      phone: '+79991234567',
      email: 'ivan@example.com',
      articleSlug: 'dokumenty-bezopasnosti',
      documentIndex: 1,
      consent: true,
      website: '',
      ...data,
    },
  };
}

test('document requests use normal lead delivery and trusted server article context', async () => {
  const delivered = [];
  const intake = createLeadIntake({
    leadDelivery: {
      async deliverLead(lead) {
        delivered.push(lead);
        return { ok: true };
      },
    },
    env: { LEAD_RATE_MAX: '100' },
    resolveDocument: async (_slug, index) => getArticleDocument(sampleArticle(), index),
  });
  const body = leadBody({ documentTitle: 'Поддельное название', articleTitle: 'Подделка' });
  const response = createResponse();

  await withMutedConsole('info', () => intake.handleLead(createRequest({ body }), response));

  assert.equal(response.statusCode, 201);
  assert.equal(delivered.length, 1);
  assert.equal(delivered[0].data.documentTitle, 'Акт & протокол');
  assert.equal(delivered[0].data.articleTitle, sampleArticle().title);
  assert.match(buildLeadText(delivered[0]), /Акт & протокол/);
});

test('document requests reject invalid fields, invalid selection, and missing consent', async () => {
  const delivered = [];
  const intake = createLeadIntake({
    leadDelivery: {
      async deliverLead(lead) {
        delivered.push(lead);
        return { ok: true };
      },
    },
    env: { LEAD_RATE_MAX: '100' },
    resolveDocument: async (_slug, index) => getArticleDocument(sampleArticle(), index),
  });
  for (const [data, error] of [
    [{ consent: false }, 'CONSENT_REQUIRED'],
    [{ email: '' }, 'INVALID_DOCUMENT_REQUEST'],
    [{ phone: '' }, 'INVALID_DOCUMENT_REQUEST'],
    [{ name: '' }, 'INVALID_DOCUMENT_REQUEST'],
    [{ documentIndex: 999 }, 'DOCUMENT_NOT_AVAILABLE'],
  ]) {
    const response = createResponse();
    await intake.handleLead(createRequest({ body: leadBody(data) }), response);
    assert.equal(response.statusCode, 400);
    assert.equal(response.body?.error, error);
  }
  assert.equal(delivered.length, 0);
});
