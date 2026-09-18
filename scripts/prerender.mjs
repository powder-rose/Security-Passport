import {
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';

import {
  fileURLToPath,
  pathToFileURL,
} from 'node:url';

import path from 'node:path';

import {
  DEFAULT_LOCATION,
  getRegionalLocations,
} from '../config/geography/index.mjs';

import {
  objectTypes,
} from '../src/data/objectTypes.js';

import {
  servicePages,
} from '../src/data/servicePages.js';


const projectRoot =
  path.resolve(
    path.dirname(
      fileURLToPath(import.meta.url),
    ),
    '..',
  );

const clientDir =
  path.join(
    projectRoot,
    'dist',
    'client',
  );

const templatePath =
  path.join(
    clientDir,
    'index.html',
  );

const serverEntry =
  path.join(
    projectRoot,
    'dist',
    'server',
    'entry-server.js',
  );


const { render } =
  await import(
    pathToFileURL(serverEntry).href
  );


const {
  html,
  helmet,
  city,
} = render({
  city: DEFAULT_LOCATION,
});


let template =
  await readFile(
    templatePath,
    'utf8',
  );


if (!template.includes('<div id="root"></div>')) {
  throw new Error(
    'Raw Vite template is missing empty root',
  );
}


const generatorTemplateDir =
  path.join(
    projectRoot,
    'dist',
    'template',
  );

const generatorTemplatePath =
  path.join(
    generatorTemplateDir,
    'index.html',
  );


await mkdir(
  generatorTemplateDir,
  {
    recursive: true,
  },
);


await writeFile(
  generatorTemplatePath,
  template,
  'utf8',
);


template = template
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


const headTags = [
  helmet?.title?.toString() || '',
  helmet?.meta?.toString() || '',
  helmet?.link?.toString() || '',
  helmet?.script?.toString() || '',
].join('\n');


const serializedCity =
  JSON.stringify(city)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');


const cityBootstrap =
  `<script>window.__PASSPORT_CITY__=${serializedCity};</script>`;


template = template
  .replace(
    '</head>',
    `${headTags}\n${cityBootstrap}\n</head>`,
  )
  .replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`,
  );


await writeFile(
  templatePath,
  template,
  'utf8',
);


const canonicalMatch =
  headTags.match(
    /rel="canonical" href="([^"]+)"/i,
  );

const canonical =
  canonicalMatch?.[1]
    ?.replace(/\/$/, '');


if (canonical) {
  await writeFile(
    path.join(
      clientDir,
      'robots.txt',
    ),

    `User-agent: *\nAllow: /\n\nSitemap: ${canonical}/sitemap.xml\n`,

    'utf8',
  );


  await writeFile(
    path.join(
      clientDir,
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


if (canonical) {
  const canonicalUrl =
    new URL(canonical);

  const googleUrls = [
    canonical,

    ...getRegionalLocations()
      .filter(
        (location) =>
          location.seoIndexable === true,
      )
      .map(
        (location) =>
          `${canonicalUrl.protocol}//` +
          `${location.slug}.` +
          `${canonicalUrl.hostname}`,
      ),
  ];

  const uniqueGoogleUrls =
    [...new Set(googleUrls)];

  await writeFile(
    path.join(
      clientDir,
      'sitemap-google.xml',
    ),

    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    uniqueGoogleUrls
      .map(
        (url) =>
          `  <url>\n` +
          `    <loc>${url}</loc>\n` +
          `  </url>\n`,
      )
      .join('') +
    `</urlset>\n`,

    'utf8',
  );

  console.log(
    'Google sitemap URLs:',
    uniqueGoogleUrls.length,
  );
}



// ----------------------------------------------------------
// Federal legal pages.
// They are intentionally noindex,follow and therefore
// are not added to sitemap.xml.
// ----------------------------------------------------------

const legalSlugs = [
  'oferta',
  'personal-data',
  'privacy',
];

const legalBaseTemplate =
  await readFile(
    generatorTemplatePath,
    'utf8',
  );

for (const legalSlug of legalSlugs) {
  const legalResult =
    render({
      city: DEFAULT_LOCATION,
      pathname: `/${legalSlug}/`,
    });

  let legalTemplate =
    legalBaseTemplate
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

  const legalHeadTags = [
    legalResult.helmet?.title?.toString() || '',
    legalResult.helmet?.meta?.toString() || '',
    legalResult.helmet?.link?.toString() || '',
    legalResult.helmet?.script?.toString() || '',
  ].join('\n');

  const legalCity =
    JSON.stringify(
      legalResult.city,
    )
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

  const legalBootstrap =
    `<script>window.__PASSPORT_CITY__=${legalCity};</script>`;

  legalTemplate =
    legalTemplate
      .replace(
        '</head>',
        `${legalHeadTags}\n${legalBootstrap}\n</head>`,
      )
      .replace(
        '<div id="root"></div>',
        `<div id="root">${legalResult.html}</div>`,
      );

  const legalDir =
    path.join(
      clientDir,
      legalSlug,
    );

  await mkdir(
    legalDir,
    {
      recursive: true,
    },
  );

  await writeFile(
    path.join(
      legalDir,
      'index.html',
    ),
    legalTemplate,
    'utf8',
  );

  console.log(
    'Legal prerender:',
    `/${legalSlug}/`,
  );
}


console.log(
  'Prerender city:',
  city.name,
);

console.log(
  'Prerender complete:',
  templatePath,
);

// === FEDERAL OBJECT TYPE PRERENDER ===

if (canonical) {
  const objectTypeBaseTemplate =
    await readFile(
      generatorTemplatePath,
      'utf8',
    );


  for (const objectType of objectTypes) {
    const objectResult =
      render({
        city: DEFAULT_LOCATION,
        pathname: objectType.path,
      });


    let objectDocument =
      objectTypeBaseTemplate
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


    const objectHeadTags = [
      objectResult.helmet?.title?.toString() || '',
      objectResult.helmet?.meta?.toString() || '',
      objectResult.helmet?.link?.toString() || '',
      objectResult.helmet?.script?.toString() || '',
    ].join('\n');


    const objectSerializedCity =
      JSON.stringify(
        objectResult.city,
      )
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026');


    const objectCityBootstrap =
      `<script>` +
      `window.__PASSPORT_CITY__=` +
      `${objectSerializedCity};` +
      `</script>`;


    objectDocument =
      objectDocument
        .replace(
          '</head>',
          `${objectHeadTags}\n` +
          `${objectCityBootstrap}\n` +
          `</head>`,
        )
        .replace(
          '<div id="root"></div>',
          `<div id="root">` +
          `${objectResult.html}` +
          `</div>`,
        );


    const objectSlug =
      objectType.path
        .replace(
          /^\/+|\/+$/g,
          '',
        );


    const objectOutputDirectory =
      path.join(
        clientDir,
        objectSlug,
      );


    await mkdir(
      objectOutputDirectory,
      {
        recursive: true,
      },
    );


    const objectOutputFile =
      path.join(
        objectOutputDirectory,
        'index.html',
      );


    await writeFile(
      objectOutputFile,
      objectDocument,
      'utf8',
    );


    const expectedObjectCanonical =
      `${canonical}${objectType.path}`;


    if (
      !objectDocument.includes(
        `rel="canonical" href="${expectedObjectCanonical}"`,
      )
    ) {
      throw new Error(
        `Object prerender canonical mismatch: ` +
        `${objectType.path}`,
      );
    }


    if (
      !objectDocument.includes(
        'name="robots" content="index,follow,' +
        'max-image-preview:large,' +
        'max-snippet:-1,' +
        'max-video-preview:-1"',
      )
    ) {
      throw new Error(
        `Object prerender robots mismatch: ` +
        `${objectType.path}`,
      );
    }


    if (
      !objectDocument.includes(
        objectType.h1,
      )
    ) {
      throw new Error(
        `Object prerender H1 mismatch: ` +
        `${objectType.path}`,
      );
    }


    console.log(
      `Object prerender: ${objectType.path}`,
    );
  }


  // === FEDERAL SERVICE PAGE PRERENDER ===

  for (const servicePage of servicePages) {
    const serviceResult =
      render({
        city: DEFAULT_LOCATION,
        pathname: servicePage.path,
      });



    let serviceDocument =
      objectTypeBaseTemplate
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



    const serviceHeadTags = [
      serviceResult.helmet?.title?.toString() || '',
      serviceResult.helmet?.meta?.toString() || '',
      serviceResult.helmet?.link?.toString() || '',
      serviceResult.helmet?.script?.toString() || '',
    ].join('\n');



    const serviceSerializedCity =
      JSON.stringify(
        serviceResult.city,
      )
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026');



    const serviceCityBootstrap =
      `<script>` +
      `window.__PASSPORT_CITY__=` +
      `${serviceSerializedCity};` +
      `</script>`;



    serviceDocument =
      serviceDocument
        .replace(
          '</head>',
          `${serviceHeadTags}\n` +
          `${serviceCityBootstrap}\n` +
          `</head>`,
        )
        .replace(
          '<div id="root"></div>',
          `<div id="root">` +
          `${serviceResult.html}` +
          `</div>`,
        );



    const serviceSlug =
      servicePage.path
        .replace(
          /^\/+|\/+$/g,
          '',
        );



    const serviceOutputDirectory =
      path.join(
        clientDir,
        serviceSlug,
      );



    await mkdir(
      serviceOutputDirectory,
      {
        recursive: true,
      },
    );



    const serviceOutputFile =
      path.join(
        serviceOutputDirectory,
        'index.html',
      );



    await writeFile(
      serviceOutputFile,
      serviceDocument,
      'utf8',
    );



    const expectedServiceCanonical =
      `${canonical}${servicePage.path}`;



    if (
      !serviceDocument.includes(
        `rel="canonical" href="${expectedServiceCanonical}"`,
      )
    ) {
      throw new Error(
        `Service prerender canonical mismatch: ` +
        `${servicePage.path}`,
      );
    }



    if (
      !serviceDocument.includes(
        'name="robots" content="index,follow,' +
        'max-image-preview:large,' +
        'max-snippet:-1,' +
        'max-video-preview:-1"',
      )
    ) {
      throw new Error(
        `Service prerender robots mismatch: ` +
        `${servicePage.path}`,
      );
    }



    if (
      !serviceDocument.includes(
        servicePage.h1,
      )
    ) {
      throw new Error(
        `Service prerender H1 mismatch: ` +
        `${servicePage.path}`,
      );
    }



    console.log(
      `Service prerender: ${servicePage.path}`,
    );
  }

  // === /FEDERAL SERVICE PAGE PRERENDER ===



  // Перезаписываем федеральный sitemap:
  // главная + индексируемые дочерние SEO-страницы.
  const federalObjectSitemapUrls = [
    {
      loc: canonical,
      priority: '1.0',
    },

    ...objectTypes.map(
      (objectType) => ({
        loc:
          `${canonical}${objectType.path}`,

        priority:
          '0.9',
      }),
    ),

    ...servicePages.map(
      (servicePage) => ({
        loc:
          `${canonical}${servicePage.path}`,

        priority:
          '0.9',
      }),
    ),
  ];


  await writeFile(
    path.join(
      clientDir,
      'sitemap.xml',
    ),

    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    federalObjectSitemapUrls
      .map(
        ({ loc, priority }) =>
          `  <url>\n` +
          `    <loc>${loc}</loc>\n` +
          `    <changefreq>monthly</changefreq>\n` +
          `    <priority>${priority}</priority>\n` +
          `  </url>\n`,
      )
      .join('') +
    `</urlset>\n`,

    'utf8',
  );


  /*
   * Google sitemap:
   * федеральная главная,
   * федеральные дочерние SEO-страницы
   * и только те региональные главные,
   * которые явно разрешены для индексации.
   *
   * Региональные object-type страницы
   * сюда намеренно НЕ добавляем.
   */
  const objectCanonicalUrl =
    new URL(
      canonical,
    );


  const googleObjectUrls = [
    ...federalObjectSitemapUrls.map(
      ({ loc }) => loc,
    ),

    ...getRegionalLocations()
      .filter(
        (location) =>
          location.seoIndexable === true,
      )
      .map(
        (location) =>
          `${objectCanonicalUrl.protocol}//` +
          `${location.slug}.` +
          `${objectCanonicalUrl.hostname}`,
      ),
  ];


  const uniqueGoogleObjectUrls =
    [...new Set(
      googleObjectUrls,
    )];


  await writeFile(
    path.join(
      clientDir,
      'sitemap-google.xml',
    ),

    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    uniqueGoogleObjectUrls
      .map(
        (url) =>
          `  <url>\n` +
          `    <loc>${url}</loc>\n` +
          `  </url>\n`,
      )
      .join('') +
    `</urlset>\n`,

    'utf8',
  );


  console.log(
    'Federal sitemap URLs:',
    federalObjectSitemapUrls.length,
  );
}

// === /FEDERAL OBJECT TYPE PRERENDER ===
