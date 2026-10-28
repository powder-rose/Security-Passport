import { marketSections } from './marketPageData';

export default function getMarketSection(id) {
  const section = marketSections.find(item => item.id === id);

  if (!section) {
    throw new Error(`Unknown market section: ${id}`);
  }

  return section;
}
