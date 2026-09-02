import { useEffect } from 'react';
import { captureAttribution } from '../../lib/attribution';
import { trackVisit } from '../../lib/visits';
import { initYandexMetrica, trackNavigationClick } from '../../lib/analytics';

export default function Analytics() {
  useEffect(() => {
    captureAttribution();
    trackVisit();
    initYandexMetrica();
    document.addEventListener('click', trackNavigationClick);

    return () => {
      document.removeEventListener('click', trackNavigationClick);
    };
  }, []);

  return null;
}
