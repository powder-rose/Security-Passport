import {
  useEffect,
  useState,
} from 'react';

import {
  getArticle,
  updateArticle,
} from '../../api/adminApi';


function createSlug(value){

  return value

    .toLowerCase()

    .replace(/ё/g,'е')

    .replace(/[^a-zа-я0-9]+/gi,'-')

    .replace(/^-|-$/g,'');

}




export default function ArticleEditPage() {

  const id =
    window.location.pathname
      .split('/')
      .filter(Boolean)
      .pop();


  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    image: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
  });


  const [
    loading,
    setLoading,
  ] = useState(true);



  useEffect(() => {

    async function load(){

      try {

        const result =
          await getArticle(id);


        if(result.article){

          setForm({
            title:
              result.article.title || '',

            slug:
              result.article.slug || '',

            content:
              result.article.content || '',

            image:
              result.article.image || '',

            status:
              result.article.status || 'draft',

            seoTitle:
              result.article.seoTitle || '',

            seoDescription:
              result.article.seoDescription || '',

            ogTitle:
              result.article.ogTitle || '',

            ogDescription:
              result.article.ogDescription || '',

            ogImage:
              result.article.ogImage || '',

          });

        }

      } finally {

        setLoading(false);

      }

    }


    load();

  }, [id]);



  function change(
    field,
    value
  ){

    setForm({

      ...form,

      [field]:
        value,


      ...(field === 'title'
        ? {
            slug:
              createSlug(value)
          }
        : {}),

    });

  }



  async function save(){

    await updateArticle(
      id,
      form
    );


    window.location.href =
      '/admin/articles';

  }



  if(loading){

    return (
      <div>
        Загрузка статьи...
      </div>
    );

  }



  return (

    <div className="admin-editor">


      <a
        href="/admin/articles"
        className="admin-back"
      >
        ← Назад
      </a>



      <h1>
        Редактирование статьи
      </h1>



      <section className="admin-editor__card">

        <h2>
          Основная информация
        </h2>


        <label>
          <span>
            Заголовок
          </span>

          <input
            value={form.title}
            onChange={
              e => {

                const value =
                  e.target.value;


                setForm({
                  ...form,

                  title:
                    value,


                  slug:
                    createSlug(
                      value
                    ),

                });

              }
            }
          />
        </label>



        <label>
          <span>
            Изображение
          </span>

          <input
            value={form.image}
            onChange={
              e =>
              change(
                'image',
                e.target.value
              )
            }
          />
        </label>


        <label>
          <span>
            Текст статьи
          </span>

          <textarea
            rows="14"
            value={form.content}
            onChange={
              e =>
              change(
                'content',
                e.target.value
              )
            }
          />
        </label>


        <label>
          <span>
            Статус
          </span>

          <select
            value={form.status}
            onChange={
              e =>
              change(
                'status',
                e.target.value
              )
            }
          >
            <option value="draft">
              Черновик
            </option>

            <option value="published">
              Опубликовано
            </option>

          </select>

        </label>

      </section>



      <section className="admin-editor__card">

        <h2>
          SEO
        </h2>


        <label>
          <span>
            SEO Title
          </span>

          <input
            value={form.seoTitle}
            onChange={
              e =>
              change(
                'seoTitle',
                e.target.value
              )
            }
          />

        </label>


        <label>
          <span>
            SEO Description
          </span>

          <textarea
            rows="4"
            value={form.seoDescription}
            onChange={
              e =>
              change(
                'seoDescription',
                e.target.value
              )
            }
          />

        </label>

      </section>






      <button
        className="admin-button"
        onClick={save}
      >
        Сохранить
      </button>


    </div>

  );

}
