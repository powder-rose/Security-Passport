import { useEffect, useState } from 'react';

import { getArticle, updateArticle, uploadArticleImage } from '../../api/adminApi';

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

const LEGACY_CATEGORY_VALUES = new Set([
  'passport',
  'categorization',
  'requirements',
  'actualization',
  'practice',
  'паспорта безопасности',
  'категорирование объектов',
  'требования и законодательство',
  'актуализация паспорта',
  'практика и документы',
]);

function getEditableCategory(value) {
  const category = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (LEGACY_CATEGORY_VALUES.has(category.toLocaleLowerCase('ru-RU'))) {
    return '';
  }

  return category;
}

const SLUG_TRANSLIT = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

function createSlug(value) {
  const source = String(value || '')
    .trim()
    .toLowerCase();

  return Array.from(source)
    .map(char =>
      Object.prototype.hasOwnProperty.call(SLUG_TRANSLIT, char) ? SLUG_TRANSLIT[char] : char,
    )
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function validatePublicationSeo(form) {
  if (form.status !== 'published') {
    return true;
  }

  const missing = [];

  if (!String(form.seoTitle || '').trim()) {
    missing.push('SEO Title');
  }

  if (!String(form.seoDescription || '').trim()) {
    missing.push('SEO Description');
  }

  if (missing.length === 0) {
    return true;
  }

  alert(
    `Статью нельзя опубликовать без SEO-полей:\n\n${missing.join('\n')}\n\nЧерновик можно сохранить без них.`,
  );

  return false;
}

export default function ArticleEditPage() {
  const id = window.location.pathname.split('/').filter(Boolean).pop();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    image: '',
    imageAlt: '',
    category: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
  });

  const [loading, setLoading] = useState(true);

  const [cropImage, setCropImage] = useState(null);

  const [savedPublication, setSavedPublication] = useState({
    status: '',
    slug: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const result = await getArticle(id);

        if (result.article) {
          setSavedPublication({
            status: result.article.status || '',

            slug: result.article.slug || '',
          });

          setForm({
            title: result.article.title || '',

            slug: result.article.slug || '',

            content: result.article.content || '',

            image: result.article.image || '',

            imageAlt: result.article.imageAlt || '',

            category: getEditableCategory(result.article.category),

            status: result.article.status || 'draft',

            seoTitle: result.article.seoTitle || '',

            seoDescription: result.article.seoDescription || '',

            ogTitle: result.article.ogTitle || '',

            ogDescription: result.article.ogDescription || '',

            ogImage: result.article.ogImage || '',
          });
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function change(field, value) {
    setForm(prev => ({
      ...prev,

      [field]: value,
    }));
  }

  function openPreview() {
    const previewArticle = {
      ...form,

      id,

      slug: form.slug || createSlug(form.title),

      updatedAt: new Date().toISOString(),
    };

    window.sessionStorage.setItem('passport-article-preview', JSON.stringify(previewArticle));

    window.open('/article-preview.html', '_blank');
  }

  async function uploadImage(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('Разрешены только JPG, PNG и WEBP');

      e.target.value = '';

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер изображения не должен превышать 5 МБ');

      e.target.value = '';

      return;
    }

    const preview = URL.createObjectURL(file);

    setCropImage({
      file,
      preview,
    });

    e.target.value = '';
  }

  async function getCroppedFile(imageSrc, pixelCrop) {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);

      img.onerror = reject;

      img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');

    canvas.width = 1200;

    canvas.height = 675;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,

      pixelCrop.x,
      pixelCrop.y,

      pixelCrop.width,
      pixelCrop.height,

      0,
      0,

      1200,
      675,
    );

    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/webp', 0.9);
    });

    if (!blob) {
      throw new Error('Не удалось подготовить изображение');
    }

    return new File([blob], 'article-image.webp', {
      type: 'image/webp',
    });
  }

  async function save() {
    if (!validatePublicationSeo(form)) {
      return;
    }

    const result = await updateArticle(id, {
      ...form,

      seoTitle: String(form.seoTitle || '').trim(),

      seoDescription: String(form.seoDescription || '').trim(),

      updateSlug: form.slug !== savedPublication.slug,
    });

    if (result?.ok === false) {
      if (result.error === 'ARTICLE_SEO_REQUIRED') {
        alert('Статью нельзя опубликовать: заполните SEO Title и SEO Description.');

        return;
      }

      alert('Не удалось сохранить статью.');

      return;
    }

    window.location.href = '/admin/articles';
  }

  if (loading) {
    return <div>Загрузка статьи...</div>;
  }

  return (
    <>
      {cropImage && (
        <ImageCropper
          image={cropImage.preview}

          onCancel={() => {
            URL.revokeObjectURL(cropImage.preview);

            setCropImage(null);
          }}

          onCrop={async pixels => {
            try {
              const file = await getCroppedFile(cropImage.preview, pixels);

              const result = await uploadArticleImage(file);

              if (result.url) {
                change('image', result.url);
              }
            } finally {
              URL.revokeObjectURL(cropImage.preview);

              setCropImage(null);
            }
          }}
        />
      )}

      <div className="admin-editor">
        <a href="/admin/articles" className="admin-back">
          ← Назад
        </a>

        <h1>Редактирование статьи</h1>

        {savedPublication.status === 'published' && savedPublication.slug && (
          <div className="admin-published-notice">
            <div className="admin-published-notice__status">
              <span className="admin-published-notice__dot" aria-hidden="true" />

              <div>
                <strong>Статья опубликована на сайте</strong>

                <span>Изменения после сохранения автоматически появятся в публичной версии.</span>
              </div>
            </div>

            <a
              href={`/blog/${savedPublication.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-published-notice__link"
            >
              Открыть статью ↗
            </a>
          </div>
        )}

        <div className="admin-editor__workspace">
          <div className="admin-editor__main">
            <section className="admin-editor__card">
              <h2>Основная информация</h2>

              <label>
                <span>Заголовок</span>

                <input value={form.title} onChange={e => change('title', e.target.value)} />
              </label>

              <label className="admin-slug-field">
                <span>URL статьи</span>

                <div className="admin-slug-control">
                  <span className="admin-slug-prefix">/blog/</span>

                  <input
                    type="text"
                    value={form.slug || ''}
                    autoCapitalize="none"
                    autoComplete="off"
                    spellCheck="false"
                    onChange={e => change('slug', createSlug(e.target.value))}
                  />

                  <span className="admin-slug-suffix">/</span>
                </div>

                <small className="admin-slug-hint">
                  После публикации URL лучше не менять. Если адрес изменить, старый slug сохранится
                  для 301-редиректа.
                </small>
              </label>

              <div className="admin-field">
                <span>Главное изображение</span>

                <label className="main-image-upload">
                  Выбрать изображение
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={uploadImage}
                  />
                </label>

                {form.image && (
                  <div className="admin-image-wrapper">
                    <div className="admin-image-preview-header">
                      <span>Предпросмотр</span>

                      <small>1200 × 675 px · 16:9</small>
                    </div>

                    <img
                      src={form.image}
                      alt={form.imageAlt || 'Превью изображения статьи'}
                      width="1200"
                      height="675"
                      className="admin-image-preview"
                    />

                    <button
                      type="button"
                      className="admin-image-remove"
                      onClick={() => {
                        change('image', '');
                      }}
                    >
                      Удалить изображение
                    </button>
                  </div>
                )}
              </div>

              <label>
                <span>Alt изображения</span>

                <input
                  type="text"
                  value={form.imageAlt}
                  onChange={e => change('imageAlt', e.target.value)}
                  placeholder="Например: Специалисты проводят обследование объекта"
                />
              </label>

              <div className="admin-field">
                <span>Текст статьи</span>

                <ArticleEditor value={form.content} onChange={value => change('content', value)} />
              </div>

              <label>
                <span>Категория статьи</span>

                <input
                  type="text"
                  list="blog-category-suggestions-edit"
                  value={form.category || ''}
                  maxLength="80"
                  placeholder="Например: Культура"
                  autoComplete="off"
                  onChange={e => change('category', e.target.value)}
                />

                <datalist id="blog-category-suggestions-edit">
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

                <select value={form.status} onChange={e => change('status', e.target.value)}>
                  <option value="draft">Черновик</option>

                  <option value="published">Опубликовано</option>
                </select>
              </label>
            </section>

            <section className="admin-editor__card">
              <h2>SEO</h2>

              <p className="admin-seo-note">
                Для черновика поля можно оставить пустыми. Для публикации обязательны SEO Title и
                SEO Description.
              </p>

              <label>
                <span>SEO Title</span>

                <input value={form.seoTitle} onChange={e => change('seoTitle', e.target.value)} />
              </label>

              <label>
                <span>SEO Description</span>

                <textarea
                  rows="4"
                  value={form.seoDescription}
                  onChange={e => change('seoDescription', e.target.value)}
                />
              </label>
            </section>
          </div>

          <aside className="admin-editor__sticky-actions" aria-label="Действия со статьёй">
            <div className="admin-editor__sticky-title">Действия</div>

            <button
              type="button"
              className="admin-button admin-button--preview"
              onClick={openPreview}
            >
              Предпросмотр
            </button>

            <button type="button" className="admin-button" onClick={save}>
              Сохранить
            </button>

            {savedPublication.status === 'published' && savedPublication.slug && (
              <a
                href={`/blog/${savedPublication.slug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-editor__public-link"
              >
                Открыть на сайте ↗
              </a>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
