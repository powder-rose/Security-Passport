import { Helmet } from 'react-helmet-async';

import {
  buildSeo,
  buildServiceSchema,
  organizationSchema,
} from '../../config/seo';

import { SITE } from '../../config/site';

import {
  getObjectTypeByPathname,
} from '../../data/objectTypes';

import {
  getServicePageByPathname,
} from '../../data/servicePages';

import { useCity } from '../../context/GeoContext';


export default function Seo({
  pathname = '/',
}) {
  const city =
    useCity();

  const objectType =
    getObjectTypeByPathname(
      pathname,
    );

  const servicePage =
    getServicePageByPathname(
      pathname,
    );

  const seo =
    buildSeo(
      city,
      pathname,
    );

  /*
   * Федеральные страницы индексируются.
   *
   * Для регионов:
   * - главная индексируется только при seoIndexable=true;
   * - service pages наследуют seoIndexable региона;
   * - object-type страницы пока всегда noindex,follow.
   */
  const childPagePath =
    objectType?.path ||
    servicePage?.path ||
    null;

  const isChildSeoPage =
    Boolean(childPagePath);

  const isRegionalObjectTypePage =
    !city.isDefault &&
    Boolean(objectType?.path);

  const isIndexable =
    city.isDefault ||
    (
      city.seoIndexable === true &&
      !isRegionalObjectTypePage
    );

  const robotsContent =
    isIndexable
      ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
      : 'noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

  const serviceSchema =
    buildServiceSchema(
      city,
      pathname,
    );

  const schemaBaseUrl =
    seo.canonical.replace(
      /\/$/,
      '',
    );

  const imageAlt =
    servicePage
      ? `${servicePage.seoName} — ${SITE.brand}`
      : objectType
        ? `${objectType.seoName} — ${SITE.brand}`
        : 'Паспорт безопасности объекта — БОЙКОВГРУПП';


  const breadcrumbHomeUrl =
    isChildSeoPage &&
    childPagePath &&
    seo.canonical.endsWith(childPagePath)
      ? seo.canonical.slice(
          0,
          -childPagePath.length,
        )
      : SITE.defaultUrl;

  const breadcrumbSchema =
    isChildSeoPage
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',

          '@id':
            `${schemaBaseUrl}/#breadcrumb`,

          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Главная',
              item: breadcrumbHomeUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,

              name:
                servicePage?.seoName ||
                objectType?.seoName ||
                seo.title,

              item:
                seo.canonical,
            },
          ],
        }
      : null;


  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',

    '@id':
      `${schemaBaseUrl}/#webpage`,

    name:
      seo.title,

    description:
      seo.description,

    url:
      seo.canonical,

    inLanguage:
      'ru-RU',

    about: {
      '@id':
        `${schemaBaseUrl}/#service`,
    },

    isPartOf: {
      '@type': 'WebSite',
      '@id':
        `${SITE.defaultUrl}/#website`,
      name:
        SITE.brand,
      url:
        SITE.defaultUrl,
      inLanguage:
        'ru-RU',
    },
  };

  if (breadcrumbSchema) {
    pageSchema.breadcrumb = {
      '@id':
        breadcrumbSchema['@id'],
    };
  }


  return (
    <Helmet>
      <html lang="ru" />

      <title>{seo.title}</title>

      <meta
        name="description"
        content={seo.description}
      />

      <meta
        name="robots"
        content={robotsContent}
      />

      <meta
        name="author"
        content={SITE.brand}
      />

      <meta
        name="format-detection"
        content="telephone=yes"
      />

      <link
        rel="canonical"
        href={seo.canonical}
      />


      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:locale"
        content="ru_RU"
      />

      <meta
        property="og:title"
        content={seo.title}
      />

      <meta
        property="og:description"
        content={seo.description}
      />

      <meta
        property="og:url"
        content={seo.canonical}
      />

      <meta
        property="og:site_name"
        content={SITE.brand}
      />

      <meta
        property="og:image"
        content={seo.image}
      />

      <meta
        property="og:image:type"
        content="image/png"
      />

      <meta
        property="og:image:width"
        content="1200"
      />

      <meta
        property="og:image:height"
        content="630"
      />

      <meta
        property="og:image:alt"
        content={imageAlt}
      />


      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={seo.title}
      />

      <meta
        name="twitter:description"
        content={seo.description}
      />

      <meta
        name="twitter:image"
        content={seo.image}
      />

      <meta
        name="twitter:image:alt"
        content={imageAlt}
      />


      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(pageSchema)}
      </script>

      {breadcrumbSchema ? (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      ) : null}
    </Helmet>
  );
}
