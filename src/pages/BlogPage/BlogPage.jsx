import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Helmet,
} from 'react-helmet-async';

import Container
from '../../components/ui/Container/Container.jsx';

import FinalCTA
from '../../sections/FinalCTA/FinalCTA.jsx';

import {
  SITE,
} from '../../config/site.js';

import {
  getPublicArticles,
} from '../../lib/articles.js';

import './BlogPage.css';


const BLOG_CATEGORIES = [
  {
    id: 'hotels',
    label: 'Гостиницы',
    description:
      'Материалы о категорировании, требованиях антитеррористической защищённости и паспортах безопасности гостиниц и других средств размещения.',
  },

  {
    id: 'culture',
    label: 'Культура',
    description:
      'Материалы о категорировании, обследовании, требованиях и паспортах безопасности объектов культуры.',
  },
];


const LEGACY_BLOG_CATEGORY_VALUES =
  new Set([
    'passport',
    'categorization',
    'requirements',
    'actualization',
    'practice',
    'паспорта безопасности',
    'категорирование объектов',
    'требования и законодательство',
    'актуализация паспорта',
    'практика и документы',
  ]);


function normalizeCategoryLabel(
  value
){

  return String(
    value || ''
  )
    .replace(
      /\s+/g,
      ' '
    )
    .trim()
    .slice(
      0,
      80
    );

}


function resolveArticleCategory(
  article
){

  const label =
    normalizeCategoryLabel(
      article?.category
    );


  if(
    !label
  ){
    return null;
  }


  const normalized =
    label.toLocaleLowerCase(
      'ru-RU'
    );


  if(
    LEGACY_BLOG_CATEGORY_VALUES.has(
      normalized
    )
  ){
    return null;
  }


  const predefined =
    BLOG_CATEGORIES.find(
      category =>
        category.id ===
          normalized
        ||
        category.label
          .toLocaleLowerCase(
            'ru-RU'
          ) ===
          normalized
    );


  if(
    predefined
  ){
    return predefined;
  }


  return {
    id:
      `custom-${encodeURIComponent(
        normalized
      )}`,

    label,

    description:
      `Материалы по теме «${label}»: практические разборы требований, документов и подготовки материалов.`,
  };

}


function formatMaterialsCount(
  count
){

  const value =
    Math.abs(
      Number(count) || 0
    );


  const mod100 =
    value % 100;

  const mod10 =
    value % 10;


  let word =
    'материалов';


  if(
    mod100 < 11
    ||
    mod100 > 14
  ){

    if(
      mod10 === 1
    ){
      word =
        'материал';
    }
    else if(
      mod10 >= 2
      &&
      mod10 <= 4
    ){
      word =
        'материала';
    }

  }


  return `${value} ${word}`;

}


function formatDate(
  value
){

  if(!value){
    return '';
  }


  const date =
    new Date(
      value
    );


  if(
    Number.isNaN(
      date.getTime()
    )
  ){
    return '';
  }


  return new Intl.DateTimeFormat(
    'ru-RU',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(
    date
  );

}


function ArticleImage({
  article,
}){

  if(
    article.image
  ){

    return (

      <img
        src={article.image}
        alt={
          article.imageAlt ||
          article.title ||
          ''
        }
        width="1200"
        height="675"
        loading="lazy"
      />

    );

  }


  return (

    <div className="blog-card__placeholder">

      <span>
        БОЙКОВГРУПП
      </span>

    </div>

  );

}


function ArticleCard({
  article,
  category,
}){

  const articleDate =
    article.publishedAt ||
    article.createdAt;


  return (

    <a
      className="blog-card"
      href={`/blog/${article.slug}/`}
    >

      <div className="blog-card__image">

        <ArticleImage
          article={article}
        />

      </div>


      <div className="blog-card__body">

        {
          category
          &&
          (
            <div className="blog-card__category">
              {category.label}
            </div>
          )
        }


        <time
          dateTime={
            articleDate ||
            undefined
          }
        >
          {
            formatDate(
              articleDate
            )
          }
        </time>


        <h2>
          {article.title}
        </h2>


        {
          article.seoDescription
          &&
          (
            <p>
              {article.seoDescription}
            </p>
          )
        }


        <span className="blog-card__link">

          Читать

          <span aria-hidden="true">
            →
          </span>

        </span>

      </div>

    </a>

  );

}


export default function BlogPage({
  initialArticles = null,
}){

  const [
    articles,
    setArticles,
  ] =
    useState(
      Array.isArray(
        initialArticles
      )
        ? initialArticles
        : []
    );


  const [
    loading,
    setLoading,
  ] =
    useState(
      !Array.isArray(
        initialArticles
      )
    );


  const [
    error,
    setError,
  ] =
    useState(
      false
    );


  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState(
      'all'
    );


  useEffect(()=>{

    let cancelled =
      false;


    getPublicArticles()
      .then(
        result => {

          if(
            cancelled
          ){
            return;
          }


          setArticles(
            currentArticles => {

              const categoryById =
                new Map(
                  currentArticles.map(
                    article => [
                      article.id,
                      article.category || '',
                    ]
                  )
                );


              return result.map(
                article => ({
                  ...article,

                  category:
                    article.category ||
                    categoryById.get(
                      article.id
                    ) ||
                    '',
                })
              );

            }
          );

          setError(
            false
          );

        }
      )
      .catch(
        () => {

          if(
            !cancelled
          ){

            setError(
              true
            );

          }

        }
      )
      .finally(
        () => {

          if(
            !cancelled
          ){

            setLoading(
              false
            );

          }

        }
      );


    return ()=>{

      cancelled =
        true;

    };

  },[]);


  useEffect(()=>{

    if(
      typeof window ===
      'undefined'
    ){
      return;
    }


    const prefix =
      '#blog-category-';


    if(
      !window.location.hash.startsWith(
        prefix
      )
    ){
      return;
    }


    const categoryId =
      window.location.hash
        .slice(
          prefix.length
        );


    if(
      categoryId ===
      'all'
    ){

      setSelectedCategory(
        'all'
      );

      return;

    }


    if(
      categoryId
    ){

      setSelectedCategory(
        categoryId
      );

    }

  },[]);


  const categorizedArticles =
    useMemo(
      () => {

        return articles.map(
          article => ({
            article,

            category:
              resolveArticleCategory(
                article
              ),
          })
        );

      },
      [
        articles,
      ]
    );


  const visibleCategories =
    useMemo(
      () => {

        const categories =
          new Map();


        categorizedArticles.forEach(
          ({
            category,
          }) => {

            if(
              !category
            ){
              return;
            }


            if(
              categories.has(
                category.id
              )
            ){
              return;
            }


            categories.set(
              category.id,
              category
            );

          }
        );


        const predefinedOrder =
          new Map(
            BLOG_CATEGORIES.map(
              (
                category,
                index
              ) => [
                category.id,
                index,
              ]
            )
          );


        return [
          ...categories.values(),
        ].sort(
          (a,b) => {

            const aOrder =
              predefinedOrder.has(
                a.id
              )
                ? predefinedOrder.get(
                    a.id
                  )
                : 999;

            const bOrder =
              predefinedOrder.has(
                b.id
              )
                ? predefinedOrder.get(
                    b.id
                  )
                : 999;


            if(
              aOrder !== bOrder
            ){
              return aOrder - bOrder;
            }


            return a.label.localeCompare(
              b.label,
              'ru'
            );

          }
        );

      },
      [
        categorizedArticles,
      ]
    );


  useEffect(()=>{

    if(
      loading
      ||
      selectedCategory ===
        'all'
    ){
      return;
    }


    const categoryExists =
      visibleCategories.some(
        category =>
          category.id ===
          selectedCategory
      );


    if(
      !categoryExists
    ){

      setSelectedCategory(
        'all'
      );

    }

  },[
    loading,
    selectedCategory,
    visibleCategories,
  ]);


  const filteredArticles =
    useMemo(
      () => {

        if(
          selectedCategory ===
          'all'
        ){

          return categorizedArticles;

        }


        return categorizedArticles.filter(
          item =>
            item.category?.id ===
            selectedCategory
        );

      },
      [
        categorizedArticles,
        selectedCategory,
      ]
    );


  const featuredEntry =
    filteredArticles[0] ||
    null;


  const restEntries =
    filteredArticles.slice(
      1
    );


  const activeCategory =
    selectedCategory ===
    'all'
      ? null
      : (
          visibleCategories.find(
            category =>
              category.id ===
              selectedCategory
          )
          ||
          null
        );


  function chooseCategory(
    categoryId
  ){

    setSelectedCategory(
      categoryId
    );


    if(
      typeof window ===
      'undefined'
    ){
      return;
    }


    const hash =
      `#blog-category-${categoryId}`;


    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}${hash}`
    );


    window.requestAnimationFrame(
      () => {

        const target =
          document.getElementById(
            'blog-category-results'
          );


        if(
          !target
        ){
          return;
        }


        const reduceMotion =
          window
            .matchMedia?.(
              '(prefers-reduced-motion: reduce)'
            )
            .matches;


        target.scrollIntoView({
          behavior:
            reduceMotion
              ? 'auto'
              : 'smooth',

          block:
            'start',
        });

      }
    );

  }


  const canonical =
    `${SITE.federalUrl}/blog/`;


  const ogImage =
    `${SITE.federalUrl}/images/og-passport-security.png`;


  const ogImageAlt =
    'Статьи о безопасности объектов — БОЙКОВГРУПП';


  return (

    <>

      <Helmet>

        <title>
          Статьи о безопасности объектов — БОЙКОВГРУПП
        </title>


        <meta
          name="description"
          content="Практические статьи БОЙКОВГРУПП об антитеррористической защищённости, паспортах безопасности, категорировании объектов и документации."
        />


        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />


        <link
          rel="canonical"
          href={canonical}
        />


        <meta
          property="og:type"
          content="website"
        />


        <meta
          property="og:title"
          content="Статьи о безопасности объектов — БОЙКОВГРУПП"
        />


        <meta
          property="og:description"
          content="Разбираем требования, документы и практические вопросы безопасности объектов."
        />


        <meta
          property="og:url"
          content={canonical}
        />


        <meta
          property="og:locale"
          content="ru_RU"
        />


        <meta
          property="og:site_name"
          content={SITE.brand}
        />


        <meta
          property="og:image"
          content={ogImage}
        />


        <meta
          property="og:image:type"
          content="image/png"
        />


        <meta
          property="og:image:width"
          content="1200"
        />


        <meta
          property="og:image:height"
          content="630"
        />


        <meta
          property="og:image:alt"
          content={ogImageAlt}
        />


        <meta
          name="twitter:card"
          content="summary_large_image"
        />


        <meta
          name="twitter:title"
          content="Статьи о безопасности объектов — БОЙКОВГРУПП"
        />


        <meta
          name="twitter:description"
          content="Разбираем требования, документы и практические вопросы безопасности объектов."
        />


        <meta
          name="twitter:image"
          content={ogImage}
        />


        <meta
          name="twitter:image:alt"
          content={ogImageAlt}
        />

      </Helmet>


      <main
        className="blog-page"
        id="main-content"
      >

        <section className="blog-hero">

          <Container>

            <div className="blog-hero__eyebrow">

              <span>
                БАЗА ЗНАНИЙ
              </span>

              <span>
                БОЙКОВГРУПП
              </span>

            </div>


            <div className="blog-hero__grid">

              <h1>
                Статьи о
                <br />
                безопасности
                <br />
                объектов
              </h1>


              <aside
                className="blog-hero__aside"
                aria-label="О блоге"
              >

                <div className="blog-hero__aside-label">
                  О блоге
                </div>


                <p>
                  Блог <strong>Николая Бойкова</strong>,
                  эксперта по безопасности объектов.
                  Практические разборы требований,
                  категорирования, паспортов безопасности
                  и подготовки документов.
                </p>


                <div className="blog-hero__tags">

                  <span>
                    Практика
                  </span>

                  <span>
                    Требования
                  </span>

                  <span>
                    Документы
                  </span>

                </div>


                <a
                  href="#blog-categories"
                  className="blog-hero__aside-link"
                >

                  Выбрать тему

                  <span aria-hidden="true">
                    ↓
                  </span>

                </a>

              </aside>

            </div>

          </Container>

        </section>


        {
          loading
          &&
          (
            <Container>

              <div className="blog-state">
                Загружаем материалы…
              </div>

            </Container>
          )
        }


        {
          error
          &&
          (
            <Container>

              <div className="blog-state">
                Не удалось загрузить статьи.
                Обновите страницу немного позже.
              </div>

            </Container>
          )
        }


        {
          !loading
          &&
          !error
          &&
          articles.length > 0
          &&
          (
            <section
              className="blog-categories"
              id="blog-categories"
              aria-labelledby="blog-categories-title"
            >

              <Container>

                <div className="blog-section-heading">

                  <h2 id="blog-categories-title">
                    Категории статей
                  </h2>

                </div>


                <p className="blog-categories__description">
                  Материалы сгруппированы по практической
                  задаче: от требований законодательства
                  и категорирования до подготовки и
                  актуализации паспорта безопасности.
                </p>


                <nav
                  className="blog-category-chips"
                  aria-label="Категории статей"
                >

                  <button
                    type="button"
                    className={
                      selectedCategory === 'all'
                        ? 'blog-category-chip is-active'
                        : 'blog-category-chip'
                    }
                    aria-pressed={
                      selectedCategory === 'all'
                    }
                    onClick={
                      () =>
                        chooseCategory(
                          'all'
                        )
                    }
                  >
                    Все материалы
                  </button>


                  {
                    visibleCategories.map(
                      category => {

                        const isActive =
                          selectedCategory ===
                          category.id;


                        return (

                          <button
                            key={category.id}
                            id={
                              `blog-category-${category.id}`
                            }
                            type="button"
                            className={
                              isActive
                                ? 'blog-category-chip is-active'
                                : 'blog-category-chip'
                            }
                            aria-pressed={
                              isActive
                            }
                            aria-label={
                              `${category.label}. ${category.description}`
                            }
                            onClick={
                              () =>
                                chooseCategory(
                                  category.id
                                )
                            }
                          >
                            {category.label}
                          </button>

                        );

                      }
                    )
                  }

                </nav>


                <div className="blog-category-seo-descriptions">

                  {
                    visibleCategories.map(
                      category => (

                        <p
                          key={
                            `seo-${category.id}`
                          }
                        >
                          <strong>
                            {category.label}.
                          </strong>
                          {' '}
                          {category.description}
                        </p>

                      )
                    )
                  }

                </div>

              </Container>

            </section>
          )
        }


        {
          !loading
          &&
          !error
          &&
          featuredEntry
          &&
          (
            <div
              key={
                selectedCategory
              }
              id="blog-category-results"
              className="blog-category-results"
            >

              <section className="blog-featured">

                <Container>

                  <div className="blog-section-heading">

                    <span>
                      {
                        activeCategory
                          ? 'ПОСЛЕДНЕЕ В РАЗДЕЛЕ'
                          : 'НОВЫЙ МАТЕРИАЛ'
                      }
                    </span>


                    <span>
                      01
                    </span>

                  </div>


                  {
                    activeCategory
                    &&
                    (
                      <div className="blog-results-context">

                        <strong>
                          {activeCategory.label}
                        </strong>

                        <p>
                          {activeCategory.description}
                        </p>

                      </div>
                    )
                  }


                  <a
                    className="blog-featured-card"
                    href={
                      `/blog/${featuredEntry.article.slug}/`
                    }
                  >

                    <div className="blog-featured-card__image">

                      <ArticleImage
                        article={
                          featuredEntry.article
                        }
                      />

                    </div>


                    <div className="blog-featured-card__body">

                      <div className="blog-featured-card__category">

                        {
                          featuredEntry.category?.label
                        }

                      </div>


                      <time
                        dateTime={
                          featuredEntry.article.publishedAt ||
                          featuredEntry.article.createdAt ||
                          undefined
                        }
                      >

                        {
                          formatDate(
                            featuredEntry.article.publishedAt ||
                            featuredEntry.article.createdAt
                          )
                        }

                      </time>


                      <h2>
                        {
                          featuredEntry.article.title
                        }
                      </h2>


                      {
                        featuredEntry.article.seoDescription
                        &&
                        (
                          <p>
                            {
                              featuredEntry
                                .article
                                .seoDescription
                            }
                          </p>
                        )
                      }


                      <span>
                        Читать статью →
                      </span>

                    </div>

                  </a>

                </Container>

              </section>


              {
                restEntries.length > 0
                &&
                (
                  <section
                    className="blog-list"
                    id="blog-materials"
                  >

                    <Container>

                      <div className="blog-section-heading">

                        <span>
                          {
                            activeCategory
                              ? activeCategory.label
                              : 'ВСЕ МАТЕРИАЛЫ'
                          }
                        </span>


                        <span>
                          {
                            String(
                              filteredArticles.length
                            ).padStart(
                              2,
                              '0'
                            )
                          }
                        </span>

                      </div>


                      <div className="blog-grid">

                        {
                          restEntries.map(
                            item => (

                              <ArticleCard
                                key={
                                  `${selectedCategory}-${item.article.id}`
                                }
                                article={
                                  item.article
                                }
                                category={
                                  item.category
                                }
                              />

                            )
                          )
                        }

                      </div>

                    </Container>

                  </section>
                )
              }

            </div>
          )
        }


        {
          !loading
          &&
          !error
          &&
          articles.length === 0
          &&
          (
            <Container>

              <div className="blog-state">
                Опубликованных материалов пока нет.
              </div>

            </Container>
          )
        }


        <FinalCTA />

      </main>

    </>

  );

}
