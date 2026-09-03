import { Helmet } from 'react-helmet-async';

import {
  buildSeo,
  buildServiceSchema,
  organizationSchema,
} from '../../config/seo';

import { SITE } from '../../config/site';
import { useCity } from '../../context/GeoContext';
import { faq } from '../../data/faq';


export default function Seo() {
  const city =
    useCity();

  const seo =
    buildSeo(city);

  const isIndexable =
    city.isDefault ||
    city.seoIndexable === true;

  const robotsContent =
    isIndexable
      ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
      : 'noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

  const serviceSchema =
    buildServiceSchema(city);

  const imageAlt =
    city.hasTrustedInflection
      ? (
          `Разработка паспорта безопасности ` +
          `${city.locationPhrase}`
        )
      : (
          `Разработка паспорта безопасности — ` +
          `${city.locationSeo}`
        );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',

    mainEntity:
      faq.map((item) => ({
        '@type': 'Question',
        name: item.question,

        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
  };


  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',

    '@id':
      `${seo.canonical}/#webpage`,

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
        `${seo.canonical}/#service`,
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
        content="image/webp"
      />

      <meta
        property="og:image:width"
        content="930"
      />

      <meta
        property="og:image:height"
        content="1400"
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

      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
}
