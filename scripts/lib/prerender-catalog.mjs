import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';

import { createCatalogStore } from '../../server/catalog/catalog-store.mjs';
import { publicCatalog } from '../../shared/catalog/catalog.js';
import { CATALOG_PATH } from '../../shared/catalog/defaults.js';
import { pageModuleSources } from '../../src/config/pageRouteRegistry.js';

export async function readPrerenderCatalog({ projectRoot, publishedPaths, env = process.env }) {
  let serverEnv = {};
  try {
    serverEnv = dotenv.parse(
      await fs.readFile(path.resolve(projectRoot, env.SERVER_ENV_FILE || '.env.server')),
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const file = path.resolve(
    env.PASSPORT_PROJECT_ROOT || serverEnv.PASSPORT_PROJECT_ROOT || projectRoot,
    env.CATALOG_FILE || serverEnv.CATALOG_FILE || 'data/directions.json',
  );
  const state = await createCatalogStore({ file }).read();
  return publicCatalog(state, publishedPaths);
}

export async function prerenderCatalog({ render, createDocument, clientDir, data }) {
  const result = render({
    pathname: CATALOG_PATH,
    catalogData: data,
    directoryItems: data.menuItems,
  });
  const directory = path.join(clientDir, 'postanovleniya');
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(
    path.join(directory, 'index.html'),
    createDocument(result, data, pageModuleSources.catalog, '__PASSPORT_CATALOG__'),
  );
}
