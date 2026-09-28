export function formatRussianPhone(value) {
  let digits = String(value ?? '')
    .replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (
    digits.startsWith('7') ||
    digits.startsWith('8')
  ) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  let result = '+7';

  if (digits.length > 0) {
    result += ` (${digits.slice(0, 3)}`;
  }

  if (digits.length >= 3) {
    result += ')';
  }

  if (digits.length > 3) {
    result += ` ${digits.slice(3, 6)}`;
  }

  if (digits.length > 6) {
    result += `-${digits.slice(6, 8)}`;
  }

  if (digits.length > 8) {
    result += `-${digits.slice(8, 10)}`;
  }

  return result;
}

export function sanitizeEmailInput(value) {
  const text = String(value ?? '');

  let result = '';
  let hasAt = false;

  for (const char of text) {
    if (!hasAt) {
      if (char === '@') {
        if (result.length > 0) {
          result += '@';
          hasAt = true;
        }

        continue;
      }

      if (
        /[A-Za-z0-9.!#$%&'*+\-/=?^_`{|}~]/.test(char)
      ) {
        result += char;
      }

      continue;
    }

    if (/[A-Za-z0-9.-]/.test(char)) {
      result += char;
    }
  }

  return result;
}

export function normalizeGeoName(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('ru-RU')
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ');
}

export function normalizeSettlementName(value) {
  return normalizeGeoName(value).replace(
    /^(?:город|г\.?|пос[её]лок|пос\.?|п\.?|пгт\.?|р\.?\s*п\.?|село|с\.?|деревня|д\.?|станица|ст-?ца\.?|хутор|х\.?)\s+/iu,
    '',
  );
}
