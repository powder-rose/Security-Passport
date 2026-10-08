import assert from 'node:assert/strict';
import test from 'node:test';

import { sanitizeArticleContent } from '../../server/articles/article-html.mjs';

test('article sanitizer preserves supported article markup', () => {
  const input = `
    <h2 class="article-heading">Заголовок</h2>
    <p class="article-text">
      Текст <strong>жирный</strong> и <em>курсив</em>.
    </p>
    <a
      href="https://example.com/document"
      target="_blank"
      rel="noopener noreferrer"
      title="Документ"
    >
      Ссылка
    </a>
    <img
      src="https://example.com/image.webp"
      alt="Изображение"
      width="1200"
      height="800"
      loading="lazy"
      decoding="async"
    >
  `;

  const result = sanitizeArticleContent(input);

  assert.match(result, /<h2 class="article-heading">Заголовок<\/h2>/);

  assert.match(
    result,
    /<p class="article-text">\s*Текст <strong>жирный<\/strong> и <em>курсив<\/em>\.\s*<\/p>/,
  );

  assert.match(result, /href="https:\/\/example\.com\/document"/);
  assert.match(result, /target="_blank"/);
  assert.match(result, /rel="noopener noreferrer"/);
  assert.match(result, /title="Документ"/);

  assert.match(result, /src="https:\/\/example\.com\/image\.webp"/);
  assert.match(result, /alt="Изображение"/);
  assert.match(result, /width="1200"/);
  assert.match(result, /height="800"/);
  assert.match(result, /loading="lazy"/);
  assert.match(result, /decoding="async"/);
});

test('article sanitizer removes executable HTML and unsafe URL schemes', () => {
  const input = `
    <script>alert('xss')</script>

    <p onclick="alert('xss')">
      Безопасный текст
    </p>

    <a href="javascript:alert('xss')" onmouseover="alert('xss')">
      Опасная ссылка
    </a>

    <img
      src="javascript:alert('xss')"
      onerror="alert('xss')"
      alt="test"
    >

    <iframe src="https://example.com"></iframe>
  `;

  const result = sanitizeArticleContent(input);

  assert.doesNotMatch(result, /<script/i);
  assert.doesNotMatch(result, /alert\('xss'\)/i);
  assert.doesNotMatch(result, /onclick=/i);
  assert.doesNotMatch(result, /onmouseover=/i);
  assert.doesNotMatch(result, /onerror=/i);
  assert.doesNotMatch(result, /javascript:/i);
  assert.doesNotMatch(result, /<iframe/i);

  assert.match(result, /Безопасный текст/);
  assert.match(result, /Опасная ссылка/);
  assert.match(result, /alt="test"/);
});

test('article sanitizer rejects protocol-relative URLs', () => {
  const input = `
    <a href="//example.com/document">Ссылка</a>
    <img src="//example.com/image.webp" alt="Изображение">
  `;

  const result = sanitizeArticleContent(input);

  assert.doesNotMatch(result, /href="\/\/example\.com/);
  assert.doesNotMatch(result, /src="\/\/example\.com/);

  assert.match(result, /<a>Ссылка<\/a>/);
  assert.match(result, /<img alt="Изображение" \/>/);
});

test('article sanitizer keeps only whitelisted table styles', () => {
  const input = `
    <table style="width: 100%; position: fixed; color: red;">
      <tbody>
        <tr>
          <th style="width: 120px; text-align: center; color: red;">
            Заголовок
          </th>
          <td style="min-width: 10rem; vertical-align: top; background: red;">
            Значение
          </td>
        </tr>
      </tbody>
    </table>
  `;

  const result = sanitizeArticleContent(input);

  assert.match(result, /width:\s*100%/i);
  assert.match(result, /width:\s*120px/i);
  assert.match(result, /text-align:\s*center/i);
  assert.match(result, /min-width:\s*10rem/i);
  assert.match(result, /vertical-align:\s*top/i);

  assert.doesNotMatch(result, /position:/i);
  assert.doesNotMatch(result, /color:/i);
  assert.doesNotMatch(result, /background:/i);
});

test('article sanitizer converts nullish values to empty HTML', () => {
  assert.equal(sanitizeArticleContent(null), '');
  assert.equal(sanitizeArticleContent(undefined), '');
});
