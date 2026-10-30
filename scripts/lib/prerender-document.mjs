export function createPrerenderDocument({ template, result, cssTags, data, bootstrapKey }) {
  let document = template
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']robots["'][^>]*>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/i, '');

  const head = [
    result.helmet?.title?.toString() || '',
    result.helmet?.meta?.toString() || '',
    result.helmet?.link?.toString() || '',
    cssTags,
    result.helmet?.script?.toString() || '',
  ]
    .filter(Boolean)
    .join('\n');
  const serialized = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  document = document
    .replace('</head>', `${head}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${result.html}</div>`)
    .replace('</body>', `<script>window.${bootstrapKey}=${serialized};</script>\n</body>`);

  if (Buffer.byteLength(document, 'utf8') > 2_000_000) {
    const label = bootstrapKey === '__PASSPORT_BLOG__' ? 'Blog' : 'Question';
    throw new Error(
      `${label} HTML exceeds the 2,000,000-byte limit. Reduce article or bootstrap data.`,
    );
  }
  return document;
}
