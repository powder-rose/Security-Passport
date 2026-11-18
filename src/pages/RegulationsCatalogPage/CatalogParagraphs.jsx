export default function CatalogParagraphs({ text }) {
  return text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(paragraph => <p key={paragraph}>{paragraph}</p>);
}
