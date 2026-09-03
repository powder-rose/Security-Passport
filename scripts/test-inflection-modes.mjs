import path from 'node:path';

import {
  fileURLToPath,
  pathToFileURL,
} from 'node:url';

import {
  LOCATIONS,
} from '../config/geography/index.mjs';


const __dirname =
  path.dirname(
    fileURLToPath(
      import.meta.url,
    ),
  );

const root =
  path.resolve(
    __dirname,
    '..',
  );

const serverEntry =
  path.join(
    root,
    'dist',
    'server',
    'entry-server.js',
  );

const { render } =
  await import(
    pathToFileURL(
      serverEntry,
    ).href
  );


const targets = [
  [
    'Воронеж',
    'Воронежская область',
  ],

  [
    'Охтеурье',
    'Ханты-Мансийский автономный округ — Югра',
  ],

  [
    'Сочи',
    'Краснодарский край',
  ],

  [
    'Лиски',
    'Воронежская область',
  ],

  [
    'Нижний Новгород',
    'Нижегородская область',
  ],

  [
    'Ростов-на-Дону',
    'Ростовская область',
  ],

  [
    'Москва',
    'Москва',
  ],

  [
    'Казань',
    'Республика Татарстан',
  ],
];


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


let failed = 0;


for (
  const [name, subject]
  of targets
) {
  const location =
    LOCATIONS.find(
      item =>
        item.name === name &&
        item.subject === subject,
    );

  if (!location) {
    console.log();
    console.log(
      '✗ NOT FOUND:',
      name,
      '|',
      subject,
    );

    failed += 1;
    continue;
  }


  const result =
    render({
      city: location,
    });


  const html =
    normalizeHtml(
      result.html,
    );


  const title =
    result.helmet
      ?.title
      ?.toString()
      ?.match(
        /<title[^>]*>(.*?)<\/title>/i,
      )?.[1] || '';


  const expectedHero =
    location.inflectionMode
      === 'neutral'
        ? location.name
        : `в ${location.prepositional}`;


  const heroOk =
    html.includes(
      expectedHero,
    );


  const titleOk =
    location.inflectionMode
      === 'neutral'
        ? (
            title.includes(
              location.name,
            )
            &&
            !title.includes(
              `в ${location.name}`,
            )
          )
        : title.includes(
            `в ${location.prepositional}`,
          );


  const badNeutralHtml =
    location.inflectionMode
      === 'neutral'
      &&
      html.includes(
        `в ${location.name}`,
      );


  const badNeutralTitle =
    location.inflectionMode
      === 'neutral'
      &&
      title.includes(
        `в ${location.name}`,
      );


  console.log();
  console.log(
    '========================================'
  );

  console.log(
    name,
    '|',
    subject,
  );

  console.log(
    'mode:',
    location.inflectionMode,
  );

  console.log(
    'slug:',
    location.slug,
  );

  console.log(
    'genitive:',
    location.genitive || '(empty)',
  );

  console.log(
    'prepositional:',
    location.prepositional || '(empty)',
  );

  console.log(
    'expected hero:',
    expectedHero,
  );

  console.log(
    'hero:',
    heroOk ? '✓' : '✗',
  );

  console.log(
    'title:',
    title,
  );

  console.log(
    'title check:',
    titleOk ? '✓' : '✗',
  );

  console.log(
    'bad neutral HTML:',
    badNeutralHtml
      ? '✗'
      : '✓',
  );

  console.log(
    'bad neutral title:',
    badNeutralTitle
      ? '✗'
      : '✓',
  );


  if (
    !heroOk ||
    !titleOk ||
    badNeutralHtml ||
    badNeutralTitle
  ) {
    failed += 1;
  }
}


console.log();
console.log(
  '========================================'
);

if (failed) {
  console.log(
    `✗ FAILED: ${failed}`
  );

  process.exitCode = 1;
} else {
  console.log(
    '✓ INFLECTION MODES SSR TEST PASSED'
  );
}
