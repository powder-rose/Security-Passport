import { useEffect, useRef } from 'react';

export default function useIndustryMotion() {
  const pageRef = useRef(null);

  useEffect(() => {
    if (
      !pageRef.current ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const elements = pageRef.current.querySelectorAll('[data-industry-reveal]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.setAttribute('data-industry-visible', '');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
    );

    elements.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return pageRef;
}
