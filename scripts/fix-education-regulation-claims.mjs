import fs from 'node:fs/promises';
import { resolveRegulationRegistryPath } from '../shared/regulations/registry-path.js';
import {
  applyRegulationSyncWorkspace,
  createRegulationSyncWorkspace,
} from '../server/regulations/regulation-sync-workspace.mjs';

const target = process.argv[2]?.trim() || process.env.REGULATION_REGISTRY_FILE?.trim();

if (!target || process.argv.length > 3) {
  throw new Error(
    'Provide a registry path: node scripts/fix-education-regulation-claims.mjs <file>, or set REGULATION_REGISTRY_FILE',
  );
}

const registryFile = resolveRegulationRegistryPath({
  env: { REGULATION_REGISTRY_FILE: target },
});

const claimIds = [
  'education.faq.05',
  'education.faq.15',
  'education.faq.16',
  'education.faq.17',
  'education.faq.18',
];

const previousCategoryText =
  'Для объектов, подпадающих под ПП РФ №1006, предусмотрены четыре категории опасности. Для объекта с другим нормативным режимом применимые правила необходимо проверять отдельно.';

function getEducationClaims(registry) {
  if (!Array.isArray(registry.items)) {
    throw new TypeError('Registry items must be an array');
  }

  const matches = registry.items.filter(item => String(item?.number) === '1006');

  if (matches.length !== 1) {
    throw new Error('Expected exactly one regulation 1006');
  }

  const education = matches[0];

  if (education.documentDate !== '2019-08-02') {
    throw new Error(`Unexpected documentDate for regulation 1006: ${education.documentDate}`);
  }

  if (!Array.isArray(education.claims)) {
    throw new TypeError('Regulation 1006 claims must be an array');
  }

  const ids = new Set();

  for (const claim of education.claims) {
    if (typeof claim?.id !== 'string' || !claim.id.trim()) {
      throw new TypeError('Regulation 1006 claims must have string IDs');
    }

    if (ids.has(claim.id)) {
      throw new Error(`Duplicate regulation 1006 claim: ${claim.id}`);
    }

    ids.add(claim.id);
  }

  return education.claims;
}

const seed = JSON.parse(
  await fs.readFile(new URL('../data/regulations.json', import.meta.url), 'utf8'),
);
const seedClaims = getEducationClaims(seed);
const approvedClaims = claimIds.map(id => {
  const claim = seedClaims.find(item => item.id === id);

  if (!claim || typeof claim.text !== 'string' || !claim.text.trim()) {
    throw new Error(`Missing approved education claim: ${id}`);
  }

  return { id, label: claim.label, text: claim.text };
});

console.log(`Regulation registry: ${registryFile}`);

const workspace = createRegulationSyncWorkspace();

await workspace.transform(registryFile, source => {
  const registry = JSON.parse(source);
  const claims = getEducationClaims(registry);
  let changed = false;

  for (const approved of approvedClaims) {
    const existing = claims.find(claim => claim.id === approved.id);

    if (!existing) {
      if (approved.id === 'education.faq.05') {
        throw new Error('Missing existing education category claim');
      }

      claims.push({ ...approved });
      changed = true;
      continue;
    }

    if (existing.text === approved.text) {
      continue;
    }

    if (approved.id !== 'education.faq.05' || existing.text !== previousCategoryText) {
      throw new Error(`Unexpected text for education claim: ${approved.id}`);
    }

    existing.text = approved.text;
    changed = true;
  }

  return changed ? JSON.stringify(registry, null, 2) + '\n' : source;
});

const result = await applyRegulationSyncWorkspace(workspace);

console.log(
  result.changedFiles
    ? 'Updated education regulation claims.'
    : 'Education regulation claims are already correct; no files changed.',
);
