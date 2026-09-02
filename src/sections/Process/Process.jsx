import { useEffect, useRef, useState } from 'react';
import Container from '../../components/ui/Container/Container';
import { DocumentFlowIllustration } from '../../components/illustrations/BlushIllustrations';
import './Process.css';

const processSteps = [
  {
    number: '01',
    title: 'Собираем исходные данные',
    text: 'Запрашиваем сведения об объекте, назначении помещений, режиме работы, количестве посетителей и сотрудников, охране и уже действующих мерах защиты.',
    meta: 'Старт проекта',
  },
  {
    number: '02',
    title: 'Разрабатываем документацию',
    text: 'Готовим комплект документов и исходных материалов, необходимых для обследования, категорирования и последующего оформления паспорта безопасности.',
    meta: 'Подготовка документов',
  },
  {
    number: '03',
    title: 'Участвуем в категорировании',
    text: 'Участвуем в обследовании объекта и работе комиссии, анализируем потенциальные угрозы и уязвимые места, помогаем определить категорию объекта.',
    meta: 'Категорирование',
  },
  {
    number: '04',
    title: 'Оформляем паспорт безопасности',
    text: 'На основании результатов обследования и категорирования оформляем паспорт безопасности с характеристиками объекта и предусмотренными мерами защиты.',
    meta: 'Оформление паспорта',
  },
  {
    number: '05',
    title: 'Сопровождаем согласование',
    text: 'Помогаем пройти процедуру согласования в уполномоченных органах, отрабатываем замечания и доводим документ до утверждения в установленном порядке.',
    meta: 'До результата',
  },
];

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const markers = stepRefs.current.filter(Boolean);
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
      (entries) => {
        const centeredMarker = entries.find((entry) => entry.isIntersecting);

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

    markers.forEach((marker) => observer.observe(marker));
    window.addEventListener('resize', setNearestStep);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', setNearestStep);
    };
  }, []);

  return (
    <section className="process-section" id="process" aria-labelledby="process-title">
      <Container className="process-section__layout">
        <div className="process-section__intro">
          <p className="process-section__kicker">Разработка паспорта безопасности</p>
          <h2 id="process-title">Как проходит подготовка документа</h2>
          <p className="process-section__lead">
            Сначала разбираемся с объектом и исходными сведениями, затем готовим документ и
            сопровождаем его до согласования. Каждый этап связан с предыдущим — без лишней
            передачи задачи между исполнителями.
          </p>

          <div className="process-section__illustration" aria-hidden="true">
            <DocumentFlowIllustration />
          </div>

          <div className="process-section__summary" aria-label="Кратко о процессе">
            <span className="process-section__summary-count">5</span>
            <div>
              <strong>последовательных этапов</strong>
              <span>от исходных данных до согласования</span>
            </div>
          </div>
        </div>

        <ol className="process-steps">
          {processSteps.map((step, index) => (
            <li
              className={`process-step${activeStep === index ? ' process-step--active' : ''}`}
              key={step.number}
            >
              <div className="process-step__rail" aria-hidden="true">
                <span className="process-step__dot">{step.number}</span>
                {index < processSteps.length - 1 ? <span className="process-step__line" /> : null}
              </div>

              <article className="process-step__content">
                <span
                  className="process-step__observer"
                  data-step-index={index}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  aria-hidden="true"
                />
                <div className="process-step__topline">
                  <span>{step.meta}</span>
                  <span aria-hidden="true">↘</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            </li>
          ))}
        </ol>
      </Container>

      <Container>
        <div className="process-section__cta">
          <div>
            <p className="process-section__cta-kicker">Нужно подготовить паспорт безопасности?</p>
            <h3>Проверим объект и определим состав работ до старта</h3>
          </div>
          <a className="button button--primary" href="#contact">
            Рассчитать стоимость
          </a>
        </div>
      </Container>
    </section>
  );
}
