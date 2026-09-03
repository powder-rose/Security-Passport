import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import { store } from './app/store';
import App from './app/App';

import {
  CITY,
  normalizeCity,
} from './config/city';

import {
  GeoProvider,
} from './context/GeoContext';


export function render({
  city = CITY,
} = {}) {
  const helmetContext = {};

  const resolvedCity =
    normalizeCity(city);

  const html =
    renderToString(
      <Provider store={store}>
        <HelmetProvider context={helmetContext}>
          <GeoProvider city={resolvedCity}>
            <App />
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
