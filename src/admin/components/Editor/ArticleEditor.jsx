import {
  useEffect,
  useState,
} from 'react';


import {
  useEditor,
  EditorContent,
} from '@tiptap/react';



import StarterKit from '@tiptap/starter-kit';



import Image from '@tiptap/extension-image';

import Link from '@tiptap/extension-link';

import {
  TableKit,
} from '@tiptap/extension-table';



import {
  uploadArticleImage,
} from '../../api/adminApi';



export default function ArticleEditor({
  value,
  onChange,
}){


const [, update] = useState(0);


const editor = useEditor({

  extensions:[

    StarterKit.configure({

      heading:{
        levels:[2,3],
      },

    }),

    Image.configure({

      HTMLAttributes:{
        class:'article-image'
      }

    }),


    Link.configure({
      openOnClick:false,
    }),


    TableKit.configure({

      table: {

        HTMLAttributes: {
          class: 'article-table',
        },

      },

    }),


  ],


  content:value || '',



  onCreate({editor}){


  },


  onTransaction(){

    update(v=>v+1);

  },


  onUpdate({editor}){



    onChange(
      editor.getHTML()
    );

  },


});



useEffect(()=>{

  if(
    editor &&
    value !== editor.getHTML()
  ){

    editor.commands.setContent(
      value || '<p></p>',
      false
    );

  }

},[value,editor]);



async function addImage(e){

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


  const result =
    await uploadArticleImage(file);


  if(result.url){

    const alt =
      window.prompt(
        'Введите описание изображения'
      ) || '';


    editor
      .chain()
      .focus()
      .setImage({
        src:result.url,
        alt
      })
      .run();

  }

}



if(!editor){

 return null;

}



return (

<div className="article-editor-shell">

<div className="article-editor-toolbar">


<button
 type="button"
 className={
   editor.isActive('bold')
   ? 'editor-button active'
   : 'editor-button'
 }
 onClick={()=>{

   editor
    .chain()
    .focus()
    .toggleBold()
    .run();

 }}
>
B
</button>


<button
 type="button"
 className={
   editor.isActive('italic')
   ? 'editor-button active'
   : 'editor-button'
 }
 onClick={()=>{

   editor
    .chain()
    .focus()
    .toggleItalic()
    .run();

 }}
>
I
</button>


<button
 type="button"
 className={
   editor.isActive('heading',{level:2})
   ? 'editor-button active'
   : 'editor-button'
 }
 onClick={()=>{

   editor
    .chain()
    .focus()
    .toggleHeading({
      level:2
    })
    .run();

 }}
>
H2
</button>



<button
 type="button"
 className={
   editor.isActive('heading',{level:3})
   ? 'editor-button active'
   : 'editor-button'
 }
 onClick={()=>{

   editor
    .chain()
    .focus()
    .toggleHeading({
      level:3
    })
    .run();

 }}
>
H3
</button>



<button
 type="button"
 className={
   editor.isActive('bulletList')
   ? 'editor-button active'
   : 'editor-button'
 }
 onClick={()=>{

   editor
    .chain()
    .focus()
    .toggleBulletList()
    .run();

 }}
>
☷
</button>



<button
 type="button"
 className={
   editor.isActive('link')
   ? 'editor-button active'
   : 'editor-button'
 }
 onClick={()=>{

   const url = window.prompt(
     'Введите ссылку'
   );


   if(url){

     editor
      .chain()
      .focus()
      .setLink({
        href:url
      })
      .run();

   }

 }}
>
🔗
</button>



<button
 type="button"
 className="editor-button"
 onClick={()=>{

   editor
    .chain()
    .focus()
    .clearNodes()
    .unsetAllMarks()
    .run();

 }}
>
Tx
</button>



<button
 type="button"
 className={`editor-button ${
   editor.isActive('blockquote')
     ? 'editor-button--active'
     : ''
 }`}
 title="Вставить выделенный блок"
 onClick={()=>{

   if(
     editor.isActive(
       'blockquote'
     )
   ){

     editor
      .chain()
      .focus()
      .toggleBlockquote()
      .run();

     return;

   }


   const selection =
     editor.state.selection;


   /*
    * Если пользователь выделил текст —
    * просто превращаем его в блок «Важно».
    */
   if(
     !selection.empty
   ){

     editor
      .chain()
      .focus()
      .toggleBlockquote()
      .run();

     return;

   }


   /*
    * Если ничего не выделено —
    * создаём готовую заготовку.
    */
   editor
    .chain()
    .focus()
    .insertContent({
      type:'blockquote',

      content:[
        {
          type:'paragraph',
        },
      ],
    })
    .focus()
    .run();

 }}
>
Врезка
</button>



<button
 type="button"
 className={
   editor.isActive('table')
     ? 'editor-button active'
     : 'editor-button'
 }
 title="Вставить таблицу 3 × 3"
 onClick={()=>{

   editor
    .chain()
    .focus()
    .insertTable({
      rows:3,
      cols:3,
      withHeaderRow:true,
    })
    .run();

 }}
>
Таблица
</button>



{
  editor.isActive('table')
  &&
  (
    <>

      <button
        type="button"
        className="editor-button"
        title="Добавить строку снизу"
        onClick={()=>{

          editor
            .chain()
            .focus()
            .addRowAfter()
            .run();

        }}
      >
        + строка
      </button>


      <button
        type="button"
        className="editor-button"
        title="Удалить текущую строку"
        onClick={()=>{

          editor
            .chain()
            .focus()
            .deleteRow()
            .run();

        }}
      >
        − строка
      </button>


      <button
        type="button"
        className="editor-button"
        title="Добавить столбец справа"
        onClick={()=>{

          editor
            .chain()
            .focus()
            .addColumnAfter()
            .run();

        }}
      >
        + столбец
      </button>


      <button
        type="button"
        className="editor-button"
        title="Удалить текущий столбец"
        onClick={()=>{

          editor
            .chain()
            .focus()
            .deleteColumn()
            .run();

        }}
      >
        − столбец
      </button>


      <button
        type="button"
        className="editor-button editor-button--danger"
        title="Удалить всю таблицу"
        onClick={()=>{

          editor
            .chain()
            .focus()
            .deleteTable()
            .run();

        }}
      >
        Удалить таблицу
      </button>

    </>
  )
}



<label className="article-upload-button">
Изображение
<input
 type="file"
 accept="image/*"
 onChange={addImage}
/>
</label>


</div>


<div className="article-editor">


<EditorContent
 editor={editor}
/>


</div>

</div>

);
}
