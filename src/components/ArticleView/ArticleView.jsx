import { useEffect, useState } from 'react';

import BlogQuestions from '../../features/questions/BlogQuestions.jsx';
import ArticleDocumentRequest from '../ArticleDocument/ArticleDocumentRequest.jsx';
import {
  renderArticleDocumentMarkup,
  plainDocumentText,
} from '../../features/articles/documents/articleDocumentMarkup.js';
import '../ArticleDocument/ArticleDocument.css';
import ArticleCallback from '../ArticleCallback/ArticleCallback.jsx';

import FinalCTA from '../../sections/FinalCTA/FinalCTA.jsx';

import { getArticleServices } from '../../data/articleServices.js';

import './ArticleView.css';

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

function formatArticleDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function splitArticleHtml(html) {
  const value = String(html || '').trim();

  if (!value) {
    return {
      contentBeforeCallback: '',
      contentAfterCallback: '',
      shouldShowCallback: false,
    };
  }

  const blocks = [];

  const tagPattern = /<\/?([a-z][\w:-]*)\b[^>]*>/gi;

  let match;
  let depth = 0;
  let blockStart = null;

  while ((match = tagPattern.exec(value))) {
    const token = match[0];

    const tag = match[1].toLowerCase();

    const closing = token.startsWith('</');

    const selfClosing = token.endsWith('/>') || VOID_TAGS.has(tag);

    if (!closing) {
      if (depth === 0 && blockStart === null) {
        blockStart = match.index;
      }

      if (!selfClosing) {
        depth += 1;
      } else if (depth === 0 && blockStart !== null) {
        blocks.push(value.slice(blockStart, tagPattern.lastIndex));

        blockStart = null;
      }

      continue;
    }

    depth = Math.max(0, depth - 1);

    if (depth === 0 && blockStart !== null) {
      blocks.push(value.slice(blockStart, tagPattern.lastIndex));

      blockStart = null;
    }
  }

  if (blockStart !== null) {
    blocks.push(value.slice(blockStart));
  }

  if (!blocks.length) {
    return {
      contentBeforeCallback: value,
      contentAfterCallback: '',
      shouldShowCallback: true,
    };
  }

  const safeHeadingIndexes = blocks
    .map((block, index) => {
      const isH2 = /^\s*<h2\b/i.test(block);

      if (!isH2 || index === 0) {
        return -1;
      }

      const previousBlock = blocks[index - 1] || '';

      const followsImage = /<(?:img|figure|picture)\b/i.test(previousBlock);

      return followsImage ? -1 : index;
    })
    .filter(index => index >= 0);

  if (!safeHeadingIndexes.length) {
    return {
      contentBeforeCallback: value,
      contentAfterCallback: '',
      shouldShowCallback: true,
    };
  }

  const targetIndex = Math.max(1, Math.ceil(blocks.length * 0.4));

  const headingAfterTarget = safeHeadingIndexes.find(index => index >= targetIndex);

  const splitIndex = headingAfterTarget ?? safeHeadingIndexes[safeHeadingIndexes.length - 1];

  return {
    contentBeforeCallback: blocks.slice(0, splitIndex).join('\n'),

    contentAfterCallback: blocks.slice(splitIndex).join('\n'),

    shouldShowCallback: true,
  };
}

/*
 * Public article HTML is sanitized on write and again when read from storage.
 * Preview HTML is produced by the authenticated article editor.
 * Keep React's raw-HTML escape hatch isolated in this component.
 */
/* eslint-disable @eslint-react/dom-no-dangerously-set-innerhtml */
function ArticleHtml({ className, html }) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
/* eslint-enable @eslint-react/dom-no-dangerously-set-innerhtml */

function RelatedServices({ article }) {
  const services = getArticleServices(article?.slug);

  return (
    <section className="article-related" aria-labelledby="article-services-title">
      <div className="article-related__head">
        <p>Услуги</p>

        <h2 id="article-services-title">По теме материала</h2>
      </div>

      <div className="article-services-grid">
        {services.map(service => (
          <a key={service.id} className="article-service-card" href={service.path}>
            <span className="article-service-card__index">Услуга</span>

            <h3>{service.title}</h3>

            <p>{service.description}</p>

            <span className="article-service-card__link">Подробнее →</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function RelatedArticles({ articles, currentArticle, preview }) {
  const items = articles
    .filter(item => item && item.id !== currentArticle?.id && item.slug !== currentArticle?.slug)
    .slice(0, 3);

  if (!items.length) {
    if (!preview) {
      return null;
    }

    return (
      <section className="article-related" aria-labelledby="article-related-title">
        <div className="article-related__head">
          <p>Читать дальше</p>

          <h2 id="article-related-title">Полезные статьи</h2>
        </div>

        <div className="article-related__empty">
          Когда появятся другие опубликованные статьи, здесь автоматически появятся до трёх похожих
          материалов.
        </div>
      </section>
    );
  }

  return (
    <section className="article-related" aria-labelledby="article-related-title">
      <div className="article-related__head">
        <p>Читать дальше</p>

        <h2 id="article-related-title">Полезные статьи</h2>
      </div>

      <div className="article-related-grid">
        {items.map(item => {
          const href = preview ? `/admin/articles/edit/${item.id}` : `/blog/${item.slug}/`;

          return (
            <a
              key={item.id || item.slug}
              className="article-related-card"
              href={href}
              target={preview ? '_blank' : undefined}
              rel={preview ? 'noopener noreferrer' : undefined}
            >
              <div className="article-related-card__image">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.imageAlt || item.title || ''}
                    width="640"
                    height="360"
                  />
                ) : (
                  <div className="article-related-card__placeholder">
                    <span>БОЙКОВГРУПП</span>
                  </div>
                )}
              </div>

              <div className="article-related-card__body">
                <h3>{item.title}</h3>

                <span>Читать →</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default function ArticleView({
  article,
  preview = false,
  relatedArticles = [],
  relatedQuestions = [],
}) {
  const title = article?.title || 'Заголовок статьи';

  const content = article?.content || '';

  const image = article?.image || '';

  const imageAlt = article?.imageAlt || title;

  const date = formatArticleDate(article?.publishedAt || article?.createdAt);
  const [documentRequest, setDocumentRequest] = useState(null);
  const [copyAllowed, setCopyAllowed] = useState(preview);

  useEffect(() => {
    if (preview || !content.includes('data-passport-document')) return undefined;

    const controller = new AbortController();
    fetch('/api/admin/session', {
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(response => response.ok)
      .then(setCopyAllowed)
      .catch(() => setCopyAllowed(false));

    return () => controller.abort();
  }, [preview, content]);

  const displayedContent = renderArticleDocumentMarkup(content, copyAllowed);
  const { contentBeforeCallback, contentAfterCallback, shouldShowCallback } =
    splitArticleHtml(displayedContent);

  function selectionTouchesProtectedDocument(event) {
    if (copyAllowed) return false;
    if (event.target?.closest?.('.passport-document[data-document-access="visitor"]')) return true;
    const selection = document.getSelection();
    if (!selection || selection.isCollapsed) return false;
    const cards = event.currentTarget.querySelectorAll(
      '.passport-document[data-document-access="visitor"]',
    );
    return Array.from(cards).some(card => {
      for (let index = 0; index < selection.rangeCount; index += 1) {
        if (selection.getRangeAt(index).intersectsNode(card)) return true;
      }
      return false;
    });
  }

  function preventDocumentCopy(event) {
    if (selectionTouchesProtectedDocument(event)) event.preventDefault();
  }

  async function handleDocumentAction(event) {
    const button = event.target?.closest?.('[data-document-request], [data-document-copy]');
    if (!button) return;

    const card = button.closest('.passport-document');
    if (!card) return;

    const index = Number(card.dataset.documentIndex);
    if (!Number.isInteger(index) || index < 1) return;

    if (button.hasAttribute('data-document-request')) {
      event.preventDefault();
      setDocumentRequest({ index, title: card.dataset.title || 'Образец документа' });
      return;
    }

    if (!copyAllowed || !button.hasAttribute('data-document-copy')) return;
    const body = card.querySelector('[data-document-body]');
    const status = card.querySelector('.passport-document__status');
    if (!body || !status) return;

    const text = plainDocumentText(body)
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (!text) {
      status.textContent = 'В образце пока нет текста.';
      return;
    }

    button.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      status.textContent = 'Текст документа скопирован.';
    } catch {
      card.querySelector('details').open = true;
      const range = document.createRange();
      range.selectNodeContents(body);
      const selection = document.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      status.textContent = 'Текст выделен — нажмите Ctrl+C.';
    } finally {
      button.disabled = false;
    }
  }

  return (
    <>
      <main id="main-content" className="article-view">
        <article
          className="article-view__article"
          onClick={handleDocumentAction}
          onCopyCapture={preventDocumentCopy}
          onCutCapture={preventDocumentCopy}
          onContextMenuCapture={preventDocumentCopy}
          onDragStartCapture={preventDocumentCopy}
        >
          <header className="article-view__header">
            {preview && <div className="article-view__preview-badge">Предпросмотр</div>}

            <div className="article-view__eyebrow">
              БОЙКОВГРУПП
              <span aria-hidden="true">·</span>
              Статьи
            </div>

            <h1 className="article-view__title">{title}</h1>

            {date && <time className="article-view__date">{date}</time>}
          </header>

          {image && (
            <figure className="article-view__hero">
              <img src={image} alt={imageAlt} width="1200" height="675" />
            </figure>
          )}

          {contentBeforeCallback && (
            <ArticleHtml className="article-view__content" html={contentBeforeCallback} />
          )}

          {shouldShowCallback && <ArticleCallback article={article} preview={preview} />}

          {contentAfterCallback && (
            <ArticleHtml className="article-view__content" html={contentAfterCallback} />
          )}

          {!content && <div className="article-view__empty">Здесь появится текст статьи.</div>}

          {documentRequest && (
            <ArticleDocumentRequest
              key={documentRequest.index}
              article={article}
              document={documentRequest}
              preview={preview}
              onClose={() => setDocumentRequest(null)}
            />
          )}
        </article>

        <div className="article-view__recommendations">
          <RelatedServices article={article} />

          <RelatedArticles articles={relatedArticles} currentArticle={article} preview={preview} />

          <BlogQuestions questions={relatedQuestions} />
        </div>
      </main>

      <FinalCTA preview={preview} />
    </>
  );
}
