import Container from '../../components/ui/Container/Container';
import { services } from '../../data/services';
import './RelatedServices.css';

function ServiceLink({ service, index }) {
  return (
    <a
      className="related-service"
      href={service.href}
      aria-label={`${service.title}. Подробнее об услуге`}
    >
      <span className="related-service__number" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="related-service__main">
        <span className="related-service__eyebrow">{service.eyebrow}</span>
        <span className="related-service__title">{service.title}</span>
      </span>

      <span className="related-service__description">{service.description}</span>

      <span className="related-service__arrow" aria-hidden="true">↗</span>
    </a>
  );
}

export default function RelatedServices() {
  return (
    <section className="related-services" id="services" aria-labelledby="related-services-title">
      <Container>
        <div className="related-services__heading">
          <div>
            <p className="related-services__kicker">Другие услуги</p>
            <h2 id="related-services-title">
              <span className="related-services__nowrap">Также помогаем с</span>
              <em>антитеррористической защищённостью</em>
            </h2>
          </div>

          <p className="related-services__lead">
            Помимо паспорта безопасности подготавливаем сопутствующие документы и обучаем
            ответственных работников. Услуги можно заказать отдельно или включить в общий проект.
          </p>
        </div>

        <nav className="related-services__list" aria-label="Другие услуги по антитеррористической защищённости">
          {services.map((service, index) => (
            <ServiceLink key={service.id} service={service} index={index} />
          ))}
        </nav>

        <div className="related-services__footer">
          <div>
            <p className="related-services__footer-kicker">Не знаете, какой комплект нужен?</p>
            <h3>Сначала определим задачу и не будем добавлять лишние документы</h3>
          </div>
          <a className="button button--primary related-services-task-button" href="#contact">
              <span className="related-services-task-button__label">Обсудить задачу</span>
              <span className="related-services-task-button__arrow" aria-hidden="true">↗</span>
            </a>
        </div>
      </Container>
    </section>
  );
}
