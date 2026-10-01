import {
  useEffect,
  useState,
} from 'react';

import {
  getDocumentation,
} from '../../api/adminApi';

import DocumentationMarkdown
from './DocumentationMarkdown.jsx';

import './DocumentationPage.css';


function formatUpdatedAt(value) {
  if (!value) {
    return 'неизвестно';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'неизвестно';
  }

  return new Intl.DateTimeFormat(
    'ru-RU',
    {
      timeZone:
        'Europe/Moscow',

      day:
        '2-digit',

      month:
        '2-digit',

      year:
        'numeric',

      hour:
        '2-digit',

      minute:
        '2-digit',
    },
  ).format(date);
}


export default function DocumentationPage() {
  const [
    documentation,
    setDocumentation,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');


  async function loadDocumentation() {
    setLoading(true);
    setError('');

    try {
      const result =
        await getDocumentation();

      if (
        !result?.ok ||
        typeof result.markdown !==
          'string'
      ) {
        throw new Error(
          result?.error ||
          'DOCUMENTATION_LOAD_FAILED',
        );
      }

      setDocumentation(
        result,
      );
    } catch (loadError) {
      console.error(
        loadError,
      );

      setError(
        'Не удалось загрузить внутреннюю документацию.',
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(
    () => {
      loadDocumentation();
    },
    [],
  );


  if (
    loading &&
    !documentation
  ) {
    return (
      <div className="documentation-state">
        Загрузка документации...
      </div>
    );
  }


  if (
    error &&
    !documentation
  ) {
    return (
      <div className="documentation-state documentation-state--error">
        <h2>
          Документация недоступна
        </h2>

        <p>
          {error}
        </p>

        <button
          type="button"
          onClick={
            loadDocumentation
          }
        >
          Повторить
        </button>
      </div>
    );
  }


  return (
    <div className="documentation-page">

      <header className="documentation-header">

        <div>
          <p className="documentation-header__eyebrow">
            Внутренний handbook
          </p>

          <h1>
            Документация
          </h1>

          <p className="documentation-header__description">
            Архитектура проекта, правила
            разработки, SSR, SEO, API,
            QA, deployment и технический долг.
          </p>
        </div>


        <div className="documentation-header__meta">
          <span>
            README_DEV.md
          </span>

          <strong>
            Обновлён{' '}
            {formatUpdatedAt(
              documentation
                ?.updatedAt,
            )}
          </strong>

          <button
            type="button"
            disabled={loading}
            onClick={
              loadDocumentation
            }
          >
            {loading
              ? 'Обновление...'
              : 'Обновить'}
          </button>
        </div>

      </header>


      {error ? (
        <div className="documentation-warning">
          {error}
        </div>
      ) : null}


      <article className="documentation-content">
        <DocumentationMarkdown
          markdown={
            documentation
              ?.markdown ||
            ''
          }
        />
      </article>

    </div>
  );
}
