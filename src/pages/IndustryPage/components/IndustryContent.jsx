import IndustryAction from './IndustryAction';

const sectionLabels = {
  objects: 'Область применения',
  'about-passport': 'Нормативное основание',
  categorization: 'Категории потенциальной опасности',
  'categorization-act': 'Работа комиссии',
  process: 'Этапы работы',
  approval: 'Согласование',
  copies: 'Экземпляры паспорта',
  service: 'Состав работ',
  prices: 'Стоимость',
  documents: 'Исходные данные',
  'passport-form': 'Форма и образец',
  'restricted-documents': 'Работа с документом',
  actualization: 'Актуализация',
  standard: 'Организация услуг',
  advantages: 'Подход к работе',
  faq: 'Вопросы и ответы',
};

export function IndustryHeading({ section }) {
  return (
    <header className="industry-section-heading" data-industry-reveal>
      <p className="industry-kicker">{sectionLabels[section.id]}</p>
      <h2 className="industry-heading" id={`industry-${section.id}-title`}>
        {section.title}
      </h2>
    </header>
  );
}

export function IndustrySubheading({ children }) {
  return <h3 className="industry-subheading">{children}</h3>;
}

export function IndustryParagraph({ text, emphasis, className = '' }) {
  const index = emphasis ? text.indexOf(emphasis) : -1;

  return (
    <p className={`industry-paragraph${className ? ` ${className}` : ''}`}>
      {index < 0 ? (
        text
      ) : (
        <>
          {text.slice(0, index)}
          <strong>{emphasis}</strong>
          {text.slice(index + emphasis.length)}
        </>
      )}
    </p>
  );
}

export function IndustryParagraphs({ items }) {
  return (
    <div className="industry-copy">
      {items.map(text => (
        <IndustryParagraph key={text} text={text} />
      ))}
    </div>
  );
}

export function IndustryList({ items, variant = 'lines' }) {
  return (
    <ul className={`industry-list industry-list--${variant}`}>
      {items.map((item, index) => (
        <li key={item} data-industry-reveal>
          <span
            className="industry-list__marker"
            data-number={String(index + 1).padStart(2, '0')}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function IndustrySectionAction({
  action,
  onServiceSelect,
  secondary = false,
  accent = false,
}) {
  return (
    <div className="industry-section-action">
      <IndustryAction
        service={action.service}
        onSelect={onServiceSelect}
        secondary={secondary}
        accent={accent}
      >
        {action.label}
      </IndustryAction>
    </div>
  );
}

export function IndustryDisclosure({ group, children }) {
  return (
    <details className="industry-disclosure">
      <summary>
        <h3>{group.title}</h3>
        <span className="industry-disclosure__icon" aria-hidden="true" />
      </summary>
      <div className="industry-disclosure__body">
        {children || <IndustryParagraphs items={group.paragraphs} />}
      </div>
    </details>
  );
}
