import { CATALOG_CARDS, CATALOG_SETTINGS } from './defaults.js';

export function createCatalogState() {
  return structuredClone({
    version: 1,
    revision: 0,
    settings: CATALOG_SETTINGS,
    cards: CATALOG_CARDS,
  });
}

export function publicCatalog(state, publishedPaths) {
  const published = new Set(publishedPaths);
  const available = state.cards.filter(card => published.has(card.url));
  return {
    settings: state.settings,
    cards: available.filter(card => card.showInCatalog).sort((a, b) => a.order - b.order),
    menuItems: available
      .filter(card => card.showInMenu)
      .sort((a, b) => a.menuOrder - b.menuOrder)
      .map(({ url, title }) => ({ path: url, title })),
  };
}

export function serializeBootstrap(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function withDirectoryBootstrap(template, items) {
  return template
    .replace(/<script id="passport-directory-data">[\s\S]*?<\/script>\s*/g, '')
    .replace(
      '</body>',
      `<script id="passport-directory-data">window.__PASSPORT_DIRECTORY__=${serializeBootstrap(items)};</script>\n</body>`,
    );
}
