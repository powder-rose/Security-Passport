import fs from 'node:fs/promises';
import path from 'node:path';
import { resolveProjectRoot } from '../shared/project-root.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
async function checkTimer() {
  try {
    await execFileAsync('systemctl', ['is-active', '--quiet', 'passport-daily-report.timer'], {
      timeout: 2000,
    });
    await execFileAsync('systemctl', ['is-enabled', '--quiet', 'passport-daily-report.timer'], {
      timeout: 2000,
    });
    return true;
  } catch {
    return false;
  }
}

export const DEFAULT_REPORT_EMAIL = 'mail@pasport-bezopasnosty.ru';

export async function getDailyReportStatus({
  env = process.env,
  projectRoot = resolveProjectRoot(),
  timerCheck = checkTimer,
} = {}) {
  let state = null;
  try {
    state = JSON.parse(await fs.readFile(path.join(projectRoot, 'data/daily-report.json'), 'utf8'));
  } catch (error) {
    if (error?.code !== 'ENOENT') state = { status: 'unavailable' };
  }
  return {
    recipient: env.DAILY_REPORT_EMAIL || DEFAULT_REPORT_EMAIL,
    configured: Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS),
    timerEnabled: await timerCheck(),
    time: '09:00',
    timeZone: 'Europe/Moscow',
    status: state?.status || 'not_sent',
    reportDate: state?.reportDate || null,
    sentAt: state?.sentAt || null,
    error: state?.error || null,
  };
}
