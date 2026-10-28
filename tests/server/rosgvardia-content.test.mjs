import assert from 'node:assert/strict';
import test from 'node:test';
import { rosgvardiaObjectType } from '../../src/data/rosgvardiaObjectType.js';
import {
  rosgvardiaHeroActions,
  rosgvardiaHeroFacts,
  rosgvardiaSections,
} from '../../src/pages/RosgvardiaPage/rosgvardiaPageData.js';

function getSection(id) {
  const section = rosgvardiaSections.find(item => item.id === id);
  assert.ok(section, `Missing section: ${id}`);
  return section;
}

function collectStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

test('rosgvardia metadata preserves the approved standalone URL and SEO text', () => {
  assert.equal(rosgvardiaObjectType.id, 'rosgvardia');
  assert.equal(
    rosgvardiaObjectType.path,
    '/pasport-bezopasnosti-obekta-obyazatelnoj-ohrany-rosgvardii/',
  );
  assert.equal(
    rosgvardiaObjectType.h1,
    'Паспорт безопасности объекта, подлежащего обязательной охране Росгвардией',
  );
  assert.equal(
    rosgvardiaObjectType.seoTitle,
    'Паспорт безопасности объекта Росгвардии по ПП № 272 — от 9 500 ₽ | БОЙКОВГРУПП',
  );
  assert.equal(
    rosgvardiaObjectType.seoDescription,
    'Разработка паспорта безопасности объектов обязательной охраны Росгвардии по ПП РФ № 272. Категорирование, акт обследования, паспорт и сопровождение согласования. От 9 500 ₽. Работаем по России.',
  );
  assert.equal(rosgvardiaObjectType.regulationAct, 'ПП РФ № 272');
});

test('rosgvardia sections retain the approved order and unique headings', () => {
  const ids = rosgvardiaSections.map(section => section.id);
  assert.deepEqual(ids, [
    'objects',
    'regulations',
    'categorization',
    'commission',
    'act',
    'process',
    'approval',
    'copies',
    'confidentiality',
    'form',
    'service',
    'prices',
    'documents',
    'actualization',
    'comparison',
    'inspections',
    'standard',
    'advantages',
    'faq',
  ]);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(rosgvardiaSections.map(section => section.title)).size, ids.length);
  for (const section of rosgvardiaSections) {
    assert.match(section.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(section.title.trim());
    assert.ok(section.kicker.trim());
    assert.doesNotMatch(section.title, /^H[1-6]:/);
  }
});

test('rosgvardia hero retains four facts and distinct enquiry purposes', () => {
  assert.deepEqual(rosgvardiaHeroFacts, [
    'По ПП РФ № 272',
    'Три категории значимости',
    'Обследование, акт и паспорт',
    'Работаем по всей России',
  ]);
  assert.deepEqual(rosgvardiaHeroActions, [
    {
      label: 'Заказать паспорт безопасности',
      service: 'Разработка паспорта безопасности',
    },
    {
      label: 'Проверить требования для объекта',
      service: 'Проверить требования для объекта',
    },
  ]);
  for (const section of rosgvardiaSections) {
    if (!section.action) continue;
    assert.ok(section.action.label.trim());
    assert.ok(section.action.service.trim());
    assert.equal(section.action.href, undefined);
  }
});

test('rosgvardia applicability distinguishes mandatory protection from an ordinary contract', () => {
  const section = getSection('objects');
  assert.equal(
    section.note,
    'Важно: наличие договора с подразделением вневедомственной охраны Росгвардии само по себе не означает, что объект относится к объектам обязательной охраны по ПП РФ № 272.',
  );
  assert.ok(
    section.notes.includes(
      'Требования данного блока постановления не распространяются на объекты транспортной инфраструктуры, транспортные средства и объекты топливно-энергетического комплекса.',
    ),
  );
  assert.match(section.paragraphs[1], /включением в установленный перечень/);
});

test('rosgvardia categories use consequence scales instead of crowd headcounts', () => {
  const section = getSection('categorization');
  assert.deepEqual(section.table, {
    headers: ['Категория', 'Значимость', 'Критерий'],
    rows: [
      ['1', 'Высокая', 'Возможный федеральный или межрегиональный масштаб ущерба'],
      ['2', 'Средняя', 'Возможный региональный или межмуниципальный масштаб ущерба'],
      ['3', 'Низкая', 'Возможный муниципальный или локальный масштаб ущерба'],
    ],
  });
  assert.doesNotMatch(collectStrings(section).join(' '), /(?:50|200|1\s?000)\s+человек/);
});

test('rosgvardia commission includes four parties and separate procedural deadlines', () => {
  const section = getSection('commission');
  assert.deepEqual(section.members, [
    'правообладателя объекта;',
    'территориального органа безопасности;',
    'территориального органа Росгвардии или подразделения вневедомственной охраны;',
    'территориального органа МЧС России.',
  ]);
  assert.deepEqual(section.timing.table.rows, [
    [
      'Создание комиссии',
      'В течение 30 дней после включения объекта в перечень, а также в предусмотренных случаях повторного обследования',
    ],
    ['Обследование объекта', 'Не более 30 дней со дня создания комиссии'],
    ['Оформление результатов обследования', 'В течение 10 дней после завершения обследования'],
  ]);
  assert.ok(
    section.serviceNotes.includes(
      'Компания сопровождает процедуру, но не подменяет решения комиссии.',
    ),
  );
});

test('rosgvardia inspection act preserves its official name and five copies', () => {
  const section = getSection('act');
  assert.equal(
    section.paragraphs[0],
    'Официальное название: акт обследования объекта (территории).',
  );
  assert.deepEqual(section.table.rows, [
    ['Форма акта', 'Произвольная'],
    ['Количество экземпляров', '5'],
    ['Кто подписывает', 'Все члены комиссии'],
    ['Статус', 'Неотъемлемая часть паспорта'],
    ['Срок оформления', '10 дней после завершения обследования'],
  ]);
  assert.equal(section.items.length, 5);
  assert.equal(section.link.href, '/akt-obsledovaniya-i-kategorirovaniya-obekta/');
});

test('rosgvardia preparation retains eight ordered steps and the qualified deadline', () => {
  const section = getSection('process');
  assert.deepEqual(
    section.steps.map(step => step.title),
    [
      'Проверка применимости требований',
      'Сбор исходных данных',
      'Создание комиссии',
      'Обследование объекта',
      'Определение категории',
      'Оформление акта обследования',
      'Разработка паспорта безопасности',
      'Согласование и утверждение',
    ],
  );
  assert.equal(
    section.notes[0],
    'Срок: паспорт разрабатывается в течение 30 дней после обследования и категорирования объекта.',
  );
  assert.ok(section.steps.every(step => step.text.trim()));
});

test('rosgvardia approval separates three approving authorities from the object head', () => {
  const section = getSection('approval');
  assert.deepEqual(section.table.rows, [
    ['Территориальный орган безопасности', 'Согласование'],
    ['Росгвардия или подразделение вневедомственной охраны', 'Согласование'],
    ['Территориальный орган МЧС России', 'Согласование'],
    ['Руководитель объекта или уполномоченное лицо', 'Утверждение'],
  ]);
  assert.deepEqual(section.timing.items, [
    'Направление паспорта на согласование — в течение 3 рабочих дней после составления.',
    'Согласование — 10 рабочих дней со дня поступления в соответствующий орган.',
    'Доработка при замечаниях — 10 рабочих дней после получения паспорта правообладателем.',
    'Утверждение — 7 рабочих дней после поступления документа правообладателю.',
  ]);
  assert.doesNotMatch(collectStrings(section).join(' '), /МВД/);
});

test('rosgvardia passport distribution includes the object and four recipients including MVD', () => {
  const section = getSection('copies');
  assert.match(section.paragraphs[0], /в пяти экземплярах/);
  assert.equal(section.paragraphs[1], 'Первый экземпляр хранится на объекте.');
  assert.deepEqual(section.items, [
    'в территориальный орган безопасности;',
    'территориальный орган МВД России;',
    'территориальный орган Росгвардии;',
    'территориальный орган МЧС России.',
  ]);
  assert.equal(section.note, 'Количество экземпляров акта обследования — также пять.');
});

test('rosgvardia confidentiality and the twelve-part form remain separate sections', () => {
  const confidentiality = getSection('confidentiality');
  const form = getSection('form');
  assert.match(confidentiality.title, /документ ДСП/);
  assert.match(confidentiality.paragraphs[0], /если ему не присвоен гриф секретности/);
  assert.match(confidentiality.notes[1], /не через обычную открытую форму загрузки файлов/);
  assert.equal(form.items.length, 12);
  assert.equal(form.items[0], 'Общие сведения об объекте (территории).');
  assert.equal(form.items[11], 'Дополнительная информация.');
  assert.equal(
    form.paragraphs[1],
    'Она не совпадает с формой паспорта безопасности места массового пребывания людей.',
  );
  assert.equal(form.action.service, 'Получить форму паспорта безопасности');
});

test('rosgvardia tariffs preserve all four starting prices and the act service name', () => {
  const prices = getSection('prices').items;
  assert.deepEqual(
    prices.map(item => [item.number, item.title, item.pricePrefix, item.price]),
    [
      ['01', 'Разработка паспорта безопасности', 'от', '9 500 ₽'],
      ['02', 'Подготовка проекта акта обследования', 'от', '9 500 ₽'],
      ['03', 'Сопровождение согласования', 'от', '9 500 ₽'],
      ['04', 'Комплекс под ключ', 'от', '35 000 ₽'],
    ],
  );
  assert.deepEqual(
    prices.filter(item => item.featured).map(item => item.number),
    ['04'],
  );
  assert.ok(prices.every(item => item.service === item.title));
});

test('rosgvardia service and source-data groups remain complete', () => {
  const service = getSection('service');
  const documents = getSection('documents');
  assert.equal(service.items.length, 8);
  assert.equal(documents.items.length, 9);
  for (const item of [...service.items, ...documents.items]) {
    assert.ok(item.title.trim());
    assert.ok(item.text.trim());
  }
  assert.match(service.note, /Полномочия комиссии/);
  assert.match(documents.note, /точный перечень исходных данных определяется/);
});

test('rosgvardia actualization preserves the three-year interval and six change grounds', () => {
  const section = getSection('actualization');
  assert.match(section.paragraphs[0], /не реже одного раза в три года/);
  assert.equal(section.items.length, 6);
  assert.equal(
    section.notes[1],
    'Изменения вносятся во все экземпляры документа с указанием причины и даты.',
  );
  assert.equal(section.link.href, '/aktualizaciya-pasporta-bezopasnosti-obekta/');
});

test('rosgvardia comparison distinguishes its act, approval and five copies from crowd rules', () => {
  const table = getSection('comparison').table;
  assert.deepEqual(table.headers, ['Критерий', 'ММПЛ', 'Обязательная охрана Росгвардии']);
  assert.equal(table.rows.length, 8);
  assert.deepEqual(
    table.rows.find(row => row[0] === 'Паспорт'),
    ['Паспорт', '6 экземпляров', '5 экземпляров'],
  );
  assert.deepEqual(
    table.rows.find(row => row[0] === 'Акт'),
    ['Акт', 'Акт обследования и категорирования ММПЛ', 'Акт обследования объекта (территории)'],
  );
  assert.equal(
    table.rows.find(row => row[0] === 'Утверждение')[2],
    'Руководитель объекта либо уполномоченное лицо',
  );
});

test('rosgvardia inspections and GOST retain their own sections without replacing the regulation', () => {
  assert.deepEqual(getSection('inspections').facts, [
    'Плановые проверки проводятся один раз в год по утверждённому плану-графику.',
    'Продолжительность проверки не может превышать 30 рабочих дней.',
  ]);
  assert.match(getSection('standard').note, /ГОСТ Р 72551-2026 не заменяет ПП РФ № 272/);
  assert.equal(getSection('advantages').items.length, 5);
});

test('rosgvardia FAQ retains nineteen unique and fully populated answers', () => {
  const faq = getSection('faq').items;
  assert.equal(faq.length, 19);
  assert.equal(new Set(faq.map(item => item.question)).size, 19);
  for (const item of faq) {
    assert.ok(item.question.endsWith('?'));
    assert.ok(item.answer.trim());
  }
  assert.equal(
    faq[1].answer,
    'Не всегда. Наличие договора охраны само по себе не означает включение объекта в перечень обязательной охраны.',
  );
  assert.equal(faq[7].answer, 'Пять экземпляров.');
  assert.equal(faq[12].answer, 'Пять экземпляров.');
  assert.equal(
    faq[18].answer,
    'От 9 500 ₽ в зависимости от исходных данных и состава услуг; цена подлежит подтверждению по действующему прайсу.',
  );
});

test('rosgvardia content retains only approved internal links and no editorial instructions', () => {
  const links = rosgvardiaSections.flatMap(section => (section.link ? [section.link] : []));
  assert.deepEqual(
    links.map(link => link.href),
    [
      '/akt-obsledovaniya-i-kategorirovaniya-obekta/',
      '/aktualizaciya-pasporta-bezopasnosti-obekta/',
      '/pasport-bezopasnosti-mesta-massovogo-prebyvaniya-lyudej/',
    ],
  );
  const content = collectStrings([rosgvardiaObjectType, rosgvardiaSections]).join('\n');
  assert.doesNotMatch(
    content,
    /https?:\/\/|www\.|Wordstat|SEO-приоритет|Для программиста|Требования разработчику/,
  );
  assert.doesNotMatch(content, /распоряжени[^.\n]*№\s*\d/i);
  for (const link of links) {
    assert.match(link.href, /^\/[a-z-]+\/$/);
    assert.ok(link.label.trim());
  }
});
