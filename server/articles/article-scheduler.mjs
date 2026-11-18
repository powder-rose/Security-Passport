import {
  publishDueArticles,
  getScheduledArticles,
  prepareScheduledPublication,
  settleScheduledPublication,
} from './admin-articles.mjs';
import {
  queueBlogPublication,
  getBlogPublicationStatus,
  observeBlogPublication,
} from './blog-publication.mjs';

export const ARTICLE_SCHEDULER_INTERVAL_MS = 15_000;

export function createArticleScheduler({
  publishDue = publishDueArticles,
  readSchedules = getScheduledArticles,
  publish = queueBlogPublication,
  getPublication = getBlogPublicationStatus,
  observe = observeBlogPublication,
  prepare = prepareScheduledPublication,
  settle = settleScheduledPublication,
  now = () => new Date(),
  logger = console,
} = {}) {
  let running = false;
  let timer = null;
  let unsubscribe = null;
  let lastCheckedAt = null;
  let lastError = null;
  async function tick() {
    if (running) return;
    running = true;
    try {
      const due = await publishDue(now());
      const schedules = await readSchedules();
      const waiting = schedules.filter(
        article => article.status === 'published' && article.schedule.state === 'publishing',
      );
      const publication = getPublication();
      // Repairs the durable article/queue boundary after an interrupted process.
      if (
        due.length ||
        (waiting.length &&
          !publication.running &&
          !publication.pending &&
          !['queued', 'running', 'error'].includes(publication.status))
      ) {
        try {
          await publish('articles-scheduled');
        } catch (error) {
          await settle(
            waiting.map(article => ({ id: article.id, scheduleId: article.schedule.id })),
            error,
          );
          throw error;
        }
      } else if (
        waiting.length &&
        publication.status === 'error' &&
        !publication.running &&
        !publication.pending
      ) {
        await settle(
          waiting.map(article => ({ id: article.id, scheduleId: article.schedule.id })),
          new Error('Publication failed'),
        );
      }
      lastError = null;
    } catch (error) {
      lastError = 'Не удалось проверить расписание. Сервер повторит проверку автоматически.';
      logger.error('[article-scheduler] check failed:', error);
    } finally {
      lastCheckedAt = now().toISOString();
      running = false;
    }
  }
  function start() {
    if (timer) return;
    unsubscribe = observe({ prepare, settle });
    timer = setInterval(() => {
      void tick();
    }, ARTICLE_SCHEDULER_INTERVAL_MS);
    timer.unref?.();
    void tick();
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    unsubscribe?.();
    unsubscribe = null;
  }
  return {
    start,
    stop,
    tick,
    getStatus: () => ({
      enabled: Boolean(timer),
      running,
      lastCheckedAt,
      lastError,
      intervalMs: ARTICLE_SCHEDULER_INTERVAL_MS,
      timeZone: 'Europe/Moscow',
    }),
  };
}

export const articleScheduler = createArticleScheduler();
