import { resolveRegulationRegistryPath } from '../shared/regulations/registry-path.js';
import { replaceRegulationDate } from '../server/regulations/regulation-date-sync.mjs';
import {
  applyRegulationSyncWorkspace,
  createRegulationSyncWorkspace,
} from '../server/regulations/regulation-sync-workspace.mjs';

const target = process.argv[2]?.trim() || process.env.REGULATION_REGISTRY_FILE?.trim();

if (!target || process.argv.length > 3) {
  throw new Error(
    'Provide a registry path: node scripts/fix-hotel-regulation-date.mjs <file>, or set REGULATION_REGISTRY_FILE',
  );
}

const registryFile = resolveRegulationRegistryPath({
  env: { REGULATION_REGISTRY_FILE: target },
});

const correctedDate = '2017-04-14';

function correctDate(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Regulation 447 title and claim text must be strings');
  }

  return text.replace(/от\s+13\.04\.2017\s+№\s*447\b/gi, match =>
    replaceRegulationDate(match, '447', correctedDate),
  );
}

console.log(`Regulation registry: ${registryFile}`);

const workspace = createRegulationSyncWorkspace();

await workspace.transform(registryFile, source => {
  const registry = JSON.parse(source);

  if (!Array.isArray(registry.items)) {
    throw new TypeError('Registry items must be an array');
  }

  const matches = registry.items.filter(item => String(item?.number) === '447');

  if (matches.length !== 1) {
    throw new Error('Expected exactly one regulation 447');
  }

  const hotel = matches[0];

  if (!['2017-04-13', correctedDate].includes(hotel.documentDate)) {
    throw new Error(`Unexpected documentDate for regulation 447: ${hotel.documentDate}`);
  }

  if (!Array.isArray(hotel.claims)) {
    throw new TypeError('Regulation 447 claims must be an array');
  }

  const updated = {
    ...hotel,
    title: correctDate(hotel.title),
    documentDate: correctedDate,
    claims: hotel.claims.map(claim => ({ ...claim, text: correctDate(claim?.text) })),
  };

  if (JSON.stringify(updated) === JSON.stringify(hotel)) {
    return source;
  }

  registry.items[registry.items.indexOf(hotel)] = updated;

  return JSON.stringify(registry, null, 2) + '\n';
});

const result = await applyRegulationSyncWorkspace(workspace);

console.log(
  result.changedFiles
    ? 'Updated regulation 447 date to 14.04.2017.'
    : 'Regulation 447 date is already correct; no files changed.',
);
