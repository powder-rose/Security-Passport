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
} from '../config/geography/index.mjs';


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


console.log(
  'Prerender city:',
  city.name,
);

console.log(
  'Prerender complete:',
  templatePath,
);
