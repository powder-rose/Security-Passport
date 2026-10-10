import { useEffect, useRef, useState } from 'react';

import { getArticle, updateArticle } from '../../api/adminApi';
import { createSlug, validatePublicationSeo } from './articleEditorUtils.js';
import { useArticleImage } from '../../features/articles/hooks/useArticleImage.js';
import {
  createArticleFormFromRecord,
  getNormalizedArticleSeo,
} from '../../features/articles/model/articleForm.js';

import ArticleFormFields from '../../features/articles/components/ArticleFormFields.jsx';

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
            <ArticleFormFields
              form={form}
              mode="edit"
              onChange={change}
              onSlugChange={value => change('slug', createSlug(value))}
              onImageSelect={selectImage}
            />
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
