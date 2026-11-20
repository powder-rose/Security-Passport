import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test, { before, after, beforeEach } from 'node:test';
import express from 'express';
import {
  parseScheduleInstant,
  fromMoscowDateTimeInput,
  toMoscowDateTimeInput,
} from '../../shared/contracts/article-schedule.js';

let root, store, publication, createScheduler, server, origin, cookie, unsubscribe;
const previousCwd = process.cwd();
const previousEnv = Object.fromEntries(
  ['PASSPORT_PROJECT_ROOT', 'BLOG_PUBLICATION_EXECUTABLE', 'BLOG_PUBLISH_SCRIPT'].map(key => [
    key,
    process.env[key],
  ]),
);
const at = '2099-05-01T06:00:00.000Z';
const input = {
  title: 'Новая статья',
  content: '<p>Содержимое</p>',
  seoTitle: 'SEO Title',
  seoDescription: 'Описание для поиска',
  status: 'scheduled',
  scheduledAt: at,
};
async function stored() {
  return JSON.parse(await fs.readFile(path.join(root, 'data/articles.json'), 'utf8'));
}
async function waitFor(predicate) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  assert.fail('Timed out waiting for scheduled publication');
}
async function api(url, body, authenticated = true) {
  const response = await fetch(origin + url, {
    method: body ? 'POST' : 'GET',
    headers: { ...(authenticated ? { cookie } : {}), 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, data: await response.json() };
}

before(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-scheduling-'));
  await fs.mkdir(path.join(root, 'data'));
  await fs.writeFile(path.join(root, 'data/articles.json'), '[]');
  const runner = path.join(root, 'publisher.mjs');
  await fs.writeFile(
    runner,
    `import fs from 'node:fs/promises';\nawait new Promise(resolve => setTimeout(resolve, 40));\nlet fail = false; try { await fs.access('failure'); fail = true; } catch {}\nif (fail) process.exitCode = 23;\n`,
  );
  process.chdir(root);
  process.env.PASSPORT_PROJECT_ROOT = root;
  process.env.BLOG_PUBLICATION_EXECUTABLE = process.execPath;
  process.env.BLOG_PUBLISH_SCRIPT = runner;
  store = await import('../../server/articles/admin-articles.mjs');
  publication = await import('../../server/articles/blog-publication.mjs');
  ({ createArticleScheduler: createScheduler } =
    await import('../../server/articles/article-scheduler.mjs'));
  unsubscribe = publication.observeBlogPublication({
    prepare: store.prepareScheduledPublication,
    settle: store.settleScheduledPublication,
  });
  const { createAdminAuth } = await import('../../server/auth/admin-auth.mjs');
  const { registerArticleRoutes } = await import('../../server/http/article-routes.mjs');
  const { registerArticleScheduleRoutes } =
    await import('../../server/http/article-schedule-routes.mjs');
  const app = express();
  app.use(express.json());
  const auth = createAdminAuth({
    password: 'schedule-test-password',
    secret: 'schedule-test-session-secret',
    isProduction: false,
  });
  app.post('/api/admin/login', auth.login);
  registerArticleRoutes({
    app,
    adminAuth: auth,
    clientDir: path.join(root, 'client'),
    uploadsDir: path.join(root, 'uploads'),
  });
  registerArticleScheduleRoutes({ app, adminAuth: auth });
  const { registerReportRoutes } = await import('../../server/http/report-routes.mjs');
  registerReportRoutes({ app, adminAuth: auth });
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  const login = await fetch(origin + '/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'schedule-test-password' }),
  });
  cookie = login.headers.get('set-cookie').split(';')[0];
});
beforeEach(async () => {
  await waitFor(() => !publication.getBlogPublicationStatus().running);
  await fs.writeFile(path.join(root, 'data/articles.json'), '[]');
  await fs.rm(path.join(root, 'data/deleted-article-slugs.json'), { force: true });
  await fs.rm(path.join(root, 'failure'), { force: true });
});
after(async () => {
  await waitFor(() => !publication.getBlogPublicationStatus().running);
  unsubscribe?.();
  if (server) await new Promise(resolve => server.close(resolve));
  process.chdir(previousCwd);
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  await fs.rm(root, { recursive: true, force: true });
});

test('Moscow input round-trips independently of browser/server timezone; impossible calendar dates are rejected', () => {
  assert.equal(toMoscowDateTimeInput(at), '2099-05-01T09:00');
  assert.equal(fromMoscowDateTimeInput('2099-05-01T09:00'), at);
  assert.equal(parseScheduleInstant('2099-05-01T09:00:00+03:00'), at);
  for (const value of ['2099-02-31T06:00:00Z', '2099-05-01T25:00:00Z', '2099-05-01T09:00', {}, 42])
    assert.equal(parseScheduleInstant(value), null);
});

test('planning rejects past/missing/invalid dates and missing SEO without changing storage', async () => {
  const original = await fs.readFile(path.join(root, 'data/articles.json'), 'utf8');
  for (const patch of [
    { scheduledAt: null },
    { scheduledAt: 'yesterday' },
    { scheduledAt: '2000-01-01T00:00:00Z' },
    { seoTitle: '' },
  ]) {
    await assert.rejects(store.createArticle({ ...input, ...patch }), error =>
      ['ARTICLE_SCHEDULE_INVALID', 'ARTICLE_SCHEDULE_PAST', 'ARTICLE_SEO_REQUIRED'].includes(
        error.code,
      ),
    );
    assert.equal(await fs.readFile(path.join(root, 'data/articles.json'), 'utf8'), original);
  }
});

test('a scheduled article stays private in public API and HTML, including stale files; manager requires authentication', async () => {
  const article = await store.createArticle(input);
  const file = path.join(root, 'client/blog', article.slug, 'index.html');
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, '<p>Stale public page</p>');
  assert.equal((await api('/api/admin/article-schedules', null, false)).status, 401);
  assert.deepEqual((await api('/api/articles')).data.articles, []);
  assert.equal((await api('/api/articles/' + article.slug)).status, 404);
  assert.equal((await fetch(origin + '/blog/' + article.slug + '/')).status, 404);
  const manager = await api('/api/admin/article-schedules');
  assert.equal(manager.data.schedules.length, 1);
  assert.equal(manager.data.schedules[0].schedule.at, at);
  assert.ok(!Object.hasOwn(manager.data.schedules[0], 'content'));
});

test('publication never starts early, starts exactly at the due boundary, and cannot claim the same article twice', async () => {
  const article = await store.createArticle(input);
  assert.deepEqual(await store.publishDueArticles(new Date(Date.parse(at) - 1)), []);
  assert.equal((await store.getArticleById(article.id)).publishedAt, null);
  assert.deepEqual(await store.publishDueArticles(new Date(at)), [article.id]);
  assert.deepEqual(await store.publishDueArticles(new Date(Date.parse(at) + 60000)), []);
  const result = await store.getArticleById(article.id);
  assert.equal(result.status, 'published');
  assert.equal(result.publishedAt, at);
  assert.equal(result.publicationSchedule.state, 'publishing');
});

test('deleting a published article removes it from the lists and permanently redirects its current and legacy URLs', async () => {
  const article = await store.createArticle({ ...input, status: 'published', slug: 'old-slug' });
  const updated = await store.updateArticle(article.id, { updateSlug: true, slug: 'removed-slug' });
  const other = await store.createArticle({ ...input, status: 'published', slug: 'other-slug' });
  const draft = await store.createArticle({ ...input, status: 'draft', slug: 'draft-only' });

  for (const slug of ['old-slug', updated.slug, other.slug]) {
    const file = path.join(root, 'client/blog', slug, 'index.html');
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, '<p>Generated article page</p>');
  }

  const request = slug => fetch(origin + '/blog/' + slug, { redirect: 'manual' });
  assert.equal((await request(updated.slug + '/')).status, 200);
  const legacy = await request('old-slug/');
  assert.equal(legacy.status, 301);
  assert.equal(legacy.headers.get('location'), '/blog/removed-slug/');

  const deleted = await fetch(origin + '/api/admin/articles/' + article.id, {
    method: 'DELETE',
    headers: { cookie },
  });
  assert.equal(deleted.status, 200);
  assert.equal((await deleted.json()).ok, true);
  assert.equal(await store.getArticleById(article.id), null);
  assert.deepEqual(
    (await api('/api/articles')).data.articles.map(item => item.slug),
    [other.slug],
  );
  assert.equal((await api('/api/articles/' + updated.slug)).status, 404);
  assert.ok(!(await api('/api/admin/articles')).data.articles.some(item => item.id === article.id));

  for (const slug of ['old-slug/', 'removed-slug', 'removed-slug/']) {
    const redirect = await request(slug);
    assert.equal(redirect.status, 301);
    assert.equal(redirect.headers.get('location'), '/blog/');
  }
  assert.equal((await request('unknown-slug/')).status, 404);
  assert.equal((await request(other.slug + '/')).status, 200);
  assert.equal((await request(draft.slug + '/')).status, 404);
  await store.deleteArticle(draft.id);
  assert.equal((await request(draft.slug + '/')).status, 404);

  const reloaded = await import('../../server/articles/admin-articles.mjs?reload-deleted-slugs');
  assert.equal(await reloaded.isDeletedArticleSlug('old-slug'), true);
  assert.equal(await reloaded.isDeletedArticleSlug('removed-slug'), true);
  assert.equal(await reloaded.isDeletedArticleSlug('draft-only'), false);
  const replacement = await store.createArticle({
    ...input,
    status: 'draft',
    slug: 'removed-slug',
  });
  assert.equal(replacement.slug, 'removed-slug-2');
  assert.equal(
    (await store.updateArticle(replacement.id, { updateSlug: true, slug: 'old-slug' })).slug,
    'old-slug-2',
  );
});

test('catch-up after downtime preserves existing publication dates, legacy slugs and unrelated raw records', async () => {
  const article = await store.createArticle(input);
  const records = await stored();
  records[0].publishedAt = '2020-01-01T00:00:00.000Z';
  records[0].legacySlugs = ['old-url'];
  const untouched = {
    id: 'untouched',
    status: 'draft',
    title: 'Черновик',
    content: '<p style="color:red">Original bytes within record</p>',
    custom: { keep: true },
  };
  records.push(untouched);
  await fs.writeFile(path.join(root, 'data/articles.json'), JSON.stringify(records));
  await store.publishDueArticles(new Date('2099-05-03T00:00:00Z'));
  const updated = await stored();
  assert.deepEqual(updated[1], untouched);
  assert.equal(updated[0].publishedAt, '2020-01-01T00:00:00.000Z');
  assert.deepEqual(updated[0].legacySlugs, ['old-url']);
  assert.equal(updated[0].id, article.id);
});

test('cancel and reschedule survive reloading the store; stale completion cannot change a new schedule', async () => {
  const article = await store.createArticle(input);
  const changed = await store.updateArticle(article.id, {
    status: 'scheduled',
    scheduledAt: '2099-05-02T06:00:00Z',
  });
  assert.notEqual(changed.publicationSchedule.id, article.publicationSchedule.id);
  await store.settleScheduledPublication([
    { id: article.id, scheduleId: article.publicationSchedule.id },
  ]);
  assert.equal((await store.getArticleById(article.id)).publicationSchedule.state, 'scheduled');
  const cancelled = await store.updateArticle(article.id, { status: 'draft' });
  assert.equal(cancelled.publicationSchedule.state, 'cancelled');
  const reloaded = await import('../../server/articles/admin-articles.mjs?reload-scheduled-store');
  assert.equal((await reloaded.getArticleById(article.id)).status, 'draft');
  assert.deepEqual(await reloaded.publishDueArticles(new Date('2100-01-01')), []);
});

test('stale editor or manager requests cannot overwrite a timer transition', async () => {
  const article = await store.createArticle(input);
  await store.publishDueArticles(new Date(at));
  await assert.rejects(
    store.updateArticle(article.id, { status: 'draft', expectedUpdatedAt: article.updatedAt }),
    error => error.code === 'ARTICLE_CONFLICT',
  );
  const response = await api('/api/admin/article-schedules/' + article.id, {
    action: 'cancel',
    expectedUpdatedAt: article.updatedAt,
  });
  assert.equal(response.status, 409);
  assert.equal((await store.getArticleById(article.id)).status, 'published');
});

test('one timer pass batches due articles into one durable publication and confirms completion only after publisher success', async () => {
  const first = await store.createArticle(input);
  const second = await store.createArticle({ ...input, title: 'Вторая статья' });
  let calls = 0;
  const scheduler = createScheduler({
    now: () => new Date(at),
    publish: async reason => {
      calls++;
      return publication.queueBlogPublication(reason);
    },
  });
  await Promise.all([scheduler.tick(), scheduler.tick()]);
  assert.equal(calls, 1);
  await waitFor(
    async () => (await store.getArticleById(first.id)).publicationSchedule.state === 'success',
  );
  assert.equal((await store.getArticleById(second.id)).publicationSchedule.state, 'success');
  assert.equal(scheduler.getStatus().lastError, null);
});

test('publisher failure is visible per article and retry completes it; failed schedules do not auto-loop', async () => {
  const article = await store.createArticle(input);
  await fs.writeFile(path.join(root, 'failure'), '1');
  const scheduler = createScheduler({ now: () => new Date(at) });
  await scheduler.tick();
  await waitFor(
    async () => (await store.getArticleById(article.id)).publicationSchedule.state === 'error',
  );
  assert.equal(publication.getBlogPublicationStatus().status, 'error');
  await scheduler.tick();
  assert.equal(publication.getBlogPublicationStatus().status, 'error');
  await fs.rm(path.join(root, 'failure'));
  const current = await store.getArticleById(article.id);
  const retried = await api('/api/admin/article-schedules/' + article.id, {
    action: 'retry',
    expectedUpdatedAt: current.updatedAt,
  });
  assert.equal(retried.status, 200);
  await waitFor(
    async () => (await store.getArticleById(article.id)).publicationSchedule.state === 'success',
  );
});

test('interrupted article-to-publication handoff is recovered once and durable queue failure is visible', async () => {
  const article = await store.createArticle(input);
  await store.publishDueArticles(new Date(at));
  let calls = 0;
  const scheduler = createScheduler({
    now: () => new Date(at),
    getPublication: () => ({ status: 'idle' }),
    publish: async () => {
      calls++;
      throw new Error('disk unavailable');
    },
    logger: { error() {} },
  });
  await scheduler.tick();
  assert.equal(calls, 1);
  assert.equal((await store.getArticleById(article.id)).publicationSchedule.state, 'error');
  await scheduler.tick();
  assert.equal(calls, 1);
});

test('daily report status requires an administrator and never returns SMTP credentials', async () => {
  assert.equal((await api('/api/admin/daily-report', null, false)).status, 401);
  const result = await api('/api/admin/daily-report');
  assert.equal(result.status, 200);
  assert.equal(result.data.report.recipient, 'mail@pasport-bezopasnosty.ru');
  for (const key of ['SMTP_PASS', 'SMTP_USER', 'SMTP_HOST', 'password'])
    assert.ok(!Object.hasOwn(result.data.report, key));
});
