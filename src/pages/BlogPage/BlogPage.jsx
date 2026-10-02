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
    id: 'passport',
    label: 'Паспорта безопасности',
    description:
      'Раздел о разработке, структуре и согласовании паспортов безопасности объектов: кому нужен документ, что в него входит и как правильно подготовить материалы.',
  },

  {
    id: 'categorization',
    label: 'Категорирование объектов',
    description:
      'Материалы об обследовании и категорировании объектов: критерии категорий, работа комиссии, оформление акта и применение требований к разным типам объектов.',
  },

  {
    id: 'requirements',
    label: 'Требования и законодательство',
    description:
      'Разбор постановлений Правительства РФ и требований антитеррористической защищённости: на кого они распространяются, что устанавливают и как применять нормы на практике.',
  },

  {
    id: 'actualization',
    label: 'Актуализация паспорта',
    description:
      'Материалы об актуализации паспорта безопасности: когда требуется пересмотр документа, какие сведения обновлять и в каких случаях необходимо повторное согласование.',
  },

  {
    id: 'practice',
    label: 'Практика и документы',
    description:
      'Практические разборы документов и рабочих ситуаций: порядок действий, типовые ошибки и рекомендации по подготовке материалов для согласования.',
  },
];


const BLOG_CATEGORY_IDS =
  new Set(
    BLOG_CATEGORIES.map(
      category =>
        category.id
    )
  );


function getBlogCategory(
  categoryId
){

  return (
    BLOG_CATEGORIES.find(
      category =>
        category.id === categoryId
    )
    ||
    null
  );

}


function resolveArticleCategory(
  article
){

  const explicitCategory =
    String(
      article?.category ||
      ''
    )
      .trim()
      .toLowerCase();


  if(
    BLOG_CATEGORY_IDS.has(
      explicitCategory
    )
  ){
    return explicitCategory;
  }


  const source =
    [
      article?.title,
      article?.slug,
      article?.seoTitle,
      article?.seoDescription,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();


  if(
    /актуализ|actualiz|пересмотр/.test(
      source
    )
  ){
    return 'actualization';
  }


  if(
    /категор|categor|обследован|obsledovan/.test(
      source
    )
  ){
    return 'categorization';
  }


  if(
    /паспорт|pasport|форма\s+паспорта|forma[-\s]?pasporta/.test(
      source
    )
  ){
    return 'passport';
  }


  if(
    /постановлен|пп\s*рф|pp[-\s]?rf|требован|антитеррор|antiterror|защищ|zashchit/.test(
      source
    )
  ){
    return 'requirements';
  }


  return 'practice';

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
  categoryId,
}){

  const category =
    getBlogCategory(
      categoryId
    );


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
            result
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
      BLOG_CATEGORY_IDS.has(
        categoryId
      )
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

            categoryId:
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


  const categoryCounts =
    useMemo(
      () => {

        const counts =
          Object.fromEntries(
            BLOG_CATEGORIES.map(
              category => [
                category.id,
                0,
              ]
            )
          );


        categorizedArticles.forEach(
          ({
            categoryId,
          }) => {

            if(
              Object.prototype.hasOwnProperty.call(
                counts,
                categoryId
              )
            ){

              counts[
                categoryId
              ] += 1;

            }

          }
        );


        return counts;

      },
      [
        categorizedArticles,
      ]
    );


  const visibleCategories =
    useMemo(
      () => {

        return BLOG_CATEGORIES.filter(
          category =>
            categoryCounts[
              category.id
            ] > 0
        );

      },
      [
        categoryCounts,
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
            item.categoryId ===
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
      : getBlogCategory(
          selectedCategory
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


                  <span>
                    {
                      String(
                        visibleCategories.length
                      ).padStart(
                        2,
                        '0'
                      )
                    }
                  </span>

                </div>


                <div className="blog-categories__intro">

                  <p>
                    Материалы сгруппированы по практической
                    задаче: от требований законодательства
                    и категорирования до подготовки и
                    актуализации паспорта безопасности.
                  </p>


                  <button
                    id="blog-category-all"
                    type="button"
                    className={
                      selectedCategory ===
                      'all'
                        ? 'blog-categories__all is-active'
                        : 'blog-categories__all'
                    }
                    aria-pressed={
                      selectedCategory ===
                      'all'
                    }
                    onClick={
                      () =>
                        chooseCategory(
                          'all'
                        )
                    }
                  >

                    <span>
                      Все материалы
                    </span>


                    <strong>
                      {
                        String(
                          articles.length
                        ).padStart(
                          2,
                          '0'
                        )
                      }
                    </strong>

                  </button>

                </div>


                <div className="blog-categories__grid">

                  {
                    visibleCategories.map(
                      category => {

                        const isActive =
                          selectedCategory ===
                          category.id;


                        return (

                          <article
                            key={category.id}
                            id={
                              `blog-category-${category.id}`
                            }
                            className={
                              isActive
                                ? 'blog-category-card is-active'
                                : 'blog-category-card'
                            }
                          >

                            <div className="blog-category-card__meta">

                              <span>
                                {
                                  formatMaterialsCount(
                                    categoryCounts[
                                      category.id
                                    ]
                                  )
                                }
                              </span>

                            </div>


                            <h3>
                              {category.label}
                            </h3>


                            <p>
                              {category.description}
                            </p>


                            <button
                              type="button"
                              className="blog-category-card__action"
                              aria-pressed={
                                isActive
                              }
                              onClick={
                                () =>
                                  chooseCategory(
                                    category.id
                                  )
                              }
                            >

                              {
                                isActive
                                  ? 'Раздел выбран'
                                  : 'Показать статьи'
                              }


                              <span aria-hidden="true">
                                →
                              </span>

                            </button>

                          </article>

                        );

                      }
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
                          getBlogCategory(
                            featuredEntry.categoryId
                          )?.label
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
                                categoryId={
                                  item.categoryId
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
