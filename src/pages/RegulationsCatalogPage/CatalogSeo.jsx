import { Helmet } from 'react-helmet-async';

import { SITE } from '../../config/site.js';
import { CATALOG_PATH } from '../../../shared/catalog/defaults.js';

export default function CatalogSeo({ settings, cards }) {
  const canonical = `${SITE.federalUrl}${CATALOG_PATH}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: settings.title,
    description: settings.seoDescription,
    url: canonical,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: cards.map((card, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: card.title,
        url: `${SITE.federalUrl}${card.url}`,
      })),
    },
  };
  return (
    <Helmet>
      <title>{settings.seoTitle}</title>
      <meta name="description" content={settings.seoDescription} />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={settings.seoTitle} />
      <meta property="og:description" content={settings.seoDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content={SITE.brand} />
      <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
    </Helmet>
  );
}
