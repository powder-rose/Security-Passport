const BOT_USER_AGENT_PATTERN =
  /googlebot|googleother|google-inspectiontool|adsbot-google|mediapartners-google|bingbot|bingpreview|yandexbot|yandexrenderresourcesbot|yandexuserproxy|applebot|baiduspider|duckduckbot|slurp|petalbot|bytespider|ahrefsbot|semrushbot|mj12bot|dotbot|oai-searchbot|gptbot|chatgpt-user|claudebot|claude-web|perplexitybot|facebookexternalhit|facebot|twitterbot|linkedinbot|telegrambot|discordbot|dataprovider|chrome-lighthouse|lighthouse|headlesschrome|crawler|spider|scrapy|uptimerobot|statuscake|pingdom|python-requests|curl\/|wget\/|go-http-client|node-fetch|undici|bot\b/i;


export function isBotUserAgent(value = '') {
  const userAgent =
    String(value)
      .trim();

  /*
   * Обычный браузер при запросе /api/visits
   * передаёт User-Agent.
   *
   * Запрос без User-Agent для внутренней
   * статистики считаем автоматическим.
   */
  if (!userAgent) {
    return true;
  }

  return BOT_USER_AGENT_PATTERN.test(
    userAgent,
  );
}


export function isBotVisit(visit) {
  return isBotUserAgent(
    visit?.meta?.userAgent || '',
  );
}
