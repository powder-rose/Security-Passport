import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Seo from '../components/Seo/Seo';
import Analytics from '../components/Analytics/Analytics';

import Hero from '../sections/Hero/Hero';
import Experience from '../sections/Experience/Experience';
import AboutPassport from '../sections/AboutPassport/AboutPassport';
import ObjectQuiz from '../sections/ObjectQuiz/ObjectQuiz';
import DocumentsComparison from '../sections/DocumentsComparison/DocumentsComparison';
import WhoNeedsPassport from '../sections/WhoNeedsPassport/WhoNeedsPassport';
import RegulationByObject from '../sections/RegulationByObject/RegulationByObject';
import Process from '../sections/Process/Process';
import Advantages from '../sections/Advantages/Advantages';
import Prices from '../sections/Prices/Prices';
import RequiredDocuments from '../sections/RequiredDocuments/RequiredDocuments';
import Penalties from '../sections/Penalties/Penalties';
import RelatedServices from '../sections/RelatedServices/RelatedServices';
import Expert from '../sections/Expert/Expert';
import FAQ from '../sections/FAQ/FAQ';
import FinalCTA from '../sections/FinalCTA/FinalCTA';

import {
  getLegalDocumentByPathname,
} from '../content/legalDocuments';

import {
  getObjectTypeByPathname,
} from '../data/objectTypes';

import {
  getServicePageByPathname,
} from '../data/servicePages';

export default function App({
  pathname,
  initialBlogArticles = null,
  initialArticle = null,
  routeComponents = {},
}) {
  const resolvedPathname =
    pathname ||
    (
      typeof window !== 'undefined'
        ? window.location.pathname
        : '/'
    );

  const normalizedPathname =
    resolvedPathname.replace(
      /\/+$/,
      ''
    ) || '/';


  const {
    LegalPage:
      LegalPageComponent,

    ObjectTypePage:
      GenericObjectTypePage,

    BlogPage:
      BlogPageComponent,

    ArticlePage:
      ArticlePageComponent,

    objectTypeComponents = {},

    servicePageComponents = {},
  } = routeComponents;


  if(
    normalizedPathname ===
    '/blog'
  ){

    return (
      <>
        <Analytics />

        <Header pathname={resolvedPathname} />

        <BlogPageComponent
          initialArticles={initialBlogArticles}
        />

        <Footer />
      </>
    );

  }


  const blogArticleMatch =
    normalizedPathname.match(
      /^\/blog\/([^/]+)$/
    );


  if(
    blogArticleMatch
  ){

    let articleSlug =
      blogArticleMatch[1];


    try {

      articleSlug =
        decodeURIComponent(
          articleSlug
        );

    }
    catch {
      // Оставляем исходный slug.
    }


    return (
      <>
        <Analytics />

        <Header pathname={resolvedPathname} />

        <ArticlePageComponent
          slug={articleSlug}
          initialArticle={initialArticle}
          initialArticles={initialBlogArticles}
        />

        <Footer />
      </>
    );

  }


  const legalDocument =
    getLegalDocumentByPathname(
      resolvedPathname,
    );

  if (legalDocument) {
    return (
      <>
        <Analytics />

        <LegalPageComponent
          document={legalDocument}
        />
      </>
    );
  }


  const objectType =
    getObjectTypeByPathname(
      resolvedPathname,
    );

  if (objectType) {
    const ObjectPageComponent =
      objectTypeComponents[
        objectType.id
      ] ||
      GenericObjectTypePage;

    return (
      <>
        <Seo pathname={resolvedPathname} />

        <Analytics />
        <Header pathname={resolvedPathname} />

        <ObjectPageComponent
          objectType={objectType}
        />

        <Footer />
      </>
    );
  }


  const servicePage =
    getServicePageByPathname(
      resolvedPathname,
    );

  const ServicePageComponent =
    servicePage
      ? servicePageComponents[
          servicePage.id
        ]
      : null;


  if (
    servicePage &&
    ServicePageComponent
  ) {
    return (
      <>
        <Seo pathname={resolvedPathname} />

        <Analytics />
        <Header pathname={resolvedPathname} />

        <ServicePageComponent
          servicePage={servicePage}
        />

        <Footer />
      </>
    );
  }



  return (
    <>
      <Seo pathname="/" />
      <Analytics />
      <Header pathname={resolvedPathname} />

      <main id="main-content">
        <Hero />
        <Experience />
        <AboutPassport />
        <ObjectQuiz />
        <DocumentsComparison />
        <WhoNeedsPassport />
        <RegulationByObject />
        <Process />
        <Advantages />
        <Prices />
        <RequiredDocuments />
        <Penalties />
        <RelatedServices />
        <Expert />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
