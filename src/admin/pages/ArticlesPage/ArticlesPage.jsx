import { useEffect, useState } from 'react';

import { getArticles, deleteArticle, updateArticle } from '../../api/adminApi';

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

  const [filter, setFilter] = useState('all');

  async function loadArticles() {
    setLoading(true);

    const result = await getArticles();

    setArticles(result.articles || []);

    setLoading(false);
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

    await deleteArticle(id);

    setArticles(articles.filter(item => item.id !== id));
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
        {BLOG_CATEGORIES.map(category => (
          <option key={category.id} value={category.label} />
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

      {loading ? (
        <div className="admin-empty">Загрузка...</div>
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
                    defaultValue={getEditableCategory(article.category)}
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

                      const previous = getEditableCategory(article.category);

                      const next = input.value.replace(/\s+/g, ' ').trim();

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
