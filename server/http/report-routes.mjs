import { getDailyReportStatus } from '../reports/report-status.mjs';
import { asyncRoute } from './async-route.mjs';

export function registerReportRoutes({ app, adminAuth }) {
  app.get(
    '/api/admin/daily-report',
    adminAuth.requireAdmin,
    asyncRoute(async (_req, res) => {
      return res.json({ ok: true, report: await getDailyReportStatus() });
    }),
  );
}
