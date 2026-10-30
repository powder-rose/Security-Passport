import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import express from 'express';

import { questionCatalog, QUESTION_PAGE_SIZE } from '../../shared/contracts/questions.js';
import { createQuestionStore } from '../../server/questions/question-store.mjs';
import { questionPageData } from '../../server/questions/question-public.mjs';
import { registerQuestionRoutes } from '../../server/http/question-routes.mjs';
import {
  createPrerenderQuestionStore,
  prerenderQuestions,
} from '../../scripts/lib/prerender-questions.mjs';

const articles = [
  {
    id: 'blog-main',
    slug: 'expert-article',
    title: 'Большой экспертный разбор',
    seoTitle: 'Экспертный разбор',
    status: 'published',
  },
];

const valid = {
  title: 'Нужен ли документ арендатору?',
  slug: 'arenda',
  shortAnswer: 'Зависит от объекта.',
  category: 'Общие вопросы',
  content: '<h2>Порядок</h2><p>Проверить исходные документы.</p>',
  seoTitle: 'Документ для арендатора',
  seoDescription: 'Ответ на вопрос об аренде.',
  authorId: 'nikolay-boykov',
  mainArticleSlug: 'expert-article',
  seoReview: 'checked',
  normativeReview: 'checked',
};

async function fixture(t, { seedFile = null } = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-questions-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  let clock = '2026-10-30T09:00:00.000Z';
  const file = path.join(root, 'questions.json');
  const store = createQuestionStore({
    file,
    seedFile,
    readArticles: async () => articles,
    now: () => clock,
  });
  return {
    root,
    file,
    store,
    time: value => {
      clock = value;
    },
  };
}

async function publish(store, values = {}) {
  const record = await store.create({ ...valid, ...values });
  return store.action(record.id, { action: 'publish', revision: record.revision });
}

test('the supplied answers start in review and never leak to the public catalog', async t => {
  const seedFile = new URL('../../server/questions/questions.seed.json', import.meta.url);
  const { store } = await fixture(t, { seedFile });
  const state = await store.read();
  assert.equal(state.records.length, 2);
  assert.equal(questionCatalog(state).questions.length, 0);
  for (const record of state.records) {
    assert.equal(record.status, 'review');
    assert.equal(record.live, null);
    assert.equal(record.draft.normativeReview, 'pending');
    assert.equal(record.draft.seoReview, 'pending');
    assert.doesNotMatch(record.draft.content, /ГАРАНТ|Нормативная проверка|utm_source/);
    assert.match(record.draft.content, /<h2>/);
  }
});

test('publication requires actual editorial checks, metadata and a published source article', async t => {
  const { store } = await fixture(t);
  for (const patch of [
    { seoReview: 'pending' },
    { normativeReview: 'pending' },
    { seoTitle: '' },
    { mainArticleSlug: 'missing' },
    { category: 'Нет категории' },
    { authorId: 'unknown' },
  ]) {
    const record = await store.create({
      ...valid,
      ...patch,
      slug: 'draft-' + Math.random().toString(36).slice(2),
    });
    await assert.rejects(store.action(record.id, { action: 'publish', revision: record.revision }));
  }
  assert.equal(questionCatalog(await store.read()).total, 0);
});

test('rich text and metadata are sanitized and public projections omit editor-only data', async t => {
  const { store } = await fixture(t);
  const record = await publish(store, {
    content:
      '<h1>Injected H1</h1><script>alert(1)</script><p onclick="bad()">Text <a href="javascript:alert(1)">link</a></p><table><tr><td>Cell</td></tr></table>',
    primaryKeyword: 'private keyword',
    keywords: ['private second keyword'],
  });
  assert.doesNotMatch(record.live.content, /<script|<h1|onclick|javascript:/i);
  assert.match(record.live.content, /<table>/);
  const state = await store.read();
  const data = questionPageData(state, record.live, articles);
  assert.equal(data.question.primaryKeyword, undefined);
  assert.equal(data.question.keywords, undefined);
  assert.equal(data.question.seoReview, undefined);
  assert.equal(data.question.normativeReview, undefined);
  assert.equal(data.articles.length, 1);
  assert.equal(questionCatalog(state).questions[0].content, undefined);
});

test('autosaving a published question changes the draft without changing the public snapshot', async t => {
  const { store } = await fixture(t);
  const published = await publish(store);
  const edited = await store.update(
    published.id,
    { content: '<p>Новая версия</p>' },
    { revision: published.revision, autosave: true },
  );
  assert.match(edited.draft.content, /Новая версия/);
  assert.match(edited.live.content, /исходные документы/);
  assert.equal(edited.draft.seoReview, 'pending');
  assert.equal(edited.draft.normativeReview, 'pending');
  await assert.rejects(
    store.action(edited.id, { action: 'publish', revision: edited.revision }),
    error => error.code === 'QUESTION_REVIEW_REQUIRED',
  );
});

test('public URL changes reserve old slugs and history restoration only changes the draft', async t => {
  const { store } = await fixture(t);
  let record = await publish(store);
  record = await store.update(record.id, { slug: 'new-address' }, { revision: record.revision });
  record = await store.action(record.id, { action: 'publish', revision: record.revision });
  assert.deepEqual(record.aliases, ['arenda']);
  await assert.rejects(
    store.create({ ...valid, slug: 'arenda' }),
    error => error.code === 'QUESTION_SLUG_CONFLICT',
  );
  const versionId = record.history[0].id;
  record = await store.action(record.id, {
    action: 'restore',
    revision: record.revision,
    versionId,
  });
  assert.equal(record.draft.slug, 'arenda');
  assert.equal(record.live.slug, 'new-address');
  assert.equal(record.draft.seoReview, 'pending');
});

test('concurrent edits cannot silently overwrite each other and persisted state survives restart', async t => {
  const { store, file } = await fixture(t);
  const record = await store.create(valid);
  const results = await Promise.allSettled([
    store.update(record.id, { title: 'Первое изменение' }, { revision: record.revision }),
    store.update(record.id, { title: 'Второе изменение' }, { revision: record.revision }),
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(
    results.find(result => result.status === 'rejected').reason.code,
    'QUESTION_REVISION_CONFLICT',
  );
  const restarted = createQuestionStore({ file, seedFile: null });
  assert.equal((await restarted.read()).records[0].draft.title, 'Первое изменение');
});

test('lastmod stays stable for editor-only changes and advances for public content', async t => {
  const { store, time } = await fixture(t);
  let record = await publish(store);
  const original = record.live.modifiedAt;
  time('2026-10-31T09:00:00.000Z');
  record = await store.update(
    record.id,
    { primaryKeyword: 'новый ключ', pinned: true },
    { revision: record.revision },
  );
  record = await store.action(record.id, { action: 'publish', revision: record.revision });
  assert.equal(record.live.modifiedAt, original);
  record = await store.update(
    record.id,
    {
      shortAnswer: 'Существенно изменённый ответ',
      seoReview: 'checked',
      normativeReview: 'checked',
    },
    { revision: record.revision },
  );
  record = await store.action(record.id, { action: 'publish', revision: record.revision });
  assert.equal(record.live.modifiedAt, '2026-10-31T09:00:00.000Z');
  assert.equal(record.live.publishedAt, original);
});

test('scheduled questions stay private until due and scheduler revalidates references', async t => {
  const { store, time } = await fixture(t);
  let record = await store.create(valid);
  record = await store.action(record.id, {
    action: 'schedule',
    revision: record.revision,
    scheduledAt: '2026-11-01T08:00:00.000Z',
  });
  assert.equal(questionCatalog(await store.read()).total, 0);
  assert.deepEqual(await store.publishDue(), []);
  time('2026-11-01T08:00:30.000Z');
  assert.deepEqual(await store.publishDue(), [record.id]);
  assert.equal(questionCatalog(await store.read()).total, 1);
  assert.deepEqual(await store.publishDue(), []);
  assert.equal((await store.read()).records[0].live.publishedAt, '2026-11-01T08:00:30.000Z');
});

test('duplicate warnings can be overridden by an authenticated administrator but review cannot', async t => {
  const { store } = await fixture(t);
  const record = await store.create({ ...valid, title: articles[0].title });
  await assert.rejects(
    store.action(record.id, { action: 'publish', revision: record.revision }),
    error => error.code === 'QUESTION_DUPLICATE_WARNING',
  );
  const result = await store.action(record.id, {
    action: 'publish',
    revision: record.revision,
    overrideWarnings: true,
  });
  assert.ok(result.live);
});

test('scheduled publication preserves an administrator override and updates an explicit self-canonical after a slug change', async t => {
  const { store, time } = await fixture(t);
  let record = await store.create({ ...valid, title: articles[0].title });
  record = await store.action(record.id, {
    action: 'schedule',
    revision: record.revision,
    scheduledAt: '2026-11-01T08:00:00.000Z',
    overrideWarnings: true,
  });
  time('2026-11-01T08:00:00.000Z');
  assert.deepEqual(await store.publishDue(), [record.id]);
  record = (await store.inspect(record.id)).record;
  record = await store.update(
    record.id,
    {
      title: valid.title,
      slug: 'renamed',
      canonical: record.live.canonical,
      seoReview: 'checked',
      normativeReview: 'checked',
    },
    { revision: record.revision },
  );
  record = await store.action(record.id, { action: 'publish', revision: record.revision });
  assert.equal(record.live.canonical, 'https://pasport-bezopasnosty.ru/questions/renamed/');
  assert.deepEqual(record.aliases, ['arenda']);
});

test('category renaming updates related records, while deletion of a used category is rejected', async t => {
  const { store } = await fixture(t);
  const record = await publish(store);
  const state = await store.read();
  await store.updateSettings({
    categories: state.categories.map(value =>
      value === 'Общие вопросы' ? 'Практические вопросы' : value,
    ),
    rename: { from: 'Общие вопросы', to: 'Практические вопросы' },
  });
  const updated = (await store.inspect(record.id)).record;
  assert.equal(updated.draft.category, 'Практические вопросы');
  assert.equal(updated.live.category, 'Практические вопросы');
  await assert.rejects(store.updateSettings({ categories: ['Другая категория'] }));
});

test('catalog searches full text, filters only public records and paginates in groups of twelve', async t => {
  const { store } = await fixture(t);
  for (let index = 0; index < 14; index += 1) {
    await publish(store, {
      slug: `question-${index}`,
      title: `Вопрос ${index}`,
      seoTitle: `Title ${index}`,
      content: `<p>${index === 13 ? 'Уникальный термин' : 'Текст'}</p>`,
    });
  }
  await store.create({
    ...valid,
    title: 'Секретный черновик',
    content: '<p>Уникальный термин</p>',
  });
  const state = await store.read();
  assert.equal(questionCatalog(state).questions.length, QUESTION_PAGE_SIZE);
  assert.equal(questionCatalog(state, { page: 2 }).questions.length, 2);
  assert.equal(questionCatalog(state, { search: 'Уникальный термин' }).total, 1);
  assert.equal(questionCatalog(state, { category: 'Нет категории' }).total, 0);
  assert.doesNotMatch(JSON.stringify(questionCatalog(state)), /Секретный/);
});

test('malformed storage is never silently replaced with initial drafts', async t => {
  const { store, file } = await fixture(t);
  await fs.writeFile(file, '{broken');
  await assert.rejects(store.read());
  await assert.rejects(store.create(valid));
  assert.equal(await fs.readFile(file, 'utf8'), '{broken');
});

test('prerender reads the same persistent questions file as the backend environment and honors process overrides', async t => {
  const { store, root, file } = await fixture(t);
  const record = await publish(store);
  await fs.writeFile(path.join(root, '.env.server'), `QUESTIONS_FILE=${file}\n`);
  const configured = await createPrerenderQuestionStore({ projectRoot: root, env: {} });
  assert.equal((await configured.read()).records[0].id, record.id);
  const override = await createPrerenderQuestionStore({
    projectRoot: root,
    env: { QUESTIONS_FILE: path.join(root, 'other.json') },
  });
  assert.equal(questionCatalog(await override.read()).total, 0);
});

test('reverse blog links require an explicit editor selection and contain only public cards', async t => {
  const { store } = await fixture(t);
  let record = await publish(store);
  assert.equal(questionCatalog(await store.read(), { article: 'expert-article' }).total, 0);
  record = await store.update(record.id, { showInBlog: true }, { revision: record.revision });
  await store.action(record.id, { action: 'publish', revision: record.revision });
  const linked = questionCatalog(await store.read(), { article: 'expert-article' });
  assert.equal(linked.total, 1);
  assert.equal(linked.questions[0].content, undefined);
  assert.equal(questionCatalog(await store.read(), { article: 'unrelated-article' }).total, 0);
});

test('prerender keeps drafts private, omits noindex from sitemaps and removes obsolete pages', async t => {
  const { store, root } = await fixture(t);
  await publish(store);
  await publish(store, {
    slug: 'excluded',
    title: 'Другой вопрос',
    seoTitle: 'Другой SEO Title',
    indexable: false,
  });
  await store.create({
    ...valid,
    slug: 'draft-only',
    title: 'Черновой вопрос',
    seoTitle: 'Черновой SEO Title',
  });
  await fs.mkdir(path.join(root, 'questions', 'stale-address'), { recursive: true });
  await fs.writeFile(path.join(root, 'questions', 'stale-address', 'index.html'), 'stale');
  const bootstrap = [];
  const sitemap = await prerenderQuestions({
    store,
    clientDir: root,
    canonical: 'https://pasport-bezopasnosty.ru',
    articles,
    render: input => input,
    createDocument: (_result, data, _source, key) => {
      bootstrap.push({ data, key });
      return '<h1>Rendered</h1>';
    },
  });
  assert.deepEqual(
    sitemap.map(item => item.loc),
    [
      'https://pasport-bezopasnosty.ru/questions/',
      'https://pasport-bezopasnosty.ru/questions/arenda/',
    ],
  );
  await assert.rejects(fs.access(path.join(root, 'questions', 'draft-only')));
  await assert.rejects(fs.access(path.join(root, 'questions', 'stale-address')));
  await fs.access(path.join(root, 'questions', 'excluded', 'index.html'));
  assert.ok(bootstrap.every(item => item.key === '__PASSPORT_QUESTIONS__'));
  assert.ok(bootstrap[0].data.questions.every(item => !Object.hasOwn(item, 'content')));
});

test('HTTP routes protect previews, gate archived static files, preserve redirects and mark query results noindex', async t => {
  const { store, root } = await fixture(t);
  const first = await publish(store);
  const draft = await store.create({
    ...valid,
    slug: 'private-draft',
    title: 'Черновик',
    seoTitle: 'SEO черновика',
  });
  await fs.mkdir(path.join(root, 'questions', 'arenda'), { recursive: true });
  await fs.writeFile(path.join(root, 'questions', 'arenda', 'index.html'), '<h1>Published</h1>');
  await fs.writeFile(path.join(root, 'questions', 'index.html'), '<h1>Questions</h1>');
  const app = express();
  app.use(express.json());
  const publicationCalls = [];
  registerQuestionRoutes({
    app,
    clientDir: root,
    store,
    readArticles: async () => articles,
    publish: async reason => {
      publicationCalls.push(reason);
      return { status: 'queued' };
    },
    adminAuth: {
      requireAdmin: (req, res, next) =>
        req.get('x-test-admin') === 'yes' ? next() : res.status(401).json({ ok: false }),
    },
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const request = (url, options = {}) => fetch(origin + url, { redirect: 'manual', ...options });
  assert.equal((await request(`/api/admin/questions/${draft.id}/preview`)).status, 401);
  const preview = await request(`/api/admin/questions/${draft.id}/preview`, {
    headers: { 'x-test-admin': 'yes' },
  });
  assert.equal(preview.status, 200);
  assert.match(preview.headers.get('cache-control'), /no-store/);
  assert.match(preview.headers.get('x-robots-tag'), /noindex/);
  assert.equal((await preview.json()).question.primaryKeyword, undefined);
  assert.equal((await request('/questions/private-draft/')).status, 404);
  assert.equal((await request('/questions/arenda/')).status, 200);
  assert.equal((await request('/questions/arenda/index.html')).status, 404);
  assert.match((await request('/questions/?search=термин')).headers.get('x-robots-tag'), /noindex/);
  assert.equal((await request('/questions')).status, 301);
  let changed = await store.update(first.id, { slug: 'new-slug' }, { revision: first.revision });
  changed = await store.action(first.id, { action: 'publish', revision: changed.revision });
  const redirect = await request('/questions/arenda/?utm_source=test');
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), '/questions/new-slug/?utm_source=test');
  const response = await request(`/api/admin/questions/${changed.id}/actions`, {
    method: 'POST',
    headers: { 'x-test-admin': 'yes', 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'archive', revision: changed.revision }),
  });
  assert.equal(response.status, 200);
  assert.equal((await request('/questions/arenda/')).status, 404);
  assert.equal((await request('/questions/new-slug/')).status, 404);
  assert.deepEqual(publicationCalls, ['question-archive']);
});
