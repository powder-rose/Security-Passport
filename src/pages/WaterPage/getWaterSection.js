import { waterSections } from './waterPageData';

export default function getWaterSection(id) {
  const section = waterSections.find(item => item.id === id);
  if (!section) throw new Error(`Unknown water section: ${id}`);
  return section;
}
