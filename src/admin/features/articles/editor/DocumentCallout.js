import { Node } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';

export const DocumentCallout = Node.create({
  name: 'documentCallout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      title: {
        default: 'Образец документа',
        parseHTML: element => element.getAttribute('data-title') || 'Образец документа',
        renderHTML: attributes => ({ 'data-title': attributes.title }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'section[data-passport-document="1"]',
        contentElement: element =>
          element.querySelector(':scope > details > [data-document-body]') || element,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', { ...HTMLAttributes, 'data-passport-document': '1' }, 0];
  },
});

export function getDocumentTarget(editor) {
  const { selection } = editor.state;
  const { $from } = selection;

  if (selection instanceof NodeSelection && selection.node.type.name === 'documentCallout') {
    return {
      from: selection.from,
      to: selection.to,
      kind: 'documentCallout',
      title: selection.node.attrs.title,
    };
  }

  for (let depth = $from.depth; depth > 0; depth -= 1) {
    const node = $from.node(depth);

    if (node.type.name === 'documentCallout' || node.type.name === 'blockquote') {
      return {
        from: $from.before(depth),
        to: $from.after(depth),
        kind: node.type.name,
        title: node.type.name === 'documentCallout' ? node.attrs.title : 'Образец документа',
      };
    }
  }

  return null;
}

export function applyDocumentCallout(editor, title, selection, target) {
  const attrs = { title: title.trim().slice(0, 160) || 'Образец документа' };

  if (target) {
    const node = editor.state.doc.nodeAt(target.from);

    if (!node || node.type.name !== target.kind) return false;

    return editor
      .chain()
      .focus()
      .insertContentAt(
        { from: target.from, to: target.to },
        {
          type: 'documentCallout',
          attrs,
          content: node.toJSON().content || [{ type: 'paragraph' }],
        },
      )
      .run();
  }

  if (selection.from !== selection.to) {
    return editor
      .chain()
      .focus()
      .setTextSelection(selection)
      .wrapIn('documentCallout', attrs)
      .run();
  }

  return editor
    .chain()
    .focus()
    .setTextSelection(selection.from)
    .insertContent({ type: 'documentCallout', attrs, content: [{ type: 'paragraph' }] })
    .run();
}

export function unwrapDocumentCallout(editor, target) {
  const node = editor.state.doc.nodeAt(target.from);

  if (!node || node.type.name !== 'documentCallout') return false;

  return editor
    .chain()
    .focus()
    .insertContentAt(
      { from: target.from, to: target.to },
      node.toJSON().content || [{ type: 'paragraph' }],
    )
    .run();
}
