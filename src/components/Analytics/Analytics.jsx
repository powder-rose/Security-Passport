import { useEffect } from 'react';
import { captureAttribution } from '../../lib/attribution';
import { initYandexMetrica, trackNavigationClick } from '../../lib/analytics';

export default function Analytics() {
  useEffect(() => {
    captureAttribution();
    initYandexMetrica();
    document.addEventListener('click', trackNavigationClick);

    return () => {
      document.removeEventListener('click', trackNavigationClick);
    };
  }, []);

  return null;
}
