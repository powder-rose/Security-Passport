import path from 'node:path';
import {
  fileURLToPath,
  pathToFileURL,
} from 'node:url';

import {
  DEFAULT_LOCATION,
  getRegionalLocations,
} from '../config/geography/index.mjs';


const __dirname =
  path.dirname(
    fileURLToPath(import.meta.url),
  );

const projectRoot =
  path.resolve(__dirname, '..');

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


const locations = [
  DEFAULT_LOCATION,
  ...getRegionalLocations(),
];


console.log(
  '========================================'
);

console.log(
  'ONE BUILD → MULTIPLE GEOGRAPHIES'
);

console.log(
  '========================================'
);


for (const location of locations) {
  const result =
    render({
      city: location,
    });

  const title =
    result.helmet
      ?.title
      ?.toString()
      ?.match(
        /<title[^>]*>(.*?)<\/title>/i,
      )?.[1] || '';

  const canonical =
    result.helmet
      ?.link
      ?.toString()
      ?.match(
        /rel="canonical" href="([^"]+)"/i,
      )?.[1] || '';

  const expectedCanonical =
    location.isDefault
      ? 'https://pasport-bezopasnosty.ru'
      : `https://${location.slug}.pasport-bezopasnosty.ru`;

  const normalizedHtml =
    result.html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/&nbsp;|&#xA0;|&#xa0;|&#160;/g, ' ')
      .replace(/\s+/g, ' ');

  const expectedHeroLocation =
    location.inflectionMode === 'neutral'
      ? location.name
      : `в ${location.prepositional}`;

  const heroOk =
    normalizedHtml.includes(
      expectedHeroLocation,
    );

  const addressOk =
    !location.address ||
    result.html.includes(
      location.address,
    );

  const canonicalOk =
    canonical === expectedCanonical;


  console.log();

  console.log(
    location.isDefault
      ? 'ФЕДЕРАЛЬНАЯ'
      : location.name,
  );

  console.log(
    `slug:      ${location.slug || '(root)'}`,
  );

  console.log(
    `title:     ${title}`,
  );

  console.log(
    `canonical: ${canonical}`,
  );

  console.log(
    `hero:      ${heroOk ? '✓' : '✗'}`,
  );

  console.log(
    `address:   ${addressOk ? '✓' : '✗'}`,
  );

  console.log(
    `canonical: ${canonicalOk ? '✓' : '✗'}`,
  );


  if (
    !heroOk ||
    !addressOk ||
    !canonicalOk
  ) {
    process.exitCode = 1;
  }
}


console.log();

if (!process.exitCode) {
  console.log(
    '✓ ОДНА СБОРКА УСПЕШНО РЕНДЕРИТ ВСЕ ГЕОГРАФИИ',
  );
}
