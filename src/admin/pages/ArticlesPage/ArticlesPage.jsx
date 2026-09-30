import {
  useEffect,
  useState,
} from 'react';


import {
  getArticles,
  deleteArticle,
  updateArticlesYear,
} from '../../api/adminApi';



function formatDate(date){

  if(!date){
    return '';
  }


  return new Date(date)
    .toLocaleDateString(
      'ru-RU',
      {
        day:'2-digit',
        month:'2-digit',
        year:'numeric',
      }
    );

}





export default function ArticlesPage() {


  const [
    articles,
    setArticles,
  ] = useState([]);



  const [
    loading,
    setLoading,
  ] = useState(true);



  const [
    filter,
    setFilter,
  ] = useState('all');



  async function loadArticles(){

    setLoading(true);


    const result =
      await getArticles();


    setArticles(
      result.articles || []
    );


    setLoading(false);

  }




  useEffect(()=>{

    loadArticles();

  },[]);




  const [
    updatingYear,
    setUpdatingYear,
  ] = useState(false);



  async function updateYear(){

    const year =
      new Date()
        .getFullYear();


    const ok =
      window.confirm(
        `Изменить год публикации всех опубликованных статей на ${year}?`
      );


    if(!ok){
      return;
    }


    setUpdatingYear(true);


    try {

      const result =
        await updateArticlesYear();


      if(result?.ok){

        alert(
          `Готово. Обновлено статей: ${result.updated || 0}`
        );


        await loadArticles();

      }
      else {

        alert(
          'Не удалось обновить год статей'
        );

      }

    }
    finally {

      setUpdatingYear(false);

    }

  }



  async function removeArticle(id){


    const ok =
      window.confirm(
        'Удалить статью?'
      );


    if(!ok){
      return;
    }



    await deleteArticle(id);



    setArticles(
      articles.filter(
        item =>
          item.id !== id
      )
    );


  }





  const filteredArticles =
    articles.filter(
      article => {

        if(filter === 'all'){
          return true;
        }


        return article.status === filter;

      }
    );



  return (

    <div className="admin-page">


      <div className="admin-page-header">


        <h1>
          Статьи
        </h1>



        <div className="admin-filter-tabs">


          <button
            className={
              filter === 'all'
              ? 'active'
              : ''
            }
            onClick={
              ()=>setFilter('all')
            }
          >
            Все
          </button>


          <button
            className={
              filter === 'published'
              ? 'active'
              : ''
            }
            onClick={
              ()=>setFilter('published')
            }
          >
            Опубликованные
          </button>


          <button
            className={
              filter === 'draft'
              ? 'active'
              : ''
            }
            onClick={
              ()=>setFilter('draft')
            }
          >
            Черновики
          </button>


        </div>




        <div className="admin-articles-header-actions-wrap">

          <div className="admin-articles-header-actions">

            <button
              type="button"
              className="admin-year-button"
              disabled={updatingYear}
              onClick={updateYear}
            >
              {
                updatingYear
                  ? 'Обновляем…'
                  : `Обновить год → ${new Date().getFullYear()}`
              }
            </button>


            <span
              className="admin-year-help"
              tabIndex="0"
              aria-label="Информация об обновлении года"
            >
              ?

              <span
                className="admin-year-tooltip"
                role="tooltip"
              >
                Обновляет только год у опубликованных статей.
                День и месяц сохраняются.
                Черновики не изменяются.
              </span>

            </span>


            <a
              href="/admin/articles/new"
              className="admin-button"
            >
              Создать статью
            </a>

          </div>




        </div>


      </div>




      {
        loading
        ?
        (
          <div className="admin-empty">
            Загрузка...
          </div>
        )


        :


        articles.length === 0


        ?

        (
          <div className="admin-empty">
            Статей пока нет
          </div>
        )


        :


        (

          <div className="admin-articles-list">


          {
            filteredArticles.map(
              article => (


                <div
                  key={article.id}
                  className="admin-article-card"
                >


                  <div className="admin-article-image">

                    {
                      article.image
                      ?
                      (
                        <img
                          src={article.image}
                            alt="Превью изображения статьи"
                            width="320"
                            height="180"
                        />
                      )
                      :
                      (
                        <div className="admin-article-image-empty">
                          Нет фото
                        </div>
                      )
                    }

                  </div>



                  <div className="admin-article-info">

                    <h3>
                      {article.title}
                    </h3>


                    <span
                      className={
                        article.status === 'published'
                        ? 'admin-status admin-status--published'
                        : 'admin-status admin-status--draft'
                      }
                    >
                      {
                        article.status === 'published'
                        ? 'Опубликовано'
                        : 'Черновик'
                      }
                    </span>


                    <div className="admin-article-date">

                      Создано:
                      {' '}
                      {formatDate(article.createdAt)}

                    </div>


                  </div>



                  <div className="admin-article-actions">


                    <a
                      href={
                        `/admin/articles/edit/${article.id}`
                      }
                      className="admin-button-secondary"
                    >
                      Редактировать
                    </a>



                    <button
                      className="admin-button-danger"
                      onClick={
                        ()=>removeArticle(article.id)
                      }
                    >
                      Удалить
                    </button>


                  </div>



                </div>


              )
            )
          }


          </div>

        )

      }



    </div>

  );

}
