import { getRegionBySlug } from '../config/regions.mjs';

const slug = String(process.argv[2] || '').trim();

if (!slug) {
  console.error('Не указан slug региона.');
  process.exit(1);
}

const region = getRegionBySlug(slug);

if (!region) {
  console.error(`Регион "${slug}" не найден в config/regions.mjs`);
  process.exit(2);
}

if (!region.active) {
  console.error(`Регион "${slug}" отключён.`);
  process.exit(3);
}

console.log(region.slug);
console.log(region.name);
console.log(region.genitive);
console.log(region.prepositional);
console.log(region.region);
console.log(region.address || '');
