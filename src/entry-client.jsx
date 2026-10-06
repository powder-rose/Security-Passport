import { StrictMode } from 'react';
import {
  createRoot,
  hydrateRoot,
} from 'react-dom/client';

import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import { store } from './app/store';
import App from './app/App';

import {
  getObjectTypeByPathname,
} from './data/objectTypes';

import {
  getServicePageByPathname,
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
