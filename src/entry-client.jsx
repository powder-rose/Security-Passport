import { StrictMode } from 'react';
import {
  createRoot,
  hydrateRoot,
} from 'react-dom/client';

import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import { store } from './app/store';
import App from './app/App';

import { CITY } from './config/city';
import { GeoProvider } from './context/GeoContext';

import {
  maybeRedirectByGeo,
} from './lib/geoRedirect';

import {
  getObjectTypeByPathname,
  isObjectTypePathname,
} from './data/objectTypes';

import {
  getServicePageByPathname,
  isServicePagePathname,
} from './data/servicePages';

import {
  getLegalDocumentByPathname,
} from './content/legalDocuments';

import './styles/reset.css';
import './styles/variables.css';
import './styles/typography.css';
import './styles/global.css';


const objectPageLoaders = {
  hotel:
    () => import(
      './pages/HotelPage/HotelPage'
    ),

  culture:
    () => import(
      './pages/CulturePage/CulturePage'
    ),

  education:
    () => import(
      './pages/EducationPage/EducationPage'
    ),

  sport:
    () => import(
      './pages/SportPage/SportPage'
    ),

  trade:
    () => import(
      './pages/TradePage/TradePage'
    ),

  health:
    () => import(
      './pages/HealthPage/HealthPage'
    ),

  crowd:
    () => import(
      './pages/CrowdPage/CrowdPage'
    ),
};


const servicePageLoaders = {
  'categorization-act':
    () => import(
      './pages/CategorizationActPage/CategorizationActPage'
    ),

  'passport-actualization':
    () => import(
      './pages/ActualizationPage/ActualizationPage'
    ),
};


async function loadRouteComponents(
  pathname,
) {
  const normalizedPathname =
    pathname.replace(
      /\/+$/,
      '',
    ) || '/';


  if (
    normalizedPathname ===
    '/blog'
  ) {
    const {
      default:
        BlogPage,
    } =
      await import(
        './pages/BlogPage/BlogPage'
      );

    return {
      BlogPage,
    };
  }


  if (
    /^\/blog\/[^/]+$/.test(
      normalizedPathname,
    )
  ) {
    const {
      default:
        ArticlePage,
    } =
      await import(
        './pages/ArticlePage/ArticlePage'
      );

    return {
      ArticlePage,
    };
  }


  if (
    getLegalDocumentByPathname(
      pathname,
    )
  ) {
    const {
      default:
        LegalPage,
    } =
      await import(
        './pages/LegalPage/LegalPage'
      );

    return {
      LegalPage,
    };
  }


  const objectType =
    getObjectTypeByPathname(
      pathname,
    );


  if (
    objectType
  ) {
    const loader =
      objectPageLoaders[
        objectType.id
      ];


    if (
      loader
    ) {
      const {
        default:
          ObjectPage,
      } =
        await loader();

      return {
        objectTypeComponents: {
          [objectType.id]:
            ObjectPage,
        },
      };
    }


    const {
      default:
        ObjectTypePage,
    } =
      await import(
        './pages/ObjectTypePage/ObjectTypePage'
      );

    return {
      ObjectTypePage,
    };
  }


  const servicePage =
    getServicePageByPathname(
      pathname,
    );


  if (
    servicePage
  ) {
    const loader =
      servicePageLoaders[
        servicePage.id
      ];


    if (
      loader
    ) {
      const {
        default:
          ServicePage,
      } =
        await loader();

      return {
        servicePageComponents: {
          [servicePage.id]:
            ServicePage,
        },
      };
    }
  }


  return {};
}


async function bootstrap() {
  /*
   * География проверяется ДО React
   * и ДО Analytics.
   *
   * Если будет переход, федеральное
   * посещение не попадёт в статистику.
   */
  const redirected =
    await maybeRedirectByGeo();

  if (redirected) {
    return;
  }


  const initialCity =
    typeof window !== 'undefined' &&
    window.__PASSPORT_CITY__
      ? window.__PASSPORT_CITY__
      : CITY;


  const initialBlogData =
    typeof window !== 'undefined'
      ? (
          window.__PASSPORT_BLOG__ ||
          {}
        )
      : {};


  const routeComponents =
    await loadRouteComponents(
      window.location.pathname,
    );


  const app = (
    <StrictMode>
      <Provider store={store}>
        <HelmetProvider>
          <GeoProvider
            city={initialCity}
          >
            <App
              pathname={
                window.location.pathname
              }
              initialBlogArticles={
                initialBlogData.articles ??
                null
              }
              initialArticle={
                initialBlogData.article ??
                null
              }
              routeComponents={
                routeComponents
              }
            />
          </GeoProvider>
        </HelmetProvider>
      </Provider>
    </StrictMode>
  );


  const root =
    document.getElementById(
      'root',
    );


  if (!root) {
    throw new Error(
      'Application root element #root was not found.',
    );
  }


  const isRegionalDynamicPage =
    !initialCity?.isDefault &&
    (
      isObjectTypePathname(
        window.location.pathname,
      ) ||
      isServicePagePathname(
        window.location.pathname,
      )
    );

  /*
   * Для регионального object-type URL Nginx
   * отдаёт региональный index.html главной.
   * Не гидратируем несовпадающую SSR-разметку:
   * очищаем root и выполняем обычный client render.
   */
  if (isRegionalDynamicPage) {
    root.replaceChildren();

    createRoot(
      root,
    ).render(
      app,
    );

    return;
  }

  if (root.hasChildNodes()) {
    hydrateRoot(
      root,
      app,
    );
  } else {
    createRoot(
      root,
    ).render(
      app,
    );
  }
}


bootstrap();
