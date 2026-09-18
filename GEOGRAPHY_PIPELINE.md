# Geography Pipeline

## Назначение

Проект использует масштабируемую региональную архитектуру для сайта `pasport-bezopasnosty.ru`.

Региональные версии работают через поддомены вида:

    <slug>.pasport-bezopasnosty.ru

Пример:

    moscow.pasport-bezopasnosty.ru

---

## Текущее production-состояние

Количество региональных географий:

- всего: 10 000;
- indexable: 1 349;
- noindex: 8 651.

Основная production-база:

    config/geography/locations.json

Проверка базы:

    node scripts/check-geography.mjs

---

## SEO-политика

### Федеральный сайт

Федеральные страницы индексируются.

### Индексируемые регионы

Для региона с:

    seoIndexable=true

индексируются:

- региональная главная;
- `/akt-obsledovaniya-i-kategorirovaniya-obekta/`;
- `/aktualizaciya-pasporta-bezopasnosti-obekta/`.

Ожидаемый robots:

    index,follow

### Неиндексируемые регионы

Для региона с:

    seoIndexable=false

региональная главная и service pages получают:

    noindex,follow

### Object-type pages

Региональные object-type pages пока всегда получают:

    noindex,follow

в том числе для регионов с `seoIndexable=true`.

---

## Региональные service routes

Массово генерируются два маршрута:

    /akt-obsledovaniya-i-kategorirovaniya-obekta/
    /aktualizaciya-pasporta-bezopasnosti-obekta/

Для 10 000 регионов ожидается:

- 10 000 региональных главных;
- 20 000 service pages;
- 30 000 regional HTML всего.

---

## SSR

Основной SSR entry:

    src/entry-server.jsx

В SSR передаются:

- `city`;
- `pathname`.

`pathname` используется для корректного определения:

- типа страницы;
- title;
- description;
- canonical;
- robots;
- H1;
- schema.

SEO-компонент:

    src/components/Seo/Seo.jsx

SEO-конфигурация:

    src/config/seo.js

---

## Генерация regional HTML

Основной генератор:

    scripts/generate-geo-pages.mjs

Региональная главная:

    dist/geo-pages/regions/<slug>/index.html

Service pages:

    dist/geo-pages/regions/<slug>/akt-obsledovaniya-i-kategorirovaniya-obekta/index.html

    dist/geo-pages/regions/<slug>/aktualizaciya-pasporta-bezopasnosti-obekta/index.html

Manifest контролирует:

- regionalCount;
- serviceRouteCount;
- servicePageCount;
- regionalHtmlCount.

Ожидаемые значения:

    regionalCount = 10000
    serviceRouteCount = 2
    servicePageCount = 20000
    regionalHtmlCount = 30000

---

## Sitemap

Для indexable-региона sitemap содержит:

1. региональную главную;
2. страницу акта обследования и категорирования;
3. страницу актуализации паспорта безопасности.

Noindex-регионы не должны создавать индексируемые региональные URL.

---

## Static assets

Общая production-статика:

    /var/www/pasport-bezopasnosty.ru/shared

CSS service pages копируется из:

    dist/client/styles/

в:

    /var/www/pasport-bezopasnosty.ru/shared/styles/

Критические CSS:

    CategorizationActPage.css
    ActualizationPage.css

---

# Geography database generation history

## Источники данных

### GeoNames

    data/geography-source/geonames/RU.zip
    data/geography-source/geonames/RU-alternatenames.zip

### КЛАДР

    data/geography-source/kladr/extracted/KLADR.DBF
    data/geography-source/kladr/extracted/ALTNAMES.DBF
    data/geography-source/kladr/extracted/NAMEMAP.DBF
    data/geography-source/kladr/extracted/SOCRBASE.DBF

---

## Initial candidate build

Старая версия:

    scripts/build-geography-candidates.py

Более поздняя версия:

    scripts/build-geography-candidates-v2.py

Результат более позднего этапа:

    locations-draft-10000-v2.json

---

## Geography audit v2

Скрипт:

    scripts/audit-geography-v2.py

Вход:

    locations-draft-10000-v2.json

QA-результат:

    qa-suspicious-v2.json

---

## V3

Сохранились результаты:

    locations-draft-10000-v3.json
    qa-selected-types-v3.csv
    qa-subjects-v3.csv
    qa-suspicious-excluded-v3.csv
    stats-10000-v3.json

Скрипт, которым непосредственно был создан этап v3, в текущем проекте и Git history не найден.

Следовательно, участок pipeline между v2 и v3 полностью автоматически не воспроизводится.

---

## Geography finalize v4

Скрипт:

    scripts/finalize-geography-v4.py

Вход:

    locations-draft-10000-v3.json

Выход:

    locations-draft-10000-v4.json

---

## Geography finalize v5

Скрипт:

    scripts/finalize-geography-v5.py

Вход:

    locations-draft-10000-v4.json

Выход:

    locations-draft-10000-v5.json

---

## Geography finalize v6

Скрипт:

    scripts/finalize-geography-v6.py

Вход:

    locations-draft-10000-v5.json

Выход:

    locations-draft-10000-v6.json

---

# Inflection pipeline

## Audit v7

Историческая версия:

    scripts/audit-inflections-v7.py

## Audit v8

Историческая версия:

    scripts/audit-inflections-v8.py

## Audit v9

Основная поздняя версия:

    scripts/audit-inflections-v9.py

Вход:

    locations-draft-10000-v6.json

Результаты:

    qa-inflection-high-v9.csv
    qa-inflection-review-v9.csv

---

## Classification v10

Историческая версия:

    scripts/classify-inflections-v10.py

## Classification v11

Основная поздняя версия:

    scripts/classify-inflections-v11.py

Вход:

    qa-inflection-high-v9.csv
    qa-inflection-review-v9.csv

Результаты:

    qa-inflection-trusted-v11.csv
    qa-inflection-neutral-v11.csv

---

## Final inflections v12

Скрипт:

    scripts/finalize-inflections-v12.py

Вход:

    locations-draft-10000-v6.json
    qa-inflection-trusted-v11.csv
    qa-inflection-neutral-v11.csv

Выход:

    locations-draft-10000-v12.json

---

## V13

Сохранились:

    locations-final-10000-v13.json
    stats-10000-v13.json

Скрипт непосредственного формирования v13 в текущем проекте и Git history не найден.

---

## V14

Сохранились:

    locations-final-10000-v14.json
    stats-10000-v14.json

Скрипт непосредственного формирования v14 в текущем проекте и Git history не найден.

Production-база сформирована на основе этой ветки данных с последующими исправлениями.

---

## Известные slug corrections

Исправлены:

    aleksandrov-gay -> aleksandrov-gai
    krasnyy-gay -> krasnyy-gai

При восстановлении `seoIndexable` старые slug использовались только для сопоставления с исторической версией данных.

---

# Deploy

Основной deploy:

    bash scripts/deploy-geographies.sh

Каталог releases:

    /var/www/pasport-bezopasnosty.ru/geo-pages/releases/

Активный release:

    /var/www/pasport-bezopasnosty.ru/geo-pages/current

Deploy выполняет атомарное переключение symlink `current`.

Предыдущий release сохраняется для rollback.

---

# Обязательные проверки

Перед deploy:

    node scripts/check-geography.mjs
    npm run build

При региональном deploy ожидается:

    regions = 10000
    service routes = 2
    service HTML = 20000
    regional HTML = 30000

---

## Production smoke test

Indexable-регион, пример Москва:

    https://moscow.pasport-bezopasnosty.ru/
    https://moscow.pasport-bezopasnosty.ru/akt-obsledovaniya-i-kategorirovaniya-obekta/
    https://moscow.pasport-bezopasnosty.ru/aktualizaciya-pasporta-bezopasnosti-obekta/

Ожидается:

- HTTP 200;
- robots index,follow;
- корректный canonical;
- корректный H1.

Noindex-регион, пример Александров Гай:

    https://aleksandrov-gai.pasport-bezopasnosty.ru/

Ожидается:

    robots=noindex,follow

---

# Правила безопасности

Нельзя массово изменять без отдельной проверки:

- seoIndexable;
- slug;
- name;
- region;
- subject;
- inflectionMode;
- genitive;
- prepositional.

Перед массовыми изменениями обязательны:

1. backup;
2. проверка diff;
3. `node scripts/check-geography.mjs`;
4. SSR/SEO regression;
5. production smoke test.

Особенно нельзя без проверки массово устанавливать всем 10 000 регионам:

    seoIndexable=false

или:

    seoIndexable=true

---

# Ключевые Git snapshots

    903e641 Fix Gai geography slug
    0d58b4c Snapshot production site with regional service pages and SEO
    0af48fd Ignore local backup and temporary files
    69f7582 Preserve geography generation tooling

На момент создания документа:

    HEAD = main = origin/main
