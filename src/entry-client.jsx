import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import { store } from './app/store';
import App from './app/App';

import { getObjectTypeByPathname } from './data/objectTypes';

import { getServicePageByPathname } from './data/servicePages';

import { getLegalDocumentByPathname } from './content/legalDocuments';

import {
  pageModuleSources,
  getObjectPageSource,
  getServicePageSource,
  getPageImportKey,
} from './config/pageRouteRegistry.js';

import './styles/reset.css';
import './styles/variables.css';
import './styles/typography.css';
import './styles/global.css';

const pageModuleLoaders = import.meta.glob('./pages/*/*Page.jsx');

async function loadPageComponent(source) {
  const importKey = getPageImportKey(source);

  const loader = pageModuleLoaders[importKey];

  if (!loader) {
    throw new Error(`Page module not registered: ${importKey}`);
  }

  const module = await loader();

  if (!module.default) {
    throw new Error(`Page module has no default export: ${importKey}`);
  }

  return module.default;
}

async function loadRouteComponents(pathname) {
  const normalizedPathname = pathname.replace(/\/+$/, '') || '/';

  if (normalizedPathname === '/blog') {
    return {
      BlogPage: await loadPageComponent(pageModuleSources.blog),
    };
  }

  if (/^\/blog\/[^/]+$/.test(normalizedPathname)) {
    return {
      ArticlePage: await loadPageComponent(pageModuleSources.article),
    };
  }

  if (getLegalDocumentByPathname(pathname)) {
    return {
      LegalPage: await loadPageComponent(pageModuleSources.legal),
    };
  }

  const objectType = getObjectTypeByPathname(pathname);

  if (objectType) {
    const source = getObjectPageSource(objectType.id);

    const component = await loadPageComponent(source);

    if (source === pageModuleSources.genericObject) {
      return {
        ObjectTypePage: component,
      };
    }

    return {
      objectTypeComponents: {
        [objectType.id]: component,
      },
    };
  }

  const servicePage = getServicePageByPathname(pathname);

  if (servicePage) {
    const source = getServicePageSource(servicePage.id);

    if (source) {
      return {
        servicePageComponents: {
          [servicePage.id]: await loadPageComponent(source),
        },
      };
    }
  }

  return {};
}

async function bootstrap() {
  const initialBlogData = typeof window !== 'undefined' ? window.__PASSPORT_BLOG__ || {} : {};

  const routeComponents = await loadRouteComponents(window.location.pathname);

  const app = (
    <StrictMode>
      <Provider store={store}>
        <HelmetProvider>
          <App
            pathname={window.location.pathname}
            initialBlogArticles={initialBlogData.articles ?? null}
            initialArticle={initialBlogData.article ?? null}
            routeComponents={routeComponents}
          />
        </HelmetProvider>
      </Provider>
    </StrictMode>
  );

  const root = document.getElementById('root');

  if (!root) {
    throw new Error('Application root element #root was not found.');
  }

  if (root.hasChildNodes()) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}

bootstrap();
