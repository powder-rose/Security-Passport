import path from 'node:path';
import process from 'node:process';

export function resolveProjectRoot({ env = process.env, cwd = process.cwd() } = {}) {
  const configured =
    typeof env.PASSPORT_PROJECT_ROOT === 'string' ? env.PASSPORT_PROJECT_ROOT.trim() : '';

  return path.resolve(configured || cwd);
}
