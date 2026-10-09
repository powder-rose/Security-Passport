import { useEffect, useMemo, useState } from 'react';

import { getDocumentation } from '../../api/adminApi';

import DocumentationMarkdown from './DocumentationMarkdown.jsx';

import './DocumentationPage.css';

function formatUpdatedAt(value) {
  if (!value) {
    return 'неизвестно';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'неизвестно';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',

    day: '2-digit',

    month: '2-digit',

    year: 'numeric',

    hour: '2-digit',

    minute: '2-digit',
  }).format(date);
}

function normalizeHeadingTitle(value) {
  return String(value || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim();
}

function createHeadingId(title, index) {
  const slug = normalizeHeadingTitle(title)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `documentation-${slug || `section-${index + 1}`}`;
}

function getDocumentationHeadings(markdown) {
  const lines = String(markdown || '')
    .replace(/\r\n?/g, '\n')
    .split('\n');

  const usedIds = new Map();

  const headings = [];

  lines.forEach((line, lineIndex) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);

    if (!match) {
      return;
    }

    const level = match[1].length;

    /*
     * В боковую навигацию берём только
     * основные уровни документации.
     *
     * H3-H6 продолжают отображаться
     * внутри документа, но не перегружают TOC.
     */
    if (level > 2) {
      return;
    }

    const title = normalizeHeadingTitle(match[2]);

    const baseId = createHeadingId(title, headings.length);

    const duplicateNumber = usedIds.get(baseId) || 0;

    usedIds.set(baseId, duplicateNumber + 1);

    const id = duplicateNumber ? `${baseId}-${duplicateNumber + 1}` : baseId;

    headings.push({
      id,
      title,
      level,
      lineIndex,
    });
  });

  return headings;
}

export default function DocumentationPage() {
  const [documentation, setDocumentation] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [navigationQuery, setNavigationQuery] = useState('');

  const [activeHeadingId, setActiveHeadingId] = useState('');

  async function loadDocumentation() {
    setLoading(true);
    setError('');

    try {
      const result = await getDocumentation();

      if (!result?.ok || typeof result.markdown !== 'string') {
        throw new Error(result?.error || 'DOCUMENTATION_LOAD_FAILED');
      }

      setDocumentation(result);
    } catch (loadError) {
      console.error(loadError);

      setError('Не удалось загрузить внутреннюю документацию.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocumentation();
  }, []);

  const headings = useMemo(
    () => getDocumentationHeadings(documentation?.markdown || ''),
    [documentation?.markdown],
  );

  const filteredHeadings = useMemo(() => {
    const query = navigationQuery.trim().toLowerCase();

    if (!query) {
      return headings;
    }

    return headings.filter(heading => heading.title.toLowerCase().includes(query));
  }, [headings, navigationQuery]);

  useEffect(() => {
    if (!headings.length) {
      setActiveHeadingId('');
      return undefined;
    }

    setActiveHeadingId(current => current || headings[0].id);

    function updateActiveHeading() {
      const offset = 150;

      let currentId = headings[0].id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);

        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= offset) {
          currentId = heading.id;
        } else {
          break;
        }
      }

      setActiveHeadingId(currentId);
    }

    updateActiveHeading();

    window.addEventListener('scroll', updateActiveHeading, {
      passive: true,
    });

    window.addEventListener('resize', updateActiveHeading);

    return () => {
      window.removeEventListener('scroll', updateActiveHeading);

      window.removeEventListener('resize', updateActiveHeading);
    };
  }, [headings]);

  if (loading && !documentation) {
    return <div className="documentation-state">Загрузка документации...</div>;
  }

  if (error && !documentation) {
    return (
      <div className="documentation-state documentation-state--error">
        <h2>Документация недоступна</h2>

        <p>{error}</p>

        <button type="button" onClick={loadDocumentation}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="documentation-page">
      <header className="documentation-header">
        <div>
          <p className="documentation-header__eyebrow">Внутренний handbook</p>

          <h1>Документация</h1>

          <p className="documentation-header__description">
            Архитектура проекта, правила разработки, SSR, SEO, API, QA, deployment и технический
            долг.
          </p>
        </div>

        <div className="documentation-header__meta">
          <span>{documentation?.filename || 'README.md'}</span>

          <strong>Обновлён {formatUpdatedAt(documentation?.updatedAt)}</strong>

          <button type="button" disabled={loading} onClick={loadDocumentation}>
            {loading ? 'Обновление...' : 'Обновить'}
          </button>
        </div>
      </header>

      {error ? <div className="documentation-warning">{error}</div> : null}

      <div className="documentation-layout">
        <aside className="documentation-nav">
          <div className="documentation-nav__head">
            <div>
              <span className="documentation-nav__eyebrow">Навигация</span>

              <h2>Содержание</h2>
            </div>

            <span className="documentation-nav__count">{headings.length}</span>
          </div>

          <label className="documentation-search">
            <span className="documentation-search__label">Поиск раздела</span>

            <input
              type="search"
              value={navigationQuery}
              placeholder="Например: SEO, BlogPage..."
              onChange={event => setNavigationQuery(event.target.value)}
            />
          </label>

          <nav className="documentation-toc" aria-label="Содержание документации">
            {filteredHeadings.length ? (
              filteredHeadings.map(heading => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={[
                    'documentation-toc__link',

                    heading.level === 2 ? 'documentation-toc__link--secondary' : '',

                    activeHeadingId === heading.id ? 'documentation-toc__link--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setActiveHeadingId(heading.id)}
                >
                  {heading.title}
                </a>
              ))
            ) : (
              <p className="documentation-toc__empty">Разделы не найдены.</p>
            )}
          </nav>
        </aside>

        <article className="documentation-content">
          <DocumentationMarkdown markdown={documentation?.markdown || ''} headings={headings} />
        </article>
      </div>
    </div>
  );
}
