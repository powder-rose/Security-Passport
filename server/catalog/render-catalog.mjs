import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { CATALOG_PATH } from '../../shared/catalog/defaults.js';
import { withDirectoryBootstrap } from '../../shared/catalog/catalog.js';
import { createPrerenderDocument } from '../../shared/render/content-document.js';
import { resolveProjectRoot } from '../shared/project-root.mjs';

async function firstExisting(paths) {
  for (const file of paths) {
    try {
      await fs.access(file);
      return file;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  throw Object.assign(new Error('CATALOG_BUILD_REQUIRED'), { code: 'CATALOG_BUILD_REQUIRED' });
}

export function routeCssLinks(manifest, source) {
  const css = new Set();
  const visited = new Set();
  function visit(key) {
    if (visited.has(key)) return;
    visited.add(key);
    const entry = manifest[key];
    if (!entry) throw new Error(`Client manifest entry not found: ${key}`);
    for (const file of entry.css || []) css.add(file);
    for (const dependency of entry.imports || []) visit(dependency);
  }
  visit(source);
  return [...css].map(file => `<link rel="stylesheet" crossorigin href="/${file}">`).join('\n');
}

// Use the immutable SSR runtime of the running backend generation in production.
// Local development uses the most recent complete build in dist/.
export function createCatalogRenderer({ clientDir, projectRoot = resolveProjectRoot() }) {
  let resources;
  async function load() {
    const entry = await firstExisting([
      fileURLToPath(new URL('../../../server/entry-server.js', import.meta.url)),
      path.join(projectRoot, 'dist/server/entry-server.js'),
    ]);
    const rawTemplate = await firstExisting([
      fileURLToPath(new URL('../../../template/index.html', import.meta.url)),
      path.join(projectRoot, 'dist/template/index.html'),
    ]);
    const [{ render }, template, manifest] = await Promise.all([
      import(pathToFileURL(entry).href),
      fs.readFile(rawTemplate, 'utf8'),
      fs.readFile(path.join(clientDir, '.vite/manifest.json'), 'utf8').then(JSON.parse),
    ]);
    return {
      render,
      template,
      cssTags: routeCssLinks(
        manifest,
        'src/pages/RegulationsCatalogPage/RegulationsCatalogPage.jsx',
      ),
    };
  }
  return async data => {
    resources ??= load().catch(error => {
      resources = null;
      throw error;
    });
    const { render, template, cssTags } = await resources;
    return createPrerenderDocument({
      template: withDirectoryBootstrap(template, data.menuItems),
      result: render({ pathname: CATALOG_PATH, catalogData: data, directoryItems: data.menuItems }),
      cssTags,
      data,
      bootstrapKey: '__PASSPORT_CATALOG__',
    });
  };
}
