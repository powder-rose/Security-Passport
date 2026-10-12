import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const prerenderFile = path.join(repositoryRoot, 'scripts', 'prerender.mjs');

async function createFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'passport-prerender-route-css-'));

  const scriptsDirectory = path.join(root, 'scripts');

  const sourceDataDirectory = path.join(root, 'src', 'data');

  const articleDataDirectory = path.join(root, 'data');

  const runtimeDirectory = path.join(root, 'runtime');

  const clientDirectory = path.join(root, 'client');

  const manifestDirectory = path.join(clientDirectory, '.vite');

  const templateDirectory = path.join(root, 'template');

  const assetsDirectory = path.join(clientDirectory, 'assets');

  await Promise.all([
    fs.mkdir(scriptsDirectory, {
      recursive: true,
    }),

    fs.mkdir(sourceDataDirectory, {
      recursive: true,
    }),

    fs.mkdir(articleDataDirectory, {
      recursive: true,
    }),

    fs.mkdir(runtimeDirectory, {
      recursive: true,
    }),

    fs.mkdir(manifestDirectory, {
      recursive: true,
    }),

    fs.mkdir(assetsDirectory, {
      recursive: true,
    }),
  ]);

  const copiedPrerender = path.join(scriptsDirectory, 'prerender.mjs');

  const serverEntry = path.join(runtimeDirectory, 'entry-server.mjs');

  await fs.copyFile(prerenderFile, copiedPrerender);

  const registryDirectory = path.join(root, 'src', 'config');

  await fs.mkdir(registryDirectory, {
    recursive: true,
  });

  await fs.copyFile(
    path.resolve(path.dirname(prerenderFile), '../src/config/pageRouteRegistry.js'),
    path.join(registryDirectory, 'pageRouteRegistry.js'),
  );

  await fs.writeFile(
    path.join(root, 'package.json'),
    `${JSON.stringify(
      {
        type: 'module',
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  await fs.writeFile(
    path.join(sourceDataDirectory, 'objectTypes.js'),
    'export const objectTypes = [];\n',
    'utf8',
  );

  await fs.writeFile(
    path.join(sourceDataDirectory, 'servicePages.js'),
    'export const servicePages = [];\n',
    'utf8',
  );

  await fs.writeFile(
    path.join(articleDataDirectory, 'articles.json'),
    `${JSON.stringify(
      [
        {
          id: 'css-fixture',

          title: 'CSS fixture article',

          content: '<p>Fixture</p>',

          image: null,

          imageAlt: '',

          status: 'published',

          category: 'Fixture',

          slug: 'css-fixture',

          legacySlugs: [],

          seoTitle: 'CSS fixture',

          seoDescription: 'CSS fixture',

          createdAt: '2026-10-11T00:00:00.000Z',

          updatedAt: '2026-10-11T00:00:00.000Z',

          publishedAt: '2026-10-11T00:00:00.000Z',
        },
      ],
      null,
      2,
    )}\n`,
    'utf8',
  );

  await fs.writeFile(
    serverEntry,
    `
function tag(value = '') {
  return {
    toString() {
      return value;
    },
  };
}

export function render({
  pathname = '/',
} = {}) {
  const canonical =
    pathname === '/'
      ? 'https://pasport-bezopasnosty.ru'
      : \`https://pasport-bezopasnosty.ru\${pathname}\`;

  return {
    html:
      \`<main>\${pathname}</main>\`,

    helmet: {
      title:
        tag(
          \`<title>\${pathname}</title>\`,
        ),

      meta:
        tag(
          '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">',
        ),

      link:
        tag(
          \`<link rel="canonical" href="\${canonical}">\`,
        ),

      script:
        tag(''),
    },
  };
}
`.trimStart(),
    'utf8',
  );

  /*
   * base.css represents CSS already present
   * in the normal Vite application template.
   *
   * Route CSS must be added by prerender
   * without duplicating this stylesheet.
   */
  await fs.writeFile(
    path.join(clientDirectory, 'index.html'),
    [
      '<!doctype html>',
      '<html>',
      '<head>',
      '<title>Fixture</title>',
      '<link rel="stylesheet" crossorigin href="/assets/base.css">',
      '</head>',
      '<body>',
      '<div id="root"></div>',
      '</body>',
      '</html>',
      '',
    ].join('\n'),
    'utf8',
  );

  const manifest = {
    'src/pages/LegalPage/LegalPage.jsx': {
      css: ['assets/legal.css'],
    },

    'src/pages/BlogPage/BlogPage.jsx': {
      css: ['assets/blog-page.css'],

      imports: ['_shared-app.js'],
    },

    'src/pages/ArticlePage/ArticlePage.jsx': {
      css: ['assets/article-page.css'],

      imports: ['_article-view.js', '_shared-app.js'],
    },

    '_article-view.js': {
      css: ['assets/article-view.css'],

      imports: ['_shared-app.js'],
    },

    '_shared-app.js': {
      css: ['assets/base.css'],
    },
  };

  await fs.writeFile(
    path.join(manifestDirectory, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  for (const cssFile of [
    'base.css',
    'legal.css',
    'blog-page.css',
    'article-page.css',
    'article-view.css',
  ]) {
    await fs.writeFile(path.join(assetsDirectory, cssFile), `/* ${cssFile} */\n`, 'utf8');
  }

  return {
    root,
    copiedPrerender,
    serverEntry,
    clientDirectory,
    templateDirectory,
  };
}

function countOccurrences(source, value) {
  return source.split(value).length - 1;
}

test('blog and article prerender include route CSS from the complete Vite manifest graph without duplicating base CSS', async () => {
  const fixture = await createFixture();

  try {
    await execFileAsync(process.execPath, [fixture.copiedPrerender], {
      cwd: fixture.root,

      env: {
        ...process.env,

        PRERENDER_CLIENT_DIR: fixture.clientDirectory,

        PRERENDER_SERVER_ENTRY: fixture.serverEntry,

        PRERENDER_TEMPLATE_DIR: fixture.templateDirectory,
      },

      windowsHide: true,
    });

    const blogHtml = await fs.readFile(
      path.join(fixture.clientDirectory, 'blog', 'index.html'),
      'utf8',
    );

    const articleHtml = await fs.readFile(
      path.join(fixture.clientDirectory, 'blog', 'css-fixture', 'index.html'),
      'utf8',
    );

    assert.match(
      blogHtml,
      /href="\/assets\/blog-page\.css"/,
      'Blog prerender must include its route stylesheet',
    );

    assert.equal(
      countOccurrences(blogHtml, 'href="/assets/base.css"'),
      1,
      'Blog prerender must not duplicate CSS already present in the base document',
    );

    assert.match(
      articleHtml,
      /href="\/assets\/article-page\.css"/,
      'Article prerender must include ArticlePage CSS',
    );

    assert.match(
      articleHtml,
      /href="\/assets\/article-view\.css"/,
      'Article prerender must include CSS owned by imported ArticleView chunk',
    );

    assert.equal(
      countOccurrences(articleHtml, 'href="/assets/base.css"'),
      1,
      'Article prerender must not duplicate CSS already present in the base document',
    );
  } finally {
    await fs.rm(fixture.root, {
      recursive: true,
      force: true,
    });
  }
});

test('sitemaps use published article dates without inventing timestamps', async () => {
  const fixture = await createFixture();

  try {
    const articlesFile = path.join(fixture.root, 'data', 'articles.json');
    const [article] = JSON.parse(await fs.readFile(articlesFile, 'utf8'));

    const articles = [
      {
        ...article,
        publishedAt: '2026-10-09T12:00:00.000Z',
        updatedAt: '2026-10-11T15:30:00.000Z',
      },
      {
        ...article,
        id: 'published-only',
        slug: 'published-only',
        publishedAt: '2026-10-10T09:00:00.000Z',
        updatedAt: null,
      },
      {
        ...article,
        id: 'future-update',
        slug: 'future-update',
        publishedAt: '2026-10-10T09:00:00.000Z',
        updatedAt: '2099-01-01T00:00:00.000Z',
      },
      {
        ...article,
        id: 'invalid-dates',
        slug: 'invalid-dates',
        publishedAt: 'invalid',
        updatedAt: null,
      },
      {
        ...article,
        id: 'draft-article',
        slug: 'draft-article',
        status: 'draft',
      },
    ];

    await fs.writeFile(articlesFile, `${JSON.stringify(articles, null, 2)}\n`, 'utf8');

    await execFileAsync(process.execPath, [fixture.copiedPrerender], {
      cwd: fixture.root,
      env: {
        ...process.env,
        PRERENDER_CLIENT_DIR: fixture.clientDirectory,
        PRERENDER_SERVER_ENTRY: fixture.serverEntry,
        PRERENDER_TEMPLATE_DIR: fixture.templateDirectory,
      },
      windowsHide: true,
    });

    for (const filename of ['sitemap.xml', 'sitemap-google.xml']) {
      const xml = await fs.readFile(path.join(fixture.clientDirectory, filename), 'utf8');
      const entries = xml.match(/<url>[\s\S]*?<\/url>/g) || [];

      const findArticle = slug =>
        entries.find(entry =>
          entry.includes(`<loc>https://pasport-bezopasnosty.ru/blog/${slug}/</loc>`),
        );

      assert.match(
        findArticle('css-fixture') || '',
        /<lastmod>2026-10-11T15:30:00\.000Z<\/lastmod>/,
      );

      assert.match(
        findArticle('published-only') || '',
        /<lastmod>2026-10-10T09:00:00\.000Z<\/lastmod>/,
      );

      assert.match(
        findArticle('future-update') || '',
        /<lastmod>2026-10-10T09:00:00\.000Z<\/lastmod>/,
      );

      assert.doesNotMatch(findArticle('invalid-dates') || '', /<lastmod>/);
      assert.equal(findArticle('draft-article'), undefined);

      const home = entries.find(entry =>
        entry.includes('<loc>https://pasport-bezopasnosty.ru</loc>'),
      );

      assert.ok(home);
      assert.doesNotMatch(home, /<lastmod>/);
    }
  } finally {
    await fs.rm(fixture.root, {
      recursive: true,
      force: true,
    });
  }
});
