import { useEffect, useRef, useState } from 'react';
import './Process.css';

export default function ProcessSteps({ steps }) {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef([]);

  useEffect(() => {
    const markers = stepsRef.current.filter(Boolean);
    if (!markers.length) return undefined;

    const setNearestStep = () => {
      const viewportCenter = window.innerHeight / 2;
      const nearestMarker = markers.reduce((nearest, marker) => {
        const markerCenter = marker.getBoundingClientRect().top;
        const distance = Math.abs(markerCenter - viewportCenter);

        if (!nearest || distance < nearest.distance) {
          return { marker, distance };
        }

        return nearest;
      }, null);

      if (nearestMarker) {
        setActiveStep(Number(nearestMarker.marker.dataset.stepIndex));
      }
    };

    setNearestStep();

    if (typeof IntersectionObserver === 'undefined') {
      window.addEventListener('scroll', setNearestStep, { passive: true });
      window.addEventListener('resize', setNearestStep);

      return () => {
        window.removeEventListener('scroll', setNearestStep);
        window.removeEventListener('resize', setNearestStep);
      };
    }

    const observer = new IntersectionObserver(
      entries => {
        const centeredMarker = entries.find(entry => entry.isIntersecting);

        if (centeredMarker) {
          setActiveStep(Number(centeredMarker.target.dataset.stepIndex));
        }
      },
      {
        root: null,
        rootMargin: '-48% 0px -48% 0px',
        threshold: 0,
      },
    );

    markers.forEach(marker => observer.observe(marker));
    window.addEventListener('resize', setNearestStep);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', setNearestStep);
    };
  }, []);

  return (
    <ol className="process-steps">
      {steps.map((step, index) => (
        <li
          className={`process-step${activeStep === index ? ' process-step--active' : ''}`}
          key={step.number}
        >
          <div className="process-step__rail" aria-hidden="true">
            <span className="process-step__dot">{step.number}</span>
            {index < steps.length - 1 ? <span className="process-step__line" /> : null}
          </div>

          <article className="process-step__content">
            <span
              className="process-step__observer"
              data-step-index={index}
              ref={node => {
                stepsRef.current[index] = node;
              }}
              aria-hidden="true"
            />
            {step.meta ? (
              <div className="process-step__topline">
                <span>{step.meta}</span>
                <span aria-hidden="true">↘</span>
              </div>
            ) : null}
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        </li>
      ))}
    </ol>
  );
}
