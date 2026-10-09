# Production infrastructure

Эта директория содержит версионируемое описание production-инфраструктуры pasport-bezopasnosty.ru.

Конфигурации здесь не содержат production-секреты и не применяются автоматически при обычном git pull.

## Архитектура

Production состоит из следующих основных уровней:

    Internet
       ↓
    Nginx
       ├── static release → /var/www/pasport-bezopasnosty.ru/current
       ├── shared uploads → /var/www/pasport-bezopasnosty.ru/shared/uploads
       └── /api/* → 127.0.0.1:8787
                        ↓
                      PM2
                        ↓
               server/index.mjs

Дополнительные фоновые задачи запускаются через systemd timers.

## Nginx

Версионируемые конфигурации:

    deploy/nginx/pasport-bezopasnosty.ru.conf
    deploy/nginx/regions-wildcard.conf
    deploy/nginx/snippets/options-ssl-pasport-bezopasnosty.conf

pasport-bezopasnosty.ru.conf соответствует фактически активной production-конфигурации федерального домена.

regions-wildcard.conf обслуживает старые региональные поддомены и перенаправляет их на федеральный сайт.

TLS-сертификаты и приватные ключи в Git не хранятся.

Перед применением Nginx-конфигурации обязательна проверка:

    nginx -t

После успешной проверки:

    systemctl reload nginx

## PM2

Основной backend process:

    passport-api

Версионируемая конфигурация:

    deploy/pm2/ecosystem.config.cjs

Backend запускает:

    server/index.mjs

Рабочая директория:

    /var/www/pasport-bezopasnosty.ru/app/passport-security-base

Production environment загружается Node-приложением из .env.server, если SERVER_ENV_FILE не задаёт другой путь.

.env.server, PM2 dump и любые секреты не должны попадать в Git.

Для первоначального запуска через версионируемый конфиг:

    pm2 start deploy/pm2/ecosystem.config.cjs --only passport-api
    pm2 save

pm2-root.service создаётся механизмом pm2 startup и не является project-specific unit, поэтому отдельно в репозитории не хранится.

## systemd

Версионируются project-specific фоновые задачи:

    passport-daily-report.service
    passport-daily-report.timer

    passport-regulation-reminders.service
    passport-regulation-reminders.timer

    passport-site-monitor.service
    passport-site-monitor.timer

Назначение:

- passport-daily-report — ежедневный статистический отчёт;
- passport-regulation-reminders — проверка сроков нормативных документов;
- passport-site-monitor — production health monitoring.

После изменения unit-файлов на сервере необходимо выполнить:

    systemctl daemon-reload

И только после этого перезапускать или включать соответствующий timer/service.

## Release-based deployment

Основной production deploy:

    bash scripts/deploy-federal.sh

Публикация изменений блога:

    bash scripts/publish-blog.sh

Rollback:

    bash scripts/rollback-federal.sh

Структура production:

    /var/www/pasport-bezopasnosty.ru/
    ├── current
    ├── releases/
    ├── release-runtime/
    ├── shared/
    │   └── uploads/
    └── app/
        └── passport-security-base/

current является указателем на активный frontend release.

Runtime SSR хранится отдельно в release-runtime.

Загруженные изображения не принадлежат конкретному release и находятся в shared/uploads.

## Secrets

В Git запрещено сохранять:

- .env.server;
- SMTP credentials;
- Telegram tokens;
- admin password;
- admin session secret;
- TLS private keys;
- /root/.pm2/dump.pm2;
- содержимое /etc/passport-monitor.env.

Перечень доступных переменных окружения поддерживается в .env.example.

## Production source of truth

Для application code source of truth — Git repository.

Для production infrastructure:

1. изменения конфигурации должны быть отражены в deploy/;
2. перед применением они должны быть проверены;
3. после ручного production-изменения соответствующий файл в deploy/ должен быть синхронизирован;
4. секретные данные остаются только во внешнем environment/system configuration.

Это предотвращает ситуацию, когда работающая конфигурация существует только на одном VPS и не может быть восстановлена из репозитория.
