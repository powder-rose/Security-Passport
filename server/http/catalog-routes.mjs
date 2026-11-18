import { CATALOG_PATH } from '../../shared/catalog/defaults.js';
import { publicCatalog } from '../../shared/catalog/catalog.js';
import { catalogStore } from '../catalog/catalog-store.mjs';
import { createPublishedPagesReader } from '../catalog/published-pages.mjs';
import { createCatalogRenderer } from '../catalog/render-catalog.mjs';
import { asyncRoute } from './async-route.mjs';

export function registerCatalogRoutes({
  app,
  adminAuth,
  clientDir,
  store = catalogStore,
  readPages = createPublishedPagesReader(clientDir),
  renderPage = createCatalogRenderer({ clientDir }),
}) {
  const route = handler =>
    asyncRoute(async (req, res) => {
      try {
        return await handler(req, res);
      } catch (error) {
        if (error.code?.startsWith('CATALOG_')) {
          const status = error.code === 'CATALOG_BUILD_REQUIRED' ? 503 : error.status || 400;
          return res.status(status).json({ ok: false, error: error.code, message: error.message });
        }
        throw error;
      }
    });
  async function readPublic() {
    const [state, pages] = await Promise.all([store.read(), readPages()]);
    return publicCatalog(
      state,
      pages.map(page => page.url),
    );
  }
  app.get(
    '/api/directions/menu',
    route(async (_req, res) => {
      res.set('Cache-Control', 'no-store');
      res.set('X-Robots-Tag', 'noindex, nofollow');
      return res.json({ ok: true, menuItems: (await readPublic()).menuItems });
    }),
  );
  app.get(
    '/api/directions',
    route(async (_req, res) => {
      res.set('Cache-Control', 'no-store');
      res.set('X-Robots-Tag', 'noindex, nofollow');
      return res.json({ ok: true, ...(await readPublic()) });
    }),
  );
  app.get(
    /^\/postanovleniya\/?$/,
    route(async (req, res) => {
      if (req.path !== CATALOG_PATH)
        return res.redirect(
          301,
          CATALOG_PATH + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''),
        );
      res.set('Cache-Control', 'no-store');
      if (Object.keys(req.query).length) res.set('X-Robots-Tag', 'noindex, follow');
      return res.type('html').send(await renderPage(await readPublic()));
    }),
  );
  for (const method of ['get', 'put']) {
    app[method](
      '/api/admin/directions',
      adminAuth.requireAdmin,
      route(async (req, res) => {
        res.set('Cache-Control', 'private, no-store');
        res.set('X-Robots-Tag', 'noindex, nofollow');
        const pages = await readPages();
        const state =
          method === 'get'
            ? await store.read()
            : await store.update(
                req.body,
                pages.map(page => page.url),
              );
        return res.json({ ok: true, ...state, pages });
      }),
    );
  }
}
