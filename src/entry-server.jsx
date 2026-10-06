import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import { createAppStore } from './app/store';
import App from './app/App';

import LegalPage
from './pages/LegalPage/LegalPage';

import ObjectTypePage
from './pages/ObjectTypePage/ObjectTypePage';

import HotelPage
from './pages/HotelPage/HotelPage';

import CulturePage
from './pages/CulturePage/CulturePage';

import EducationPage
from './pages/EducationPage/EducationPage';

import SportPage
from './pages/SportPage/SportPage';

import TradePage
from './pages/TradePage/TradePage';

import HealthPage
from './pages/HealthPage/HealthPage';

import CrowdPage
from './pages/CrowdPage/CrowdPage';

import ActualizationPage
from './pages/ActualizationPage/ActualizationPage';

import CategorizationActPage
from './pages/CategorizationActPage/CategorizationActPage';

import BlogPage
from './pages/BlogPage/BlogPage';

import ArticlePage
from './pages/ArticlePage/ArticlePage';


const serverRouteComponents = {
  LegalPage,
  ObjectTypePage,
  BlogPage,
  ArticlePage,

  objectTypeComponents: {
    hotel:
      HotelPage,

    culture:
      CulturePage,

    education:
      EducationPage,

    sport:
      SportPage,

    trade:
      TradePage,

    health:
      HealthPage,

    crowd:
      CrowdPage,
  },

  servicePageComponents: {
    'categorization-act':
      CategorizationActPage,

    'passport-actualization':
      ActualizationPage,
  },
};


import {
  CITY,
  normalizeCity,
} from './config/city';

import {
  GeoProvider,
} from './context/GeoContext';


export function render({
  city = CITY,
  pathname = '/',
  blogArticles = null,
  article = null,
} = {}) {
  const helmetContext = {};

  const store =
    createAppStore();

  const resolvedCity =
    normalizeCity(city);

  const html =
    renderToString(
      <Provider store={store}>
        <HelmetProvider context={helmetContext}>
          <GeoProvider city={resolvedCity}>
            <App
              pathname={pathname}
              initialBlogArticles={blogArticles}
              initialArticle={article}
              routeComponents={
                serverRouteComponents
              }
            />
          </GeoProvider>
        </HelmetProvider>
      </Provider>,
    );

  return {
    html,
    helmet:
      helmetContext.helmet,

    city:
      resolvedCity,
  };
}
