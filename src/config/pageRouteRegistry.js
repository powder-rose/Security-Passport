export const pageModuleSources = Object.freeze({
  legal: 'src/pages/LegalPage/LegalPage.jsx',
  blog: 'src/pages/BlogPage/BlogPage.jsx',
  article: 'src/pages/ArticlePage/ArticlePage.jsx',
  genericObject: 'src/pages/ObjectTypePage/ObjectTypePage.jsx',
});

export const objectPageSources = Object.freeze({
  hotel: 'src/pages/HotelPage/HotelPage.jsx',
  culture: 'src/pages/CulturePage/CulturePage.jsx',
  education: 'src/pages/EducationPage/EducationPage.jsx',
  sport: 'src/pages/SportPage/SportPage.jsx',
  trade: 'src/pages/TradePage/TradePage.jsx',
  market: 'src/pages/MarketPage/MarketPage.jsx',
  water: 'src/pages/WaterPage/WaterPage.jsx',
  health: 'src/pages/HealthPage/HealthPage.jsx',
  crowd: 'src/pages/CrowdPage/CrowdPage.jsx',
  rosgvardia: 'src/pages/RosgvardiaPage/RosgvardiaPage.jsx',
  industry: 'src/pages/IndustryPage/IndustryPage.jsx',
  energy: 'src/pages/EnergyPage/EnergyPage.jsx',
  agriculture: 'src/pages/AgriculturePage/AgriculturePage.jsx',
  religion: 'src/pages/ReligiousPage/ReligiousPage.jsx',
});

export const servicePageSources = Object.freeze({
  'categorization-act': 'src/pages/CategorizationActPage/CategorizationActPage.jsx',

  'passport-actualization': 'src/pages/ActualizationPage/ActualizationPage.jsx',
});

export function getObjectPageSource(id) {
  return objectPageSources[id] ?? pageModuleSources.genericObject;
}

export function getServicePageSource(id) {
  return servicePageSources[id] ?? null;
}

export function getPageImportKey(source) {
  if (typeof source !== 'string' || !source.startsWith('src/pages/') || !source.endsWith('.jsx')) {
    throw new TypeError(`Invalid page module source: ${source}`);
  }

  return `./${source.slice(4)}`;
}
