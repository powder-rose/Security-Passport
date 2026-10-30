import { questionText } from '../../../shared/contracts/questions.js';

export function questionHeadings(content) {
  const headings = [];
  const html = String(content || '').replace(
    /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_tag, level, text) => {
      const id = `question-section-${headings.length + 1}`;
      headings.push({ id, level: Number(level), text: questionText(text) });
      return `<h${level} id="${id}">${text}</h${level}>`;
    },
  );
  return { html, headings };
}

// Rich text is sanitized on server writes, reads and preview restoration.
// Keep the raw HTML boundary isolated from the rest of the question template.
/* eslint-disable @eslint-react/dom-no-dangerously-set-innerhtml */
export default function QuestionContent({ html }) {
  return <div className="question-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
/* eslint-enable @eslint-react/dom-no-dangerously-set-innerhtml */
