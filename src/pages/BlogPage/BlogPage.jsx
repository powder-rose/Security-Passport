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

import './BlogPage.css';

import {
  formatDate,
} from './blogPageUtils';


import useBlogArticles
from './useBlogArticles';

import ArticleImage
from './components/ArticleImage';

import BlogArticleCard
from './components/BlogArticleCard';


export default function BlogPage({
  initialArticles = null,
}){

  const {
    articles,
    loading,
    error,
    selectedCategory,
    visibleCategories,
    filteredArticles,
    featuredEntry,
    restEntries,
    activeCategory,
    chooseCategory,
  } =
    useBlogArticles({
      initialArticles,
    });


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

                              <BlogArticleCard
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
