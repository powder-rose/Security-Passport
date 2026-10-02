import {
  Helmet,
} from 'react-helmet-async';


export default function ArticlePageState({
  type,
}) {

  if (type === 'loading') {

    return (

      <>
        <Helmet>

          <meta
            name="robots"
            content="noindex,follow"
          />

        </Helmet>


        <main className="article-page-state">

          <div className="article-page-state__inner">
            Загружаем статью…
          </div>

        </main>
      </>

    );

  }


  if (type === 'not-found') {

    return (

      <>
        <Helmet>

          <title>
            Статья не найдена — БОЙКОВГРУПП
          </title>

          <meta
            name="robots"
            content="noindex,follow"
          />

        </Helmet>


        <main className="article-page-state">

          <div className="article-page-state__inner">

            <span>
              404
            </span>

            <h1>
              Статья не найдена
            </h1>

            <p>
              Возможно, материал был снят с публикации
              или адрес страницы изменился.
            </p>

            <a href="/blog/">
              Вернуться в блог →
            </a>

          </div>

        </main>
      </>

    );

  }


  return (

    <>
      <Helmet>

        <meta
          name="robots"
          content="noindex,follow"
        />

      </Helmet>


      <main className="article-page-state">

        <div className="article-page-state__inner">

          <h2>
            Не удалось загрузить статью
          </h2>

          <p>
            Попробуйте обновить страницу немного позже.
          </p>

          <a href="/blog/">
            Все статьи →
          </a>

        </div>

      </main>
    </>

  );

}
