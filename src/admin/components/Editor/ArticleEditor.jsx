import {
  useEffect,
  useReducer,
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



const ArticleImage = Image.extend({

  addAttributes() {

    return {
      ...this.parent?.(),

      width: {
        default: null,
      },

      height: {
        default: null,
      },
    };

  },

});


function getEditorLinks(
  editor
){

  if(
    !editor
  ){
    return [];
  }


  const links = [];


  editor.state.doc.descendants(
    (
      node,
      position
    ) => {

      if(
        !node.isText
      ){
        return;
      }


      const linkMark =
        node.marks.find(
          mark =>
            mark.type.name ===
            'link'
        );


      if(
        !linkMark
      ){
        return;
      }


      const href =
        String(
          linkMark.attrs?.href ||
          ''
        );


      const from =
        position;

      const to =
        position +
        node.nodeSize;


      const previous =
        links[
          links.length - 1
        ];


      /*
       * Один link может состоять из нескольких
       * text-node. Склеиваем соседние части.
       */
      if(
        previous
        &&
        previous.href === href
        &&
        previous.to === from
      ){

        previous.to =
          to;

        previous.text +=
          node.text || '';

        return;

      }


      links.push({
        href,

        text:
          node.text || '',

        from,
        to,
      });

    }
  );


  return links;

}



export default function ArticleEditor({
  value,
  onChange,
}){


const [, forceUpdate] = useReducer(
  value => value + 1,
  0,
);


const [
  linksOpen,
  setLinksOpen,
] = useState(false);


const editor = useEditor({

  extensions:[

    StarterKit.configure({

      heading:{
        levels:[2,3],
      },

    }),

    ArticleImage.configure({

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



  onTransaction(){

    forceUpdate();

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



const links =
  getEditorLinks(
    editor
  );


function editCurrentLink(){

  const isLink =
    editor.isActive(
      'link'
    );


  if(
    !isLink
    &&
    editor.state.selection.empty
  ){

    alert(
      'Сначала выделите текст для ссылки.'
    );

    return;

  }


  const currentHref =
    isLink
      ? (
          editor
            .getAttributes(
              'link'
            )
            .href ||
          ''
        )
      : '';


  const href =
    window.prompt(
      isLink
        ? 'Изменить ссылку'
        : 'Введите ссылку',
      currentHref
    );


  if(
    href === null
  ){
    return;
  }


  const cleanHref =
    href.trim();


  if(
    !cleanHref
  ){

    if(
      isLink
    ){

      editor
        .chain()
        .focus()
        .extendMarkRange(
          'link'
        )
        .unsetLink()
        .run();

    }

    return;

  }


  const chain =
    editor
      .chain()
      .focus();


  if(
    isLink
  ){

    chain.extendMarkRange(
      'link'
    );

  }


  chain
    .setLink({
      href:
        cleanHref,
    })
    .run();

}



function editArticleLink(
  link
){

  const href =
    window.prompt(
      'Изменить адрес ссылки',
      link.href
    );


  if(
    href === null
  ){
    return;
  }


  const cleanHref =
    href.trim();


  if(
    !cleanHref
  ){

    removeArticleLink(
      link
    );

    return;

  }


  editor
    .chain()
    .focus()
    .setTextSelection({
      from:
        link.from,

      to:
        link.to,
    })
    .setLink({
      href:
        cleanHref,
    })
    .run();

}



function removeArticleLink(
  link
){

  editor
    .chain()
    .focus()
    .setTextSelection({
      from:
        link.from,

      to:
        link.to,
    })
    .unsetLink()
    .run();

}



function focusArticleLink(
  link
){

  editor
    .chain()
    .focus()
    .setTextSelection({
      from:
        link.from,

      to:
        link.to,
    })
    .run();

}



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
        alt,
        width:result.width,
        height:result.height
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
 title={
   editor.isActive('link')
     ? 'Изменить ссылку'
     : 'Добавить ссылку'
 }
 onClick={
   editCurrentLink
 }
>
🔗
</button>


<button
 type="button"
 className={
   linksOpen
     ? 'editor-button active'
     : 'editor-button'
 }
 title="Просмотреть ссылки статьи"
 onClick={()=>{

   setLinksOpen(
     value =>
       !value
   );

 }}
>
Ссылки ({links.length})
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


{
  linksOpen
  &&
  (
    <div className="article-links-panel">

      <div className="article-links-panel__head">

        <strong>
          Ссылки в статье
        </strong>

        <span>
          {links.length}
        </span>

      </div>


      {
        links.length === 0
        ?
        (
          <div className="article-links-panel__empty">
            В тексте статьи ссылок нет.
          </div>
        )
        :
        (
          <div className="article-links-panel__list">

            {
              links.map(
                (
                  link,
                  index
                ) => (

                  <div
                    key={
                      `${link.from}-${link.to}-${link.href}`
                    }
                    className="article-links-panel__item"
                  >

                    <button
                      type="button"
                      className="article-links-panel__info"
                      title="Выделить ссылку в тексте"
                      onClick={()=>{

                        focusArticleLink(
                          link
                        );

                      }}
                    >

                      <span>
                        {
                          String(
                            index + 1
                          ).padStart(
                            2,
                            '0'
                          )
                        }
                      </span>

                      <div>

                        <strong>
                          {
                            link.text.trim()
                            ||
                            'Ссылка без текста'
                          }
                        </strong>

                        <small>
                          {link.href}
                        </small>

                      </div>

                    </button>


                    <div className="article-links-panel__actions">

                      <a
                        href={
                          link.href
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Открыть ↗
                      </a>


                      <button
                        type="button"
                        onClick={()=>{

                          editArticleLink(
                            link
                          );

                        }}
                      >
                        Изменить
                      </button>


                      <button
                        type="button"
                        className="is-danger"
                        onClick={()=>{

                          const ok =
                            window.confirm(
                              'Удалить ссылку? Текст останется.'
                            );


                          if(
                            ok
                          ){

                            removeArticleLink(
                              link
                            );

                          }

                        }}
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
  )
}


<div className="article-editor">


<EditorContent
 editor={editor}
/>


</div>

</div>

);
}
