export default function ArticleEditorToolbar({
  editor,
  linksOpen,
  linksCount,
  onEditCurrentLink,
  onToggleLinks,
  onAddImage,
}) {
  return (
    <div className="article-editor-toolbar">
      <button
        type="button"
        className={editor.isActive('bold') ? 'editor-button active' : 'editor-button'}
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        B
      </button>

      <button
        type="button"
        className={editor.isActive('italic') ? 'editor-button active' : 'editor-button'}
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        I
      </button>

      <button
        type="button"
        className={
          editor.isActive('heading', { level: 2 }) ? 'editor-button active' : 'editor-button'
        }
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 2,
            })
            .run();
        }}
      >
        H2
      </button>

      <button
        type="button"
        className={
          editor.isActive('heading', { level: 3 }) ? 'editor-button active' : 'editor-button'
        }
        onClick={() => {
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 3,
            })
            .run();
        }}
      >
        H3
      </button>

      <button
        type="button"
        className={editor.isActive('bulletList') ? 'editor-button active' : 'editor-button'}
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        ☷
      </button>

      <button
        type="button"
        className={editor.isActive('link') ? 'editor-button active' : 'editor-button'}
        title={editor.isActive('link') ? 'Изменить ссылку' : 'Добавить ссылку'}
        onClick={onEditCurrentLink}
      >
        🔗
      </button>

      <button
        type="button"
        className={linksOpen ? 'editor-button active' : 'editor-button'}
        title="Просмотреть ссылки статьи"
        onClick={onToggleLinks}
      >
        Ссылки ({linksCount})
      </button>

      <button
        type="button"
        className="editor-button"
        onClick={() => {
          editor.chain().focus().clearNodes().unsetAllMarks().run();
        }}
      >
        Tx
      </button>

      <button
        type="button"
        className={`editor-button ${editor.isActive('blockquote') ? 'editor-button--active' : ''}`}
        title="Вставить выделенный блок"
        onClick={() => {
          if (editor.isActive('blockquote')) {
            editor.chain().focus().toggleBlockquote().run();

            return;
          }

          const selection = editor.state.selection;

          if (!selection.empty) {
            editor.chain().focus().toggleBlockquote().run();

            return;
          }

          editor
            .chain()
            .focus()
            .insertContent({
              type: 'blockquote',
              content: [
                {
                  type: 'paragraph',
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
        className={editor.isActive('table') ? 'editor-button active' : 'editor-button'}
        title="Вставить таблицу 3 × 3"
        onClick={() => {
          editor
            .chain()
            .focus()
            .insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            })
            .run();
        }}
      >
        Таблица
      </button>

      {editor.isActive('table') && (
        <>
          <button
            type="button"
            className="editor-button"
            title="Добавить строку снизу"
            onClick={() => {
              editor.chain().focus().addRowAfter().run();
            }}
          >
            + строка
          </button>

          <button
            type="button"
            className="editor-button"
            title="Удалить текущую строку"
            onClick={() => {
              editor.chain().focus().deleteRow().run();
            }}
          >
            − строка
          </button>

          <button
            type="button"
            className="editor-button"
            title="Добавить столбец справа"
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
            }}
          >
            + столбец
          </button>

          <button
            type="button"
            className="editor-button"
            title="Удалить текущий столбец"
            onClick={() => {
              editor.chain().focus().deleteColumn().run();
            }}
          >
            − столбец
          </button>

          <button
            type="button"
            className="editor-button editor-button--danger"
            title="Удалить всю таблицу"
            onClick={() => {
              editor.chain().focus().deleteTable().run();
            }}
          >
            Удалить таблицу
          </button>
        </>
      )}

      <label className="article-upload-button">
        Изображение
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onAddImage} />
      </label>
    </div>
  );
}
