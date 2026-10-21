import ServiceAction from '../../../components/commercial/ServiceAction';

export function EnergyHeading({ section }) {
  return (
    <header className="energy-section-heading" data-scroll-reveal>
      <p className="energy-kicker">{section.kicker}</p>
      <h2 className="energy-heading" id={`energy-${section.id}-title`}>
        {section.title}
      </h2>
    </header>
  );
}

export function EnergySubheading({ children }) {
  return <h3 className="energy-subheading">{children}</h3>;
}

export function EnergyParagraphs({ items }) {
  return (
    <div className="energy-copy">
      {items.map(text => (
        <p className="energy-paragraph" key={text}>
          {text}
        </p>
      ))}
    </div>
  );
}

export function EnergyAction({ action, onServiceSelect, secondary = false, accent = false }) {
  return (
    <div className="energy-section-action">
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

export function EnergyList({ items, variant = 'lines' }) {
  return (
    <ul className={`energy-list energy-list--${variant}`}>
      {items.map((item, index) => (
        <li key={item} data-scroll-reveal>
          <span
            className="energy-list__marker"
            data-number={String(index + 1).padStart(2, '0')}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
