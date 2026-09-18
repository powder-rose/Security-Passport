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
    if (!/\balt=["']/.test(attrs)) addError('Found an <img> without alt text.');
    if (!/\bwidth=["']/.test(attrs) || !/\bheight=["']/.test(attrs)) {
      addWarning('Found an <img> without explicit width/height; this can increase CLS.');
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
