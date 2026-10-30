import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import { createAppStore } from './app/store';
import App from './app/App';

import {
  pageModuleSources,
  objectPageSources,
  servicePageSources,
  getPageImportKey,
} from './config/pageRouteRegistry.js';

const serverPageModules = import.meta.glob('./pages/*/*Page.jsx', {
  eager: true,
  import: 'default',
});

function resolveServerPageComponent(source) {
  const importKey = getPageImportKey(source);

  const component = serverPageModules[importKey];

  if (!component) {
    throw new Error(`SSR page module not found: ${importKey}`);
  }

  return component;
}

function resolvePageComponents(sources) {
  return Object.fromEntries(
    Object.entries(sources).map(([id, source]) => [id, resolveServerPageComponent(source)]),
  );
}

const serverRouteComponents = {
  LegalPage: resolveServerPageComponent(pageModuleSources.legal),

  ObjectTypePage: resolveServerPageComponent(pageModuleSources.genericObject),

  BlogPage: resolveServerPageComponent(pageModuleSources.blog),

  QuestionsPage: resolveServerPageComponent(pageModuleSources.questions),

  QuestionPage: resolveServerPageComponent(pageModuleSources.question),

  ArticlePage: resolveServerPageComponent(pageModuleSources.article),

  objectTypeComponents: resolvePageComponents(objectPageSources),

  servicePageComponents: resolvePageComponents(servicePageSources),
};

export function render({
  pathname = '/',
  blogArticles = null,
  article = null,
  questionsData = null,
  relatedQuestions = null,
} = {}) {
  const helmetContext = {};

  const store = createAppStore();

  const html = renderToString(
    <Provider store={store}>
      <HelmetProvider context={helmetContext}>
        <App
          pathname={pathname}
          initialBlogArticles={blogArticles}
          initialArticle={article}
          initialQuestionsData={questionsData}
          initialRelatedQuestions={relatedQuestions}
          routeComponents={serverRouteComponents}
        />
      </HelmetProvider>
    </Provider>,
  );

  return {
    html,
    helmet: helmetContext.helmet,
  };
}
