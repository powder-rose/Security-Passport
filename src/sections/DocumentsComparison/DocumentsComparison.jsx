import Container from '../../components/ui/Container/Container';
import { DocumentFlowIllustration, ShieldBuildingIllustration } from '../../components/illustrations/BlushIllustrations';
import './DocumentsComparison.css';

const actPoints = [
  'Оформляется по итогам обследования объекта и работы комиссии.',
  'Фиксирует категорию, присвоенную объекту по результатам обследования.',
  'Подписывается членами комиссии, участвовавшими в категорировании.',
  'Становится основанием для последующей разработки паспорта.',
];

const passportPoints = [
  'Разрабатывается с учётом результатов категорирования и сведений из акта.',
  'Содержит характеристики объекта, возможные угрозы и действующие меры защиты.',
  'Утверждается и согласуется в порядке, установленном применимым постановлением.',
  'Не заменяет акт обследования и не отменяет необходимость работы комиссии.',
];

function DocumentCard({
  type,
  label,
  title,
  points,
  actionLabel,
  actionHref = '#contact',
  actionAriaLabel,
  variant = 'light',
  illustration,
}) {
  return (
    <article className={`document-card document-card--${variant}`}>
      <div className="document-card__top">
        <span className="document-card__type" aria-hidden="true">{type}</span>
        <span className="document-card__label">{label}</span>
      </div>

      <div className="document-card__illustration" aria-hidden="true">{illustration}</div>

      <h3>{title}</h3>

      <ol className="document-card__list">
        {points.map((point, index) => (
          <li key={point}>
            <span className="document-card__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ol>

      <a
        className="document-card__action"
        href={actionHref}
        aria-label={
          actionAriaLabel
            || `${actionLabel}. Перейти к форме консультации`
        }
      >
        <span>{actionLabel}</span>
        <span className="document-card__arrow" aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export default function DocumentsComparison() {
  return (
    <section className="documents-comparison" id="comparison" aria-labelledby="comparison-title">
      <Container>
        <div className="documents-comparison__heading">
          <div>
            <p className="documents-comparison__kicker">Сравнение документов</p>
            <h2 id="comparison-title">
              Акт категорирования и паспорт безопасности — <em>не одно и то же</em>
            </h2>
          </div>

          <p className="documents-comparison__lead">
            Акт фиксирует результаты обследования и решение комиссии. Паспорт готовится после
            категорирования и описывает объект, возможные угрозы и комплекс мер защиты.
          </p>
        </div>

        <div className="documents-comparison__cards">
          <DocumentCard
            type="АКТ"
            label="Документ комиссии"
            title="Акт обследования и категорирования"
            points={actPoints}
            actionLabel="Заказать акт категорирования"
            actionHref="/akt-obsledovaniya-i-kategorirovaniya-obekta/"
            actionAriaLabel="Подробнее об услуге подготовки акта обследования и категорирования объекта"
            illustration={<DocumentFlowIllustration />}
          />

          <DocumentCard
            type="ПБ"
            label="Итоговый документ"
            title="Паспорт безопасности"
            points={passportPoints}
            actionLabel="Заказать паспорт безопасности"
            variant="dark"
            illustration={<ShieldBuildingIllustration />}
          />
        </div>

        <aside className="documents-comparison__notice" aria-label="Важная информация о порядке разработки">
          <span className="documents-comparison__notice-mark" aria-hidden="true">!</span>
          <div>
            <p className="documents-comparison__notice-label">Важно</p>
            <p>
              Заказать только паспорт можно не во всех случаях. Для его подготовки обычно нужны
              результаты обследования и категорирования, оформленные комиссией отдельным актом.
            </p>
          </div>
        </aside>
      </Container>
    </section>
  );
}
