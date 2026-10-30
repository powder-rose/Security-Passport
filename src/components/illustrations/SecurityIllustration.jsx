import './SecurityIllustration.css';

const illustrationSources = {
  hotel: '/images/illustrations/hotel.webp',
  education: '/images/illustrations/education.webp',
  culture: '/images/illustrations/culture.webp',
  trade: '/images/illustrations/trade.webp',
  market: '/images/illustrations/overview.webp',
  water: '/images/illustrations/overview.webp',
  sport: '/images/illustrations/sport.webp',
  health: '/images/illustrations/health.webp',
  crowd: '/images/illustrations/crowd.webp',
  rosgvardia: '/images/illustrations/overview.webp',
  industry: '/images/illustrations/industry.webp',
  energy: '/images/illustrations/energy.webp',
  agriculture: '/images/illustrations/agriculture.webp',
  religion: '/images/illustrations/religion.webp',
  social: '/images/illustrations/social.webp',
  act: '/images/illustrations/inspection-act.webp',
  passport: '/images/illustrations/security-passport.webp',
  overview: '/images/illustrations/overview.webp',
};

export default function SecurityIllustration({ variant = 'overview', title = '' }) {
  return (
    <img
      className="security-illustration"
      src={illustrationSources[variant] || illustrationSources.overview}
      alt={title}
      width="1254"
      height="1254"
      loading="lazy"
      decoding="async"
    />
  );
}
