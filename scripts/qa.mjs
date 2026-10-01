import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist', 'client');
const mode = process.argv.includes('--dist') ? 'dist' : 'source';

const errors = [];
const warnings = [];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, predicate = () => true) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(full, predicate));
    else if (predicate(full)) result.push(full);
  }
  return result;
}

function addError(message) { errors.push(message); }
function addWarning(message) { warnings.push(message); }

if (mode === 'source') {
  const files = await walk(srcDir, (file) => /\.(jsx?|css)$/.test(file));
  const contents = await Promise.all(files.map(async (file) => [file, await readFile(file, 'utf8')]));
  const all = contents.map(([, text]) => text).join('\n');

  const h1Files =
    contents.filter(
      ([, text]) =>
        /<h1\b/.test(text),
    );

  if (!h1Files.length) {
    addError(
      'No <h1> found in source page templates.',
    );
  }

  for (
    const [file, text]
    of h1Files
  ) {
    const count =
      (
        text.match(/<h1\b/g) ||
        []
      ).length;

    if (count !== 1) {
      addError(
        `Source page template ${
          path.relative(root, file)
        } contains ${count} <h1> elements; expected exactly one.`,
      );
    }
  }

  const ids = new Set([...all.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
  const hashLinks = new Set([...all.matchAll(/\bhref=["']#([^"']+)["']/g)].map((match) => match[1]));
  for (const id of hashLinks) {
    if (!ids.has(id)) addError(`Internal link #${id} has no matching literal id in source.`);
  }

  for (const [, src] of all.matchAll(/<img[\s\S]*?\bsrc=["']([^"']+)["'][\s\S]*?>/g)) {
    if (src.startsWith('/')) {
      const file = path.join(publicDir, src.replace(/^\//, ''));
      if (!(await exists(file))) addError(`Image ${src} is referenced but missing from public/.`);
    }
  }

  for (const match of all.matchAll(/<img([\s\S]*?)\/>/g)) {
    const attrs = match[1];
    const hasAlt =
      /\balt\s*=\s*(?:["'][^"']*["']|\{[^}]+\})/.test(attrs);

    const hasWidth =
      /\bwidth\s*=\s*(?:["'][^"']+["']|\{[^}]+\})/.test(attrs);

    const hasHeight =
      /\bheight\s*=\s*(?:["'][^"']+["']|\{[^}]+\})/.test(attrs);

    if (!hasAlt) {
      addError(
        'Found an <img> without alt text.'
      );
    }

    if (!hasWidth || !hasHeight) {
      addWarning(
        'Found an <img> without explicit width/height; this can increase CLS.'
      );
    }
  }

  const configFiles = ['src/config/city.js', 'src/config/seo.js', 'src/config/site.js'];
  const productionConfig = (await Promise.all(configFiles.map((rel) => readFile(path.join(root, rel), 'utf8')))).join('\n');
  const suspiciousDomains = ['example.ru', 'example.com', 'localhost:5173'];
  for (const domain of suspiciousDomains) {
    if (productionConfig.includes(domain)) addError(`Suspicious production placeholder found in config: ${domain}`);
  }

  for (const rel of configFiles) {
    if (!(await exists(path.join(root, rel)))) addError(`Missing required config file: ${rel}`);
  }

  if (!(await exists(path.join(publicDir, 'favicon.svg')))) addWarning('public/favicon.svg is missing.');

  const index = await readFile(path.join(root, 'index.html'), 'utf8');
  if (!index.includes('class="skip-link"')) addWarning('index.html has no skip link.');
  if (!index.includes('id="root"')) addError('index.html has no #root mount point.');
} else {
  const indexPath = path.join(distDir, 'index.html');
  if (!(await exists(indexPath))) addError('dist/client/index.html is missing. Run the production build first.');
  else {
    const html = await readFile(indexPath, 'utf8');
    if (html.includes('<div id="root"></div>')) addError('Prerender failed: #root is still empty in dist/client/index.html.');
    if (!/<link[^>]+rel=["']canonical["']/i.test(html)) addError('Prerendered HTML is missing canonical link.');
    if (!/<script[^>]+application\/ld\+json/i.test(html)) addError('Prerendered HTML is missing JSON-LD.');
    if (!/<h1\b/i.test(html)) addError('Prerendered HTML is missing H1 content.');
    if ((html.match(/<h1\b/gi) || []).length !== 1) addError('Prerendered HTML must contain exactly one H1.');
  }


  /*
   * ----------------------------------------------------------
   * Open Graph / social preview QA
   * ----------------------------------------------------------
   */

  const blogDir =
    path.join(
      distDir,
      'blog',
    );


  const validateSocialPreview =
    (
      html,
      pageLabel,
    ) => {

      const ogImageMatch =
        html.match(
          /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
        );

      if (!ogImageMatch) {

        addError(
          `${pageLabel} is missing og:image.`,
        );

      }
      else if (
        !/^https:\/\//i.test(
          ogImageMatch[1],
        )
      ) {

        addError(
          `${pageLabel} og:image must use an absolute HTTPS URL; found ${ogImageMatch[1]}.`,
        );

      }


      const twitterCardMatch =
        html.match(
          /<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']+)["']/i,
        );

      if (
        !twitterCardMatch ||
        twitterCardMatch[1] !==
          'summary_large_image'
      ) {

        addError(
          `${pageLabel} must use twitter:card=summary_large_image.`,
        );

      }


      const twitterImageMatch =
        html.match(
          /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
        );

      if (!twitterImageMatch) {

        addError(
          `${pageLabel} is missing twitter:image.`,
        );

      }
      else if (
        !/^https:\/\//i.test(
          twitterImageMatch[1],
        )
      ) {

        addError(
          `${pageLabel} twitter:image must use an absolute HTTPS URL; found ${twitterImageMatch[1]}.`,
        );

      }

    };


  const blogIndexPath =
    path.join(
      blogDir,
      'index.html',
    );


  if (
    !(await exists(blogIndexPath))
  ) {

    addError(
      'Blog prerender is missing: dist/client/blog/index.html.',
    );

  }
  else {

    const blogHtml =
      await readFile(
        blogIndexPath,
        'utf8',
      );

    validateSocialPreview(
      blogHtml,
      '/blog/',
    );

  }


  if (
    await exists(blogDir)
  ) {

    const blogEntries =
      await readdir(
        blogDir,
        {
          withFileTypes: true,
        },
      );


    for (
      const entry
      of blogEntries
    ) {

      if (
        !entry.isDirectory()
      ) {
        continue;
      }


      const articleIndexPath =
        path.join(
          blogDir,
          entry.name,
          'index.html',
        );


      if (
        !(await exists(
          articleIndexPath,
        ))
      ) {
        continue;
      }


      const articleHtml =
        await readFile(
          articleIndexPath,
          'utf8',
        );


      validateSocialPreview(
        articleHtml,
        `/blog/${entry.name}/`,
      );

    }

  }


  const fallbackOgImage =
    path.join(
      publicDir,
      'images',
      'og-passport-security.png',
    );


  if (
    !(await exists(
      fallbackOgImage,
    ))
  ) {

    addError(
      'Fallback OG image is missing: public/images/og-passport-security.png.',
    );

  }


  /*
   * ----------------------------------------------------------
   * Internal links / broken links QA
   * ----------------------------------------------------------
   *
   * Проверяем ссылки уже в итоговом prerender HTML.
   *
   * Контролируем:
   * - относительные внутренние ссылки;
   * - ссылки от корня /...;
   * - абсолютные ссылки на production-домен;
   * - ссылки на статические файлы;
   * - hash-якоря #... на HTML-страницах.
   *
   * Не проверяем:
   * - внешние сайты;
   * - mailto:, tel:, javascript:, data:;
   * - /api/;
   * - /admin/.
   */

  const linkQaIgnoredFiles =
    new Set([
      'admin.html',
      'article-preview.html',
    ]);


  const linkQaHtmlFiles =
    (
      await walk(
        distDir,
        file =>
          file.endsWith('.html'),
      )
    )
      .filter(
        file => {

          const relative =
            path.relative(
              distDir,
              file,
            )
              .split(path.sep)
              .join('/');

          return (
            !linkQaIgnoredFiles.has(
              relative,
            )
          );

        },
      );


  function htmlFileToPublicPath(
    file,
  ) {

    const relative =
      path.relative(
        distDir,
        file,
      )
        .split(path.sep)
        .join('/');


    if (
      relative ===
      'index.html'
    ) {
      return '/';
    }


    if (
      relative.endsWith(
        '/index.html',
      )
    ) {

      return (
        '/' +
        relative.slice(
          0,
          -'index.html'.length,
        )
      );

    }


    return `/${relative}`;

  }


  const rootHtmlForLinks =
    await exists(indexPath)
      ? await readFile(
          indexPath,
          'utf8',
        )
      : '';


  const rootCanonicalMatch =
    rootHtmlForLinks.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
    );


  let linkQaOrigin =
    'https://pasport-bezopasnosty.ru';


  if (
    rootCanonicalMatch?.[1]
  ) {

    try {

      linkQaOrigin =
        new URL(
          rootCanonicalMatch[1],
        ).origin;

    }
    catch {

      addError(
        `Invalid root canonical URL: ${rootCanonicalMatch[1]}.`,
      );

    }

  }


  function getPathVariants(
    pathname,
  ) {

    const variants =
      new Set([
        pathname,
      ]);


    try {

      variants.add(
        decodeURIComponent(
          pathname,
        ),
      );

    }
    catch {
      // Некорректное percent-encoding
      // будет поймано как отсутствующая цель.
    }


    return [
      ...variants,
    ];

  }


  async function resolveInternalTarget(
    pathname,
  ) {

    for (
      const pathnameVariant
      of getPathVariants(
        pathname,
      )
    ) {

      const clean =
        pathnameVariant
          .replace(
            /^\/+/,
            '',
          );


      const candidates =
        [];


      if (
        pathnameVariant === '/'
      ) {

        candidates.push(
          path.join(
            distDir,
            'index.html',
          ),
        );

      }
      else if (
        pathnameVariant.endsWith('/')
      ) {

        candidates.push(
          path.join(
            distDir,
            clean,
            'index.html',
          ),
        );

      }
      else {

        /*
         * Например:
         *
         * /robots.txt
         * /images/file.webp
         * /some-page
         */

        candidates.push(
          path.join(
            distDir,
            clean,
          ),
        );


        if (
          !path.posix.extname(
            pathnameVariant,
          )
        ) {

          candidates.push(
            path.join(
              distDir,
              clean,
              'index.html',
            ),
          );

          candidates.push(
            path.join(
              distDir,
              `${clean}.html`,
            ),
          );

        }

      }


      for (
        const candidate
        of candidates
      ) {

        if (
          await exists(
            candidate,
          )
        ) {

          return candidate;

        }

      }

    }


    return null;

  }


  const linkQaHtmlCache =
    new Map();


  async function getHtmlIds(
    htmlPath,
  ) {

    if (
      linkQaHtmlCache.has(
        htmlPath,
      )
    ) {

      return linkQaHtmlCache.get(
        htmlPath,
      );

    }


    const html =
      await readFile(
        htmlPath,
        'utf8',
      );


    const ids =
      new Set(
        [
          ...html.matchAll(
            /\bid=["']([^"']+)["']/gi,
          ),
        ].map(
          match =>
            match[1],
        ),
      );


    linkQaHtmlCache.set(
      htmlPath,
      ids,
    );


    return ids;

  }


  const brokenInternalLinks =
    new Map();

  const checkedInternalLinks =
    new Set();


  function registerBrokenLink({
    source,
    href,
    target,
    reason,
  }) {

    const key =
      `${source} -> ${target}`;


    if (
      !brokenInternalLinks.has(
        key,
      )
    ) {

      brokenInternalLinks.set(
        key,
        {
          source,
          href,
          target,
          reason,
        },
      );

    }

  }


  for (
    const htmlFile
    of linkQaHtmlFiles
  ) {

    const sourcePage =
      htmlFileToPublicPath(
        htmlFile,
      );


    const html =
      await readFile(
        htmlFile,
        'utf8',
      );


    const hrefMatches =
      html.matchAll(
        /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi,
      );


    for (
      const match
      of hrefMatches
    ) {

      const rawHref =
        String(
          match[2] ||
          '',
        )
          .replace(
            /&amp;/g,
            '&',
          )
          .trim();


      if (
        !rawHref ||
        rawHref.startsWith('//') ||
        /^(?:mailto|tel|javascript|data):/i
          .test(
            rawHref,
          )
      ) {
        continue;
      }


      let targetUrl;


      try {

        targetUrl =
          new URL(
            rawHref,
            new URL(
              sourcePage,
              `${linkQaOrigin}/`,
            ),
          );

      }
      catch {

        registerBrokenLink({
          source:
            sourcePage,

          href:
            rawHref,

          target:
            rawHref,

          reason:
            'invalid URL',
        });

        continue;

      }


      /*
       * Внешний домен — это уже не внутренняя
       * broken-link проверка.
       */
      if (
        targetUrl.origin !==
        linkQaOrigin
      ) {
        continue;
      }


      if (
        targetUrl.pathname ===
          '/admin' ||
        targetUrl.pathname.startsWith(
          '/admin/',
        ) ||
        targetUrl.pathname ===
          '/api' ||
        targetUrl.pathname.startsWith(
          '/api/',
        )
      ) {
        continue;
      }


      const targetLabel =
        (
          targetUrl.pathname ||
          '/'
        ) +
        (
          targetUrl.hash ||
          ''
        );


      checkedInternalLinks.add(
        `${sourcePage} -> ${targetLabel}`,
      );


      const targetFile =
        await resolveInternalTarget(
          targetUrl.pathname,
        );


      if (
        !targetFile
      ) {

        registerBrokenLink({
          source:
            sourcePage,

          href:
            rawHref,

          target:
            targetLabel,

          reason:
            'target does not exist in dist/client',
        });

        continue;

      }


      /*
       * Если указан #fragment и цель —
       * HTML, проверяем существование id.
       */
      if (
        targetUrl.hash &&
        targetFile.endsWith(
          '.html',
        )
      ) {

        let fragment =
          targetUrl.hash.slice(1);


        try {

          fragment =
            decodeURIComponent(
              fragment,
            );

        }
        catch {
          // Оставляем исходный fragment.
        }


        const ids =
          await getHtmlIds(
            targetFile,
          );


        if (
          !ids.has(
            fragment,
          )
        ) {

          registerBrokenLink({
            source:
              sourcePage,

            href:
              rawHref,

            target:
              targetLabel,

            reason:
              `missing #${fragment} anchor`,
          });

        }

      }

    }

  }


  for (
    const {
      source,
      href,
      target,
      reason,
    }
    of brokenInternalLinks.values()
  ) {

    addError(
      `Broken internal link on ${source}: ` +
      `"${href}" -> ${target} (${reason}).`,
    );

  }


  console.log(
    `Internal link QA: ` +
    `${linkQaHtmlFiles.length} HTML pages, ` +
    `${checkedInternalLinks.size} internal links checked, ` +
    `${brokenInternalLinks.size} broken.`,
  );


  /*
   * Heading hierarchy QA.
   *
   * Проверяем итоговые prerender index.html:
   * - ровно один H1;
   * - отсутствие скачков H1 -> H3,
   *   H2 -> H4 и т.п.
   */
  let headingQaPages = 0;
  let headingQaProblems = 0;


  for (
    const htmlFile
    of linkQaHtmlFiles
  ) {

    if (
      path.basename(
        htmlFile,
      ) !== 'index.html'
    ) {
      continue;
    }


    headingQaPages++;


    const html =
      await readFile(
        htmlFile,
        'utf8',
      );


    const headings =
      [
        ...html.matchAll(
          /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi,
        ),
      ]
        .map(
          (match) => ({
            level:
              Number(
                match[1],
              ),

            text:
              match[2]
                .replace(
                  /<[^>]+>/g,
                  ' ',
                )
                .replace(
                  /&nbsp;/g,
                  ' ',
                )
                .replace(
                  /\s+/g,
                  ' ',
                )
                .trim()
                .slice(
                  0,
                  120,
                ),
          }),
        );


    const h1Count =
      headings.filter(
        (heading) =>
          heading.level === 1,
      ).length;


    const pageLabel =
      path.relative(
        distDir,
        htmlFile,
      );


    if (
      h1Count !== 1
    ) {

      headingQaProblems++;

      addError(
        `Heading hierarchy ${pageLabel}: ` +
        `expected exactly one H1; found ${h1Count}.`,
      );

    }


    for (
      let index = 1;
      index < headings.length;
      index++
    ) {

      const previous =
        headings[index - 1];

      const current =
        headings[index];


      if (
        current.level >
        previous.level + 1
      ) {

        headingQaProblems++;

        addError(
          `Heading hierarchy ${pageLabel}: ` +
          `H${previous.level} -> H${current.level} jump ` +
          `("${previous.text}" -> "${current.text}").`,
        );

      }

    }

  }


  console.log(
    `Heading hierarchy QA: ` +
    `${headingQaPages} HTML pages, ` +
    `${headingQaProblems} problems.`,
  );


  const legalPages = [
    'oferta',
    'personal-data',
    'privacy',
  ];

  for (const slug of legalPages) {
    const legalPath =
      path.join(
        distDir,
        slug,
        'index.html',
      );

    if (!(await exists(legalPath))) {
      addError(
        `Legal prerender is missing: dist/client/${slug}/index.html.`,
      );

      continue;
    }

    const legalHtml =
      await readFile(
        legalPath,
        'utf8',
      );

    if (
      legalHtml.includes(
        '<div id="root"></div>',
      )
    ) {
      addError(
        `Legal prerender failed for /${slug}/: #root is empty.`,
      );
    }

    const h1Count =
      (
        legalHtml.match(
          /<h1\b/gi,
        ) ||
        []
      ).length;

    if (h1Count !== 1) {
      addError(
        `Legal page /${slug}/ must contain exactly one H1; found ${h1Count}.`,
      );
    }

    const robotsMatch =
      legalHtml.match(
        /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i,
      );

    if (
      !robotsMatch ||
      !robotsMatch[1].startsWith(
        'noindex,follow',
      )
    ) {
      addError(
        `Legal page /${slug}/ must be noindex,follow.`,
      );
    }

    const canonicalMatch =
      legalHtml.match(
        /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
      );

    const expectedCanonical =
      `https://pasport-bezopasnosty.ru/${slug}/`;

    if (
      !canonicalMatch ||
      canonicalMatch[1] !== expectedCanonical
    ) {
      addError(
        `Legal page /${slug}/ has invalid canonical; expected ${expectedCanonical}.`,
      );
    }

    if (
      legalHtml.includes(
        'boykovgroup.ru',
      )
    ) {
      addError(
        `Legal page /${slug}/ still contains boykovgroup.ru.`,
      );
    }
  }

  const notFoundPagePath =
    path.join(
      distDir,
      '404.html',
    );

  if (
    !(await exists(
      notFoundPagePath,
    ))
  ) {

    addError(
      'dist/client/404.html is missing.',
    );

  }
  else {

    const notFoundHtml =
      await readFile(
        notFoundPagePath,
        'utf8',
      );

    const robots404 =
      notFoundHtml.match(
        /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i,
      );

    if (
      !robots404 ||
      !robots404[1]
        .toLowerCase()
        .startsWith(
          'noindex',
        )
    ) {

      addError(
        '404.html must contain robots noindex.',
      );

    }

  }


  for (const name of ['robots.txt', 'sitemap.xml']) {
    if (!(await exists(path.join(distDir, name)))) addError(`dist/client/${name} is missing.`);
  }
}

for (const warning of warnings) console.warn(`QA warning: ${warning}`);
for (const error of errors) console.error(`QA error: ${error}`);

if (errors.length) {
  console.error(`QA failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`QA ${mode} checks passed${warnings.length ? ` with ${warnings.length} warning(s)` : ''}.`);
