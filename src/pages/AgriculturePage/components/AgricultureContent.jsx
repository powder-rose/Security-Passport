import ServiceAction from '../../../components/commercial/ServiceAction';

export function AgricultureHeading({ section }) {
  return (
    <header className="agriculture-section-heading" data-scroll-reveal>
      <p className="agriculture-kicker">{section.kicker}</p>
      <h2 className="agriculture-heading" id={`agriculture-${section.id}-title`}>
        {section.title}
      </h2>
    </header>
  );
}

export function AgricultureSubheading({ children }) {
  return <h3 className="agriculture-subheading">{children}</h3>;
}

export function AgricultureParagraphs({ items }) {
  return (
    <div className="agriculture-copy">
      {items.map(text => (
        <p className="agriculture-paragraph" key={text}>
          {text}
        </p>
      ))}
    </div>
  );
}

export function AgricultureAction({ action, onServiceSelect, secondary = false, accent = false }) {
  return (
    <div className="agriculture-section-action">
      <ServiceAction
        service={action.service}
        onSelect={onServiceSelect}
        secondary={secondary}
        accent={accent}
      >
        {action.label}
      </ServiceAction>
    </div>
  );
}

export function AgricultureList({ items }) {
  return (
    <ul className="agriculture-list">
      {items.map((item, index) => (
        <li key={item} data-scroll-reveal>
          <span
            className="agriculture-list__number"
            data-number={String(index + 1).padStart(2, '0')}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function AgricultureLink({ link }) {
  return (
    <a className="agriculture-inline-link" href={link.href}>
      <span>{link.label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
