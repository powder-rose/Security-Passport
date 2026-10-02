export function getLocationText(city) {
  if (
    city.isDefault ||
    city.type === 'country'
  ) {
    return 'по России';
  }

  if (
    city.hasTrustedInflection &&
    !city.seoNeedsSubject
  ) {
    return city.locationPhrase;
  }

  return `в регионе: ${city.locationSeo}`;
}
