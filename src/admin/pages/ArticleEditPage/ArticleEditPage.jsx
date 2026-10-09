import { useEffect, useRef, useState } from 'react';

import { getArticle, updateArticle } from '../../api/adminApi';
import { BLOG_CATEGORIES, createSlug, validatePublicationSeo } from './articleEditorUtils.js';
import { useArticleImage } from '../../features/articles/hooks/useArticleImage.js';
import {
  createArticleFormFromRecord,
  getNormalizedArticleSeo,
} from '../../features/articles/model/articleForm.js';

import ArticleEditor from '../../components/Editor/ArticleEditor.jsx';

import ImageCropper from '../../components/ImageCropper/ImageCropper.jsx';

export default function ArticleEditPage() {
  const id = window.location.pathname.split('/').filter(Boolean).pop();

  const [form, setForm] = useState(() => createArticleFormFromRecord());

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState('');

  const savingRef = useRef(false);

  const [saving, setSaving] = useState(false);

  const [savedPublication, setSavedPublication] = useState({
    status: '',
    slug: '',
  });

  useEffect(() => {
    async function load() {
      setLoadError('');

      try {
        const result = await getArticle(id);

        if (result.article) {
          setSavedPublication({
            status: result.article.status || '',

            slug: result.article.slug || '',
          });

          setForm(createArticleFormFromRecord(result.article));
        } else if (result?.error === 'ARTICLE_NOT_FOUND') {
          setLoadError('Статья не найдена.');
        } else {
          setLoadError('Не удалось загрузить статью.');
        }
      } catch (error) {
        console.error(error);

        setLoadError('Не удалось загрузить статью. Попробуйте позже.');
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

  const { cropImage, selectImage, cancelCrop, cropAndUpload } = useArticleImage({
    onUploaded: url => change('image', url),
    resetInputAfterSelect: true,
  });

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

  async function save() {
    if (savingRef.current) {
      return;
    }

    if (!validatePublicationSeo(form)) {
      return;
    }

    savingRef.current = true;
    setSaving(true);

    try {
      const result = await updateArticle(id, {
        ...form,

        ...getNormalizedArticleSeo(form),

        updateSlug: form.slug !== savedPublication.slug,
      });

      if (result?.ok === false) {
        if (result.error === 'ARTICLE_SEO_REQUIRED') {
          alert('Статью нельзя опубликовать: заполните SEO Title и SEO Description.');
        } else {
          alert('Не удалось сохранить статью.');
        }

        savingRef.current = false;
        setSaving(false);

        return;
      }

      window.location.href = '/admin/articles';
    } catch (error) {
      console.error(error);

      alert('Не удалось сохранить статью.');

      savingRef.current = false;
      setSaving(false);
    }
  }

  if (loading) {
    return <div>Загрузка статьи...</div>;
  }

  if (loadError) {
    return (
      <div className="admin-editor">
        <a href="/admin/articles" className="admin-back">
          ← Назад
        </a>

        <section className="admin-editor__card">
          <h2>Не удалось открыть статью</h2>

          <p>{loadError}</p>
        </section>
      </div>
    );
  }

  return (
    <>
      {cropImage && (
        <ImageCropper image={cropImage.preview} onCancel={cancelCrop} onCrop={cropAndUpload} />
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
                    onChange={selectImage}
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

            <button type="button" className="admin-button" onClick={save} disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
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
