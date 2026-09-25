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


const regionalLocations =
  getRegionalLocations();

const locations = [
  DEFAULT_LOCATION,
  ...regionalLocations,
];

const SERVICE_ROUTES = Object.freeze([
  {
    pathname:
      '/akt-obsledovaniya-i-kategorirovaniya-obekta/',
    h1Fragment:
      'Акт обследования',
    titleFragment:
      'Акт',
  },
  {
    pathname:
      '/aktualizaciya-pasporta-bezopasnosti-obekta/',
    h1Fragment:
      'Актуализация паспорта',
    titleFragment:
      'Актуализация',
  },
]);


const OBJECT_ROUTE_ROBOTS =
  'noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';


/*
 * Страницы паспортов безопасности по типам объектов
 * существуют только на федеральном домене.
 *
 * Региональные копии не генерируем.
 */
const OBJECT_ROUTES = Object.freeze([]);


for (const route of OBJECT_ROUTES) {
  if (
    !route.id ||
    !route.pathname ||
    !route.h1Fragment ||
    !route.titleFragment
  ) {
    throw new Error(
      `Invalid object route: ${JSON.stringify(route)}`,
    );
  }
}


const REGIONAL_ROUTE_PATHNAMES = [
  ...SERVICE_ROUTES.map(
    ({ pathname }) => pathname,
  ),

  ...OBJECT_ROUTES.map(
    ({ pathname }) => pathname,
  ),
];


if (
  new Set(
    REGIONAL_ROUTE_PATHNAMES,
  ).size !==
  REGIONAL_ROUTE_PATHNAMES.length
) {
  throw new Error(
    'Duplicate regional route pathname',
  );
}



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


// GEO_SERVICE_ROUTES_PATCH_V1
let serviceGeneratedCount = 0;

let objectGeneratedCount = 0;


function geoExpectedCanonicalForPath(
  location,
  pathname,
) {
  const base =
    expectedCanonical(location);

  if (!pathname || pathname === '/') {
    return base;
  }

  const normalizedPath =
    `/${String(pathname).replace(/^\/+|\/+$/g, '')}/`;

  return `${base}${normalizedPath}`;
}


function geoExtractTagText(
  document,
  tagName,
) {
  const match =
    document.match(
      new RegExp(
        `<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
        'i',
      ),
    );

  if (!match) {
    return '';
  }

  return normalizeHtml(
    match[1].replace(/<[^>]+>/g, ' '),
  ).trim();
}


function geoValidateServiceDocument(
  location,
  route,
  document,
) {
  const expected =
    geoExpectedCanonicalForPath(
      location,
      route.pathname,
    );

  const canonicalOk =
    document.includes(
      `rel="canonical" href="${expected}"`,
    );

  const h1Text =
    geoExtractTagText(
      document,
      'h1',
    );

  const titleText =
    geoExtractTagText(
      document,
      'title',
    );

  const h1Ok =
    h1Text
      .toLowerCase()
      .includes(
        route.h1Fragment.toLowerCase(),
      );

  const titleOk =
    titleText
      .toLowerCase()
      .includes(
        route.titleFragment.toLowerCase(),
      );

  const robotsOk =
    document.includes(
      `name="robots" content="${expectedRobots(location)}"`,
    );

  const bootstrapOk =
    document.includes(
      'window.__PASSPORT_CITY__=',
    );

  if (
    !canonicalOk ||
    !h1Ok ||
    !titleOk ||
    !robotsOk ||
    !bootstrapOk
  ) {
    throw new Error(
      [
        `Ошибка service SSR: ${location.name}`,
        `pathname=${route.pathname}`,
        `canonical=${canonicalOk}`,
        `h1=${h1Ok}`,
        `title=${titleOk}`,
        `robots=${robotsOk}`,
        `bootstrap=${bootstrapOk}`,
      ].join(' | '),
    );
  }
}


function geoValidateObjectDocument(
  location,
  route,
  document,
) {
  const expected =
    geoExpectedCanonicalForPath(
      location,
      route.pathname,
    );


  const canonicalOk =
    document.includes(
      `rel="canonical" href="${expected}"`,
    );


  const h1Text =
    geoExtractTagText(
      document,
      'h1',
    );


  const titleText =
    geoExtractTagText(
      document,
      'title',
    );


  const h1Ok =
    h1Text
      .toLowerCase()
      .includes(
        route.h1Fragment
          .toLowerCase(),
      );


  const titleOk =
    titleText
      .toLowerCase()
      .includes(
        route.titleFragment
          .toLowerCase(),
      );


  const robotsOk =
    document.includes(
      `name="robots" content="${OBJECT_ROUTE_ROBOTS}"`,
    );


  const bootstrapOk =
    document.includes(
      'window.__PASSPORT_CITY__=',
    );


  if (
    !canonicalOk ||
    !h1Ok ||
    !titleOk ||
    !robotsOk ||
    !bootstrapOk
  ) {
    throw new Error(
      [
        `Ошибка object SSR: ${location.name}`,
        `pathname=${route.pathname}`,
        `canonical=${canonicalOk}`,
        `h1=${h1Ok}`,
        `title=${titleOk}`,
        `robots=${robotsOk}`,
        `bootstrap=${bootstrapOk}`,
      ].join(' | '),
    );
  }
}


for (const location of regionalLocations) {

  const regionDirectory =
    path.join(
      outputRoot,
      'regions',
      location.slug,
    );

  const routeManifest = [];



  const objectRouteManifest = [];


  for (const route of SERVICE_ROUTES) {

    const result = await render({
      city: location,
      pathname: route.pathname,
    });


    const document =
      buildDocument(result);


    geoValidateServiceDocument(
      location,
      route,
      document,
    );


    const routeDirectoryName =
      route.pathname.replace(
        /^\/+|\/+$/g,
        '',
      );


    const outputDirectory =
      path.join(
        regionDirectory,
        routeDirectoryName,
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


    routeManifest.push({
      pathname:
        route.pathname,

      canonical:
        geoExpectedCanonicalForPath(
          location,
          route.pathname,
        ),

      output:
        path.relative(
          outputRoot,
          outputFile,
        ),
    });


    serviceGeneratedCount += 1;
  }


  for (const route of OBJECT_ROUTES) {

    const result = await render({
      city:
        location,

      pathname:
        route.pathname,
    });


    const document =
      buildDocument(result);


    geoValidateObjectDocument(
      location,
      route,
      document,
    );


    const routeDirectoryName =
      route.pathname.replace(
        /^\/+|\/+$/g,
        '',
      );


    const outputDirectory =
      path.join(
        regionDirectory,
        routeDirectoryName,
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


    objectRouteManifest.push({
      id:
        route.id,

      pathname:
        route.pathname,

      canonical:
        geoExpectedCanonicalForPath(
          location,
          route.pathname,
        ),

      output:
        path.relative(
          outputRoot,
          outputFile,
        ),
    });


    objectGeneratedCount += 1;
  }



  if (isSeoIndexable(location)) {

    const sitemapEntries = [
      {
        loc:
          expectedCanonical(location),

        priority:
          '1.0',
      },

      ...SERVICE_ROUTES.map(
        (route) => ({
          loc:
            geoExpectedCanonicalForPath(
              location,
              route.pathname,
            ),

          priority:
            '0.9',
        }),
      ),
    ];


    const sitemap =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +

      sitemapEntries
        .map(
          ({ loc, priority }) =>
            `  <url>\n` +
            `    <loc>${loc}</loc>\n` +
            `    <changefreq>monthly</changefreq>\n` +
            `    <priority>${priority}</priority>\n` +
            `  </url>\n`,
        )
        .join('') +

      `</urlset>\n`;


    await writeFile(
      path.join(
        regionDirectory,
        'sitemap.xml',
      ),
      sitemap,
      'utf8',
    );
  }


  const manifestEntry =
    manifest.find(
      (entry) =>
        entry.slug === location.slug,
    );


  if (manifestEntry) {
    manifestEntry.serviceRoutes =
      routeManifest;

    manifestEntry.objectRoutes =
      objectRouteManifest;
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


const geoManifestPath =
  path.join(
    outputRoot,
    'manifest.json',
  );


const geoManifestData =
  JSON.parse(
    await readFile(
      geoManifestPath,
      'utf8',
    ),
  );


geoManifestData.regionalCount =
  regionalLocations.length;

geoManifestData.serviceRouteCount =
  SERVICE_ROUTES.length;

geoManifestData.objectRouteCount =
  OBJECT_ROUTES.length;

geoManifestData.servicePageCount =
  serviceGeneratedCount;

geoManifestData.objectPageCount =
  objectGeneratedCount;

geoManifestData.regionalHtmlCount =
  regionalLocations.length *
  (
    1 +
    SERVICE_ROUTES.length +
    OBJECT_ROUTES.length
  );

geoManifestData.serviceRoutes =
  SERVICE_ROUTES.map(
    ({ pathname }) => pathname,
  );

geoManifestData.objectRoutes =
  OBJECT_ROUTES.map(
    ({ pathname }) => pathname,
  );


await writeFile(
  geoManifestPath,
  JSON.stringify(
    geoManifestData,
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
  `✓ Создано HTML: ${generatedCount + serviceGeneratedCount + objectGeneratedCount}`,
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
