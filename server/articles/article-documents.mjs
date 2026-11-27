const DOCUMENT_SECTION = /<section\b([^>]*)>([\s\S]*?)<\/section>/gi;
const DOCUMENT_FLAG = /(?:^|\s)data-passport-document=(['"])1\1(?:\s|$)/i;
const DOCUMENT_TITLE = /(?:^|\s)data-title=(['"])(.*?)\1(?:\s|$)/i;

function decodeAttribute(value) {
  return String(value || '').replace(
    /&(?:amp|lt|gt|quot|apos|nbsp|#39|#(?:x[0-9a-f]+|[0-9]+));/gi,
    token => {
      const normalized = token.toLowerCase();
      const named = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': "'",
        '&nbsp;': ' ',
        '&#39;': "'",
      };
      if (Object.hasOwn(named, normalized)) return named[normalized];
      const number = normalized.startsWith('&#x')
        ? Number.parseInt(normalized.slice(3, -1), 16)
        : Number.parseInt(normalized.slice(2, -1), 10);
      return Number.isInteger(number) && number > 0 && number <= 0x10ffff
        ? String.fromCodePoint(number)
        : token;
    },
  );
}

export function getArticleDocument(article, documentIndex) {
  if (!article || article.status !== 'published' || !Number.isInteger(documentIndex)) return null;
  if (documentIndex < 1 || documentIndex > 1000) return null;

  let index = 0;

  for (const match of String(article.content || '').matchAll(DOCUMENT_SECTION)) {
    if (!DOCUMENT_FLAG.test(match[1])) continue;

    index += 1;
    if (index !== documentIndex) continue;

    const encodedTitle = DOCUMENT_TITLE.exec(match[1])?.[2] || 'Образец документа';
    const title = decodeAttribute(encodedTitle).trim().slice(0, 160);

    if (!match[2].replace(/<[^>]*>/g, '').trim()) return null;

    return {
      documentTitle: title || 'Образец документа',
      articleTitle: String(article.title || '').slice(0, 240),
      articleSlug: article.slug,
      documentIndex,
      articleUrl: `https://pasport-bezopasnosty.ru/blog/${encodeURIComponent(article.slug)}/#passport-document-${documentIndex}`,
    };
  }

  return null;
}
