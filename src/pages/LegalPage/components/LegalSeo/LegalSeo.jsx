import { Helmet } from "react-helmet-async";

import { SITE } from "../../../../config/site";

export default function LegalSeo({ document }) {
  const canonical = `${SITE.federalUrl}/${document.slug}/`;

  const image = `${SITE.federalUrl}/images/og-passport-security.png`;

  return (
    <Helmet>
      <title>
        {document.title} — {SITE.brand}
      </title>

      <meta name="description" content={document.description} />

      <meta
        name="robots"
        content="noindex,follow,max-image-preview:large,max-snippet:-1"
      />

      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />

      <meta property="og:locale" content="ru_RU" />

      <meta property="og:site_name" content={SITE.brand} />

      <meta property="og:title" content={`${document.title} — ${SITE.brand}`} />

      <meta property="og:description" content={document.description} />

      <meta property="og:url" content={canonical} />

      <meta property="og:image" content={image} />

      <meta property="og:image:type" content="image/png" />

      <meta property="og:image:width" content="1200" />

      <meta property="og:image:height" content="630" />
    </Helmet>
  );
}
