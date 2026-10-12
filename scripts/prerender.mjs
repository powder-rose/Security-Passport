import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

import { fileURLToPath, pathToFileURL } from 'node:url';

import path from 'node:path';

import { objectTypes } from '../src/data/objectTypes.js';

import { servicePages } from '../src/data/servicePages.js';

import {
  pageModuleSources,
  getObjectPageSource,
  getServicePageSource,
} from '../src/config/pageRouteRegistry.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const resolveEnvPath = (name, fallback) => {
  const value = process.env[name]?.trim();

  return value ? path.resolve(value) : fallback;
};

const clientDir = resolveEnvPath('PRERENDER_CLIENT_DIR', path.join(projectRoot, 'dist', 'client'));

const templatePath = resolveEnvPath('PRERENDER_TEMPLATE_PATH', path.join(clientDir, 'index.html'));

const serverEntry = resolveEnvPath(
  'PRERENDER_SERVER_ENTRY',
  path.join(projectRoot, 'dist', 'server', 'entry-server.js'),
);

const { render } = await import(pathToFileURL(serverEntry).href);

const { html, helmet } = render();

let template = await readFile(templatePath, 'utf8');

/*
 * npm run prerender может запускаться повторно
 * после полноценной сборки — например, когда
 * редактор публикует новую статью.
 *
 * В таком случае dist/client/index.html уже
 * содержит SSR-разметку, поэтому используем
 * сохранённый сырой Vite-шаблон.
 */
if (!template.includes('<div id="root"></div>')) {
  const savedRawTemplate = path.join(projectRoot, 'dist', 'template', 'index.html');

  try {
    template = await readFile(savedRawTemplate, 'utf8');
  } catch {
    // Финальная проверка ниже
    // выдаст понятную ошибку.
  }
}

if (!template.includes('<div id="root"></div>')) {
  throw new Error('Raw Vite template is missing empty root');
}

const generatorTemplateDir = resolveEnvPath(
  'PRERENDER_TEMPLATE_DIR',
  path.join(projectRoot, 'dist', 'template'),
);

const generatorTemplatePath = path.join(generatorTemplateDir, 'index.html');

await mkdir(generatorTemplateDir, {
  recursive: true,
});

await writeFile(generatorTemplatePath, template, 'utf8');

const clientManifestPath = path.join(clientDir, '.vite', 'manifest.json');

const clientManifest = JSON.parse(await readFile(clientManifestPath, 'utf8'));

function getClientCssLinks(sourceFile) {
  const manifestEntry = clientManifest[sourceFile];

  if (!manifestEntry) {
    throw new Error(`Client manifest entry not found: ${sourceFile}`);
  }

  const cssFiles = manifestEntry.css || [];

  if (cssFiles.length === 0) {
    throw new Error(`Client CSS not found in manifest: ${sourceFile}`);
  }

  return cssFiles
    .map(cssFile => `<link rel="stylesheet" crossorigin href="/${cssFile}">`)
    .join('\n');
}

function getClientCssFilesFromManifestGraph(sourceFile) {
  const visitedEntries = new Set();

  const cssFiles = new Set();

  function visit(entryKey) {
    if (visitedEntries.has(entryKey)) {
      return;
    }

    visitedEntries.add(entryKey);

    const manifestEntry = clientManifest[entryKey];

    if (!manifestEntry) {
      throw new Error(`Client manifest entry not found: ${entryKey}`);
    }

    for (const cssFile of manifestEntry.css || []) {
      cssFiles.add(cssFile);
    }

    for (const importedEntry of manifestEntry.imports || []) {
      visit(importedEntry);
    }
  }

  visit(sourceFile);

  if (cssFiles.size === 0) {
    throw new Error(`Client CSS not found in manifest graph: ${sourceFile}`);
  }

  return [...cssFiles];
}

function getLinkedClientStylesheets(htmlDocument) {
  const linkedCssFiles = new Set();

  const linkTags = String(htmlDocument).match(/<link\b[^>]*>/gi) || [];

  for (const linkTag of linkTags) {
    if (!/\brel=["']stylesheet["']/i.test(linkTag)) {
      continue;
    }

    const hrefMatch = linkTag.match(/\bhref=["']\/([^"'?#]+\.css)(?:[?#][^"']*)?["']/i);

    if (hrefMatch?.[1]) {
      linkedCssFiles.add(hrefMatch[1]);
    }
  }

  return linkedCssFiles;
}

function getClientRouteCssLinks(sourceFile, htmlDocument) {
  const linkedCssFiles = getLinkedClientStylesheets(htmlDocument);

  return getClientCssFilesFromManifestGraph(sourceFile)
    .filter(cssFile => !linkedCssFiles.has(cssFile))
    .map(cssFile => `<link rel="stylesheet" crossorigin href="/${cssFile}">`)
    .join('\n');
}

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

    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <url>\n` +
      `    <loc>${canonical}</loc>\n` +
      `    <changefreq>monthly</changefreq>\n` +
      `    <priority>1.0</priority>\n` +
      `  </url>\n` +
      `</urlset>\n`,

    'utf8',
  );
}

if (canonical) {
  const googleUrls = [canonical];

  const uniqueGoogleUrls = [...new Set(googleUrls)];

  await writeFile(
    path.join(clientDir, 'sitemap-google.xml'),

    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      uniqueGoogleUrls.map(url => `  <url>\n` + `    <loc>${url}</loc>\n` + `  </url>\n`).join('') +
      `</urlset>\n`,

    'utf8',
  );

  console.log('Google sitemap URLs:', uniqueGoogleUrls.length);
}

// ----------------------------------------------------------
// Federal legal pages.
// They are intentionally noindex,follow and therefore
// are not added to sitemap.xml.
// ----------------------------------------------------------

const legalSlugs = ['oferta', 'personal-data', 'privacy'];

const legalBaseTemplate = await readFile(generatorTemplatePath, 'utf8');

for (const legalSlug of legalSlugs) {
  const legalResult = render({
    pathname: `/${legalSlug}/`,
  });

  let legalTemplate = legalBaseTemplate
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']robots["'][^>]*>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/i, '');

  const legalRouteCssTags = getClientCssLinks(pageModuleSources.legal);

  const legalHeadTags = [
    legalResult.helmet?.title?.toString() || '',
    legalResult.helmet?.meta?.toString() || '',
    legalResult.helmet?.link?.toString() || '',
    legalResult.helmet?.script?.toString() || '',
    legalRouteCssTags,
  ]
    .filter(Boolean)
    .join('\n');

  legalTemplate = legalTemplate
    .replace('</head>', `${legalHeadTags}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${legalResult.html}</div>`);

  const legalDir = path.join(clientDir, legalSlug);

  await mkdir(legalDir, {
    recursive: true,
  });

  await writeFile(path.join(legalDir, 'index.html'), legalTemplate, 'utf8');

  console.log('Legal prerender:', `/${legalSlug}/`);
}

console.log('Prerender complete:', templatePath);

// === FEDERAL OBJECT TYPE PRERENDER ===

if (canonical) {
  const objectTypeBaseTemplate = await readFile(generatorTemplatePath, 'utf8');

  /*
   * Published blog articles.
   *
   * Они используются для:
   * - SSR /blog/
   * - SSR /blog/:slug/
   * - sitemap.xml
   */
  const articlesFile = path.join(projectRoot, 'data', 'articles.json');

  let publishedArticles = [];

  try {
    const articlesSource = JSON.parse(await readFile(articlesFile, 'utf8'));

    if (Array.isArray(articlesSource)) {
      publishedArticles = articlesSource
        .filter(article => article?.status === 'published' && article?.slug)
        .sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt || 0) -
            new Date(a.publishedAt || a.createdAt || 0),
        );
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }

  function createBlogDocument(renderResult, blogData, routeCssSource) {
    let document = objectTypeBaseTemplate
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta\s+name=["']robots["'][^>]*>/i, '')
      .replace(/<meta\s+name=["']description["'][^>]*>/i, '');

    const routeCssTags = getClientRouteCssLinks(routeCssSource, document);

    const resultHeadTags = [
      renderResult.helmet?.title?.toString() || '',
      renderResult.helmet?.meta?.toString() || '',
      renderResult.helmet?.link?.toString() || '',
      routeCssTags,
      renderResult.helmet?.script?.toString() || '',
    ]
      .filter(Boolean)
      .join('\n');

    const serializedBlogData = JSON.stringify(blogData)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

    const resultBootstrap =
      `<script>` + `window.__PASSPORT_BLOG__=` + `${serializedBlogData};` + `</script>`;

    document = document
      .replace('</head>', `${resultHeadTags}\n` + `${resultBootstrap}\n` + `</head>`)
      .replace('<div id="root"></div>', `<div id="root">` + `${renderResult.html}` + `</div>`);

    return document;
  }

  for (const objectType of objectTypes) {
    const objectResult = render({
      pathname: objectType.path,
    });

    let objectDocument = objectTypeBaseTemplate
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta\s+name=["']robots["'][^>]*>/i, '')
      .replace(/<meta\s+name=["']description["'][^>]*>/i, '');

    const objectRouteCssSource = getObjectPageSource(objectType.id);

    const objectRouteCssTags = getClientCssLinks(objectRouteCssSource);

    const objectHeadTags = [
      objectResult.helmet?.title?.toString() || '',
      objectResult.helmet?.meta?.toString() || '',
      objectResult.helmet?.link?.toString() || '',
      objectResult.helmet?.script?.toString() || '',
      objectRouteCssTags,
    ]
      .filter(Boolean)
      .join('\n');

    objectDocument = objectDocument
      .replace('</head>', `${objectHeadTags}\n` + `</head>`)
      .replace('<div id="root"></div>', `<div id="root">` + `${objectResult.html}` + `</div>`);

    const objectSlug = objectType.path.replace(/^\/+|\/+$/g, '');

    const objectOutputDirectory = path.join(clientDir, objectSlug);

    await mkdir(objectOutputDirectory, {
      recursive: true,
    });

    const objectOutputFile = path.join(objectOutputDirectory, 'index.html');

    await writeFile(objectOutputFile, objectDocument, 'utf8');

    const expectedObjectCanonical = `${canonical}${objectType.path}`;

    if (!objectDocument.includes(`rel="canonical" href="${expectedObjectCanonical}"`)) {
      throw new Error(`Object prerender canonical mismatch: ` + `${objectType.path}`);
    }

    if (
      !objectDocument.includes(
        'name="robots" content="index,follow,' +
          'max-image-preview:large,' +
          'max-snippet:-1,' +
          'max-video-preview:-1"',
      )
    ) {
      throw new Error(`Object prerender robots mismatch: ` + `${objectType.path}`);
    }

    if (!objectDocument.includes(objectType.h1)) {
      throw new Error(`Object prerender H1 mismatch: ` + `${objectType.path}`);
    }

    console.log(`Object prerender: ${objectType.path}`);
  }

  // === FEDERAL SERVICE PAGE PRERENDER ===

  for (const servicePage of servicePages) {
    const serviceResult = render({
      pathname: servicePage.path,
    });

    let serviceDocument = objectTypeBaseTemplate
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta\s+name=["']robots["'][^>]*>/i, '')
      .replace(/<meta\s+name=["']description["'][^>]*>/i, '');

    const serviceRouteCssSource = getServicePageSource(servicePage.id);

    if (!serviceRouteCssSource) {
      throw new Error(`Client CSS route source not found: ${servicePage.id}`);
    }

    const serviceRouteCssTags = getClientCssLinks(serviceRouteCssSource);

    const serviceHeadTags = [
      serviceResult.helmet?.title?.toString() || '',
      serviceResult.helmet?.meta?.toString() || '',
      serviceResult.helmet?.link?.toString() || '',
      serviceResult.helmet?.script?.toString() || '',
      serviceRouteCssTags,
    ]
      .filter(Boolean)
      .join('\n');

    serviceDocument = serviceDocument
      .replace('</head>', `${serviceHeadTags}\n` + `</head>`)
      .replace('<div id="root"></div>', `<div id="root">` + `${serviceResult.html}` + `</div>`);

    const serviceSlug = servicePage.path.replace(/^\/+|\/+$/g, '');

    const serviceOutputDirectory = path.join(clientDir, serviceSlug);

    await mkdir(serviceOutputDirectory, {
      recursive: true,
    });

    const serviceOutputFile = path.join(serviceOutputDirectory, 'index.html');

    await writeFile(serviceOutputFile, serviceDocument, 'utf8');

    const expectedServiceCanonical = `${canonical}${servicePage.path}`;

    if (!serviceDocument.includes(`rel="canonical" href="${expectedServiceCanonical}"`)) {
      throw new Error(`Service prerender canonical mismatch: ` + `${servicePage.path}`);
    }

    if (
      !serviceDocument.includes(
        'name="robots" content="index,follow,' +
          'max-image-preview:large,' +
          'max-snippet:-1,' +
          'max-video-preview:-1"',
      )
    ) {
      throw new Error(`Service prerender robots mismatch: ` + `${servicePage.path}`);
    }

    if (!serviceDocument.includes(servicePage.h1)) {
      throw new Error(`Service prerender H1 mismatch: ` + `${servicePage.path}`);
    }

    console.log(`Service prerender: ${servicePage.path}`);
  }

  // === /FEDERAL SERVICE PAGE PRERENDER ===

  // ========================================================
  // BLOG PRERENDER
  // ========================================================

  const blogResult = render({
    pathname: '/blog/',

    blogArticles: publishedArticles,

    article: null,
  });

  const blogDocument = createBlogDocument(
    blogResult,

    {
      articles: publishedArticles,

      article: null,
    },

    pageModuleSources.blog,
  );

  const blogOutputDirectory = path.join(clientDir, 'blog');

  /*
   * /blog полностью принадлежит prerender.
   *
   * Клиентская директория может быть скопирована
   * из предыдущего release, поэтому перед генерацией
   * удаляем старое blog-дерево целиком.
   *
   * Это гарантирует, что снятые с публикации статьи
   * и старые slug не переживут следующую публикацию.
   */
  await rm(blogOutputDirectory, {
    recursive: true,
    force: true,
  });

  await mkdir(blogOutputDirectory, {
    recursive: true,
  });

  await writeFile(path.join(blogOutputDirectory, 'index.html'), blogDocument, 'utf8');

  console.log('Blog prerender: /blog/');

  for (const article of publishedArticles) {
    const articlePathname = `/blog/${article.slug}/`;

    const articleResult = render({
      pathname: articlePathname,

      blogArticles: publishedArticles,

      article,
    });

    const articleDocument = createBlogDocument(
      articleResult,

      {
        articles: publishedArticles,

        article,
      },

      pageModuleSources.article,
    );

    const articleOutputDirectory = path.join(clientDir, 'blog', article.slug);

    await mkdir(articleOutputDirectory, {
      recursive: true,
    });

    await writeFile(path.join(articleOutputDirectory, 'index.html'), articleDocument, 'utf8');

    console.log(`Article prerender: ${articlePathname}`);
  }

  console.log('Published articles:', publishedArticles.length);

  // ========================================================
  // /BLOG PRERENDER
  // ========================================================

  // Перезаписываем федеральный sitemap:
  // главная + индексируемые дочерние SEO-страницы.
  function getArticleLastmod(article) {
    const timestamps = [article.publishedAt, article.updatedAt]
      .filter(value => typeof value === 'string')
      .map(value => Date.parse(value))
      .filter(value => Number.isFinite(value) && value <= Date.now());

    return timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : null;
  }

  const federalObjectSitemapUrls = [
    {
      loc: canonical,
      priority: '1.0',
    },

    ...objectTypes.map(objectType => ({
      loc: `${canonical}${objectType.path}`,

      priority: '0.9',
    })),

    ...servicePages.map(servicePage => ({
      loc: `${canonical}${servicePage.path}`,

      priority: '0.9',
    })),

    {
      loc: `${canonical}/blog/`,

      priority: '0.8',
    },

    ...publishedArticles.map(article => ({
      loc: `${canonical}/blog/` + `${encodeURIComponent(article.slug)}/`,

      lastmod: getArticleLastmod(article),

      priority: '0.7',
    })),
  ];

  await writeFile(
    path.join(clientDir, 'sitemap.xml'),

    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      federalObjectSitemapUrls
        .map(
          ({ loc, lastmod, priority }) =>
            `  <url>\n` +
            `    <loc>${loc}</loc>\n` +
            (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
            `    <changefreq>monthly</changefreq>\n` +
            `    <priority>${priority}</priority>\n` +
            `  </url>\n`,
        )
        .join('') +
      `</urlset>\n`,

    'utf8',
  );

  /*
   * Google sitemap contains the same
   * federal indexable URLs as sitemap.xml.
   */
  const uniqueGoogleObjectUrls = [
    ...new Map(federalObjectSitemapUrls.map(entry => [entry.loc, entry])).values(),
  ];

  await writeFile(
    path.join(clientDir, 'sitemap-google.xml'),

    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      uniqueGoogleObjectUrls
        .map(
          ({ loc, lastmod }) =>
            `  <url>\n` +
            `    <loc>${loc}</loc>\n` +
            (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
            `  </url>\n`,
        )
        .join('') +
      `</urlset>\n`,

    'utf8',
  );

  console.log('Federal sitemap URLs:', federalObjectSitemapUrls.length);
}

// === /FEDERAL OBJECT TYPE PRERENDER ===
