import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = path.join(projectRoot, 'dist', 'client');
const templatePath = path.join(clientDir, 'index.html');
const serverEntry = path.join(projectRoot, 'dist', 'server', 'entry-server.js');

const { render } = await import(pathToFileURL(serverEntry).href);
const { html, helmet } = render();
let template = await readFile(templatePath, 'utf8');

// Remove fallback tags from index.html before inserting Helmet's final SEO tags.
template = template
  .replace(/<title>[\s\S]*?<\/title>/i, '')
  .replace(/<meta\s+name=["']robots["'][^>]*>/i, '')
  .replace(/<meta\s+name=["']description["'][^>]*>/i, '');

const headTags = [
  helmet?.title?.toString() || '',
  helmet?.meta?.toString() || '',
  helmet?.link?.toString() || '',
  helmet?.script?.toString() || '',
].join('\n');

template = template
  .replace('</head>', `${headTags}\n</head>`)
  .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

await writeFile(templatePath, template, 'utf8');

const canonicalMatch = headTags.match(/rel="canonical" href="([^"]+)"/i);
const canonical = canonicalMatch?.[1]?.replace(/\/$/, '');

if (canonical) {
  await writeFile(
    path.join(clientDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${canonical}/sitemap.xml\n`,
    'utf8',
  );

  await writeFile(
    path.join(clientDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${canonical}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
    'utf8',
  );
}

console.log('Prerender complete:', templatePath);
