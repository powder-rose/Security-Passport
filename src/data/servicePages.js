export const servicePages = [
  {
    id: 'categorization-act',

    path:
      '/akt-obsledovaniya-i-kategorirovaniya-obekta/',

    title:
      'Акт обследования и категорирования объекта',

    seoName:
      'Акт обследования и категорирования объекта',

    seoTitle:
      'Акт обследования и категорирования объекта — разработка от 9 500 ₽',

    seoDescription:
      'Подготовка акта обследования и категорирования объекта в области антитеррористической защищённости. Определим применимые требования, подготовим документы для работы комиссии. Стоимость — 9 500 ₽.',

    regionalDescription:
      'Подготовим документацию для обследования и категорирования объекта, определим применимые требования и подготовим проект акта.',

    h1:
      'Акт обследования и категорирования объекта',

    description:
      'Подготовим документацию для обследования и категорирования объекта в соответствии с применимыми требованиями к антитеррористической защищённости.',
  },

  {
    id: 'passport-actualization',

    path:
      '/aktualizaciya-pasporta-bezopasnosti-obekta/',

    title:
      'Актуализация паспорта безопасности',

    seoName:
      'Актуализация паспорта безопасности объекта',

    seoTitle:
      'Актуализация паспорта безопасности объекта — сроки и оформление',

    seoDescription:
      'Актуализация паспорта безопасности объекта: проверим основания, применимые требования и необходимость повторного категорирования, подготовим изменения или новую редакцию паспорта и сопроводим оформление. Работаем по России.',

    regionalDescription:
      'Проверим действующий паспорт, основания для изменений или замены и подготовим актуальную редакцию.',

    h1:
      'Актуализация паспорта безопасности объекта',

    description:
      'Проверим действующий паспорт, основания для внесения изменений или замены документа и подготовим актуальную редакцию.',
  },
];


function normalizePathname(pathname) {
  const value =
    String(pathname || '/')
      .split('?')[0]
      .split('#')[0]
      .trim();

  if (
    !value ||
    value === '/'
  ) {
    return '/';
  }

  return (
    '/' +
    value
      .replace(/^\/+|\/+$/g, '') +
    '/'
  );
}


export function getServicePageByPathname(
  pathname,
) {
  const normalized =
    normalizePathname(pathname);

  return (
    servicePages.find(
      (page) =>
        page.path === normalized,
    ) || null
  );
}


export function isServicePagePathname(
  pathname,
) {
  return Boolean(
    getServicePageByPathname(
      pathname,
    ),
  );
}
