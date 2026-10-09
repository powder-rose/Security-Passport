import { useEffect, useReducer, useState } from 'react';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TableKit } from '@tiptap/extension-table';

import { uploadArticleImage } from '../../api/adminApi';
import ArticleEditorToolbar from '../../features/articles/components/ArticleEditorToolbar.jsx';
import ArticleLinksPanel from '../../features/articles/components/ArticleLinksPanel.jsx';
import { getEditorLinks } from '../../features/articles/editor/articleEditorLinks.js';

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

export default function ArticleEditor({ value, onChange }) {
  const [, forceUpdate] = useReducer(current => current + 1, 0);
  const [linksOpen, setLinksOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),

      ArticleImage.configure({
        HTMLAttributes: {
          class: 'article-image',
        },
      }),

      Link.configure({
        openOnClick: false,
      }),

      TableKit.configure({
        table: {
          HTMLAttributes: {
            class: 'article-table',
          },
        },
      }),
    ],

    content: value || '',

    onTransaction() {
      forceUpdate();
    },

    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>', false);
    }
  }, [value, editor]);

  const links = getEditorLinks(editor);

  function editCurrentLink() {
    const isLink = editor.isActive('link');

    if (!isLink && editor.state.selection.empty) {
      alert('Сначала выделите текст для ссылки.');

      return;
    }

    const currentHref = isLink ? editor.getAttributes('link').href || '' : '';

    const href = window.prompt(isLink ? 'Изменить ссылку' : 'Введите ссылку', currentHref);

    if (href === null) {
      return;
    }

    const cleanHref = href.trim();

    if (!cleanHref) {
      if (isLink) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      }

      return;
    }

    const chain = editor.chain().focus();

    if (isLink) {
      chain.extendMarkRange('link');
    }

    chain
      .setLink({
        href: cleanHref,
      })
      .run();
  }

  function editArticleLink(link) {
    const href = window.prompt('Изменить адрес ссылки', link.href);

    if (href === null) {
      return;
    }

    const cleanHref = href.trim();

    if (!cleanHref) {
      removeArticleLink(link);

      return;
    }

    editor
      .chain()
      .focus()
      .setTextSelection({
        from: link.from,
        to: link.to,
      })
      .setLink({
        href: cleanHref,
      })
      .run();
  }

  function removeArticleLink(link) {
    editor
      .chain()
      .focus()
      .setTextSelection({
        from: link.from,
        to: link.to,
      })
      .unsetLink()
      .run();
  }

  function focusArticleLink(link) {
    editor
      .chain()
      .focus()
      .setTextSelection({
        from: link.from,
        to: link.to,
      })
      .run();
  }

  async function addImage(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('Разрешены только JPG, PNG и WEBP');

      event.target.value = '';

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер изображения не должен превышать 5 МБ');

      event.target.value = '';

      return;
    }

    const result = await uploadArticleImage(file);

    if (result.url) {
      const alt = window.prompt('Введите описание изображения') || '';

      editor
        .chain()
        .focus()
        .setImage({
          src: result.url,
          alt,
          width: result.width,
          height: result.height,
        })
        .run();
    }
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="article-editor-shell">
      <ArticleEditorToolbar
        editor={editor}
        linksOpen={linksOpen}
        linksCount={links.length}
        onEditCurrentLink={editCurrentLink}
        onToggleLinks={() => {
          setLinksOpen(current => !current);
        }}
        onAddImage={addImage}
      />

      {linksOpen && (
        <ArticleLinksPanel
          links={links}
          onFocus={focusArticleLink}
          onEdit={editArticleLink}
          onRemove={removeArticleLink}
        />
      )}

      <div className="article-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
