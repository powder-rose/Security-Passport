import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import tls from 'node:tls';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(
  fileURLToPath(import.meta.url),
);

const projectRoot = path.resolve(
  __dirname,
  '..',
);

dotenv.config({
  path: path.join(
    projectRoot,
    '.env.server',
  ),
});

dotenv.config({
  path: '/etc/passport-monitor.env',
});

const DOMAIN =
  'pasport-bezopasnosty.ru';

const ORIGIN =
  `https://${DOMAIN}`;

const STATE_DIR =
  '/var/lib/passport-monitor';

const STATE_FILE =
  path.join(
    STATE_DIR,
    'state.json',
  );

const FAILURE_THRESHOLD = 3;

const DISK_USED_THRESHOLD = 85;

const SSL_WARNING_DAYS = 14;

const REQUEST_TIMEOUT_MS = 10000;

const PM2_BIN = '/usr/bin/pm2';

const SYSTEMCTL_BIN =
  '/usr/bin/systemctl';

const DF_BIN = '/usr/bin/df';


function nowIso() {
  return new Date().toISOString();
}


function formatDate(value) {
  try {
    return new Intl.DateTimeFormat(
      'ru-RU',
      {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: 'Europe/Moscow',
      },
    ).format(
      new Date(value),
    );
  } catch {
    return value;
  }
}


async function ensureStateDir() {
  await fs.mkdir(
    STATE_DIR,
    {
      recursive: true,
      mode: 0o700,
    },
  );
}


async function readState() {
  try {
    const raw = await fs.readFile(
      STATE_FILE,
      'utf8',
    );

    const state = JSON.parse(raw);

    return {
      consecutiveFailures:
        Number(
          state.consecutiveFailures ||
          0,
        ),

      incidentActive:
        Boolean(
          state.incidentActive,
        ),

      incidentStartedAt:
        state.incidentStartedAt ||
        null,

      lastIssues:
        Array.isArray(
          state.lastIssues,
        )
          ? state.lastIssues
          : [],
    };
  } catch {
    return {
      consecutiveFailures: 0,
      incidentActive: false,
      incidentStartedAt: null,
      lastIssues: [],
    };
  }
}


async function writeState(
  state,
) {
  await ensureStateDir();

  const temporary =
    `${STATE_FILE}.${process.pid}.tmp`;

  await fs.writeFile(
    temporary,
    `${JSON.stringify(
      state,
      null,
      2,
    )}\n`,
    {
      mode: 0o600,
    },
  );

  await fs.rename(
    temporary,
    STATE_FILE,
  );
}


async function checkHttp(
  label,
  pathname,
) {
  const started = Date.now();

  try {
    const response = await fetch(
      `${ORIGIN}${pathname}`,
      {
        signal:
          AbortSignal.timeout(
            REQUEST_TIMEOUT_MS,
          ),

        headers: {
          'user-agent':
            'Passport-Site-Monitor/1.0',
        },
      },
    );

    const elapsed =
      Date.now() - started;

    if (response.status !== 200) {
      return {
        ok: false,
        label,
        detail:
          `HTTP ${response.status}`,
      };
    }

    return {
      ok: true,
      label,
      detail:
        `HTTP 200, ${elapsed} ms`,
    };
  } catch (error) {
    return {
      ok: false,
      label,
      detail:
        error?.message ||
        'request failed',
    };
  }
}


async function checkApi() {
  const started = Date.now();

  try {
    const response = await fetch(
      `${ORIGIN}/api/health`,
      {
        signal:
          AbortSignal.timeout(
            REQUEST_TIMEOUT_MS,
          ),

        headers: {
          'user-agent':
            'Passport-Site-Monitor/1.0',
        },
      },
    );

    const elapsed =
      Date.now() - started;

    if (response.status !== 200) {
      return {
        ok: false,
        label: 'API',
        detail:
          `HTTP ${response.status}`,
      };
    }

    const data =
      await response.json();

    if (data?.ok !== true) {
      return {
        ok: false,
        label: 'API',
        detail:
          'health returned ok != true',
      };
    }

    return {
      ok: true,
      label: 'API',
      detail:
        `OK, ${elapsed} ms`,
    };
  } catch (error) {
    return {
      ok: false,
      label: 'API',
      detail:
        error?.message ||
        'API request failed',
    };
  }
}


async function checkNginx() {
  try {
    const {
      stdout,
    } = await execFileAsync(
      SYSTEMCTL_BIN,
      [
        'is-active',
        'nginx',
      ],
      {
        timeout: 5000,
      },
    );

    const status =
      stdout.trim();

    return {
      ok: status === 'active',
      label: 'nginx',
      detail: status,
    };
  } catch (error) {
    return {
      ok: false,
      label: 'nginx',
      detail:
        error?.stdout?.trim() ||
        error?.message ||
        'inactive',
    };
  }
}


async function checkPm2() {
  try {
    const {
      stdout,
    } = await execFileAsync(
      PM2_BIN,
      [
        'jlist',
      ],
      {
        timeout: 10000,
        env: {
          ...process.env,
          HOME: '/root',
          PM2_HOME: '/root/.pm2',
        },
      },
    );

    const apps =
      JSON.parse(stdout);

    const app =
      apps.find(
        item =>
          item.name ===
          'passport-api',
      );

    if (!app) {
      return {
        ok: false,
        label: 'passport-api',
        detail:
          'PM2 process not found',
      };
    }

    const status =
      app.pm2_env?.status ||
      'unknown';

    return {
      ok: status === 'online',
      label: 'passport-api',
      detail: status,
    };
  } catch (error) {
    return {
      ok: false,
      label: 'passport-api',
      detail:
        error?.message ||
        'PM2 check failed',
    };
  }
}


async function checkDisk() {
  try {
    const {
      stdout,
    } = await execFileAsync(
      DF_BIN,
      [
        '-P',
        '/',
      ],
      {
        timeout: 5000,
      },
    );

    const lines =
      stdout
        .trim()
        .split('\n');

    const fields =
      lines
        .at(-1)
        .trim()
        .split(/\s+/);

    const usedRaw =
      fields[4] || '';

    const used =
      Number(
        usedRaw.replace(
          '%',
          '',
        ),
      );

    if (
      !Number.isFinite(used)
    ) {
      throw new Error(
        `invalid df output: ${usedRaw}`,
      );
    }

    return {
      ok:
        used <
        DISK_USED_THRESHOLD,

      label: 'Диск',

      detail:
        `${used}% занято`,
    };
  } catch (error) {
    return {
      ok: false,
      label: 'Диск',
      detail:
        error?.message ||
        'disk check failed',
    };
  }
}


function getCertificate() {
  return new Promise(
    resolve => {
      const socket =
        tls.connect(
          {
            host: DOMAIN,
            port: 443,
            servername: DOMAIN,
            rejectUnauthorized: true,
            timeout: 10000,
          },

          () => {
            try {
              const cert =
                socket.getPeerCertificate();

              socket.end();

              if (
                !cert ||
                !cert.valid_to
              ) {
                resolve({
                  ok: false,
                  label: 'SSL',
                  detail:
                    'certificate missing',
                });

                return;
              }

              const expiresAt =
                new Date(
                  cert.valid_to,
                );

              const remainingMs =
                expiresAt.getTime() -
                Date.now();

              const days =
                Math.floor(
                  remainingMs /
                  86400000,
                );

              resolve({
                ok:
                  days >
                  SSL_WARNING_DAYS,

                label: 'SSL',

                detail:
                  `${days} дн. до истечения`,
              });
            } catch (error) {
              socket.destroy();

              resolve({
                ok: false,
                label: 'SSL',
                detail:
                  error?.message ||
                  'SSL check failed',
              });
            }
          },
        );

      socket.on(
        'timeout',
        () => {
          socket.destroy();

          resolve({
            ok: false,
            label: 'SSL',
            detail: 'timeout',
          });
        },
      );

      socket.on(
        'error',
        error => {
          resolve({
            ok: false,
            label: 'SSL',
            detail:
              error?.message ||
              'TLS error',
          });
        },
      );
    },
  );
}


function createMailTransport() {
  const host =
    process.env.SMTP_HOST;

  const user =
    process.env.SMTP_USER;

  const pass =
    process.env.SMTP_PASS;

  if (
    !host ||
    !user ||
    !pass
  ) {
    throw new Error(
      'SMTP configuration is incomplete',
    );
  }

  return nodemailer.createTransport(
    {
      host,

      port: Number(
        process.env.SMTP_PORT ||
        465,
      ),

      secure:
        String(
          process.env.SMTP_SECURE ??
          'true',
        ).toLowerCase() ===
        'true',

      auth: {
        user,
        pass,
      },
    },
  );
}


async function sendEmail(
  subject,
  text,
) {
  const to =
    process.env
      .MONITOR_EMAIL_TO;

  if (!to) {
    throw new Error(
      'MONITOR_EMAIL_TO is missing',
    );
  }

  const transport =
    createMailTransport();

  await transport.sendMail({
    from:
      process.env
        .LEAD_EMAIL_FROM ||
      process.env.SMTP_USER,

    to,
    subject,
    text,
  });
}


async function sendTelegram(
  text,
) {
  const token =
    process.env
      .MONITOR_TELEGRAM_BOT_TOKEN;

  const chatId =
    process.env
      .MONITOR_TELEGRAM_CHAT_ID;

  if (
    !token ||
    !chatId
  ) {
    throw new Error(
      'Telegram configuration is incomplete',
    );
  }

  const response =
    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',

        signal:
          AbortSignal.timeout(
            REQUEST_TIMEOUT_MS,
          ),

        headers: {
          'content-type':
            'application/json',
        },

        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      },
    );

  const result =
    await response.json();

  if (
    !response.ok ||
    !result.ok
  ) {
    throw new Error(
      result?.description ||
      `Telegram HTTP ${response.status}`,
    );
  }
}


async function notify(
  subject,
  text,
) {
  const results =
    await Promise.allSettled([
      sendEmail(
        subject,
        text,
      ),

      sendTelegram(
        text,
      ),
    ]);

  const email =
    results[0];

  const telegram =
    results[1];

  console.log(
    'EMAIL:',
    email.status ===
    'fulfilled'
      ? 'OK'
      : `ERROR: ${email.reason?.message}`,
  );

  console.log(
    'TELEGRAM:',
    telegram.status ===
    'fulfilled'
      ? 'OK'
      : `ERROR: ${telegram.reason?.message}`,
  );

  if (
    email.status ===
      'rejected' &&
    telegram.status ===
      'rejected'
  ) {
    throw new Error(
      'Both notification channels failed',
    );
  }
}


function formatResults(
  results,
) {
  return results
    .map(
      item =>
        `${item.ok ? '✅' : '❌'} ${item.label}: ${item.detail}`,
    )
    .join('\n');
}


async function runChecks() {
  const results = await Promise.all([
    checkHttp(
      'Главная',
      '/',
    ),

    checkHttp(
      'Блог',
      '/blog/',
    ),

    checkHttp(
      'Админка',
      '/admin/',
    ),

    checkApi(),

    checkNginx(),

    checkPm2(),

    checkDisk(),

    getCertificate(),
  ]);

  if (
    process.argv.includes(
      '--simulate-failure',
    )
  ) {
    results.push({
      ok: false,
      label: 'Тестовая авария',
      detail: 'симуляция отказа мониторинга',
    });
  }

  return results;
}


async function sendTestAlert() {
  const text =
    `🧪 ТЕСТ МОНИТОРИНГА ${DOMAIN}\n\n` +
    `Это тестовое сообщение.\n` +
    `Время: ${formatDate(nowIso())}`;

  await notify(
    `🧪 Тест мониторинга ${DOMAIN}`,
    text,
  );
}


async function main() {
  if (
    process.argv.includes(
      '--test-alert',
    )
  ) {
    await sendTestAlert();
    return;
  }

  const results =
    await runChecks();

  console.log(
    formatResults(results),
  );

  const issues =
    results.filter(
      item => !item.ok,
    );

  const state =
    await readState();

  if (issues.length === 0) {
    if (
      state.incidentActive
    ) {
      const recoveredAt =
        nowIso();

      const startedAt =
        state.incidentStartedAt;

      let durationText =
        'неизвестно';

      if (startedAt) {
        const durationMs =
          Date.now() -
          new Date(
            startedAt,
          ).getTime();

        const minutes =
          Math.max(
            1,
            Math.round(
              durationMs /
              60000,
            ),
          );

        durationText =
          `${minutes} мин.`;
      }

      const text =
        `🟢 ${DOMAIN} — ВОССТАНОВЛЕН\n\n` +
        `${formatResults(results)}\n\n` +
        `Недоступность: ${durationText}\n` +
        `Восстановлен: ${formatDate(recoveredAt)}`;

      await notify(
        `🟢 ${DOMAIN} восстановлен`,
        text,
      );
    }

    await writeState({
      consecutiveFailures: 0,
      incidentActive: false,
      incidentStartedAt: null,
      lastIssues: [],
    });

    return;
  }


  const consecutiveFailures =
    state.consecutiveFailures +
    1;

  const issueLines =
    issues.map(
      item =>
        `${item.label}: ${item.detail}`,
    );

  if (
    !state.incidentActive &&
    consecutiveFailures >=
      FAILURE_THRESHOLD
  ) {
    const incidentStartedAt =
      state.incidentStartedAt ||
      nowIso();

    const text =
      `🔴 ${DOMAIN} — СБОЙ\n\n` +
      `${formatResults(results)}\n\n` +
      `Ошибка подтверждена после ${FAILURE_THRESHOLD} проверок подряд.\n` +
      `Начало: ${formatDate(incidentStartedAt)}`;

    await notify(
      `🔴 Сбой ${DOMAIN}`,
      text,
    );

    await writeState({
      consecutiveFailures,
      incidentActive: true,
      incidentStartedAt,
      lastIssues: issueLines,
    });

    return;
  }


  await writeState({
    consecutiveFailures,

    incidentActive:
      state.incidentActive,

    incidentStartedAt:
      state.incidentStartedAt ||
      nowIso(),

    lastIssues:
      issueLines,
  });
}


main().catch(
  error => {
    console.error(
      '[site-monitor]',
      error,
    );

    process.exitCode = 1;
  },
);
