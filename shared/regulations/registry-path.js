import path from 'node:path';
import process from 'node:process';

export function resolveRegulationRegistryPath({
  env = process.env,
  projectRoot = process.cwd(),
} = {}) {
  const root = path.resolve(projectRoot);

  const configured =
    typeof env.REGULATION_REGISTRY_FILE === 'string' ? env.REGULATION_REGISTRY_FILE.trim() : '';

  if (configured) {
    return path.resolve(root, configured);
  }

  return path.join(root, 'data', 'regulations.json');
}
