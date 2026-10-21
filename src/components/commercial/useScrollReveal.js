import { useEffect, useRef } from 'react';
import './ScrollReveal.css';

export default function useScrollReveal() {
  const pageRef = useRef(null);

  useEffect(() => {
    if (
      !pageRef.current ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const elements = pageRef.current.querySelectorAll('[data-scroll-reveal]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.setAttribute('data-scroll-visible', '');
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
