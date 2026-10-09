import assert from 'node:assert/strict';
import test from 'node:test';

import { registerAdminRoutes } from '../../server/http/admin-routes.mjs';
import { registerArticleRoutes } from '../../server/http/article-routes.mjs';
import { registerPublicApiRoutes } from '../../server/http/public-api-routes.mjs';

function createRouteRegistry() {
  const routes = [];

  const app = {};

  for (const method of ['get', 'post', 'put', 'delete']) {
    app[method] = (routePath, ...handlers) => {
      routes.push({
        method: method.toUpperCase(),
        path: routePath,
        handlers,
      });

      return app;
    };
  }

  return {
    app,
    routes,
  };
}

function findRoute(routes, method, routePath) {
  return routes.find(
    route => route.method === method && JSON.stringify(route.path) === JSON.stringify(routePath),
  );
}

function assertRoute(routes, method, routePath) {
  const route = findRoute(routes, method, routePath);

  assert.ok(route, `Expected route ${method} ${JSON.stringify(routePath)} to be registered`);

  return route;
}

function createAdminAuth() {
  return {
    login() {},
    logout() {},
    session() {},
    requireAdmin() {},
  };
}

test('public API route contract preserves endpoints and middleware order', () => {
  const { app, routes } = createRouteRegistry();

  const leadIntake = {
    rateLimit() {},
    handleLead() {},
  };

  const visitTracking = {
    handleVisit() {},
  };

  registerPublicApiRoutes({
    app,
    environment: 'test',

    leadDelivery: {
      getTransportStatus() {
        return {};
      },
    },

    leadIntake,
    visitTracking,

    env: {
      BASE_DOMAIN: 'pasport-bezopasnosty.ru',
    },
  });

  assert.equal(routes.length, 4);

  const geo = assertRoute(routes, 'GET', '/api/geo');
  const health = assertRoute(routes, 'GET', '/api/health');
  const visits = assertRoute(routes, 'POST', '/api/visits');
  const leads = assertRoute(routes, 'POST', '/api/leads');

  assert.equal(geo.handlers.length, 1);
  assert.equal(health.handlers.length, 1);

  assert.deepEqual(visits.handlers, [visitTracking.handleVisit]);

  assert.deepEqual(leads.handlers, [leadIntake.rateLimit, leadIntake.handleLead]);
});

test('admin route contract protects every private endpoint', () => {
  const { app, routes } = createRouteRegistry();

  const adminAuth = createAdminAuth();

  registerAdminRoutes({
    app,
    adminAuth,
    projectRoot: '/tmp/passport-route-test',
    leadsFile: '/tmp/passport-route-test/leads.jsonl',
  });

  assert.equal(routes.length, 11);

  const login = assertRoute(routes, 'POST', '/api/admin/login');
  const logout = assertRoute(routes, 'POST', '/api/admin/logout');

  assert.deepEqual(login.handlers, [adminAuth.login]);

  assert.deepEqual(logout.handlers, [adminAuth.logout]);

  const protectedRoutes = [
    ['GET', '/api/admin/session'],
    ['GET', '/api/admin/documentation'],
    ['GET', '/api/admin/leads'],
    ['DELETE', '/api/admin/leads/:id'],
    ['GET', '/api/admin/statistics'],
    ['GET', '/api/admin/regulations'],
    ['POST', '/api/admin/regulations/save'],
    ['GET', '/api/admin/regulations/publication'],
    ['POST', '/api/admin/regulations/publication'],
  ];

  for (const [method, routePath] of protectedRoutes) {
    const route = assertRoute(routes, method, routePath);

    assert.equal(
      route.handlers[0],
      adminAuth.requireAdmin,
      `${method} ${routePath} must require admin authentication`,
    );

    assert.ok(
      route.handlers.length >= 2,
      `${method} ${routePath} must have a protected route handler`,
    );
  }

  const session = assertRoute(routes, 'GET', '/api/admin/session');

  assert.deepEqual(session.handlers, [adminAuth.requireAdmin, adminAuth.session]);
});

test('article route contract keeps public routes open and admin routes protected', () => {
  const { app, routes } = createRouteRegistry();

  const adminAuth = createAdminAuth();

  registerArticleRoutes({
    app,
    adminAuth,
    clientDir: '/tmp/passport-route-test/client',
  });

  assert.equal(routes.length, 10);

  const publicRoutes = [
    ['GET', ['/blog/:slug', '/blog/:slug/']],
    ['GET', '/api/articles'],
    ['GET', '/api/articles/:slug'],
  ];

  for (const [method, routePath] of publicRoutes) {
    const route = assertRoute(routes, method, routePath);

    assert.equal(route.handlers.length, 1);

    assert.notEqual(
      route.handlers[0],
      adminAuth.requireAdmin,
      `${method} ${JSON.stringify(routePath)} must remain public`,
    );
  }

  const protectedRoutes = [
    ['GET', '/api/admin/blog-publication'],
    ['GET', '/api/admin/articles'],
    ['POST', '/api/admin/articles'],
    ['GET', '/api/admin/articles/:id'],
    ['PUT', '/api/admin/articles/:id'],
    ['DELETE', '/api/admin/articles/:id'],
    ['POST', '/api/admin/upload/article-image'],
  ];

  for (const [method, routePath] of protectedRoutes) {
    const route = assertRoute(routes, method, routePath);

    assert.equal(
      route.handlers[0],
      adminAuth.requireAdmin,
      `${method} ${routePath} must require admin authentication`,
    );

    assert.ok(
      route.handlers.length >= 2,
      `${method} ${routePath} must have a protected route handler`,
    );
  }
});
