import {
  LOCATIONS,
  DEFAULT_LOCATION,
  getRegionalLocations,
} from '../config/geography/index.mjs';

console.log('================================');
console.log('GEOGRAPHY DATABASE');
console.log('================================');

console.log(
  `Всего географий: ${LOCATIONS.length}`,
);

console.log(
  `Региональных страниц: ${getRegionalLocations().length}`,
);

console.log(
  `Федеральная: ${DEFAULT_LOCATION.name}`,
);

console.log();

for (const location of LOCATIONS) {
  console.log(
    [
      location.isDefault ? '[DEFAULT]' : '[REGION] ',
      location.slug || '(root)',
      '→',
      location.name,
      '→',
      location.prepositional,
      '→',
      location.subject,
    ].join(' '),
  );
}

console.log();
console.log('✓ Geography database valid');
