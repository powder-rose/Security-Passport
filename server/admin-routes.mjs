import fs from 'node:fs/promises';
import path from 'node:path';

import { getAdminLeadsPage } from './admin-leads.mjs';
import { listRegulations, saveRegulationBundle } from './admin-regulations.mjs';
import { deleteLeadFromFile } from './lead-storage.mjs';
import { getRegulationPublication, queueRegulationPublication } from './regulation-publisher.mjs';
import { getStatistics } from './statistics.mjs';

export function registerAdminRoutes({ app, adminAuth, projectRoot, leadsFile }) {
  app.post('/api/admin/login', adminAuth.login);

  app.post('/api/admin/logout', adminAuth.logout);

  app.get('/api/admin/session', adminAuth.requireAdmin, adminAuth.session);

  app.get('/api/admin/documentation', adminAuth.requireAdmin, async (_req, res) => {
    const documentationPath = path.resolve(projectRoot, 'README_DEV.md');

    try {
      const [markdown, stats] = await Promise.all([
        fs.readFile(documentationPath, 'utf8'),

        fs.stat(documentationPath),
      ]);

      res.set('Cache-Control', 'no-store');

      return res.json({
        ok: true,
        markdown,
        updatedAt: stats.mtime.toISOString(),
      });
    } catch (error) {
      if (error?.code === 'ENOENT') {
        return res.status(404).json({
          ok: false,
          error: 'README_DEV_NOT_FOUND',
        });
      }

      console.error('[admin] documentation read failed:', error?.message || error);

      return res.status(500).json({
        ok: false,
        error: 'DOCUMENTATION_READ_FAILED',
      });
    }
  });

  app.get('/api/admin/leads', adminAuth.requireAdmin, async (req, res) => {
    try {
      const result = await getAdminLeadsPage({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
      });

      return res.json({
        ok: true,
        ...result,
      });
    } catch (error) {
      console.error('[admin] leads failed:', error?.message || error);

      return res.status(500).json({
        ok: false,
        error: 'ADMIN_LEADS_READ_FAILED',
      });
    }
  });

  app.delete('/api/admin/leads/:id', adminAuth.requireAdmin, async (req, res) => {
    try {
      const result = await deleteLeadFromFile(leadsFile, req.params.id);

      if (!result.deleted && result.reason === 'INVALID_ID') {
        return res.status(400).json({
          ok: false,
          error: 'INVALID_LEAD_ID',
        });
      }

      if (!result.deleted) {
        return res.status(404).json({
          ok: false,
          error: 'LEAD_NOT_FOUND',
        });
      }

      return res.json({
        ok: true,
        deleted: true,
      });
    } catch (error) {
      console.error('[admin] lead delete failed:', error?.message || error);

      return res.status(500).json({
        ok: false,
        error: 'ADMIN_LEAD_DELETE_FAILED',
      });
    }
  });

  app.get('/api/admin/statistics', adminAuth.requireAdmin, async (_req, res) => {
    try {
      const statistics = await getStatistics();

      return res.json({
        ok: true,
        ...statistics,
      });
    } catch (error) {
      console.error('[admin] statistics failed:', error?.message || error);

      return res.status(500).json({
        ok: false,
        error: 'STATISTICS_READ_FAILED',
      });
    }
  });

  app.get('/api/admin/regulations', adminAuth.requireAdmin, async (_req, res) => {
    try {
      return res.json({
        ok: true,
        regulations: await listRegulations(),
      });
    } catch (error) {
      console.error('[admin] regulations read failed:', error);

      return res.status(500).json({
        ok: false,
        error: 'REGULATIONS_READ_FAILED',
      });
    }
  });

  app.post('/api/admin/regulations/save', adminAuth.requireAdmin, async (req, res) => {
    try {
      const result = await saveRegulationBundle(req.body);

      if (!result) {
        return res.status(404).json({
          ok: false,
          message: 'Документ не найден',
        });
      }

      return res.status(result.created ? 201 : 200).json({
        ok: true,
        regulation: result.regulation,
        changedClaims: result.changedClaims,
        publication: result.publicationNeeded ? queueRegulationPublication() : null,
      });
    } catch (error) {
      if (error instanceof TypeError) {
        return res.status(400).json({
          ok: false,
          message: error.message,
        });
      }

      console.error('[admin] regulation bundle save failed:', error);

      return res.status(500).json({
        ok: false,
        message: 'Ошибка сохранения постановления',
      });
    }
  });

  app.get('/api/admin/regulations/publication', adminAuth.requireAdmin, async (_req, res) => {
    try {
      return res.json({
        ok: true,
        publication: await getRegulationPublication(),
      });
    } catch (error) {
      console.error('[admin] publication status failed:', error);

      return res.status(500).json({
        ok: false,
        message: 'Ошибка получения статуса публикации',
      });
    }
  });

  app.post('/api/admin/regulations/publication', adminAuth.requireAdmin, (_req, res) => {
    return res.status(202).json({
      ok: true,
      publication: queueRegulationPublication(),
    });
  });
}
