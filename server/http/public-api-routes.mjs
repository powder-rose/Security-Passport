import process from 'node:process';

export function registerPublicApiRoutes({
  app,
  environment,
  leadDelivery,
  leadIntake,
  visitTracking,
  env = process.env,
}) {
  app.get('/api/geo', (_req, res) => {
    const baseDomain = String(env.BASE_DOMAIN || 'pasport-bezopasnosty.ru')
      .trim()
      .toLowerCase();

    return res.json({
      ok: true,
      kind: 'federal',
      reason: 'federal-only',

      detected: {
        country: null,
        city: null,
        subdivision: null,
      },

      location: {
        slug: 'russia',
        name: 'Россия',
        type: 'country',
      },

      targetOrigin: `https://${baseDomain}`,
    });
  });

  app.get('/api/health', (_req, res) => {
    return res.json({
      ok: true,
      service: 'passport-security-leads',
      environment,
      transports: leadDelivery.getTransportStatus(),
    });
  });

  app.post('/api/visits', visitTracking.handleVisit);

  app.post('/api/leads', leadIntake.rateLimit, leadIntake.handleLead);
}
