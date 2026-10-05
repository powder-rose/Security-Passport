import { Helmet } from "react-helmet-async";

import { SITE } from "../../../../config/site.js";

export default function BlogSeo() {
  const canonical = `${SITE.federalUrl}/blog/`;

  const ogImage = `${SITE.federalUrl}/images/og-passport-security.png`;

  const ogImageAlt = "Статьи о безопасности объектов — БОЙКОВГРУПП";

  return (
    <>
      <Helmet>
        <title>Статьи о безопасности объектов — БОЙКОВГРУПП</title>

        <meta
          name="description"
          content="Практические статьи БОЙКОВГРУПП об антитеррористической защищённости, паспортах безопасности, категорировании объектов и документации."
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />

        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="website" />

        <meta
          property="og:title"
          content="Статьи о безопасности объектов — БОЙКОВГРУПП"
        />

        <meta
          property="og:description"
          content="Разбираем требования, документы и практические вопросы безопасности объектов."
        />

        <meta property="og:url" content={canonical} />

        <meta property="og:locale" content="ru_RU" />

        <meta property="og:site_name" content={SITE.brand} />

        <meta property="og:image" content={ogImage} />

        <meta property="og:image:type" content="image/png" />

        <meta property="og:image:width" content="1200" />

        <meta property="og:image:height" content="630" />

        <meta property="og:image:alt" content={ogImageAlt} />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Статьи о безопасности объектов — БОЙКОВГРУПП"
        />

        <meta
          name="twitter:description"
          content="Разбираем требования, документы и практические вопросы безопасности объектов."
        />

        <meta name="twitter:image" content={ogImage} />

        <meta name="twitter:image:alt" content={ogImageAlt} />
      </Helmet>
    </>
  );
}
