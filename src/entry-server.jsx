import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './app/store';
import App from './app/App';

export function render() {
  const helmetContext = {};

  const html = renderToString(
    <Provider store={store}>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </Provider>,
  );

  return { html, helmet: helmetContext.helmet };
}
