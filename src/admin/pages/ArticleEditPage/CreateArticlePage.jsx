import {
  useEffect,
  useState,
} from 'react';


import {
  createArticle,
  uploadArticleImage,
} from '../../api/adminApi';


import ArticleEditor from '../../components/Editor/ArticleEditor.jsx';

import ImageCropper from '../../components/ImageCropper/ImageCropper.jsx';






const BLOG_CATEGORIES = [
  {
    id: 'hotels',
    label: 'Гостиницы',
  },
  {
    id: 'culture',
    label: 'Культура',
  },
];


const SLUG_TRANSLIT = {
  а:'a', б:'b', в:'v', г:'g', д:'d',
  е:'e', ё:'e', ж:'zh', з:'z', и:'i',
  й:'y', к:'k', л:'l', м:'m', н:'n',
  о:'o', п:'p', р:'r', с:'s', т:'t',
  у:'u', ф:'f', х:'h', ц:'c', ч:'ch',
  ш:'sh', щ:'shch', ъ:'', ы:'y', ь:'',
  э:'e', ю:'yu', я:'ya',
};


function createSlug(value){

  const source =
    String(value || '')
      .trim()
      .toLowerCase();


  return Array
    .from(source)
    .map(
      char =>
        Object.prototype.hasOwnProperty.call(
          SLUG_TRANSLIT,
          char
        )
          ? SLUG_TRANSLIT[char]
          : char
    )
    .join('')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
    .replace(/-{2,}/g,'-');

}




function validatePublicationSeo(
  form
){

  if(
    form.status !==
    'published'
  ){
    return true;
  }


  const missing = [];


  if(
    !String(
      form.seoTitle || ''
    ).trim()
  ){
    missing.push(
      'SEO Title'
    );
  }


  if(
    !String(
      form.seoDescription || ''
    ).trim()
  ){
    missing.push(
      'SEO Description'
    );
  }


  if(
    missing.length === 0
  ){
    return true;
  }


  alert(
    `Статью нельзя опубликовать без SEO-полей:\n\n${missing.join('\n')}\n\nЧерновик можно сохранить без них.`
  );


  return false;

}


const ARTICLE_DRAFT_KEY =
  'passport-admin-new-article-draft';


function loadArticleDraft(){

  try {

    const params =
      new URLSearchParams(
        window.location.search
      );


    /*
     * Переход по кнопке «Создать статью»
     * всегда должен начинать новую статью
     * с чистой формы.
     *
     * После очистки убираем ?fresh=1 из URL,
     * чтобы обычное обновление страницы уже
     * восстанавливало текущий автосохранённый
     * черновик.
     */
    if(
      params.get(
        'fresh'
      ) === '1'
    ){

      window.localStorage.removeItem(
        ARTICLE_DRAFT_KEY
      );


      params.delete(
        'fresh'
      );


      const query =
        params.toString();


      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash || ''}`
      );


      return null;

    }


    const raw =
      window.localStorage.getItem(
        ARTICLE_DRAFT_KEY
      );


    if(!raw){
      return null;
    }


    const parsed =
      JSON.parse(raw);


    if(
      !parsed
      ||
      typeof parsed !== 'object'
    ){
      return null;
    }


    return parsed;

  }
  catch{

    return null;

  }

}



export default function CreateArticlePage(){


const [form,setForm] = useState(()=>{

  const draft =
    loadArticleDraft();


  return draft?.form || {

    title:'',
    slug:'',
    content:'',
    image:'',
    imageAlt:'',
    category:'',
    status:'draft',
    seoTitle:'',
    seoDescription:'',

  };

});


const [cropImage,setCropImage] = useState(null);



useEffect(()=>{

  const timer =
    window.setTimeout(()=>{

      try {

        window.localStorage.setItem(
          ARTICLE_DRAFT_KEY,
          JSON.stringify({

            form,

            savedAt:
              new Date()
                .toISOString(),

          })
        );

      }
      catch(error){

        console.warn(
          'Не удалось сохранить черновик статьи',
          error
        );

      }

    },300);


  return ()=>{

    window.clearTimeout(
      timer
    );

  };

},[
  form,
]);




function change(
  field,
  value
){

  setForm(
    prev => ({
      ...prev,

      [field]:
        value,
    })
  );

}




async function uploadImage(e){

  const file =
    e.target.files[0];




  if(!file){
    return;
  }


  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];


  if(!allowedTypes.includes(file.type)){

    alert(
      'Разрешены только JPG, PNG и WEBP'
    );

    e.target.value = '';

    return;

  }


  if(file.size > 5 * 1024 * 1024){

    alert(
      'Размер изображения не должен превышать 5 МБ'
    );

    e.target.value = '';

    return;

  }


  const dimensionsValid =
    await new Promise((resolve)=>{

      const img = new Image();

      img.onload = ()=>{

        const ratio =
          img.width / img.height;


        if(
          ratio > 0.75
          &&
          ratio < 0.9
        ){

          resolve(true);

        }
        else{

          resolve(false);

        }

      };


      img.onerror = ()=>resolve(false);


      img.src =
        URL.createObjectURL(file);

    });


  const preview =
    URL.createObjectURL(
      file
    );


  setCropImage({

    file,

    preview

  });

}


async function getCroppedFile(
  imageSrc,
  pixelCrop
){

  const image =
    await new Promise((resolve)=>{

      const img = new Image();

      img.onload = ()=>{
        resolve(img);
      };

      img.src = imageSrc;

    });



  const canvas =
    document.createElement('canvas');


  canvas.width =
    1200;


  canvas.height =
    675;



  const ctx =
    canvas.getContext('2d');



  ctx.drawImage(

    image,

    pixelCrop.x,
    pixelCrop.y,

    pixelCrop.width,
    pixelCrop.height,

    0,
    0,

    1200,
    675

  );



  const blob =
    await new Promise((resolve)=>{

      canvas.toBlob(
        resolve,
        'image/webp',
        0.9
      );

    });



  return new File(

    [
      blob
    ],

    'article-image.webp',

    {
      type:'image/webp'
    }

  );

}



function previewArticle(){

  const previewData = {

    ...form,

    slug:
      createSlug(
        form.slug ||
        form.title
      ),

    createdAt:
      new Date()
        .toISOString(),

  };


  sessionStorage.setItem(
    'passport-article-preview',
    JSON.stringify(
      previewData
    )
  );


  window.open(
    '/article-preview.html',
    '_blank'
  );

}



async function save(){

  if(
    !validatePublicationSeo(
      form
    )
  ){
    return;
  }


  const result =
    await createArticle({

      ...form,

      seoTitle:
        String(
          form.seoTitle || ''
        ).trim(),

      seoDescription:
        String(
          form.seoDescription || ''
        ).trim(),

      slug:
        createSlug(
          form.slug ||
          form.title
        ),

    });


  if(
    result?.ok === false
  ){

    if(
      result.error ===
      'ARTICLE_SEO_REQUIRED'
    ){

      alert(
        'Статью нельзя опубликовать: заполните SEO Title и SEO Description.'
      );

      return;
    }


    alert(
      'Не удалось сохранить статью.'
    );

    return;
  }


  window.localStorage.removeItem(
    ARTICLE_DRAFT_KEY
  );


  window.location.href =
    '/admin/articles';

}




return (

<>


{
  cropImage
  &&
  (
    <ImageCropper

      image={
        cropImage.preview
      }


      onCancel={()=>{

        setCropImage(null);

      }}


      onCrop={async(pixels)=>{

        const file =
          await getCroppedFile(
            cropImage.preview,
            pixels
          );


        const result =
          await uploadArticleImage(
            file
          );


        if(result.url){

          change(
            'image',
            result.url
          );

        }


        setCropImage(null);


      }}

    />
  )
}


<div className="admin-editor">


<a
 href="/admin/articles"
 className="admin-back"
>
← Назад
</a>



<h1>
Новая статья
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
  e =>
   change(
    'title',
    e.target.value
   )
 }

/>

</label>



<label className="admin-slug-field">

<span>
URL статьи
</span>


<div className="admin-slug-control">

  <span className="admin-slug-prefix">
    /blog/
  </span>


  <input
    type="text"
    value={form.slug || ''}
    placeholder={
      createSlug(form.title) ||
      'url-stati'
    }
    autoCapitalize="none"
    autoComplete="off"
    spellCheck="false"
    onChange={
      e =>
        change(
          'slug',
          createSlug(
            e.target.value
          )
        )
    }
  />


  <span className="admin-slug-suffix">
    /
  </span>

</div>


<small className="admin-slug-hint">
  Можно оставить пустым — адрес автоматически
  сформируется из заголовка.
</small>

</label>



<label>

<span>
Изображение
</span>


<label className="main-image-upload">

Выбрать изображение

<input

 type="file"

 accept="image/*"

 onChange={
   uploadImage
 }

/>

</label>


{
  form.image
  &&
  (
    <div className="admin-image-wrapper">

      <div className="admin-image-preview-header">

        <span>
          Предпросмотр
        </span>

        <small>
          1200 × 675 px · 16:9
        </small>

      </div>


      <img
        src={form.image}
        alt="Превью изображения статьи"
        width="1200"
        height="675"
        className="admin-image-preview"
      />


      <button
        type="button"
        className="admin-image-remove"
        onClick={()=>{

          change(
            'image',
            ''
          );

        }}
      >
        Удалить изображение
      </button>

    </div>
  )
}


</label>


<label>

<span>
Alt изображения
</span>

<input

type="text"

value={form.imageAlt}

onChange={(e)=>{

change(
'imageAlt',
e.target.value
);

}}

placeholder="Например: Специалисты проводят обследование объекта"

/>

</label>




<div className="admin-field">

<span>
Текст статьи
</span>


<ArticleEditor

 value={form.content}

 onChange={
   value =>
     change(
       'content',
       value
     )
 }

/>

</div>




<label>

<span>
Категория статьи
</span>


<input
  type="text"
  list="blog-category-suggestions-create"
  value={
    form.category || ''
  }
  maxLength="80"
  placeholder="Например: Культура"
  autoComplete="off"
  onChange={
    e =>
      change(
        'category',
        e.target.value
      )
  }
/>


<datalist id="blog-category-suggestions-create">

{
  BLOG_CATEGORIES.map(
    category => (

      <option
        key={category.id}
        value={category.label}
      />

    )
  )
}

</datalist>


<small className="admin-category-hint">
Выберите готовую категорию или
впишите новую самостоятельно.
</small>

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


<p className="admin-seo-note">
Для черновика поля можно оставить пустыми.
Для публикации обязательны SEO Title
и SEO Description.
</p>



<label>

<span>
SEO Title
</span>


<input
  value={
    form.seoTitle
  }
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
  value={
    form.seoDescription
  }
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



<div className="admin-editor__actions">

<button

type="button"

className="admin-button admin-button--preview"

onClick={previewArticle}

>
Предпросмотр статьи
</button>


<button

type="button"

className="admin-button"

onClick={save}

>
Сохранить
</button>

</div>



</div>

</>

);


}
