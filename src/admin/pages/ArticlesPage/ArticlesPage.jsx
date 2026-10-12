import { useEffect, useState } from 'react';

import { getArticles, deleteArticle, updateArticle } from '../../api/adminApi';
import { useArticleCategoryOptions } from '../../features/articles/hooks/useArticleCategoryOptions.js';
import { normalizeArticleCategory } from '../../features/articles/model/articleCategoryOptions.js';

import BlogPublicationStatus from './components/BlogPublicationStatus.jsx';
import useBlogPublication from './hooks/useBlogPublication.js';

function formatDate(date) {
  if (!date) {
    return '';
  }

  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [filter, setFilter] = useState('all');

  const { categoryOptions, rememberCategory } = useArticleCategoryOptions();

  const {
    publication,
    setPublication,
    retryPublication: retryPublicationRequest,
    retrying,
  } = useBlogPublication();

  async function loadArticles() {
    setLoading(true);
    setError('');

    try {
      const result = await getArticles();

      if (!result?.ok || !Array.isArray(result.articles)) {
        throw new Error(result?.error || 'ARTICLES_LOAD_FAILED');
      }

      setArticles(result.articles);
    } catch (loadError) {
      console.error(loadError);

      setError('Не удалось загрузить статьи.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);

  async function changeArticleCategory(id, category) {
    setUpdatingCategoryId(id);

    try {
      const result = await updateArticle(id, {
        category,
      });

      if (result?.ok && result.article) {
        setArticles(current =>
          current.map(article => (article.id === id ? result.article : article)),
        );

        rememberCategory(result.article.category);

        if (result.publication) {
          setPublication(result.publication);
        }

        return true;
      }

      alert('Не удалось изменить категорию статьи');

      return false;
    } catch {
      alert('Не удалось изменить категорию статьи');

      return false;
    } finally {
      setUpdatingCategoryId(null);
    }
  }

  async function removeArticle(id) {
    const ok = window.confirm('Удалить статью?');

    if (!ok) {
      return;
    }

    try {
      const result = await deleteArticle(id);

      if (!result?.ok) {
        alert('Не удалось удалить статью.');

        return;
      }

      if (result.publication) {
        setPublication(result.publication);
      }

      setArticles(current => current.filter(item => item.id !== id));
    } catch (deleteError) {
      console.error(deleteError);

      alert('Не удалось удалить статью.');
    }
  }

  async function retryPublication() {
    try {
      await retryPublicationRequest();
    } catch (error) {
      alert(error.message || 'Не удалось повторить публикацию');
    }
  }

  const filteredArticles = articles.filter(article => {
    if (filter === 'all') {
      return true;
    }

    return article.status === filter;
  });

  return (
    <div className="admin-page">
      <datalist id="admin-blog-category-options">
        {categoryOptions.map(category => (
          <option key={category} value={category} />
        ))}
      </datalist>

      <div className="admin-page-header">
        <h1>Статьи</h1>

        <div className="admin-filter-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            Все
          </button>

          <button
            className={filter === 'published' ? 'active' : ''}
            onClick={() => setFilter('published')}
          >
            Опубликованные
          </button>

          <button className={filter === 'draft' ? 'active' : ''} onClick={() => setFilter('draft')}>
            Черновики
          </button>
        </div>

        <div className="admin-articles-header-actions-wrap">
          <div className="admin-articles-header-actions">
            <a href="/admin/articles/new?fresh=1" className="admin-button">
              Создать статью
            </a>
          </div>
        </div>
      </div>

      <BlogPublicationStatus
        publication={publication}
        retrying={retrying}
        onRetry={retryPublication}
      />

      {loading ? (
        <div className="admin-empty">Загрузка...</div>
      ) : error ? (
        <div className="admin-empty">
          <p>{error}</p>

          <button type="button" className="admin-button-secondary" onClick={loadArticles}>
            Повторить
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="admin-empty">Статей пока нет</div>
      ) : (
        <div className="admin-articles-list">
          {filteredArticles.map(article => (
            <div key={article.id} className="admin-article-card">
              <div className="admin-article-image">
                {article.image ? (
                  <img
                    src={article.image}
                    alt="Превью изображения статьи"
                    width="320"
                    height="180"
                  />
                ) : (
                  <div className="admin-article-image-empty">Нет фото</div>
                )}
              </div>

              <div className="admin-article-info">
                <h3>{article.title}</h3>

                <span
                  className={
                    article.status === 'published'
                      ? 'admin-status admin-status--published'
                      : 'admin-status admin-status--draft'
                  }
                >
                  {article.status === 'published' ? 'Опубликовано' : 'Черновик'}
                </span>

                <label className="admin-article-category">
                  <span>Категория</span>

                  <input
                    type="text"
                    list="admin-blog-category-options"
                    defaultValue={normalizeArticleCategory(article.category)}
                    maxLength="80"
                    placeholder="Без категории"
                    autoComplete="off"
                    disabled={updatingCategoryId === article.id}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();

                        e.currentTarget.blur();
                      }
                    }}
                    onBlur={async e => {
                      const input = e.currentTarget;

                      const previous = normalizeArticleCategory(article.category);

                      const next = normalizeArticleCategory(input.value);

                      input.value = next;

                      if (next === previous) {
                        return;
                      }

                      const saved = await changeArticleCategory(article.id, next);

                      if (!saved) {
                        input.value = previous;
                      }
                    }}
                  />
                </label>

                <div className="admin-article-date">Создано: {formatDate(article.createdAt)}</div>
              </div>

              <div className="admin-article-actions">
                <a href={`/admin/articles/edit/${article.id}`} className="admin-button-secondary">
                  Редактировать
                </a>

                <button className="admin-button-danger" onClick={() => removeArticle(article.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
