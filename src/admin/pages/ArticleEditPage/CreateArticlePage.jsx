import { useEffect, useRef, useState } from 'react';

import { createArticle } from '../../api/adminApi';
import { createSlug, validatePublicationSeo } from './articleEditorUtils.js';
import { useArticleImage } from '../../features/articles/hooks/useArticleImage.js';
import {
  createEmptyArticleForm,
  getNormalizedArticleSeo,
} from '../../features/articles/model/articleForm.js';

import ArticleFormFields from '../../features/articles/components/ArticleFormFields.jsx';

import ImageCropper from '../../components/ImageCropper/ImageCropper.jsx';

const ARTICLE_DRAFT_KEY = 'passport-admin-new-article-draft';

function loadArticleDraft() {
  try {
    const params = new URLSearchParams(window.location.search);

    /*
     * Переход по кнопке «Создать статью»
     * всегда должен начинать новую статью
     * с чистой формы.
     *
     * После очистки убираем ?fresh=1 из URL,
     * чтобы обычное обновление страницы уже
     * восстанавливало текущий автосохранённый
     * черновик.
     */
    if (params.get('fresh') === '1') {
      window.localStorage.removeItem(ARTICLE_DRAFT_KEY);

      params.delete('fresh');

      const query = params.toString();

      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash || ''}`,
      );

      return null;
    }

    const raw = window.localStorage.getItem(ARTICLE_DRAFT_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export default function CreateArticlePage() {
  const [form, setForm] = useState(() => {
    const draft = loadArticleDraft();

    return draft?.form || createEmptyArticleForm();
  });

  const savingRef = useRef(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          ARTICLE_DRAFT_KEY,
          JSON.stringify({
            form,

            savedAt: new Date().toISOString(),
          }),
        );
      } catch (error) {
        console.warn('Не удалось сохранить черновик статьи', error);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [form]);

  function change(field, value) {
    setForm(prev => ({
      ...prev,

      [field]: value,
    }));
  }

  const { cropImage, selectImage, cancelCrop, cropAndUpload } = useArticleImage({
    onUploaded: url => change('image', url),
  });

  function previewArticle() {
    const previewData = {
      ...form,

      slug: createSlug(form.slug || form.title),

      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem('passport-article-preview', JSON.stringify(previewData));

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
      const result = await createArticle({
        ...form,

        ...getNormalizedArticleSeo(form),

        slug: createSlug(form.slug || form.title),
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

      window.localStorage.removeItem(ARTICLE_DRAFT_KEY);

      window.location.href = '/admin/articles';
    } catch (error) {
      console.error(error);

      alert('Не удалось сохранить статью.');

      savingRef.current = false;
      setSaving(false);
    }
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

        <h1>Новая статья</h1>

        <ArticleFormFields
          form={form}
          mode="create"
          onChange={change}
          onSlugChange={value => change('slug', createSlug(value))}
          onImageSelect={selectImage}
          slugPlaceholder={createSlug(form.title) || 'url-stati'}
        />

        <div className="admin-editor__actions">
          <button
            type="button"

            className="admin-button admin-button--preview"

            onClick={previewArticle}
          >
            Предпросмотр статьи
          </button>

          <button
            type="button"

            className="admin-button"

            onClick={save}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </>
  );
}
