import fs from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = 'https://pasport-bezopasnosty.ru';

export function normalizeCommercialUrl(value) {
  if (typeof value !== 'string') return null;
  const source = value.trim();
  if (!source.startsWith('/') && !source.startsWith(`${ORIGIN}/`)) return null;
  let url;
  try {
    url = new URL(source, ORIGIN);
  } catch {
    return null;
  }
  if (url.origin !== ORIGIN || url.search || url.hash || url.username || url.password) return null;
  if (!/^\/pasport-bezopasnosti-[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(url.pathname)) return null;
  return url.pathname.replace(/\/?$/, '/');
}

// Check local published HTML rather than issuing network requests to CMS input.
export async function readPublishedCommercialPages(clientDir, cache = new Map()) {
  let directories;
  try {
    directories = await fs.readdir(clientDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const pages = await Promise.all(
    directories.map(async directory => {
      const url = normalizeCommercialUrl(`/${directory.name}/`);
      if (!directory.isDirectory() || !url) return null;
      const file = path.join(clientDir, directory.name, 'index.html');
      let html;
      let signature;
      try {
        const stat = await fs.stat(file);
        signature = `${stat.ino}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}`;
        if (cache.get(file)?.signature === signature) return cache.get(file).page;
        html = await fs.readFile(file, 'utf8');
      } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
      }
      const tags = html.match(/<(?:link|meta)\b[^>]*>/gi) || [];
      const canonical = tags.find(tag => /\brel=["']canonical["']/i.test(tag));
      const href = canonical?.match(/\bhref=["']([^"']+)["']/i)?.[1];
      const blocked =
        href !== `${ORIGIN}${url}` ||
        !/<h1\b/i.test(html) ||
        tags.some(
          tag => /\bname=["'](?:robots|googlebot)["']/i.test(tag) && /\bnoindex\b/i.test(tag),
        ) ||
        tags.some(tag => /http-equiv=["']refresh["']/i.test(tag));
      const page = blocked ? null : { url };
      cache.set(file, { signature, page });
      return page;
    }),
  );
  return pages.filter(Boolean).sort((a, b) => a.url.localeCompare(b.url));
}

export function createPublishedPagesReader(clientDir) {
  const cache = new Map();
  return () => readPublishedCommercialPages(clientDir, cache);
}
