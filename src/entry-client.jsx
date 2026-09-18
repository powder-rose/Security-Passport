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
  isObjectTypePathname,
} from './data/objectTypes';

import {
  isServicePagePathname,
} from './data/servicePages';

import './styles/reset.css';
import './styles/variables.css';
import './styles/typography.css';
import './styles/global.css';
import './styles/responsive-audit.css';


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
