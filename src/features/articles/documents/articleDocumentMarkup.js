const DOCUMENT_SECTION = /<section\b([^>]*)>([\s\S]*?)<\/section>/gi;
const DOCUMENT_FLAG = /(?:^|\s)data-passport-document=(['"])1\1(?:\s|$)/i;
const DOCUMENT_TITLE = /(?:^|\s)data-title=(['"])(.*?)\1(?:\s|$)/i;

export function renderArticleDocumentMarkup(value, copyAllowed = false) {
  let index = 0;

  return String(value || '').replace(DOCUMENT_SECTION, (original, attributes, body) => {
    if (!DOCUMENT_FLAG.test(attributes)) return original;

    index += 1;
    const title = DOCUMENT_TITLE.exec(attributes)?.[2] || 'Образец документа';
    const id = `passport-document-${index}`;
    const documentMode = copyAllowed ? 'editor' : 'visitor';
    const copy = copyAllowed
      ? '<button type="button" class="passport-document__copy" data-document-copy>Скопировать образец</button>'
      : '';
    const request = copyAllowed
      ? ''
      : `<a href="tel:+78002012043" class="passport-document__request" data-document-request="${index}">Запросить документ <span aria-hidden="true">↗</span></a>`;

    return (
      `<section class="passport-document" id="${id}" data-document-index="${index}" data-document-access="${documentMode}" data-title="${title}">` +
      '<header class="passport-document__head">' +
      '<span class="passport-document__icon" aria-hidden="true"></span>' +
      `<div class="passport-document__heading"><span class="passport-document__eyebrow">Образец документа</span><p class="passport-document__title">${title}</p></div>` +
      `<div class="passport-document__action">${request}${copy}</div></header>` +
      '<details class="passport-document__details">' +
      '<summary><span class="passport-document__show">Открыть образец</span>' +
      '<span class="passport-document__hide">Скрыть образец</span><span class="passport-document__plus" aria-hidden="true"></span></summary>' +
      `<div class="passport-document__body" data-document-body>${body}</div></details>` +
      '<p class="passport-document__status" role="status" aria-live="polite"></p></section>'
    );
  });
}

export function plainDocumentText(node) {
  if (node.nodeType === 3) return node.nodeValue || '';
  if (node.nodeType !== 1) {
    return Array.from(node.childNodes).map(plainDocumentText).join('');
  }

  const tag = node.tagName.toLowerCase();
  if (tag === 'br') return '\n';

  const text = Array.from(node.childNodes).map(plainDocumentText).join('');

  if (tag === 'li') {
    const list = node.parentElement;
    const index = list ? Array.from(list.children).indexOf(node) : 0;
    const start = Number(list?.getAttribute('start') || 1);
    return `${list?.tagName === 'OL' ? `${start + index}.` : '•'} ${text.trim()}\n`;
  }

  if (tag === 'td' || tag === 'th') return `${text.trim()}\t`;
  if (tag === 'tr') return `${text.replace(/\t$/, '')}\n`;

  return text + (/^(p|h[1-6]|ul|ol|blockquote|table|pre)$/.test(tag) ? '\n\n' : '');
}
