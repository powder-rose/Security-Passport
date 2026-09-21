import { Helmet } from 'react-helmet-async';

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

import LegalPage from '../pages/LegalPage/LegalPage';
import ObjectTypePage from '../pages/ObjectTypePage/ObjectTypePage';
import HotelPage from '../pages/HotelPage/HotelPage';
import CulturePage from '../pages/CulturePage/CulturePage';
import ActualizationPage from '../pages/ActualizationPage/ActualizationPage';
import CategorizationActPage from '../pages/CategorizationActPage/CategorizationActPage';

const legalPageCssUrl =
  '/styles/LegalPage.css';

const objectTypePageCssUrl =
  '/styles/ObjectTypePage.css';

const hotelPageCssUrl =
  '/styles/HotelPage.css';

const culturePageCssUrl =
  '/styles/CulturePage.css';

const actualizationPageCssUrl =
  '/styles/ActualizationPage.css';

const categorizationActPageCssUrl =
  '/styles/CategorizationActPage.css';


function getRuntimeStylesheetUrl(
  fallbackUrl,
) {
  if (
    typeof document === 'undefined'
  ) {
    return fallbackUrl;
  }

  const fileName =
    fallbackUrl
      .split('/')
      .pop()
      ?.replace(
        /\.css$/,
        '',
      );

  if (!fileName) {
    return fallbackUrl;
  }

  const existingLink =
    Array.from(
      document.querySelectorAll(
        'link[rel="stylesheet"]',
      ),
    ).find(
      (link) => {
        const href =
          link.getAttribute(
            'href',
          ) || '';

        return href.includes(
          `/styles/${fileName}`,
        );
      },
    );

  return (
    existingLink?.getAttribute(
      'href',
    ) ||
    fallbackUrl
  );
}


const objectTypeViews = {
  hotel: {
    Component:
      HotelPage,

    cssUrl:
      hotelPageCssUrl,
  },

  culture: {
    Component:
      CulturePage,

    cssUrl:
      culturePageCssUrl,
  },
};


const servicePageViews = {
  'categorization-act': {
    Component:
      CategorizationActPage,

    cssUrl:
      categorizationActPageCssUrl,
  },

  'passport-actualization': {
    Component:
      ActualizationPage,

    cssUrl:
      actualizationPageCssUrl,
  },
};

import {
  getLegalDocumentByPathname,
} from '../content/legalDocuments';

import {
  getObjectTypeByPathname,
} from '../data/objectTypes';

import {
  getServicePageByPathname,
} from '../data/servicePages';

import {
  useCity,
} from '../context/GeoContext';


export default function App({
  pathname,
}) {
  const city =
    useCity();

  const resolvedPathname =
    pathname ||
    (
      typeof window !== 'undefined'
        ? window.location.pathname
        : '/'
    );

  const legalDocument =
    city.isDefault
      ? getLegalDocumentByPathname(
          resolvedPathname,
        )
      : null;

  if (legalDocument) {
    return (
      <>
        <Helmet>
          <link
            rel="stylesheet"
            href={legalPageCssUrl}
          />
        </Helmet>

        <Analytics />

        <LegalPage
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
    const objectTypeView =
      objectTypeViews[
        objectType.id
      ];

    const ObjectPageComponent =
      objectTypeView?.Component ||
      ObjectTypePage;

    const objectPageCssUrl =
      getRuntimeStylesheetUrl(
        objectTypeView?.cssUrl ||
        objectTypePageCssUrl,
      );

    return (
      <>
        <Seo pathname={resolvedPathname} />

        <Helmet>
          <link
            rel="stylesheet"
            href={objectPageCssUrl}
          />
        </Helmet>

        <Analytics />
        <Header />

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

  const servicePageView =
    servicePage
      ? servicePageViews[
          servicePage.id
        ]
      : null;


  if (
    servicePage &&
    servicePageView
  ) {
    const ServicePageComponent =
      servicePageView.Component;

    const servicePageCssUrl =
      getRuntimeStylesheetUrl(
        servicePageView.cssUrl,
      );

    return (
      <>
        <Seo pathname={resolvedPathname} />

        <Helmet>
          <link
            rel="stylesheet"
            href={servicePageCssUrl}
          />
        </Helmet>

        <Analytics />
        <Header />

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
      <Header />

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
