import * as yup from 'yup';

const PHONE_MIN_DIGITS = 10;
const PHONE_MAX_DIGITS = 15;

const obviousGarbage = new Set([
  'test',
  'тест',
  'qwerty',
  'asdf',
  'abc',
  'куку',
  'кукуку',
]);

const consonants =
  'bcdfghjklmnpqrstvwxyzбвгджзйклмнпрстфхцчшщ';

const repeatedCharsPattern = /(.)\1{3,}/iu;
const repeatedChunkPattern = /^(.{1,4})\1{2,}$/iu;

function compactText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[\s'"«»\-–—]/g, '');
}

function hasRepeatedGarbage(value) {
  const compact = compactText(value);

  if (!compact) return false;

  return (
    repeatedCharsPattern.test(compact) ||
    repeatedChunkPattern.test(compact)
  );
}

function hasLongConsonantRun(value) {
  const tokens = String(value ?? '')
    .toLowerCase()
    .split(/\s+/);

  return tokens.some((token) => {
    const letters = token.replace(
      /[^a-zа-яё]/giu,
      '',
    );

    if (letters.length < 12) {
      return false;
    }

    const pattern = new RegExp(
      `[${consonants}]{6,}`,
      'iu',
    );

    return pattern.test(letters);
  });
}

function hasSuspiciousLetterDigitMix(value) {
  const tokens = String(value ?? '')
    .split(/\s+/);

  return tokens.some((token) => {
    const cleaned = token.replace(
      /[.,;:!?()[\]{}"'«»]/g,
      '',
    );

    const hasLetters =
      /[a-zа-яё]/iu.test(cleaned);

    const hasDigits =
      /\d/.test(cleaned);

    if (!hasLetters || !hasDigits) {
      return false;
    }

    /*
     * Разрешаем нормальные обозначения:
     * 2400м2
     * 2400м²
     * 350м
     * 120м3
     */
    if (
      /^\d+(?:[.,]\d+)?(?:м|м2|м²|м3|м³)$/iu.test(
        cleaned,
      )
    ) {
      return false;
    }

    return true;
  });
}

function isSuspiciousText(value) {
  const text = String(value ?? '').trim();

  if (!text) {
    return false;
  }

  if (hasRepeatedGarbage(text)) {
    return true;
  }

  if (hasLongConsonantRun(text)) {
    return true;
  }

  if (hasSuspiciousLetterDigitMix(text)) {
    return true;
  }

  return false;
}

const nameSchema = yup
  .string()
  .transform((value) => value?.trim() ?? '')
  .required('Укажите ваше имя.')
  .min(
    2,
    'Имя должно содержать минимум 2 символа.',
  )
  .max(
    80,
    'Имя слишком длинное.',
  )
  .matches(
    /^[A-Za-zА-Яа-яЁё\s'-]+$/,
    'Имя может содержать только буквы, пробел, дефис и апостроф.',
  )
  .test(
    'not-obvious-garbage',
    'Укажите настоящее имя.',
    (value) => {
      if (!value) return false;

      const normalized =
        compactText(value);

      if (obviousGarbage.has(normalized)) {
        return false;
      }

      if (hasRepeatedGarbage(value)) {
        return false;
      }

      if (hasLongConsonantRun(value)) {
        return false;
      }

      return true;
    },
  );

const phoneSchema = yup
  .string()
  .transform((value) => value?.trim() ?? '')
  .required('Укажите номер телефона.')
  .test(
    'phone-digits',
    'Укажите корректный номер телефона.',
    (value) => {
      if (!value) return false;

      const digits =
        value.replace(/\D/g, '');

      if (
        digits.length < PHONE_MIN_DIGITS ||
        digits.length > PHONE_MAX_DIGITS
      ) {
        return false;
      }

      if (/^(\d)\1+$/.test(digits)) {
        return false;
      }

      const obviousFakeNumbers = new Set([
        '0123456789',
        '1234567890',
        '9876543210',
        '0987654321',
      ]);

      if (obviousFakeNumbers.has(digits)) {
        return false;
      }

      return true;
    },
  );

const emailSchema = yup
  .string()
  .transform((value) => value?.trim() ?? '')
  .max(
    254,
    'Адрес электронной почты слишком длинный.',
  )
  .email(
    'Укажите корректный адрес электронной почты.',
  )
  .test(
    'email-local-part',
    'Укажите корректный адрес электронной почты.',
    (value) => {
      if (!value) {
        return true;
      }

      const parts = value.split('@');

      if (parts.length !== 2) {
        return false;
      }

      const local = parts[0];

      if (
        local.length < 1 ||
        local.length > 64
      ) {
        return false;
      }

      /*
       * Разрешённый dot-atom:
       * буквы, цифры и стандартные
       * специальные символы email.
       *
       * Точка разрешена только
       * между непустыми частями:
       *
       * ivan.petrov   OK
       * .ivan         НЕТ
       * ivan.         НЕТ
       * ivan..petrov  НЕТ
       */
      return /^[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+(?:\.[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+)*$/.test(
        local,
      );
    },
  )
  .test(
    'email-domain',
    'Укажите корректный адрес электронной почты.',
    (value) => {
      if (!value) {
        return true;
      }

      const parts = value.split('@');

      if (parts.length !== 2) {
        return false;
      }

      const domain = parts[1];

      if (!domain.includes('.')) {
        return false;
      }

      const labels = domain.split('.');

      if (
        labels.some(
          (label) =>
            !label ||
            !/^[A-Za-zА-Яа-яЁё0-9](?:[A-Za-zА-Яа-яЁё0-9-]*[A-Za-zА-Яа-яЁё0-9])?$/.test(label),
        )
      ) {
        return false;
      }

      const tld = labels.at(-1);

      return (
        tld.length >= 2 &&
        /^[A-Za-zА-Яа-яЁё]+$/.test(tld)
      );
    },
  )
  .default('');

const consentSchema = yup
  .boolean()
  .oneOf(
    [true],
    'Необходимо согласие на обработку персональных данных.',
  );

const optionalHumanTextSchema = (
  maxLength,
  tooLongMessage,
) =>
  yup
    .string()
    .transform((value) => value?.trim() ?? '')
    .max(
      maxLength,
      tooLongMessage,
    )
    .test(
      'not-garbage',
      'Проверьте введённый текст.',
      (value) =>
        !value ||
        !isSuspiciousText(value),
    )
    .default('');


const organizationSchema = yup
  .string()
  .transform((value) => value?.trim() ?? '')
  .max(
    200,
    'Название организации слишком длинное.',
  )
  .test(
    'organization-min-length',
    'Укажите корректное название организации.',
    (value) => !value || value.length >= 2,
  )
  .test(
    'organization-has-letter',
    'Название организации должно содержать буквы.',
    (value) =>
      !value ||
      /[A-Za-zА-Яа-яЁё]/.test(value),
  )
  .test(
    'organization-not-garbage',
    'Проверьте название организации.',
    (value) => {
      if (!value) return true;

      const compact = compactText(value);

      if (obviousGarbage.has(compact)) {
        return false;
      }

      if (hasRepeatedGarbage(value)) {
        return false;
      }

      if (hasLongConsonantRun(value)) {
        return false;
      }

      const letters =
        value.match(/[A-Za-zА-Яа-яЁё]/g)?.length ?? 0;

      const digits =
        value.match(/\d/g)?.length ?? 0;

      /*
       * Не даём вводить телефон, ИНН или длинный набор цифр
       * вместо названия организации.
       *
       * При этом "1С", "ГКБ № 52", "X5 Group" остаются допустимыми.
       */
      if (
        digits >= 8 &&
        digits > letters * 3
      ) {
        return false;
      }

      return true;
    },
  )
  .default('');

const russianPhoneSchema = phoneSchema
  .test(
    'russian-phone',
    'Укажите полный номер телефона.',
    (value) => {
      if (!value) return false;

      const digits =
        value.replace(/\D/g, '');

      return (
        digits.length === 11 &&
        digits.startsWith('7')
      );
    },
  );

const areaSchema = yup
  .string()
  .transform((value) => value?.trim() ?? '')
  .required('Укажите площадь объекта.')
  .test(
    'area-format',
    'Укажите площадь числом, например 850.',
    (value) => {
      if (!value) return false;

      const normalized =
        value.replace(/\s/g, '');

      return /^\d{1,8}(?:[.,]\d{1,2})?$/.test(
        normalized,
      );
    },
  )
  .test(
    'area-range',
    'Площадь должна быть от 1 до 10 000 000 м².',
    (value) => {
      if (!value) return false;

      const normalized =
        value
          .replace(/\s/g, '')
          .replace(',', '.');

      const number =
        Number(normalized);

      return (
        Number.isFinite(number) &&
        number >= 1 &&
        number <= 10000000
      );
    },
  );

const peopleSchema = yup
  .string()
  .transform((value) => value?.trim() ?? '')
  .required(
    'Укажите максимальное количество людей.',
  )
  .matches(
    /^\d+$/,
    'Количество людей указывается целым числом.',
  )
  .test(
    'people-range',
    'Количество людей должно быть от 1 до 1 000 000.',
    (value) => {
      if (!value) return false;

      const number =
        Number(value);

      return (
        Number.isInteger(number) &&
        number >= 1 &&
        number <= 1000000
      );
    },
  );


const russianPlaceNameSchema = (
  fieldLabel,
) =>
  yup
    .string()
    .transform(
      (value) => value?.trim() ?? '',
    )
    .required(
      `Укажите ${fieldLabel.toLowerCase()}.`,
    )
    .min(
      2,
      `${fieldLabel} указан некорректно.`,
    )
    .max(
      120,
      `${fieldLabel} указан слишком длинно.`,
    )
    .matches(
      /^[А-Яа-яЁё0-9\s.,№'"«»()\-–—]+$/u,
      `${fieldLabel} должен быть указан на русском языке.`,
    )
    .test(
      'has-cyrillic',
      `${fieldLabel} должен содержать название на русском языке.`,
      (value) => {
        if (!value) return false;

        const letters =
          value.match(/[А-Яа-яЁё]/g) ?? [];

        return letters.length >= 2;
      },
    )
    .test(
      'not-place-garbage',
      `Проверьте поле «${fieldLabel}».`,
      (value) => {
        if (!value) return false;

        if (hasRepeatedGarbage(value)) {
          return false;
        }

        if (hasLongConsonantRun(value)) {
          return false;
        }

        const compact =
          compactText(value);

        if (obviousGarbage.has(compact)) {
          return false;
        }

        return true;
      },
    );

export const quizLocationSchema = yup.object({
  region: russianPlaceNameSchema(
    'Регион',
  ),

  city: russianPlaceNameSchema(
    'Населённый пункт',
  ),
});

export const quizMetricsSchema = yup.object({
  area: areaSchema,
  people: peopleSchema,
});

export const leadFormSchema = yup.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,

  object: optionalHumanTextSchema(
    1000,
    'Описание слишком длинное.',
  ),

  consent: consentSchema,

  website: yup
    .string()
    .max(
      0,
      'Некорректная отправка формы.',
    )
    .default(''),
});

export const quizContactSchema = yup.object({
  name: nameSchema,
  phone: russianPhoneSchema,
  email: emailSchema,
  company: organizationSchema,
  consent: consentSchema,
});
