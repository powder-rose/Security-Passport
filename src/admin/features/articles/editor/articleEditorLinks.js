export function getEditorLinks(editor) {
  if (!editor) {
    return [];
  }

  const links = [];

  editor.state.doc.descendants((node, position) => {
    if (!node.isText) {
      return;
    }

    const linkMark = node.marks.find(mark => mark.type.name === 'link');

    if (!linkMark) {
      return;
    }

    const href = String(linkMark.attrs?.href || '');
    const from = position;
    const to = position + node.nodeSize;
    const previous = links[links.length - 1];

    if (previous && previous.href === href && previous.to === from) {
      previous.to = to;
      previous.text += node.text || '';

      return;
    }

    links.push({
      href,
      text: node.text || '',
      from,
      to,
    });
  });

  return links;
}
