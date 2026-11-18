import {
  getScheduledArticles,
  updateArticle,
  settleScheduledPublication,
} from '../articles/admin-articles.mjs';
import { articleScheduler } from '../articles/article-scheduler.mjs';
import { getBlogPublicationStatus, queueBlogPublication } from '../articles/blog-publication.mjs';
import { asyncRoute } from './async-route.mjs';

const inputErrors = new Set([
  'ARTICLE_INPUT_INVALID',
  'ARTICLE_SEO_REQUIRED',
  'ARTICLE_SCHEDULE_INVALID',
  'ARTICLE_SCHEDULE_PAST',
]);

export function registerArticleScheduleRoutes({ app, adminAuth }) {
  app.get(
    '/api/admin/article-schedules',
    adminAuth.requireAdmin,
    asyncRoute(async (_req, res) => {
      return res.json({
        ok: true,
        schedules: await getScheduledArticles(),
        publication: getBlogPublicationStatus(),
        scheduler: articleScheduler.getStatus(),
        serverNow: new Date().toISOString(),
      });
    }),
  );
  app.post(
    '/api/admin/article-schedules/:id',
    adminAuth.requireAdmin,
    asyncRoute(async (req, res) => {
      const { action, scheduledAt, expectedUpdatedAt } = req.body || {};
      if (
        !['schedule', 'cancel', 'publish', 'retry'].includes(action) ||
        typeof expectedUpdatedAt !== 'string'
      )
        return res.status(400).json({ ok: false, error: 'ARTICLE_INPUT_INVALID' });
      const schedules = await getScheduledArticles();
      const current = schedules.find(article => article.id === req.params.id);
      if (!current) return res.status(404).json({ ok: false, error: 'ARTICLE_NOT_FOUND' });
      if (
        current.updatedAt !== expectedUpdatedAt ||
        (action === 'retry' ? current.schedule.state !== 'error' : current.status !== 'scheduled')
      )
        return res.status(409).json({ ok: false, error: 'ARTICLE_CONFLICT' });
      try {
        const article = await updateArticle(current.id, {
          status: action === 'cancel' ? 'draft' : action === 'schedule' ? 'scheduled' : 'published',
          ...(action === 'schedule' ? { scheduledAt } : {}),
          expectedUpdatedAt,
        });
        let publication = getBlogPublicationStatus();
        // Future schedules and cancellation never need to run the publisher.
        if (action === 'publish' || action === 'retry') {
          try {
            publication = await queueBlogPublication('article-schedule-' + action);
          } catch (error) {
            await settleScheduledPublication(
              [{ id: article.id, scheduleId: article.publicationSchedule.id }],
              error,
            );
            throw error;
          }
        }
        return res.json({ ok: true, article, publication });
      } catch (error) {
        if (inputErrors.has(error?.code) || error?.code === 'ARTICLE_CONFLICT')
          return res
            .status(error.code === 'ARTICLE_CONFLICT' ? 409 : 400)
            .json({ ok: false, error: error.code });
        throw error;
      }
    }),
  );
}
