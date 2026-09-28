import {
  useState,
} from 'react';


import {
  createArticle,
  uploadArticleImage,
} from '../../api/adminApi';


import ArticleEditor from '../../components/Editor/ArticleEditor.jsx';

import ImageCropper from '../../components/ImageCropper/ImageCropper.jsx';






function createSlug(value){

  return value
    .toLowerCase()
    .replace(/ё/g,'е')
    .replace(/[^a-zа-я0-9]+/gi,'-')
    .replace(/^-|-$/g,'');

}



export default function CreateArticlePage(){


const [form,setForm] = useState({

 title:'',
 content:'',
 image:'',
 imageAlt:'',
 status:'draft',
 seoTitle:'',
 seoDescription:'',

});


const [seoManual,setSeoManual] = useState({

 seoTitle:false,
 seoDescription:false,

});


const [cropImage,setCropImage] = useState(null);




function change(field,value){


 setForm((prev)=>{


   const next = {

     ...prev,

     [field]:value,

   };



   if(
     field === 'title'
     &&
     !seoManual.seoTitle
   ){

     next.seoTitle = value;

   }



   if(
     field === 'content'
     &&
     !seoManual.seoDescription
   ){

     next.seoDescription =
       value
       .replace(/<[^>]*>/g,' ')
       .replace(/\s+/g,' ')
       .trim()
       .slice(0,160);

   }



   return next;


 });


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



async function save(){



 await createArticle({

   ...form,

   slug:createSlug(
     form.title
   ),

 });


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
e => {

setSeoManual({
 ...seoManual,
 seoTitle:true,
});

change(
'seoTitle',
e.target.value
);

}
}

/>

</label>



<label>

<span>
SEO Description
</span>


<textarea

value={form.seoDescription}

onChange={
e => {

setSeoManual({
 ...seoManual,
 seoDescription:true,
});

change(
'seoDescription',
e.target.value

);

}
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

</>

);


}
