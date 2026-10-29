import assert from 'node:assert/strict';
import test from 'node:test';
import { waterObjectType } from '../../src/data/waterObjectType.js';
import {
  waterHeroActions,
  waterHeroFacts,
  waterHeroPrice,
  waterLinks,
  waterRegulationSummary,
  waterSections,
  waterTransition,
} from '../../src/pages/WaterPage/waterPageData.js';

function section(id) {
  const value = waterSections.find(item => item.id === id);
  assert.ok(value, `Missing water section: ${id}`);
  return value;
}

function strings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

function links(value) {
  if (!value || typeof value !== 'object') return [];
  return [
    ...(typeof value.href === 'string' ? [value] : []),
    ...Object.values(value).flatMap(links),
  ];
}

const approvedSectionIds = [
  'applicability',
  'objects',
  'exclusions',
  'regulations',
  'changes',
  'transition',
  'registry',
  'categorization',
  'categories',
  'separate-objects',
  'commission',
  'act',
  'after-categorization',
  'process',
  'approval',
  'copies',
  'validity',
  'amendments',
  'restricted',
  'form',
  'protection',
  'inspections',
  'service',
  'prices',
  'documents',
  'standard',
  'advantages',
  'faq',
];

const faq = section('faq').items;

test('water metadata preserves the single approved address and exact SEO copy', () => {
  assert.equal(waterObjectType.id, 'water');
  assert.equal(
    waterObjectType.path,
    '/pasport-bezopasnosti-obekta-vodosnabzheniya-i-vodootvedeniya/',
  );
  assert.equal(
    waterObjectType.seoTitle,
    'Паспорт безопасности водоснабжения и водоотведения по ПП № 1467 | БОЙКОВГРУПП',
  );
  assert.equal(
    waterObjectType.seoDescription,
    'Разработка паспорта безопасности объекта водоснабжения и водоотведения по ПП № 1467. Категорирование, акт, согласование, обновление по изменениям 2026 года. От 9 500 ₽.',
  );
  assert.equal(waterObjectType.h1, 'Паспорт безопасности объекта водоснабжения и водоотведения');
  assert.equal(waterObjectType.seoTitle.split('БОЙКОВГРУПП').length, 2);
});

test('water catalog data preserves the brief title and description without hiding other services', () => {
  assert.equal(
    waterObjectType.title,
    'Паспорт безопасности объектов водоснабжения и водоотведения',
  );
  assert.equal(
    waterObjectType.description,
    'Разработка по ПП РФ № 1467. Водозаборы, насосные станции, очистные сооружения.',
  );
  assert.equal(waterObjectType.regulationAct, 'ПП РФ № 1467');
  assert.equal(waterObjectType.excludedServiceIds, undefined);
});

test('water hero preserves both approved introductory paragraphs and five facts', () => {
  assert.equal(
    waterObjectType.pageLead,
    'Разработаем паспорт безопасности объекта водоснабжения и водоотведения по действующей редакции ПП РФ № 1467. Подготовим материалы для обследования и категорирования, проект акта, паспорт по утверждённой форме и комплект для согласования с уполномоченными органами.',
  );
  assert.equal(
    waterObjectType.pageCoverage,
    'Работаем с водоканалами, водозаборами, насосными станциями и очистными сооружениями по всей России. Учитываем изменения октября 2026 года.',
  );
  assert.deepEqual(waterHeroFacts, [
    'ПП РФ № 1467',
    'Редакция октября 2026 года',
    'Категорирование + акт + паспорт',
    'Сопровождение согласования',
    'Работаем по России',
  ]);
  assert.deepEqual(
    waterHeroActions.map(item => item.label),
    ['Заказать паспорт', 'Проверить требования к объекту'],
  );
});

test('water starting price is qualified and does not promise the complete service cycle', () => {
  assert.equal(waterHeroPrice.pricePrefix, 'от');
  assert.equal(waterHeroPrice.price, '9 500 ₽');
  assert.equal(
    waterHeroPrice.note,
    'Цена от 9 500 ₽ относится к разработке паспорта при наличии необходимых исходных документов и не означает стоимость всех работ по категорированию и согласованию.',
  );
});

test('water regulation summary retains the amendment and its approved effective date', () => {
  assert.equal(waterRegulationSummary.id, 'regulation-summary');
  assert.equal(waterRegulationSummary.title, 'ПП РФ № 1467');
  assert.equal(waterRegulationSummary.edition, 'Изменения № 1340 — с 16.10.2026.');
});

test('water sections preserve 31 page positions including the hero, summary and final form', () => {
  assert.deepEqual(
    waterSections.map(item => item.id),
    approvedSectionIds,
  );
  const pageIds = ['water-hero', waterRegulationSummary.id, ...approvedSectionIds, 'lead-form'];
  assert.equal(pageIds.length, 31);
  assert.equal(new Set(pageIds).size, 31);
  assert.ok(!pageIds.includes('top'));
  assert.equal(new Set(waterSections.map(item => item.title)).size, 28);
  for (const item of waterSections) {
    assert.match(item.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(item.title.trim());
    assert.ok(item.kicker.trim());
    assert.doesNotMatch(item.title, /^H[1-6]:/);
  }
});

test('water applicability requires the regional list and preserves the paragraph 13 qualification', () => {
  const value = section('applicability');
  assert.equal(value.items.length, 4);
  assert.deepEqual(
    value.items.map(item => item.title),
    [
      'Назначение объекта',
      'Региональный перечень',
      'Отсутствие исключений',
      'Эксплуатирующая организация',
    ],
  );
  assert.match(value.paragraphs[0], /включённых в региональные перечни/);
  assert.match(value.note, /если объект не включён/);
  assert.match(value.note, /не распространяются/);
  assert.match(value.note, /самостоятельно определяет содержание и порядок/);
  assert.match(value.note, /пункту 13/);
});

test('water object cards preserve seven approved types and exclude networks', () => {
  const value = section('objects');
  assert.deepEqual(
    value.items.map(item => item.title),
    [
      'Водозаборы',
      'Очистные сооружения водопровода',
      'Водопроводные насосные станции',
      'Резервуары и водонапорные башни',
      'Очистные сооружения канализации',
      'Канализационные насосные станции',
      'Объекты водоканалов',
    ],
  );
  assert.equal(
    value.note,
    'водопроводные и канализационные сети прямо исключены из определения объектов в пункте 2 ПП № 1467.',
  );
  assert.match(value.items[6].text, /Отдельные объекты/);
});

test('water exclusions retain all four qualifications instead of exempting entire industries', () => {
  const value = section('exclusions');
  assert.equal(value.items.length, 4);
  assert.match(value.items[0], /обязательной охране Росгвардией/);
  assert.match(value.items[1], /для собственных нужд.*при соблюдении условий пункта 3/);
  assert.match(value.items[3], /в части оборудования инженерно-техническими средствами/);
  assert.match(value.note, /в точном объёме/);
  assert.match(
    value.note,
    /Нельзя считать, что любой объект промышленного предприятия автоматически освобождён/,
  );
});

test('water regulation and revision content retains all eight subjects and six changes', () => {
  assert.equal(section('regulations').items.length, 8);
  assert.match(section('regulations').paragraphs[0], /23 декабря 2016 года № 1467/);
  const changes = section('changes');
  assert.equal(changes.items.length, 6);
  assert.deepEqual(
    changes.items.map(item => item.title),
    [
      'Критические элементы и опасные участки',
      'Беспилотные аппараты',
      'Организационные документы',
      'Инженерно-технические мероприятия',
      'Замена паспорта',
      'Форма паспорта',
    ],
  );
  assert.match(changes.items[3].text, /независимо от категории/);
  assert.match(changes.items[3].text, /для объектов первой и второй категорий/);
});

test('water transition preserves the six-month deadline and exact enquiry subject', () => {
  assert.equal(section('transition'), waterTransition);
  assert.equal(waterTransition.enabled, true);
  assert.equal(waterTransition.effectiveDate, '2026-10-16');
  assert.equal(waterTransition.deadline, '2027-04-16');
  assert.equal(
    waterTransition.title,
    'Действующие паспорта необходимо привести в соответствие до 16 апреля 2027 года',
  );
  assert.match(waterTransition.paragraphs[0], /действующих на эту дату паспортов/);
  assert.match(waterTransition.paragraphs[0], /шестимесячный срок/);
  assert.equal(waterTransition.action.label, 'Проверить действующий паспорт');
  assert.equal(
    waterTransition.action.service,
    'Приведение паспорта в соответствие с изменениями № 1340',
  );
  assert.equal(
    waterTransition.note,
    'Необходимость повторных процедур определяется конкретными изменениями и нормативными основаниями.',
  );
});

test('water registry keeps formation, approval, confidentiality and notification distinct', () => {
  const value = section('registry');
  assert.equal(value.paragraphs.length, 4);
  assert.match(
    value.paragraphs[1],
    /формируется уполномоченным органом.*утверждается высшим должностным лицом/,
  );
  assert.match(
    value.paragraphs[2],
    /«Для служебного пользования», если ему не присвоен гриф секретности/,
  );
  assert.match(value.paragraphs[3], /уведомляется о его включении/);
  assert.equal(links(value).length, 0);
});

test('water categorization keeps six indicators and the highest applicable criterion', () => {
  const value = section('categorization');
  assert.equal(value.items.length, 6);
  assert.match(value.conclusion, /наивысшему показателю любого/);
  assert.match(value.note, /нельзя определять исключительно по площади.*численности работников/);
});

test('water categories retain all four rows and the incomplete-criteria disclaimer', () => {
  const value = section('categories');
  assert.deepEqual(value.table.headers, ['Категория', 'Примеры критериев']);
  assert.deepEqual(
    value.table.rows.map(row => row[0]),
    ['Первая', 'Вторая', 'Третья', 'Четвёртая'],
  );
  assert.match(value.table.rows[0][1], /более 500 тыс.*более 500 млн/);
  assert.match(value.table.rows[1][1], /от 200 до 500 тыс.*от 200 до 500 млн/);
  assert.match(value.table.rows[2][1], /от 100 до 200 тыс.*отдельные объекты водоотведения/);
  assert.match(value.table.rows[3][1], /от 50 до 100 млн.*другие критерии пункта 10/);
  assert.match(value.notes[0], /не заменяет полный перечень пункта 10/);
  assert.match(value.notes[1], /дополнительные критерии по объектам водоотведения/);
});

test('water separate-object rules preserve more than 500 metres and different operators', () => {
  const value = section('separate-objects');
  assert.match(value.paragraphs[1], /более 500 метров/);
  assert.match(value.paragraphs[1], /обособленных территориях/);
  assert.match(value.paragraphs[2], /эксплуатируются разными организациями/);
  assert.match(
    value.conclusion,
    /составом, территориальным расположением и организацией эксплуатации/,
  );
});

test('water commission is created by the operating organization within two months of notification', () => {
  const value = section('commission');
  assert.match(
    value.paragraphs[0],
    /Решением руководителя организации, осуществляющей эксплуатацию/,
  );
  assert.equal(
    value.timing,
    'Срок создания комиссии: в течение двух месяцев после получения уведомления о включении объекта в региональный перечень.',
  );
  assert.match(
    value.chair,
    /руководитель эксплуатирующей организации или уполномоченный им заместитель/,
  );
  assert.match(value.members[0], /пунктом 16/);
  assert.equal(
    value.note,
    'категория определяется комиссией, а не подрядчиком по подготовке документов.',
  );
});

test('water act retains its exact name, one copy and all seven normative parameters', () => {
  const value = section('act');
  assert.equal(
    value.documentName,
    'Акт обследования и категорирования объекта водоснабжения и водоотведения.',
  );
  assert.deepEqual(value.table.rows, [
    ['Составляет', 'Комиссия'],
    ['Экземпляров', '1'],
    ['Подписывает', 'Все члены комиссии'],
    ['Утверждает', 'Председатель комиссии'],
    ['Статус', 'Основание для разработки паспорта'],
    ['Приложение', 'Приобщается к паспорту'],
    ['Режим информации', 'ДСП, если не присвоен гриф секретности'],
  ]);
  assert.match(value.note, /акт не заменяет паспорт безопасности/);
  assert.equal(value.action.label, 'Заказать подготовку акта');
});

test('water post-categorization separates one-month notification and five-year implementation', () => {
  const value = section('after-categorization');
  assert.equal(value.timing, 'Срок уведомления — один месяц со дня утверждения акта.');
  assert.match(value.exclusion, /отсутствуют.*исключение объекта из перечня/);
  assert.equal(value.items.length, 3);
  assert.match(value.implementation[0], /пяти лет со дня подписания акта/);
  assert.equal(value.implementation[1], 'Этот срок не равен сроку разработки паспорта.');
});

test('water workflow preserves eight steps and the three-month development-and-approval window', () => {
  const value = section('process');
  assert.deepEqual(
    value.steps.map(item => item.title),
    [
      'Проверка применимости',
      'Анализ документации',
      'Подготовка к категорированию',
      'Обследование и определение категории',
      'Оформление акта',
      'Разработка паспорта',
      'Согласование',
      'Утверждение',
    ],
  );
  assert.equal(value.steps[3].text, 'Комиссия проводит установленную процедуру.');
  assert.equal(
    value.timing,
    'Срок разработки и согласования паспорта: в течение трёх месяцев со дня утверждения акта обследования и категорирования.',
  );
  assert.doesNotMatch(strings(value).join(' '), /30 дней/);
});

test('water approval keeps four approving bodies and the operating manager as final approver', () => {
  const value = section('approval');
  assert.deepEqual(
    value.authorities.map(item => item.title),
    [
      'Территориальным органом безопасности',
      'Территориальным органом Росгвардии или подразделением вневедомственной охраны',
      'Территориальным органом МЧС России',
      'Уполномоченным органом субъекта Российской Федерации',
    ],
  );
  assert.equal(
    value.approval,
    'Руководитель организации, эксплуатирующей объект водоснабжения и водоотведения, либо уполномоченный им заместитель.',
  );
  assert.match(value.note, /не заменяет утверждающего руководителя/);
});

test('water passport uses one original with copies sent to only the two specified recipients', () => {
  const value = section('copies');
  assert.equal(
    value.paragraphs[0],
    'Паспорт безопасности объекта водоснабжения и водоотведения составляется в одном экземпляре.',
  );
  assert.match(value.paragraphs[1], /на объекте либо в организации/);
  assert.deepEqual(value.recipients, [
    'в территориальный орган безопасности;',
    'в территориальный орган МЧС России.',
  ]);
  assert.match(value.listLabel, /копии или электронные копии/);
});

test('water validity keeps five years, seven replacement triggers and a separate three-month limit', () => {
  const value = section('validity');
  assert.equal(value.paragraphs[0], 'Срок действия паспорта — пять лет.');
  assert.match(value.paragraphs[1], /предварительным подтверждением присвоенной объекту категории/);
  assert.equal(value.replacement.items.length, 7);
  assert.match(value.replacement.items[5], /в пределах, влияющих на категорию/);
  assert.equal(
    value.replacement.timing,
    'При указанных обстоятельствах замена осуществляется в течение трёх месяцев.',
  );
});

test('water paragraph 72 amendments retain their decision, reasons and notification documents', () => {
  const value = section('amendments');
  assert.match(value.paragraphs[0], /Пункт 72.*не влекущих замены.*по решению руководителя/);
  assert.equal(value.paragraphs[1], 'При этом указываются причины и дата внесения изменений.');
  assert.match(
    value.paragraphs[2],
    /Копии текста изменений и соответствующего распорядительного акта/,
  );
  assert.match(value.paragraphs[2], /безопасности и МЧС России/);
});

test('water restricted-information content preserves the secrecy qualification for both documents', () => {
  const value = section('restricted');
  assert.match(
    value.paragraphs[1],
    /«Для служебного пользования», если ему не присваивается гриф секретности/,
  );
  assert.match(value.paragraphs[2], /для акта обследования и категорирования/);
  assert.equal(value.allowed.items.length, 4);
  assert.equal(value.restricted.items.length, 4);
  assert.ok(value.restricted.items.includes('Закрытые перечни объектов.'));
  assert.ok(value.restricted.items.includes('Заполненный паспорт действующего объекта.'));
});

test('water passport form retains four roman-numbered sections, eight attachments and a form CTA', () => {
  const value = section('form');
  assert.deepEqual(
    value.items.map(item => item.number),
    ['I', 'II', 'III', 'IV'],
  );
  assert.equal(value.items.length, 4);
  assert.equal(value.attachments.items.length, 8);
  assert.match(value.paragraphs[1], /В октябре 2026 года форма изменена ПП РФ № 1340/);
  assert.equal(value.action.label, 'Получить актуальную форму паспорта');
  assert.equal(links(value).length, 0);
});

test('water protection retains nine measure groups and conditional automated-site arrangements', () => {
  const value = section('protection');
  assert.equal(value.items.length, 9);
  assert.match(value.items[8], /беспилотным аппаратам.*редакции 2026 года/);
  assert.match(value.notes[0], /установленной категории и результатов обследования/);
  assert.match(
    value.notes[1],
    /отдельных автоматизированных объектов третьей и четвёртой категорий/,
  );
  assert.match(value.notes[1], /при соблюдении установленных условий/);
});

test('water inspection table preserves all four categories and distinct 15-day and five-day limits', () => {
  const value = section('inspections');
  assert.deepEqual(value.table.rows, [
    ['Первая', 'Не реже одного раза в год'],
    ['Вторая', 'Не реже одного раза в год'],
    ['Третья', 'Не реже одного раза в два года'],
    ['Четвёртая', 'Не реже одного раза в два года'],
  ]);
  assert.equal(value.scheduled, 'Максимальный срок плановой проверки — 15 дней.');
  assert.match(value.unscheduled, /не может превышать пяти дней/);
  assert.equal(value.result, 'По итогам проверки составляется акт контроля.');
  assert.match(value.note, /акт контроля и акт обследования и категорирования — разные документы/);
});

test('water service scope preserves eight cards and documentary support rather than commission decisions', () => {
  const value = section('service');
  assert.equal(value.items.length, 8);
  assert.equal(
    value.items[3].text,
    'Готовим сведения и расчётные материалы для рассмотрения комиссией.',
  );
  assert.equal(value.items[4].text, 'Подготавливаем проект акта обследования и категорирования.');
  assert.match(value.items[7].text, /в рамках договора/);
});

test('water pricing retains four starting-price offers and their limiting descriptions', () => {
  const value = section('prices');
  assert.deepEqual(
    value.items.map(item => item.title),
    [
      'Паспорт безопасности',
      'Акт обследования и категорирования',
      'Сопровождение согласования',
      'Комплекс под ключ',
    ],
  );
  assert.deepEqual(
    value.items.map(item => item.price),
    ['9 500 ₽', '9 500 ₽', '9 500 ₽', '35 000 ₽'],
  );
  assert.ok(value.items.every(item => item.pricePrefix === 'от'));
  assert.match(value.items[0].description, /при наличии необходимых исходных документов/);
  assert.match(value.items[1].description, /проекта акта.*для комиссии/);
  assert.match(value.items[3].description, /после определения исходных данных/);
  assert.equal(value.items.filter(item => item.featured).length, 1);
  assert.equal(value.items[3].featured, true);
});

test('water revision service remains separately calculated without an invented tariff', () => {
  const value = section('prices').additionalService;
  assert.equal(value.title, 'Приведение паспорта в соответствие с изменениями ПП № 1340.');
  assert.equal(
    value.description,
    'Стоимость рассчитывается по состоянию и объёму существующей документации.',
  );
  assert.equal(value.price, undefined);
  assert.equal(section('prices').action.label, 'Рассчитать стоимость');
});

test('water source requirements retain ten groups and safe document transfer', () => {
  const value = section('documents');
  assert.equal(value.items.length, 10);
  assert.equal(value.items[2].title, 'Подтверждение статуса');
  assert.match(value.items[6].text, /с соблюдением требований по защите информации/);
  assert.equal(
    value.note,
    'чувствительные документы не загружать через общедоступную форму заявки. Способ их передачи определяется отдельно.',
  );
});

test('water standard remains subordinate to the specialized regulation', () => {
  const value = section('standard');
  assert.equal(value.title, 'ГОСТ Р 72551-2026 и разработка паспорта безопасности');
  assert.equal(value.paragraphs[1], 'Стандарт действует с 1 мая 2026 года.');
  assert.match(value.note, /не заменяет ПП РФ № 1467 и не меняет/);
});

test('water benefits contain the five approved claims without invented project counts', () => {
  const value = section('advantages');
  assert.deepEqual(
    value.items.map(item => item.title),
    [
      'Работаем с отраслевыми постановлениями',
      'Учитываем актуальную редакцию',
      'Разделяем этапы работ',
      'Учитываем действующие документы',
      'Работаем по России',
    ],
  );
  assert.doesNotMatch(
    value.items.map(item => item.text).join(' '),
    /\d+\s+(паспортов|проектов|лет опыта)|гарантируем/i,
  );
});

test('water FAQ retains 24 separately addressable questions and answers', () => {
  assert.equal(faq.length, 24);
  assert.equal(new Set(faq.map(item => item.id)).size, 24);
  assert.equal(new Set(faq.map(item => item.question)).size, 24);
  for (const [index, item] of faq.entries()) {
    assert.equal(item.id, `water-faq-${String(index + 1).padStart(2, '0')}`);
    assert.ok(item.question.endsWith('?'));
    assert.ok(item.answer.trim());
  }
});

test('water FAQ preserves the critical quantities, roles, deadline and conditional recategorization', () => {
  assert.equal(faq[6].answer, 'Первая, вторая, третья и четвёртая категории.');
  assert.equal(
    faq[9].answer,
    'Акт обследования и категорирования объекта водоснабжения и водоотведения.',
  );
  assert.equal(faq[10].answer, 'Один экземпляр.');
  assert.equal(
    faq[11].answer,
    'Разработка и согласование осуществляются в течение трёх месяцев со дня утверждения акта обследования и категорирования.',
  );
  assert.equal(
    faq[12].answer,
    'С территориальными органами безопасности, Росгвардии, МЧС России и уполномоченным органом субъекта РФ.',
  );
  assert.equal(
    faq[13].answer,
    'Руководитель эксплуатирующей организации либо уполномоченный им заместитель.',
  );
  assert.equal(faq[15].answer, 'Пять лет.');
  assert.match(faq[18].answer, /действовавшие на момент вступления.*до 16 апреля 2027 года/);
  assert.match(faq[19].answer, /не следует считать обязательным во всех случаях/);
});

test('water internal links retain exactly the four approved paths and anchors', () => {
  assert.deepEqual(waterLinks, {
    home: { href: '/', label: 'Паспорт безопасности объекта' },
    act: {
      href: '/akt-obsledovaniya-i-kategorirovaniya-obekta/',
      label: 'Акт обследования и категорирования объекта',
    },
    actualization: {
      href: '/aktualizaciya-pasporta-bezopasnosti-obekta/',
      label: 'Актуализация паспорта безопасности объекта',
    },
    rosgvardia: {
      href: '/pasport-bezopasnosti-obekta-obyazatelnoj-ohrany-rosgvardii/',
      label: 'Паспорт безопасности объекта обязательной охраны Росгвардии',
    },
  });
  for (const link of [...Object.values(waterLinks), ...links(waterSections)]) {
    assert.match(link.href, /^\/(?!\/)(?:[a-z-]+\/)?$/);
    assert.equal(link.target, undefined);
    assert.equal(link.rel, undefined);
  }
});

test('water Rosgvardia link appears only in the exclusions content and is not an enquiry', () => {
  assert.deepEqual(
    waterSections
      .filter(item => links(item).some(link => link.href === waterLinks.rosgvardia.href))
      .map(item => item.id),
    ['exclusions'],
  );
  assert.equal(section('act').link, waterLinks.act);
  assert.equal(section('amendments').link, waterLinks.actualization);
  assert.ok(waterHeroActions.every(item => !/Росгвард/i.test(item.label)));
});

test('water enquiry definitions preserve eleven action contexts without upload or download promises', () => {
  const actions = [
    ...waterHeroActions,
    ...waterSections.filter(item => item.action).map(item => item.action),
  ];
  assert.equal(actions.length, 7);
  const tariffs = section('prices').items;
  assert.equal(actions.length + tariffs.length, 11);
  for (const value of [...actions, ...tariffs]) {
    assert.ok(value.service.trim());
    assert.equal(value.href, undefined);
    assert.equal(value.download, undefined);
    assert.equal(value.upload, undefined);
  }
});

test('water public content excludes developer directions, external links and source-frequency data', () => {
  const content = strings({
    waterObjectType,
    waterSections,
    waterHeroActions,
    waterHeroFacts,
    waterHeroPrice,
  }).join('\n');
  assert.doesNotMatch(
    content,
    /https?:\/\/|Wordstat|Для программиста|SEO Title:|SEO Description:|CMS|Не утверждать, что|Не копировать|Не представлять этот срок|Оформить в виде|Не добавлять неподтверждённые/,
  );
  assert.equal(waterObjectType.admin, undefined);
});
