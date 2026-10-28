import assert from 'node:assert/strict';
import test from 'node:test';
import { marketObjectType } from '../../src/data/marketObjectType.js';
import {
  marketHeroActions,
  marketHeroFacts,
  marketLinks,
  marketSections,
} from '../../src/pages/MarketPage/marketPageData.js';

function getSection(id) {
  const section = marketSections.find(item => item.id === id);
  assert.ok(section, `Missing section: ${id}`);
  return section;
}

function collectStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

function collectLinks(value) {
  if (!value || typeof value !== 'object') return [];
  const own = typeof value.href === 'string' ? [value.href] : [];
  return [...own, ...Object.values(value).flatMap(collectLinks)];
}

test('retail market metadata preserves the approved standalone URL and SEO copy', () => {
  assert.equal(marketObjectType.id, 'market');
  assert.equal(marketObjectType.path, '/pasport-bezopasnosti-roznichnogo-rynka/');
  assert.equal(
    marketObjectType.seoTitle,
    'Паспорт безопасности розничного рынка по ПП № 255 — от 9 500 ₽ | БОЙКОВГРУПП',
  );
  assert.equal(
    marketObjectType.seoDescription,
    'Разработка паспорта безопасности розничного рынка по ПП РФ № 255. Подготовка документа, согласование с МВД и госпожнадзором. От 9 500 ₽. Работаем по России.',
  );
  assert.equal(
    marketObjectType.h1,
    'Паспорт безопасности розничного рынка — разработка и согласование',
  );
  assert.equal(marketObjectType.seoTitle.split('БОЙКОВГРУПП').length, 2);
});

test('retail market metadata keeps a dedicated identity without hiding directory services', () => {
  assert.equal(marketObjectType.title, 'Розничные рынки');
  assert.equal(marketObjectType.quizOption, 'Розничные рынки');
  assert.equal(marketObjectType.regulationAct, 'ПП РФ № 255');
  assert.equal(marketObjectType.excludedServiceIds, undefined);
  assert.notEqual(marketObjectType.path, marketLinks.trade.href);
  assert.notEqual(marketObjectType.path, marketLinks.article.href);
});

test('retail market hero preserves its introduction, coverage and four approved facts', () => {
  assert.equal(
    marketObjectType.pageLead,
    'Разработаем паспорт безопасности розничного рынка в соответствии с постановлением Правительства РФ № 255. Подготовим документ с учётом типа рынка, организации торговли, требований к безопасности и установленного перечня сведений. Сопроводим согласование с уполномоченными органами.',
  );
  assert.equal(marketObjectType.pageCoverage, 'Работаем по всей России.');
  assert.deepEqual(marketHeroFacts, [
    'ПП РФ № 255',
    '4 экземпляра паспорта',
    'Подготовка и сопровождение согласования',
    'Работаем по всей России',
  ]);
  assert.deepEqual(marketHeroActions, [
    { label: 'Заказать паспорт', service: 'Разработка паспорта безопасности розничного рынка' },
    { label: 'Проверить требования для рынка', service: 'Проверить требования для рынка' },
  ]);
});

test('retail market sections preserve the approved order and unique heading identifiers', () => {
  const ids = marketSections.map(section => section.id);
  assert.deepEqual(ids, [
    'objects',
    'regulations',
    'responsibility',
    'form',
    'contents',
    'plans',
    'process',
    'approval',
    'copies',
    'sample',
    'prices',
    'documents',
    'actualization',
    'comparison',
    'current-requirements',
    'service',
    'advantages',
    'faq',
  ]);
  assert.equal(new Set(ids).size, 18);
  assert.equal(new Set(marketSections.map(section => section.title)).size, 18);
  for (const section of marketSections) {
    assert.match(section.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(section.title.trim());
    assert.ok(section.kicker.trim());
    assert.doesNotMatch(section.title, /^H[1-6]:/);
  }
});

test('retail market applicability distinguishes four market types from informal names', () => {
  const section = getSection('objects');
  assert.deepEqual(
    section.items.map(item => item.title),
    [
      'Универсальные рынки',
      'Специализированные рынки',
      'Сельскохозяйственные рынки',
      'Сельскохозяйственные кооперативные рынки',
    ],
  );
  assert.match(section.paragraphs[0], /Федеральным законом от 30 декабря 2006 года № 271-ФЗ/);
  assert.match(section.note, /не каждый объект, называемый рынком, автоматически относится/);
  assert.match(section.notes[0], /разрешения на право организации рынка/);
  assert.equal(section.action.label, 'Проверить требования для рынка');
});

test('retail market regulation defines required information rather than a unified blank form', () => {
  const section = getSection('regulations');
  assert.equal(section.title, 'Постановление Правительства РФ № 255');
  assert.match(section.paragraphs[0], /от 28 апреля 2007 года № 255/);
  assert.match(section.note, /не утверждает отдельную унифицированную форму/);
  assert.deepEqual(section.facts, [
    'ПП РФ № 255',
    'Федеральный закон № 271-ФЗ',
    '4 экземпляра паспорта',
    'Согласование с МВД и госпожнадзором',
  ]);
});

test('retail market management company retains preparation and approval responsibilities', () => {
  const section = getSection('responsibility');
  assert.equal(
    section.paragraphs[0],
    'В соответствии с ПП РФ № 255 паспорт безопасности составляет и утверждает управляющая рынком компания.',
  );
  assert.match(section.paragraphs[2], /специализированной организации на договорной основе/);
  assert.match(section.note, /Исполнитель документации не заменяет её/);
});

test('retail market document structure contains nine elements and an enquiry-only sample action', () => {
  const section = getSection('form');
  assert.equal(section.items.length, 9);
  assert.equal(section.items[0], 'Титульный лист.');
  assert.equal(section.items[8], 'Приложения — планы и схемы.');
  assert.match(section.paragraphs[0], /не содержит утверждённой унифицированной формы/);
  assert.match(section.note, /не означает, что паспорт можно составлять в произвольном виде/);
  assert.equal(section.action.label, 'Получить образец структуры паспорта рынка');
  assert.equal(section.action.href, undefined);
});

test('retail market content details keep all seven groups and nine general information fields', () => {
  const section = getSection('contents');
  assert.deepEqual(
    section.items.map(item => item.title),
    [
      'Общие сведения о рынке',
      'Сведения о работниках и продавцах',
      'Мероприятия по обеспечению безопасности',
      'Организация охраны',
      'Инженерные системы',
      'Пожарная безопасность',
      'Приложения',
    ],
  );
  assert.equal(section.items[0].items.length, 9);
  assert.ok(section.items[0].items.includes('Информация о разрешении на право организации рынка.'));
  assert.ok(section.items[0].items.includes('Расчётная максимальная посещаемость.'));
  assert.match(section.note, /фактическое состояние рынка на дату составления/);
});

test('retail market plans retain three types without providing actual protection diagrams', () => {
  const section = getSection('plans');
  assert.deepEqual(
    section.items.map(item => item.title),
    ['Ситуационный план', 'Поэтажные планы зданий и сооружений', 'Схемы инженерных коммуникаций'],
  );
  assert.match(section.paragraphs[0], /совместно с согласующими органами/);
  assert.match(section.note, /не публикуются в открытом доступе/);
  assert.match(section.notes[0], /в объёме, предусмотренном договором/);
});

test('retail market workflow contains seven steps with no categorization or mandatory act', () => {
  const section = getSection('process');
  assert.deepEqual(
    section.steps.map(step => step.title),
    [
      'Определение правового статуса рынка',
      'Сбор исходных сведений',
      'Анализ организации безопасности',
      'Подготовка проекта паспорта',
      'Подготовка приложений',
      'Согласование паспорта',
      'Утверждение и оформление экземпляров',
    ],
  );
  assert.deepEqual(
    section.steps.map(step => step.number),
    ['01', '02', '03', '04', '05', '06', '07'],
  );
  assert.doesNotMatch(
    collectStrings(section.steps).join(' '),
    /категорирован|комисси|акт обследования/i,
  );
  assert.match(section.note, /не предусматривает самостоятельного категорирования/);
});

test('retail market approval has exactly two authorities and separate management approval', () => {
  const section = getSection('approval');
  assert.deepEqual(section.authorities, [
    'С соответствующими органами внутренних дел по месту расположения рынка.',
    'С соответствующими органами государственного пожарного надзора по месту расположения рынка.',
  ]);
  assert.equal(
    section.approval,
    'После предусмотренного согласования документ утверждается управляющей рынком компанией.',
  );
  assert.match(section.notes[1], /получает копию документа согласно пункту 3/);
  assert.doesNotMatch(section.authorities.join(' '), /ФСБ|Росгвард/);
});

test('retail market approval does not promise a universal fixed processing time', () => {
  const section = getSection('approval');
  assert.equal(
    section.timing.paragraphs[0],
    'ПП РФ № 255 не устанавливает общего срока согласования паспорта безопасности розничного рынка.',
  );
  assert.match(section.timing.paragraphs[1], /взаимодействия с согласующими органами/);
  assert.doesNotMatch(collectStrings(section).join(' '), /(?:10|30)\s+(?:рабочих\s+)?дней/);
});

test('retail market passport has four copies plus a separately described additional copy', () => {
  const section = getSection('copies');
  assert.deepEqual(section.table, {
    headers: ['Получатель', 'Количество'],
    rows: [
      ['Орган внутренних дел', '1'],
      ['Орган государственного пожарного надзора', '1'],
      ['Орган местного самоуправления, выдавший разрешение', '1'],
      ['Управляющая рынком компания', '1'],
    ],
  });
  assert.equal(
    section.table.rows.reduce((sum, row) => sum + Number(row[1]), 0),
    4,
  );
  assert.equal(
    section.copy,
    'Дополнительно копия паспорта направляется в территориальный орган безопасности.',
  );
  assert.match(section.note, /не одно и то же/);
});

test('retail market sample stays unfilled and does not impose a universal DSP marking', () => {
  const section = getSection('sample');
  assert.match(section.paragraphs[2], /незаполненный шаблон структуры паспорта/);
  assert.match(section.paragraphs[2], /не содержащий сведений о действующей системе охраны/);
  assert.equal(
    section.note,
    'Важно: ПП РФ № 255 само по себе не устанавливает обязательную пометку «Для служебного пользования» для каждого паспорта розничного рынка.',
  );
  assert.equal(section.action.label, 'Получить образец структуры паспорта');
  assert.equal(section.action.href, undefined);
});

test('retail market pricing preserves two starting prices and one calculated offer', () => {
  const section = getSection('prices');
  assert.equal(section.priceLabel, 'Предварительная стоимость');
  assert.equal(section.items.length, 3);
  assert.deepEqual(
    section.items.map(item => [item.title, item.pricePrefix, item.price]),
    [
      ['Разработка паспорта безопасности розничного рынка', 'от', '9 500 ₽'],
      ['Сопровождение согласования', 'от', '9 500 ₽'],
      ['Комплексное оформление паспорта и сопровождение согласования', '', 'По расчёту'],
    ],
  );
  assert.equal(section.items.filter(item => item.featured).length, 1);
  assert.equal(section.action.label, 'Рассчитать стоимость паспорта');
  assert.doesNotMatch(
    collectStrings(section.items).join(' '),
    /категорирован|акт обследования|35\s*000/i,
  );
});

test('retail market initial data keeps twelve groups and secure document transfer guidance', () => {
  const section = getSection('documents');
  assert.equal(section.table.rows.length, 12);
  assert.equal(section.table.rows[1][0], 'Разрешение');
  assert.equal(section.table.rows[11][1], 'Предыдущий паспорт при наличии');
  assert.match(section.notes[0], /определяется после проверки объекта/);
  assert.match(section.notes[1], /согласованным безопасным способом/);
});

test('retail market updates keep six grounds and the qualified ten-day and three-day periods', () => {
  const section = getSection('actualization');
  assert.equal(section.items.length, 6);
  assert.equal(
    section.timing.paragraphs[0],
    'Срок внесения изменений — не позднее 10 дней с даты соответствующего изменения.',
  );
  assert.equal(
    section.timing.paragraphs[1],
    'Управляющая рынком компания обязана в течение трёх дней после внесения изменений письменно уведомить согласующие органы, а также территориальный орган безопасности.',
  );
  assert.match(section.note, /не устанавливает универсальный период/);
  assert.equal(section.link, marketLinks.actualization);
});

test('retail market comparison preserves all nine distinctions from regulation 1273', () => {
  const section = getSection('comparison');
  assert.equal(section.table.rows.length, 9);
  assert.deepEqual(section.table.headers, [
    'Критерий',
    'Розничный рынок по № 255',
    'Торговый объект по № 1273',
  ]);
  assert.deepEqual(section.table.rows[3], ['Унифицированная форма', 'Не утверждена', 'Утверждена']);
  assert.deepEqual(section.table.rows[4], [
    'Категорирование по соответствующему постановлению',
    'Отдельная процедура не предусмотрена',
    'Предусмотрено',
  ]);
  assert.deepEqual(section.table.rows[5], [
    'Акт категорирования',
    'Не предусмотрен № 255',
    'Предусмотрен',
  ]);
  assert.deepEqual(section.table.rows[6], [
    'Количество экземпляров',
    '4',
    '2 по редакции 2026 года',
  ]);
  assert.match(
    section.notes[0],
    /Применимость этого положения к конкретному рынку необходимо оценивать/,
  );
  assert.equal(section.link, marketLinks.trade);
});

test('retail market current requirements have no invented GOST or categorization section', () => {
  const section = getSection('current-requirements');
  assert.equal(section.title, 'Требования к паспорту безопасности розничного рынка в 2026 году');
  assert.equal(section.paragraphs.length, 3);
  assert.match(section.paragraphs[0], /от 28\.04\.2007 № 255/);
  assert.doesNotMatch(collectStrings(section).join(' '), /ГОСТ|обязательное категорирование/);
  for (const id of ['categorization', 'act', 'standard', 'confidentiality']) {
    assert.equal(
      marketSections.some(item => item.id === id),
      false,
    );
  }
});

test('retail market service scope keeps nine deliverables within the agreed contract', () => {
  const section = getSection('service');
  assert.equal(section.table.rows.length, 9);
  assert.deepEqual(section.table.rows[4], [
    'Подготовка приложений в рамках договора',
    'Необходимые планы и схемы',
  ]);
  assert.deepEqual(section.table.rows[8], [
    'Подготовка итоговой редакции',
    'Документ для утверждения управляющей компанией',
  ]);
  assert.equal(
    section.paragraphs[2],
    'Итоговый состав работ определяется после проверки объекта и согласуется с заказчиком.',
  );
});

test('retail market advantages contain five approved statements without invented metrics', () => {
  assert.deepEqual(getSection('advantages').items, [
    'Работа с нормативными требованиями к безопасности объектов.',
    'Подготовка паспортов по конкретным постановлениям Правительства РФ.',
    'Разработка документов с учётом особенностей объекта.',
    'Сопровождение оформления и согласования.',
    'Работа с заказчиками по России.',
  ]);
  assert.equal(getSection('advantages').link, marketLinks.home);
});

test('retail market FAQ includes all eighteen unique questions and substantive answers', () => {
  const items = getSection('faq').items;
  assert.equal(items.length, 18);
  assert.equal(new Set(items.map(item => item.id)).size, 18);
  assert.equal(new Set(items.map(item => item.question)).size, 18);
  for (const item of items) {
    assert.match(item.id, /^market-faq-\d{2}$/);
    assert.ok(item.question.endsWith('?'));
    assert.ok(item.answer.length > 20);
  }
  assert.equal(items[0].question, 'Нужен ли паспорт безопасности розничному рынку?');
  assert.equal(items[17].question, 'Сколько стоит разработка паспорта безопасности рынка?');
});

test('retail market FAQ retains the critical approval, copies, categorization and DSP qualifications', () => {
  const items = getSection('faq').items;
  assert.match(items[6].answer, /Копия паспорта направляется в территориальный орган безопасности/);
  assert.match(items[7].answer, /^Четыре экземпляра\. Дополнительно копия/);
  assert.match(items[8].answer, /^Нет\. ПП № 255 не устанавливает/);
  assert.equal(items[12].answer, 'Не позднее 10 дней с даты соответствующего изменения.');
  assert.match(items[13].answer, /трёх дней с даты внесения изменений/);
  assert.match(items[15].answer, /не устанавливает обязательную пометку ДСП/);
  assert.match(items[17].answer, /Предварительная стоимость — от 9 500 ₽/);
});

test('retail market links use only the four specified internal destinations', () => {
  assert.deepEqual(
    Object.values(marketLinks).map(link => link.href),
    [
      '/',
      '/pasport-bezopasnosti-torgovogo-obekta/',
      '/blog/pasport-bezopasnosti-rynka/',
      '/aktualizaciya-pasporta-bezopasnosti-obekta/',
    ],
  );
  const allowed = new Set(Object.values(marketLinks).map(link => link.href));
  for (const href of collectLinks([marketSections, marketLinks])) {
    assert.ok(allowed.has(href), `Unexpected link: ${href}`);
    assert.match(href, /^\/(?!\/)/);
    assert.ok(href.endsWith('/'));
  }
  assert.equal(allowed.has('/akt-obsledovaniya-i-kategorirovaniya-obekta/'), false);
});

test('retail market enquiry actions preserve context without unverified downloads', () => {
  const actions = [
    ...marketHeroActions,
    ...marketSections.filter(section => section.action).map(section => section.action),
  ];
  assert.equal(actions.length, 6);
  for (const item of [...actions, ...getSection('prices').items]) {
    assert.ok(item.service.trim());
    assert.equal(item.href, undefined);
    assert.doesNotMatch(item.service, /категорирован|акт обследования/i);
  }
});

test('retail market public copy excludes implementation instructions, external URLs and extra aliases', () => {
  const copy = collectStrings([
    marketObjectType,
    marketHeroFacts,
    marketHeroActions,
    marketSections,
  ]).join('\n');
  assert.doesNotMatch(copy, /https?:\/\/|Wordstat|Для программиста|SEO-логика|Перед публикацией/);
  assert.doesNotMatch(
    copy,
    /не указывать|не переносить|административной панели|отдельный рекламный блок/i,
  );
  assert.doesNotMatch(
    copy,
    /\/pasport-bezopasnosti-rynka-255\/|\/pasport-bezopasnosti-prodovolstvennogo-rynka\//,
  );
});
