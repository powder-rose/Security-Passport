import ObjectQuiz
from '../../sections/ObjectQuiz/ObjectQuiz.jsx';

import FinalCTA
from '../../sections/FinalCTA/FinalCTA.jsx';

import {
  servicePages,
} from '../../data/servicePages.js';

import './ArticleView.css';


const VOID_TAGS =
  new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ]);


function formatArticleDate(value) {

  if (!value) {
    return '';
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '';
  }


  return new Intl.DateTimeFormat(
    'ru-RU',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(date);

}


function splitArticleHtml(html) {

  const value =
    String(html || '')
      .trim();


  if (!value) {
    return ['', ''];
  }


  const blocks = [];

  const tagPattern =
    /<\/?([a-z][\w:-]*)\b[^>]*>/gi;


  let match;
  let depth = 0;
  let blockStart = null;


  while (
    (
      match =
        tagPattern.exec(value)
    )
  ) {

    const token =
      match[0];

    const tag =
      match[1]
        .toLowerCase();

    const closing =
      token.startsWith('</');

    const selfClosing =
      token.endsWith('/>') ||
      VOID_TAGS.has(tag);


    if (!closing) {

      if (
        depth === 0 &&
        blockStart === null
      ) {
        blockStart =
          match.index;
      }


      if (!selfClosing) {
        depth += 1;
      }
      else if (
        depth === 0 &&
        blockStart !== null
      ) {

        blocks.push(
          value.slice(
            blockStart,
            tagPattern.lastIndex
          )
        );

        blockStart = null;

      }

      continue;

    }


    depth =
      Math.max(
        0,
        depth - 1
      );


    if (
      depth === 0 &&
      blockStart !== null
    ) {

      blocks.push(
        value.slice(
          blockStart,
          tagPattern.lastIndex
        )
      );

      blockStart = null;

    }

  }


  if (blockStart !== null) {

    blocks.push(
      value.slice(
        blockStart
      )
    );

  }


  if (blocks.length < 2) {
    return [
      value,
      '',
    ];
  }


  const splitIndex =
    Math.min(
      blocks.length - 1,
      Math.max(
        1,
        Math.ceil(
          blocks.length * .4
        )
      )
    );


  return [
    blocks
      .slice(
        0,
        splitIndex
      )
      .join('\n'),

    blocks
      .slice(
        splitIndex
      )
      .join('\n'),
  ];

}


function RelatedServices() {

  const services =
    servicePages.slice(
      0,
      2
    );


  return (

    <section
      className="article-related"
      aria-labelledby="article-services-title"
    >

      <div className="article-related__head">

        <p>
          Услуги
        </p>

        <h2 id="article-services-title">
          По теме материала
        </h2>

      </div>


      <div className="article-services-grid">

        {
          services.map(
            service => (

              <a
                key={service.id}
                className="article-service-card"
                href={service.path}
              >

                <span className="article-service-card__index">
                  Услуга
                </span>

                <h3>
                  {service.title}
                </h3>

                <p>
                  {service.description}
                </p>

                <span className="article-service-card__link">
                  Подробнее →
                </span>

              </a>

            )
          )
        }

      </div>

    </section>

  );

}


function RelatedArticles({
  articles,
  currentArticle,
  preview,
}) {

  const items =
    articles
      .filter(
        item =>
          item &&
          item.id !==
            currentArticle?.id &&
          item.slug !==
            currentArticle?.slug
      )
      .slice(
        0,
        3
      );


  if (!items.length) {

    if (!preview) {
      return null;
    }


    return (

      <section
        className="article-related"
        aria-labelledby="article-related-title"
      >

        <div className="article-related__head">

          <p>
            Читать дальше
          </p>

          <h2 id="article-related-title">
            Похожие статьи
          </h2>

        </div>


        <div className="article-related__empty">
          Когда появятся другие опубликованные статьи,
          здесь автоматически появятся до трёх похожих материалов.
        </div>

      </section>

    );

  }


  return (

    <section
      className="article-related"
      aria-labelledby="article-related-title"
    >

      <div className="article-related__head">

        <p>
          Читать дальше
        </p>

        <h2 id="article-related-title">
          Похожие статьи
        </h2>

      </div>


      <div className="article-related-grid">

        {
          items.map(
            item => {

              const href =
                preview
                  ? `/admin/articles/edit/${item.id}`
                  : `/articles/${item.slug}/`;


              return (

                <a
                  key={item.id || item.slug}
                  className="article-related-card"
                  href={href}
                  target={
                    preview
                      ? '_blank'
                      : undefined
                  }
                  rel={
                    preview
                      ? 'noopener noreferrer'
                      : undefined
                  }
                >

                  <div className="article-related-card__image">

                    {
                      item.image
                      ?
                      (
                        <img
                          src={item.image}
                          alt={
                            item.imageAlt ||
                            item.title ||
                            ''
                          }
                          width="640"
                          height="360"
                        />
                      )
                      :
                      (
                        <div className="article-related-card__placeholder">

                          <span>
                            БОЙКОВГРУПП
                          </span>

                        </div>
                      )
                    }

                  </div>


                  <div className="article-related-card__body">

                    <h3>
                      {item.title}
                    </h3>

                    <span>
                      Читать →
                    </span>

                  </div>

                </a>

              );

            }
          )
        }

      </div>

    </section>

  );

}


export default function ArticleView({
  article,
  preview = false,
  relatedArticles = [],
}) {

  const title =
    article?.title ||
    'Заголовок статьи';


  const content =
    article?.content ||
    '';


  const image =
    article?.image ||
    '';


  const imageAlt =
    article?.imageAlt ||
    title;


  const date =
    formatArticleDate(
      article?.publishedAt ||
      article?.createdAt
    );


  const [
    contentBeforeQuiz,
    contentAfterQuiz,
  ] =
    splitArticleHtml(
      content
    );


  return (

    <>

      <main className="article-view">

        <article className="article-view__article">

          <header className="article-view__header">

            {
              preview
              &&
              (
                <div className="article-view__preview-badge">
                  Предпросмотр
                </div>
              )
            }


            <div className="article-view__eyebrow">

              БОЙКОВГРУПП

              <span aria-hidden="true">
                ·
              </span>

              Статьи

            </div>


            <h1 className="article-view__title">
              {title}
            </h1>


            {
              date
              &&
              (
                <time className="article-view__date">
                  {date}
                </time>
              )
            }

          </header>


          {
            image
            &&
            (
              <figure className="article-view__hero">

                <img
                  src={image}
                  alt={imageAlt}
                  width="1200"
                  height="675"
                />

              </figure>
            )
          }


          {
            contentBeforeQuiz
            &&
            (
              <div
                className="article-view__content"
                dangerouslySetInnerHTML={{
                  __html:
                    contentBeforeQuiz,
                }}
              />
            )
          }


          {
            content
            &&
            (
              <ObjectQuiz
                variant="article"
                preview={preview}
              />
            )
          }


          {
            contentAfterQuiz
            &&
            (
              <div
                className="
                  article-view__content
                  article-view__content--after-quiz
                "
                dangerouslySetInnerHTML={{
                  __html:
                    contentAfterQuiz,
                }}
              />
            )
          }


          {
            !content
            &&
            (
              <div className="article-view__empty">
                Здесь появится текст статьи.
              </div>
            )
          }

        </article>


        <div className="article-view__recommendations">

          <RelatedServices />


          <RelatedArticles
            articles={relatedArticles}
            currentArticle={article}
            preview={preview}
          />

        </div>

      </main>


      <FinalCTA
        preview={preview}
      />

    </>

  );

}
