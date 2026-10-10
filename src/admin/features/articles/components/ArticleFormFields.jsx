import ArticleEditor from '../../../components/Editor/ArticleEditor.jsx';

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

export default function ArticleFormFields({
  form,
  mode,
  onChange,
  onSlugChange,
  onImageSelect,
  slugPlaceholder = '',
}) {
  const isEdit = mode === 'edit';

  const categoryListId = isEdit
    ? 'blog-category-suggestions-edit'
    : 'blog-category-suggestions-create';

  const imageField = (
    <>
      <span>{isEdit ? 'Главное изображение' : 'Изображение'}</span>

      <label className="main-image-upload">
        Выбрать изображение
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onImageSelect} />
      </label>

      {form.image && (
        <div className="admin-image-wrapper">
          <div className="admin-image-preview-header">
            <span>Предпросмотр</span>

            <small>1200 × 675 px · 16:9</small>
          </div>

          <img
            src={form.image}
            alt={
              isEdit ? form.imageAlt || 'Превью изображения статьи' : 'Превью изображения статьи'
            }
            width="1200"
            height="675"
            className="admin-image-preview"
          />

          <button
            type="button"
            className="admin-image-remove"
            onClick={() => onChange('image', '')}
          >
            Удалить изображение
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      <section className="admin-editor__card">
        <h2>Основная информация</h2>

        <label>
          <span>Заголовок</span>

          <input value={form.title} onChange={event => onChange('title', event.target.value)} />
        </label>

        <label className="admin-slug-field">
          <span>URL статьи</span>

          <div className="admin-slug-control">
            <span className="admin-slug-prefix">/blog/</span>

            <input
              type="text"
              value={form.slug || ''}
              placeholder={isEdit ? undefined : slugPlaceholder}
              autoCapitalize="none"
              autoComplete="off"
              spellCheck="false"
              onChange={event => onSlugChange(event.target.value)}
            />

            <span className="admin-slug-suffix">/</span>
          </div>

          <small className="admin-slug-hint">
            {isEdit
              ? 'После публикации URL лучше не менять. Если адрес изменить, старый slug сохранится для 301-редиректа.'
              : 'Можно оставить пустым — адрес автоматически сформируется из заголовка.'}
          </small>
        </label>

        {isEdit ? <div className="admin-field">{imageField}</div> : <label>{imageField}</label>}

        <label>
          <span>Alt изображения</span>

          <input
            type="text"
            value={form.imageAlt}
            onChange={event => onChange('imageAlt', event.target.value)}
            placeholder="Например: Специалисты проводят обследование объекта"
          />
        </label>

        <div className="admin-field">
          <span>Текст статьи</span>

          <ArticleEditor value={form.content} onChange={value => onChange('content', value)} />
        </div>

        <label>
          <span>Категория статьи</span>

          <input
            type="text"
            list={categoryListId}
            value={form.category || ''}
            maxLength="80"
            placeholder="Например: Культура"
            autoComplete="off"
            onChange={event => onChange('category', event.target.value)}
          />

          <datalist id={categoryListId}>
            {BLOG_CATEGORIES.map(category => (
              <option key={category.id} value={category.label} />
            ))}
          </datalist>

          <small className="admin-category-hint">
            Выберите готовую категорию или впишите новую самостоятельно.
          </small>
        </label>

        <label>
          <span>Статус</span>

          <select value={form.status} onChange={event => onChange('status', event.target.value)}>
            <option value="draft">Черновик</option>

            <option value="published">Опубликовано</option>
          </select>
        </label>
      </section>

      <section className="admin-editor__card">
        <h2>SEO</h2>

        <p className="admin-seo-note">
          Для черновика поля можно оставить пустыми. Для публикации обязательны SEO Title и SEO
          Description.
        </p>

        <label>
          <span>SEO Title</span>

          <input
            value={form.seoTitle}
            onChange={event => onChange('seoTitle', event.target.value)}
          />
        </label>

        <label>
          <span>SEO Description</span>

          <textarea
            rows={isEdit ? 4 : undefined}
            value={form.seoDescription}
            onChange={event => onChange('seoDescription', event.target.value)}
          />
        </label>
      </section>
    </>
  );
}
