import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createRoot,
} from 'react-dom/client';

import {
  Provider,
} from 'react-redux';

import {
  store,
} from '../app/store';

import {
  getArticles,
} from '../admin/api/adminApi.js';

import Header
from '../components/Header/Header.jsx';

import Footer
from '../components/Footer/Footer.jsx';

import ArticleView
from '../components/ArticleView/ArticleView.jsx';

import '../styles/reset.css';
import '../styles/variables.css';
import '../styles/typography.css';
import '../styles/global.css';


const STORAGE_KEY =
  'passport-article-preview';


const STOP_WORDS =
  new Set([
    'который',
    'которая',
    'которые',
    'этого',
    'этой',
    'этот',
    'также',
    'нужно',
    'может',
    'после',
    'перед',
    'объекта',
    'объект',
    'статьи',
    'для',
    'или',
    'при',
    'как',
    'что',
    'это',
  ]);


function getPreviewArticle() {

  try {

    const raw =
      sessionStorage.getItem(
        STORAGE_KEY
      );


    if (!raw) {
      return null;
    }


    return JSON.parse(
      raw
    );

  }
  catch {

    return null;

  }

}


function stripHtml(value) {

  return String(
    value || ''
  )
    .replace(
      /<[^>]*>/g,
      ' '
    )
    .replace(
      /\s+/g,
      ' '
    );

}


function getWords(article) {

  const text =
    (
      `${article?.title || ''} ` +
      stripHtml(
        article?.content
      )
    )
      .toLocaleLowerCase(
        'ru-RU'
      );


  return new Set(
    (
      text.match(
        /[а-яёa-z0-9]{4,}/gi
      ) ||
      []
    )
      .map(
        word =>
          word.toLocaleLowerCase(
            'ru-RU'
          )
      )
      .filter(
        word =>
          !STOP_WORDS.has(
            word
          )
      )
  );

}


function similarityScore(
  source,
  candidate
) {

  const sourceWords =
    getWords(source);

  const candidateWords =
    getWords(candidate);


  let score = 0;


  for (
    const word
    of sourceWords
  ) {

    if (
      candidateWords.has(
        word
      )
    ) {
      score += 1;
    }

  }


  return score;

}


function ArticlePreviewApp() {

  const article =
    useMemo(
      () =>
        getPreviewArticle(),
      []
    );


  const [
    relatedArticles,
    setRelatedArticles,
  ] =
    useState([]);


  useEffect(()=>{

    if (!article) {
      return;
    }


    let cancelled =
      false;


    getArticles()
      .then(
        result => {

          if (cancelled) {
            return;
          }


          const articles =
            Array.isArray(
              result?.articles
            )
              ? result.articles
              : [];


          const ranked =
            articles
              .filter(
                item =>
                  item.status ===
                    'published' &&
                  item.id !==
                    article.id &&
                  item.slug !==
                    article.slug
              )
              .map(
                item => ({
                  item,

                  score:
                    similarityScore(
                      article,
                      item
                    ),
                })
              )
              .sort(
                (a,b) =>
                  b.score -
                    a.score ||
                  new Date(
                    b.item.publishedAt ||
                    b.item.createdAt ||
                    0
                  ) -
                  new Date(
                    a.item.publishedAt ||
                    a.item.createdAt ||
                    0
                  )
              )
              .slice(
                0,
                3
              )
              .map(
                entry =>
                  entry.item
              );


          setRelatedArticles(
            ranked
          );

        }
      )
      .catch(
        () => {

          if (!cancelled) {
            setRelatedArticles(
              []
            );
          }

        }
      );


    return ()=>{

      cancelled =
        true;

    };

  },[
    article,
  ]);


  if (!article) {

    return (

      <main
        style={{
          padding:
            '60px 24px',

          maxWidth:
            '900px',

          margin:
            '0 auto',
        }}
      >

        <h1>
          Предпросмотр недоступен
        </h1>

        <p>
          Вернитесь в редактор статьи
          и нажмите «Предпросмотр статьи».
        </p>

      </main>

    );

  }


  return (

    <div id="top">

      <Header />


      <ArticleView
        article={article}
        preview
        relatedArticles={
          relatedArticles
        }
      />


      <Footer />

    </div>

  );

}


createRoot(
  document.getElementById(
    'article-preview-root'
  )
).render(

  <React.StrictMode>

    <Provider store={store}>

      <ArticlePreviewApp />

    </Provider>

  </React.StrictMode>

);
