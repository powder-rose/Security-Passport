import {
  useEffect,
} from 'react';


export default function useActualizationTimeline() {
  useEffect(() => {
    const items =
      Array.from(
        document.querySelectorAll(
          '.actualization-work__timeline li',
        ),
      );

    if (!items.length) {
      return undefined;
    }

    if (
      !('IntersectionObserver' in window)
    ) {
      items.forEach(
        (item) => {
          item.classList.add('is-active');
        },
      );

      return undefined;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add(
                'is-active',
              );

              observer.unobserve(
                entry.target,
              );
            },
          );
        },
        {
          threshold: 0.42,
          rootMargin:
            '0px 0px -18% 0px',
        },
      );

    items.forEach(
      (item) => {
        observer.observe(item);
      },
    );

    return () => {
      observer.disconnect();
    };
  }, []);
}
