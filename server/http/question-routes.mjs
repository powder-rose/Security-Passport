import fs from 'node:fs/promises';
import path from 'node:path';

import { questionCatalog, questionPath, questionCard } from '../../shared/contracts/questions.js';
import { getArticles } from '../articles/admin-articles.mjs';
import {
  queueBlogPublication,
  getBlogPublicationStatus,
  retryBlogPublication,
} from '../articles/blog-publication.mjs';
import { questionStore } from '../questions/question-store.mjs';
import { questionPageData } from '../questions/question-public.mjs';
import { asyncRoute } from './async-route.mjs';

export function registerQuestionRoutes({
  app,
  adminAuth,
  clientDir,
  store = questionStore,
  publish = queueBlogPublication,
  readArticles = getArticles,
}) {
  const route = handler =>
    asyncRoute(async (req, res) => {
      try {
        return await handler(req, res);
      } catch (error) {
        if (error.code?.startsWith('QUESTION_') || error.code === 'BLOG_PUBLICATION_BUSY') {
          return res
            .status(error.status || (error.code === 'BLOG_PUBLICATION_BUSY' ? 409 : 400))
            .json({ ok: false, error: error.code, message: error.message });
        }
        throw error;
      }
    });
  const privateRoute = handler => [
    adminAuth.requireAdmin,
    route(async (req, res) => {
      res.set('Cache-Control', 'private, no-store');
      res.set('X-Robots-Tag', 'noindex, nofollow');
      return handler(req, res);
    }),
  ];

  app.get(
    '/api/questions',
    route(async (req, res) => {
      res.set('X-Robots-Tag', 'noindex, nofollow');
      return res.json({ ok: true, ...questionCatalog(await store.read(), req.query) });
    }),
  );

  app.get(
    '/api/questions/:slug',
    route(async (req, res) => {
      res.set('X-Robots-Tag', 'noindex, nofollow');
      const state = await store.read();
      const record = state.records.find(item => item.live?.slug === req.params.slug);
      if (!record) return res.status(404).json({ ok: false, error: 'QUESTION_NOT_FOUND' });
      return res.json({ ok: true, ...questionPageData(state, record.live, await readArticles()) });
    }),
  );

  app.get(
    ['/questions', '/questions/*'],
    route(async (req, res) => {
      const match = req.path.match(/^\/questions(?:\/([a-z0-9-]+))?\/?$/);
      if (!match) return res.status(404).type('text').send('Question not found');
      const slug = match[1];
      const state = await store.read();
      let record;
      if (slug) {
        record = state.records.find(
          item => item.live && (item.live.slug === slug || item.aliases.includes(slug)),
        );
        if (!record) return res.status(404).type('text').send('Question not found');
        if (record.live.slug !== slug)
          return res.redirect(
            301,
            questionPath(record.live.slug) +
              (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''),
          );
      }
      const canonicalPath = slug ? questionPath(slug) : '/questions/';
      if (req.path !== canonicalPath)
        return res.redirect(
          301,
          canonicalPath + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''),
        );
      res.set('Cache-Control', 'no-cache');
      if (Object.keys(req.query).length || record?.live.indexable === false)
        res.set('X-Robots-Tag', 'noindex, follow');
      try {
        const html = await fs.readFile(
          path.join(clientDir, 'questions', ...(slug ? [slug] : []), 'index.html'),
          'utf8',
        );
        return res.type('html').send(html);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        return res
          .status(503)
          .set('Retry-After', '60')
          .type('text')
          .send('Question page is being published.');
      }
    }),
  );

  app.get(
    '/api/admin/questions',
    ...privateRoute(async (_req, res) => {
      const state = await store.read();
      return res.json({
        ok: true,
        ...state,
        records: state.records.map(
          ({ id, revision, status, updatedAt, scheduledAt, scheduleError, draft, live }) => ({
            id,
            revision,
            status,
            updatedAt,
            scheduledAt,
            scheduleError,
            draft: {
              title: draft.title,
              slug: draft.slug,
              category: draft.category,
              authorId: draft.authorId,
              seoReview: draft.seoReview,
              normativeReview: draft.normativeReview,
            },
            live: live ? { id: live.id, slug: live.slug, title: live.title } : null,
          }),
        ),
        publication: getBlogPublicationStatus(),
      });
    }),
  );
  app.get(
    '/api/admin/questions/catalog',
    ...privateRoute(async (_req, res) => {
      const state = await store.read();
      const articles = (await readArticles())
        .filter(article => article.status === 'published')
        .map(({ id, title, slug, seoTitle }) => ({ id, title, slug, seoTitle }));
      return res.json({
        ok: true,
        settings: state.settings,
        categories: state.categories,
        authors: state.authors,
        articles,
        questions: state.records.flatMap(record =>
          record.live ? [questionCard(record.live)] : [],
        ),
      });
    }),
  );
  app.post(
    '/api/admin/questions',
    ...privateRoute(async (req, res) => {
      return res.status(201).json({ ok: true, record: await store.create(req.body) });
    }),
  );
  app.get(
    '/api/admin/questions/publication',
    ...privateRoute(async (_req, res) => {
      return res.json({ ok: true, publication: getBlogPublicationStatus() });
    }),
  );
  app.post(
    '/api/admin/questions/publication',
    ...privateRoute(async (_req, res) => {
      return res.status(202).json({ ok: true, publication: await retryBlogPublication() });
    }),
  );
  app.put(
    '/api/admin/questions/settings',
    ...privateRoute(async (req, res) => {
      const state = await store.updateSettings(req.body);
      const publication = await publish('questions-settings');
      return res.json({
        ok: true,
        settings: state.settings,
        categories: state.categories,
        authors: state.authors,
        publication,
      });
    }),
  );
  app.get(
    '/api/admin/questions/:id',
    ...privateRoute(async (req, res) => {
      return res.json({ ok: true, ...(await store.inspect(req.params.id)) });
    }),
  );
  app.get(
    '/api/admin/questions/:id/preview',
    ...privateRoute(async (req, res) => {
      const state = await store.read();
      const { record } = await store.inspect(req.params.id);
      const question = {
        ...record.draft,
        id: record.id,
        publishedAt: record.live?.publishedAt || null,
        modifiedAt: record.live?.modifiedAt || null,
        author: state.authors.find(author => author.id === record.draft.authorId),
      };
      return res.json({
        ok: true,
        ...questionPageData(state, question, await readArticles()),
        preview: true,
      });
    }),
  );
  app.put(
    '/api/admin/questions/:id',
    ...privateRoute(async (req, res) => {
      const { revision, autosave, ...input } = req.body || {};
      const record = await store.update(req.params.id, input, { revision, autosave });
      return res.json({ ok: true, record });
    }),
  );
  app.post(
    '/api/admin/questions/:id/actions',
    ...privateRoute(async (req, res) => {
      const record = await store.action(req.params.id, req.body || {});
      const affectsPublic = ['publish', 'archive'].includes(req.body?.action);
      const publication = affectsPublic ? await publish('question-' + req.body.action) : null;
      return res.json({ ok: true, record, publication });
    }),
  );
}

export function startQuestionScheduler({
  store = questionStore,
  publish = queueBlogPublication,
} = {}) {
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const published = await store.publishDue();
      if (published.length) await publish('questions-scheduled');
    } catch (error) {
      console.error('[questions] scheduled publication failed:', error);
    } finally {
      running = false;
    }
  };
  const timer = setInterval(tick, 60_000);
  timer.unref();
  void tick();
  return () => clearInterval(timer);
}
