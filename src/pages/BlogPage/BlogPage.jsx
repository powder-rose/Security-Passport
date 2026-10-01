import {
  useEffect,
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


function formatDate(value){

  if(!value){
    return '';
  }


  const date =
    new Date(value);


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
      day:'numeric',
      month:'long',
      year:'numeric',
    }
  ).format(date);

}


function ArticleImage({
  article,
}){

  if(article.image){

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
}){

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

        <time>
          {
            formatDate(
              article.publishedAt ||
              article.createdAt
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
      Array.isArray(initialArticles)
        ? initialArticles
        : []
    );


  const [
    loading,
    setLoading,
  ] =
    useState(
      !Array.isArray(initialArticles)
    );


  const [
    error,
    setError,
  ] =
    useState(false);


  useEffect(()=>{

    let cancelled =
      false;


    getPublicArticles()
      .then(
        result => {

          if(cancelled){
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

          if(!cancelled){
            setError(
              true
            );
          }

        }
      )
      .finally(
        () => {

          if(!cancelled){
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


  const featured =
    articles[0] ||
    null;


  const rest =
    articles.slice(1);


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
                  Публикуем материалы о паспортах
                  безопасности, категорировании объектов,
                  требованиях законодательства и
                  практической подготовке документов.
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
                  href="#blog-materials"
                  className="blog-hero__aside-link"
                >
                  Все статьи
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
          featured
          &&
          (
            <section className="blog-featured">

              <Container>

                <div className="blog-section-heading">

                  <span>
                    НОВЫЙ МАТЕРИАЛ
                  </span>

                  <span>
                    01
                  </span>

                </div>


                <a
                  className="blog-featured-card"
                  href={`/blog/${featured.slug}/`}
                >

                  <div className="blog-featured-card__image">

                    <ArticleImage
                      article={featured}
                    />

                  </div>


                  <div className="blog-featured-card__body">

                    <time>

                      {
                        formatDate(
                          featured.publishedAt ||
                          featured.createdAt
                        )
                      }

                    </time>


                    <h2>
                      {featured.title}
                    </h2>


                    {
                      featured.seoDescription
                      &&
                      (
                        <p>
                          {featured.seoDescription}
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
              className="blog-list"
              id="blog-materials"
            >

              <Container>

                <div className="blog-section-heading">

                  <span>
                    ВСЕ МАТЕРИАЛЫ
                  </span>

                  <span>
                    {
                      String(
                        articles.length
                      ).padStart(
                        2,
                        '0'
                      )
                    }
                  </span>

                </div>


                <div className="blog-grid">

                  {
                    rest.map(
                      article => (

                        <ArticleCard
                          key={article.id}
                          article={article}
                        />

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
