export function createStableEntries(values, prefix = 'item') {
  const occurrences = new Map();

  return values.map(value => {
    const text = String(value);

    const occurrence = (occurrences.get(text) || 0) + 1;

    occurrences.set(text, occurrence);

    return {
      key: `${prefix}-${text}-${occurrence}`,
      value,
    };
  });
}
