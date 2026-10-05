# Паспорт безопасности

Production-проект сайта по разработке и сопровождению паспортов безопасности объектов.

Проект построен на React и Vite, но не является обычным client-only SPA. Production-сборка включает SSR/prerender, SEO-генерацию, Express backend, административную панель, блог, региональные страницы и автоматический QA.

## Технологический стек

### Frontend

- React 18
- Redux Toolkit
- React Redux
- Vite
- react-helmet-async
- Yup
- Tiptap
- react-easy-crop

### Backend

- Node.js 20+
- Express
- Nodemailer
- Formidable
- Sharp
- MaxMind

### Build и SEO

- Vite client build
- Vite SSR build
- server-side rendering
- custom prerender
- Vite manifest
- route-level code splitting
- автоматический QA
- генерация robots.txt
- генерация sitemap.xml

## Требования

    Node.js >= 20
    npm

Установка зависимостей:

    npm ci

Использование `npm ci` предпочтительно, поскольку в проекте хранится `package-lock.json`.

## Локальный запуск

Для полноценной разработки нужны frontend и backend.

В первом терминале:

    npm run dev:api

Во втором:

    npm run dev

Backend в development-режиме запускается через:

    node --watch server/index.mjs

По умолчанию backend использует порт 8787.

Vite проксирует запросы:

    /api/*

на:

    http://127.0.0.1:8787

## Production build

Основная команда:

    npm run build

Это полный pipeline проекта, а не только Vite build.

Последовательность:

    npm run qa
        ↓
    npm run build:client
        ↓
    npm run build:ssr
        ↓
    npm run prerender
        ↓
    npm run qa:dist

Отдельные команды:

    npm run qa
    npm run build:client
    npm run build:ssr
    npm run prerender
    npm run qa:dist

Client build создаётся в:

    dist/client/

SSR bundle создаётся в:

    dist/server/

## Production server

После успешной сборки:

    npm start

Запускается:

    server/index.mjs

Сервер обслуживает frontend и API.

## Основные entrypoints

### Публичный сайт

    index.html
        ↓
    src/main.jsx
        ↓
    src/entry-client.jsx

### SSR

    src/entry-server.jsx

### Административная панель

    admin.html
        ↓
    src/admin/main.jsx

### Предпросмотр статьи

    article-preview.html
        ↓
    src/article-preview/main.jsx

Предпросмотр статьи имеет robots `noindex,nofollow`.

## Структура проекта

    src/
    ├── admin/
    ├── app/
    ├── article-preview/
    ├── components/
    ├── config/
    ├── content/
    ├── context/
    ├── data/
    ├── features/
    ├── lib/
    ├── pages/
    ├── sections/
    ├── styles/
    ├── entry-client.jsx
    ├── entry-server.jsx
    └── main.jsx

    server/
    scripts/
    public/
    config/
    data/
    deploy/

## Routing

Проект не использует React Router.

Маршрут определяется через pathname и внутренние route/data-модули.

Основные источники маршрутов:

    src/data/objectTypes.js
    src/data/servicePages.js
    src/content/

Client-side route components загружаются через dynamic import в:

    src/entry-client.jsx

SSR использует отдельный mapping route components в:

    src/entry-server.jsx

При добавлении новой страницы client routing, SSR и prerender должны изменяться согласованно.

## Страницы

Основные page modules находятся в:

    src/pages/

На текущий момент в проекте присутствуют:

    ActualizationPage
    ArticlePage
    BlogPage
    CategorizationActPage
    CrowdPage
    CulturePage
    EducationPage
    HealthPage
    HotelPage
    LegalPage
    ObjectTypePage
    SportPage
    TradePage

## CSS-архитектура

Page-specific CSS хранится рядом с компонентом.

Пример:

    src/pages/TradePage/
    ├── TradePage.jsx
    └── TradePage.css

Компонент импортирует собственный CSS:

    import './TradePage.css';

Старая архитектура с отдельными page styles в:

    public/styles/

удалена и больше не используется.

Production CSS формируется Vite в hashed assets:

    /assets/<name>-<hash>.css

Prerender получает generated CSS через Vite manifest.

Глобальные стили находятся в:

    src/styles/

В проекте используются:

    reset.css
    variables.css
    typography.css
    global.css

Общие responsive-правила хранятся рядом с их владельцами: глобальные — в `global.css`, компонентные — в соответствующих CSS-файлах.

## SSR и prerender

Основные файлы:

    src/entry-server.jsx
    scripts/prerender.mjs

Production HTML формируется до выполнения клиентского JavaScript.

Prerender отвечает, в частности, за:

- server-rendered HTML;
- title;
- meta description;
- canonical;
- robots;
- Open Graph metadata;
- Twitter metadata;
- JSON-LD;
- route-specific CSS;
- legal pages;
- object pages;
- service pages;
- blog pages;
- sitemap;
- robots.txt.

## SEO

Основные точки SEO:

    src/components/Seo/Seo.jsx
    src/config/seo.js
    scripts/prerender.mjs

SEO metadata должны присутствовать в prerendered HTML.

Нельзя рассчитывать только на client-side Helmet после hydration.

## QA

Основная проверка:

    npm run qa

Полный production QA выполняется автоматически командой:

    npm run build

Используются:

    scripts/qa.mjs
    scripts/qa-regulations.mjs
    node --check server/index.mjs

Проверяются, среди прочего:

- изображения;
- внутренние anchors;
- внутренние ссылки;
- broken internal links;
- heading hierarchy;
- H1;
- canonical;
- robots;
- Open Graph;
- Twitter metadata;
- JSON-LD;
- legal pages;
- 404;
- robots.txt;
- sitemap.xml;
- нормативные документы;
- синтаксис backend.

Если `npm run build` завершается ошибкой, production deploy выполнять нельзя.

## Backend

Главный backend entrypoint:

    server/index.mjs

Отдельные модули:

    server/admin-articles.mjs
    server/admin-auth.mjs
    server/admin-leads.mjs
    server/admin-regulations.mjs
    server/blog-publication.mjs
    server/bot-detection.mjs
    server/geo-location.mjs
    server/lead-storage.mjs
    server/regulation-date-sync.mjs
    server/regulation-number-sync.mjs
    server/regulation-publisher.mjs
    server/regulation-reminders.mjs
    server/regulation-title-sync.mjs
    server/site-region.mjs
    server/statistics.mjs

## Основные API

Публичные endpoints:

    GET  /api/health
    GET  /api/geo
    GET  /api/articles
    GET  /api/articles/:slug
    POST /api/leads
    POST /api/visits

Admin API используется для:

- авторизации;
- заявок;
- статистики;
- статей;
- загрузки изображений;
- нормативных документов;
- публикации контента.

## Заявки

Основной endpoint:

    POST /api/leads

Backend поддерживает:

- нормализацию входных данных;
- валидацию;
- rate limiting;
- request deduplication;
- honeypot/spam-защиту;
- локальное резервное сохранение;
- Telegram delivery;
- SMTP email delivery.

Runtime-файлы с заявками не должны попадать в Git.

## Статистика

Посещения отправляются через:

    POST /api/visits

Основной server-модуль:

    server/statistics.mjs

Admin получает статистику через:

    GET /api/admin/statistics

## Административная панель

Entry:

    admin.html
    src/admin/main.jsx

Административная панель используется для работы с:

- заявками;
- статистикой;
- статьями;
- публикацией блога;
- нормативными документами.

## Блог

Публичные статьи prerenderятся для SEO.

Общий rendering статьи находится в:

    src/components/ArticleView/

Предпросмотр статьи имеет отдельный Vite entrypoint и не индексируется.

## География

Проект поддерживает федеральную и региональную архитектуру.

Подробная документация:

    GEOGRAPHY_PIPELINE.md

Основные элементы:

    config/geography/
    scripts/check-geography.mjs
    scripts/generate-geo-pages.mjs
    scripts/deploy-geographies.sh
    server/geo-location.mjs
    src/lib/geoRedirect.js

После изменения географической базы обязательно выполнить:

    node scripts/check-geography.mjs
    npm run build

## Deployment

В проекте имеются production scripts:

    scripts/deploy-federal.sh
    scripts/deploy-region.sh
    scripts/deploy-geographies.sh
    scripts/publish-blog.sh
    scripts/redeploy-all-regions.sh
    scripts/rollback-federal.sh

Они рассчитаны на production-окружение проекта.

Не запускайте production deployment scripts на неподготовленной локальной машине.

## Environment

Frontend-шаблон:

    .env.example

Backend по умолчанию загружает:

    .env.server

если `SERVER_ENV_FILE` не задаёт другой путь.

Секреты не должны попадать в Git.

Переменные с префиксом `VITE_` попадают в client bundle и не должны содержать секретные значения.

## Что не должно попадать в Git

- .env;
- .env.server;
- API tokens;
- passwords;
- SMTP credentials;
- session secrets;
- реальные персональные данные;
- runtime JSONL;
- dist;
- node_modules;
- runtime uploads.

## Правила внесения изменений

Перед commit:

    git status --short
    git diff
    git diff --check
    npm run build

При параллельной разработке предпочтительно добавлять изменённые файлы явно:

    git add path/to/file

вместо безусловного:

    git add .

Не смешивайте в одном commit независимые архитектурные изменения.

## Основной инженерный принцип

Изменение страницы считается завершённым только если оно:

1. работает в client;
2. собирается;
3. корректно рендерится через SSR;
4. prerenderится;
5. получает правильный CSS;
6. имеет корректные SEO metadata;
7. проходит QA;
8. корректно обслуживается production server.
