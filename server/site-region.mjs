const BASE_DOMAIN =
  String(
    process.env.BASE_DOMAIN ||
    'pasport-bezopasnosty.ru',
  )
    .trim()
    .toLowerCase();


const FEDERAL_SITE =
  Object.freeze({
    slug: 'russia',
    name: 'Россия',
    host: BASE_DOMAIN,
    isDefault: true,
  });


export function resolveSiteFromHost() {
  return {
    ...FEDERAL_SITE,
  };
}
