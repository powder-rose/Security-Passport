import {
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';

import path from 'node:path';

import {
  fileURLToPath,
  pathToFileURL,
} from 'node:url';

import {
  DEFAULT_LOCATION,
  getRegionalLocations,
} from '../config/geography/index.mjs';


const startedAt =
  Date.now();


const __dirname =
  path.dirname(
    fileURLToPath(import.meta.url),
  );


const projectRoot =
  path.resolve(
    __dirname,
    '..',
  );


const distRoot =
  path.join(
    projectRoot,
    'dist',
  );


const templatePath =
  path.join(
    distRoot,
    'template',
    'index.html',
  );


const serverEntry =
  path.join(
    distRoot,
    'server',
    'entry-server.js',
  );


const outputRoot =
  path.join(
    distRoot,
    'geo-pages',
  );


const template =
  await readFile(
    templatePath,
    'utf8',
  );


if (
  !template.includes(
    '<div id="root"></div>',
  )
) {
  throw new Error(
    'Generation template does not contain empty #root',
  );
}


const {
  render,
} =
  await import(
    pathToFileURL(
      serverEntry,
    ).href
  );


const locations = [
  DEFAULT_LOCATION,
  ...getRegionalLocations(),
];


function serializeCity(city) {
  return JSON.stringify(city)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}


function prepareTemplate(rawTemplate) {
  return rawTemplate
    .replace(
      /<title>[\s\S]*?<\/title>/i,
      '',
    )
    .replace(
      /<meta\s+name=["']robots["'][^>]*>/i,
      '',
    )
    .replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      '',
    );
}


function buildDocument(result) {
  const {
    html,
    helmet,
    city,
  } = result;


  const headTags = [
    helmet?.title?.toString() || '',
    helmet?.meta?.toString() || '',
    helmet?.link?.toString() || '',
    helmet?.script?.toString() || '',
  ].join('\n');


  const cityBootstrap =
    `<script>` +
    `window.__PASSPORT_CITY__=` +
    `${serializeCity(city)};` +
    `</script>`;


  return prepareTemplate(template)
    .replace(
      '</head>',
      `${headTags}\n${cityBootstrap}\n</head>`,
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`,
    );
}


function normalizeHtml(html) {
  return html
    .replace(
      /<!--[\s\S]*?-->/g,
      '',
    )
    .replace(
      /&nbsp;|&#xA0;|&#xa0;|&#160;/g,
      ' ',
    )
    .replace(
      /\s+/g,
      ' ',
    );
}


function expectedCanonical(
  location,
) {
  if (
    location.isDefault ||
    !location.slug
  ) {
    return (
      'https://pasport-bezopasnosty.ru'
    );
  }

  return (
    `https://${location.slug}.` +
    `pasport-bezopasnosty.ru`
  );
}



function isSeoIndexable(location) {
  return (
    location.isDefault ||
    location.seoIndexable === true
  );
}


function expectedRobots(location) {
  return isSeoIndexable(location)
    ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
    : 'noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
}


function validateDocument(
  location,
  document,
) {
  const expected =
    expectedCanonical(location);


  const canonicalOk =
    document.includes(
      `rel="canonical" href="${expected}"`,
    );


  const normalized =
    normalizeHtml(document);


  const expectedHeroLocation =
    location.inflectionMode === 'neutral'
      ? location.name
      : `в ${location.prepositional}`;

  const heroOk =
    normalized.includes(
      expectedHeroLocation,
    );


  const addressOk =
    !location.address ||
    document.includes(
      location.address,
    );


  const bootstrapOk =
    document.includes(
      'window.__PASSPORT_CITY__=',
    );


  const robotsOk =
    document.includes(
      `name="robots" content="${expectedRobots(location)}"`,
    );


  if (
    !canonicalOk ||
    !heroOk ||
    !addressOk ||
    !bootstrapOk ||
    !robotsOk
  ) {
    throw new Error(
      [
        `Ошибка генерации: ${location.name}`,
        `canonical=${canonicalOk}`,
        `hero=${heroOk}`,
        `address=${addressOk}`,
        `bootstrap=${bootstrapOk}`,
        `robots=${robotsOk}`,
      ].join(' | '),
    );
  }
}


function getOutputDirectory(
  location,
) {
  if (
    location.isDefault ||
    !location.slug
  ) {
    return path.join(
      outputRoot,
      'federal',
    );
  }

  return path.join(
    outputRoot,
    'regions',
    location.slug,
  );
}


await rm(
  outputRoot,
  {
    recursive: true,
    force: true,
  },
);


await mkdir(
  outputRoot,
  {
    recursive: true,
  },
);


const manifest = [];


console.log(
  '========================================',
);

console.log(
  'GENERATING GEOGRAPHY PAGES',
);

console.log(
  '========================================',
);

console.log(
  `Географий: ${locations.length}`,
);

console.log();


let generatedCount = 0;


for (
  const location of locations
) {
  const result =
    render({
      city: location,
    });


  const document =
    buildDocument(result);


  validateDocument(
    location,
    document,
  );


  const outputDirectory =
    getOutputDirectory(
      location,
    );


  await mkdir(
    outputDirectory,
    {
      recursive: true,
    },
  );


  const outputFile =
    path.join(
      outputDirectory,
      'index.html',
    );


  await writeFile(
    outputFile,
    document,
    'utf8',
  );


  const canonical =
    expectedCanonical(
      location,
    );


  const indexable =
    isSeoIndexable(location);


  await writeFile(
    path.join(
      outputDirectory,
      'robots.txt',
    ),

    `User-agent: *\n` +
    `Allow: /\n` +
    (
      indexable
        ? `\nSitemap: ${canonical}/sitemap.xml\n`
        : ''
    ),

    'utf8',
  );


  if (indexable) {
    await writeFile(
      path.join(
        outputDirectory,
        'sitemap.xml',
      ),

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


  manifest.push({
    slug:
      location.slug,

    name:
      location.name,

    seoIndexable:
      isSeoIndexable(location),

    canonical:
      expectedCanonical(
        location,
      ),

    output:
      path.relative(
        outputRoot,
        outputFile,
      ),
  });


  generatedCount += 1;


  if (
    generatedCount <= 10 ||
    generatedCount % 500 === 0 ||
    generatedCount === locations.length
  ) {
    console.log(
      `[${generatedCount}/${locations.length}] ` +
      `${location.name} ✓`,
    );
  }
}


await writeFile(
  path.join(
    outputRoot,
    'manifest.json',
  ),

  JSON.stringify(
    {
      generatedAt:
        new Date().toISOString(),

      count:
        generatedCount,

      locations:
        manifest,
    },
    null,
    2,
  ),

  'utf8',
);


const elapsed =
  (
    (
      Date.now() -
      startedAt
    ) /
    1000
  ).toFixed(2);


console.log();

console.log(
  '========================================',
);

console.log(
  `✓ Создано страниц: ${generatedCount}`,
);

console.log(
  `✓ Время: ${elapsed} сек.`,
);

console.log(
  `✓ Каталог: ${outputRoot}`,
);

console.log(
  '========================================',
);
