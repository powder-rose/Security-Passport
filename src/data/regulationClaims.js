import registry from '../../data/regulations.json';

export function getRegulationClaim(number, id) {
  const regulation = registry.items.find(
    item => String(item.number) === String(number)
  );
  const claim = regulation?.claims?.find(item => item.id === id);
  if (!claim || typeof claim.text !== 'string' || !claim.text.trim()) {
    throw new Error(`Missing regulation claim: ${number}/${id}`);
  }
  return claim.text;
}
