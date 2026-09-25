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

<>

<div className="article-editor">


<EditorContent
 editor={editor}
/>


</div>



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



<label className="article-upload-button">
Изображение
<input
 type="file"
 accept="image/*"
 onChange={addImage}
/>
</label>


</div>


</>

);
}
