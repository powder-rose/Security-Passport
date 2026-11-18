#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

PROJECT=/var/www/pasport-bezopasnosty.ru/app/passport-security-base
TARGET=mail@pasport-bezopasnosty.ru
[[ $(id -u) == 0 ]] || { echo 'Запустите установку от root.' >&2; exit 1; }
id passport >/dev/null
cd "$PROJECT"
[[ -f .env.server && -d data ]] || { echo 'Окружение сайта не найдено.' >&2; exit 1; }

# Verify credentials as the runtime user; do not print values or send test messages.
runuser -u passport -- env SERVER_ENV_FILE="$PROJECT/.env.server" DAILY_REPORT_EXPECTED_TO="$TARGET" /usr/bin/node --input-type=module <<'NODE'
import fs from 'node:fs/promises';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
const env = dotenv.parse(await fs.readFile(process.env.SERVER_ENV_FILE));
if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
  console.error('SMTP_NOT_CONFIGURED: заполните SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS в .env.server.');
  process.exit(2);
}
if ((env.DAILY_REPORT_EMAIL || 'mail@pasport-bezopasnosty.ru') !== process.env.DAILY_REPORT_EXPECTED_TO) {
  console.error('DAILY_REPORT_EMAIL должен быть mail@pasport-bezopasnosty.ru.');
  process.exit(2);
}
const port = Number(env.SMTP_PORT || 465);
const transport = nodemailer.createTransport({ host: env.SMTP_HOST, port, secure: env.SMTP_SECURE === undefined ? port === 465 : env.SMTP_SECURE === 'true', auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }, connectionTimeout: 20000, greetingTimeout: 20000, socketTimeout: 20000, logger: false, debug: false });
try { await transport.verify(); console.log('SMTP_VERIFY=PASSED_NO_MESSAGE_SENT'); }
catch (error) { console.error('SMTP_VERIFY=FAILED_' + String(error.code || 'UNKNOWN').replace(/[^a-z0-9_]/gi, '_')); process.exitCode = 1; }
finally { transport.close(); }
NODE

systemd-analyze verify "$PROJECT/deploy/systemd/passport-daily-report.service" "$PROJECT/deploy/systemd/passport-daily-report.timer"
backup=$(mktemp -d /var/lib/passport-report-units.XXXXXX)
for name in passport-daily-report.service passport-daily-report.timer; do
  [[ ! -e /etc/systemd/system/$name ]] || cp -a "/etc/systemd/system/$name" "$backup/"
  install -m 0644 "deploy/systemd/$name" "/etc/systemd/system/$name"
done
systemd-analyze verify /etc/systemd/system/passport-daily-report.service /etc/systemd/system/passport-daily-report.timer
systemctl daemon-reload
systemctl enable --now passport-daily-report.timer
systemctl is-active --quiet passport-daily-report.timer
systemctl is-enabled --quiet passport-daily-report.timer
echo 'DAILY_REPORT=ENABLED'
echo "DAILY_REPORT_RECIPIENT=$TARGET"
echo 'DAILY_REPORT_TIME=09:00_Europe/Moscow'
systemctl list-timers --all passport-daily-report.timer --no-pager
