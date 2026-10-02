export const BLOG_CATEGORIES = [
  {
    id: 'hotels',
    label: 'Гостиницы',
    description:
      'Материалы о категорировании, требованиях антитеррористической защищённости и паспортах безопасности гостиниц и других средств размещения.',
  },

  {
    id: 'culture',
    label: 'Культура',
    description:
      'Материалы о категорировании, обследовании, требованиях и паспортах безопасности объектов культуры.',
  },
];


const LEGACY_BLOG_CATEGORY_VALUES =
  new Set([
    'passport',
    'categorization',
    'requirements',
    'actualization',
    'practice',
    'паспорта безопасности',
    'категорирование объектов',
    'требования и законодательство',
    'актуализация паспорта',
    'практика и документы',
  ]);


function normalizeCategoryLabel(
  value
){

  return String(
    value || ''
  )
    .replace(
      /\s+/g,
      ' '
    )
    .trim()
    .slice(
      0,
      80
    );

}


export function resolveArticleCategory(
  article
){

  const label =
    normalizeCategoryLabel(
      article?.category
    );


  if(
    !label
  ){
    return null;
  }


  const normalized =
    label.toLocaleLowerCase(
      'ru-RU'
    );


  if(
    LEGACY_BLOG_CATEGORY_VALUES.has(
      normalized
    )
  ){
    return null;
  }


  const predefined =
    BLOG_CATEGORIES.find(
      category =>
        category.id ===
          normalized
        ||
        category.label
          .toLocaleLowerCase(
            'ru-RU'
          ) ===
          normalized
    );


  if(
    predefined
  ){
    return predefined;
  }


  return {
    id:
      `custom-${encodeURIComponent(
        normalized
      )}`,

    label,

    description:
      `Материалы по теме «${label}»: практические разборы требований, документов и подготовки материалов.`,
  };

}


export function formatDate(
  value
){

  if(!value){
    return '';
  }


  const date =
    new Date(
      value
    );


  if(
    Number.isNaN(
      date.getTime()
    )
  ){
    return '';
  }


  return new Intl.DateTimeFormat(
    'ru-RU',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(
    date
  );

}
