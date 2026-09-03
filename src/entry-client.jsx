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

import './styles/reset.css';
import './styles/variables.css';
import './styles/typography.css';
import './styles/global.css';
import './styles/responsive-audit.css';


const initialCity =
  typeof window !== 'undefined' &&
  window.__PASSPORT_CITY__
    ? window.__PASSPORT_CITY__
    : CITY;


const app = (
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <GeoProvider city={initialCity}>
          <App />
        </GeoProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);


const root =
  document.getElementById('root');


if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
