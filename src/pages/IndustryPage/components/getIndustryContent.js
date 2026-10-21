export function getIndustryContent(section) {
  const groups = [];

  for (const block of section.blocks) {
    if (block.type === 'heading' || groups.length === 0) {
      groups.push({ title: '', paragraphs: [] });
    }

    const group = groups[groups.length - 1];

    if (block.type === 'heading') {
      group.title = block.text;
    } else if (block.type === 'paragraph') {
      group.paragraphs.push(block.text);
    } else {
      group[block.type] = block;
    }
  }

  return groups;
}
