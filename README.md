# Passport Security — base

Базовый каркас одностраничного сайта БОЙКОВГРУПП на React + Vite + Redux Toolkit.

## Что уже заложено

- React + Vite
- Redux Toolkit / React Redux
- SEO-компонент через `react-helmet-async`
- JSON-LD для `Organization`, `Service`, `WebPage`, `FAQPage`
- конфигурация города для будущих поддоменов
- семантическая HTML-структура
- skip-link, `aria-label`, `aria-live`, `focus-visible`, `prefers-reduced-motion`
- базовая editorial design-system
- фотография Николая Бойкова оптимизирована в WebP и встроена в editorial Hero
- собственные Blush-inspired SVG-иллюстрации без внешних библиотек
- полностью собранные контентные секции лендинга

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run qa
npm run build
npm run preview
```

`npm run build` автоматически запускает source-QA до сборки и dist-QA после prerender. Проверяются внутренние якоря, изображения, единственный H1, canonical, JSON-LD, robots.txt и sitemap.xml.

## Главные точки настройки

- `src/config/city.js` — город / регион / поддомен
- `src/config/site.js` — бренд, домен, контакты
- `src/config/seo.js` — title/description/canonical/schema
- `src/data/*` — контентные данные
- `src/styles/variables.css` — дизайн-токены

## Важно для SEO городских поддоменов

Production-build уже делает prerender: городские `<title>`, `<meta>`, canonical, schema и основной текст страницы попадают в исходный HTML. Для каждого городского поддомена делайте отдельную сборку с его `VITE_CITY_*` значениями и добавляйте действительно полезный локальный контент, а не только замену названия города.

## Реализовано на шаге ObjectQuiz

- Полная 6-шаговая экспресс-проверка объекта из исходной страницы.
- Ответы хранятся в Redux Toolkit (`features/quiz`).
- Прогресс, возврат назад, валидация обязательных полей.
- Семантические `fieldset`, `legend`, `label`, `role=progressbar`, `role=alert`.
- Адаптивная editorial-композиция.
- Финальная отправка подключена к встроенному `POST /api/leads`; квиз передаёт все ответы и контактные данные на backend.

## Production SEO build

`npm run build` now produces a prerendered version in `dist/client`. The final `index.html` already contains the page HTML, canonical/meta tags and JSON-LD before JavaScript executes. The same build also generates `robots.txt` and `sitemap.xml` from the canonical URL.

For city subdomains, create a separate build with the matching `VITE_CITY_*` values. Do not only replace the city name visually: keep city-specific metadata and local content where it is genuinely useful.

## Responsive audit

Финальный адаптивный слой находится в `src/styles/responsive-audit.css` и подключается последним.
Проверочные диапазоны: 1440 px, 1024 px, 768 px и 390 px.

- hamburger-навигация включается раньше на планшетах;
- на узких экранах CTA из шапки переносится внутрь меню;
- тесные двухколоночные секции раньше переходят в одну колонку;
- крупные editorial-заголовки ограничены безопасными мобильными размерами;
- карточки, квиз, цены, FAQ и footer получают отдельную полировку для 390 px;
- hover-сдвиги отключаются на touch-устройствах;
- декоративные элементы не создают горизонтальный скролл.

## Release checklist

Перед публикацией:

1. Заполнить `.env` для нужного города/домена.
2. Создать `.env.server`, включить Telegram и/или SMTP и проверить `GET /api/health` + реальную отправку формы.
3. Выполнить `npm run build` и убедиться, что QA проходит без ошибок.
4. Публиковать содержимое `dist/client`.
5. Проверить HTTP 200, HTTPS, canonical, robots.txt и sitemap.xml уже на боевом домене.
6. После публикации прогнать Lighthouse/PageSpeed и Яндекс Вебмастер.

## Заявки и Яндекс Метрика

Проект теперь готов к реальной отправке обеих форм и к отслеживанию рекламных конверсий.

В `.env` нужно заполнить:

```bash
VITE_LEAD_ENDPOINT=/api/leads
VITE_YANDEX_METRICA_ID=12345678
VITE_YANDEX_METRICA_ENABLED=true
VITE_YANDEX_METRICA_WEBVISOR=true
```

`VITE_LEAD_ENDPOINT` должен принимать `POST` с JSON. Одинаковая транспортная функция используется для финальной формы и 6-шагового квиза. Каждая заявка содержит `requestId`, дату, страницу, referrer и сохранённые рекламные метки (`utm_*`, `yclid`, `gclid`). Кнопки блокируются во время отправки, поэтому случайный двойной submit не создаётся из интерфейса.

Цели Метрики, которые используются в коде:

- `lead_submit_success` — успешно отправлена основная форма;
- `quiz_submit_success` — успешно отправлена заявка из квиза;
- `quiz_start` — пользователь начал квиз;
- `quiz_step_completed` — пройден очередной шаг квиза;
- `contact_cta_click` — клик по CTA, ведущему к форме;
- `phone_click` — клик по телефону;
- `email_click` — клик по email;
- `lead_submit_error` и `quiz_submit_error` — технические ошибки отправки для диагностики.

В интерфейсе Яндекс Метрики для рекламных конверсий имеет смысл создать JavaScript-цели прежде всего для `lead_submit_success` и `quiz_submit_success`. Остальные удобно использовать как микроцели и для анализа воронки.

По умолчанию фронтенд использует встроенный `/api/leads`. Если API недоступен или не смог доставить заявку ни в один рабочий канал, интерфейс не показывает ложный успех: пользователю выводятся телефон и email компании.

## Backend API для заявок

В проект добавлен production-сервер `server/index.mjs`. Он одновременно раздаёт готовую сборку из `dist/client` и принимает заявки через `POST /api/leads`.

### Локальный запуск

В двух терминалах:

```bash
npm run dev:api
npm run dev
```

Vite проксирует `/api/*` на `http://127.0.0.1:8787`, поэтому фронтенду не нужен отдельный CORS-URL.

### Production

```bash
cp .env.example .env
cp .env.server.example .env.server
npm install
npm run build
npm start
```

По умолчанию фронтенд отправляет заявки на `/api/leads`. API проверяет обязательные контакты и согласие, ограничивает частоту запросов, отбрасывает honeypot-спам и не создаёт повторную заявку при повторной отправке того же `requestId`.

Доступные каналы доставки:

- локальная резервная копия `data/leads.jsonl`;
- Telegram — `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`;
- email по SMTP — `SMTP_*` + `LEAD_EMAIL_TO`.

Можно включить Telegram и SMTP одновременно. API отвечает успехом, если хотя бы один настроенный канал принял заявку. Проверка состояния без секретов: `GET /api/health`.

**Важно:** `data/leads.jsonl` содержит персональные данные. Папка `data` не раздаётся как статика и добавлена в `.gitignore`. На сервере ограничьте доступ к ней и настройте срок хранения в соответствии с вашей политикой обработки персональных данных.
