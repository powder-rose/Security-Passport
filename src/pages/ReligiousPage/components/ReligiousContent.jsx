import ServiceAction from '../../../components/commercial/ServiceAction';

export function ReligiousHeading({ section }) {
  return (
    <header className="religious-section-heading" data-scroll-reveal>
      <p className="religious-kicker">{section.kicker}</p>
      <h2 className="religious-heading" id={`religious-${section.id}-title`}>
        {section.title}
      </h2>
    </header>
  );
}

export function ReligiousSubheading({ children }) {
  return <h3 className="religious-subheading">{children}</h3>;
}

export function ReligiousParagraphs({ items }) {
  return (
    <div className="religious-copy">
      {items.map(text => (
        <p className="religious-paragraph" key={text}>
          {text}
        </p>
      ))}
    </div>
  );
}

export function ReligiousPriceText({ text }) {
  const [description, price] = text.split(' — ');

  return (
    <>
      {description} — <span className="religious-price-value">{price}</span>
    </>
  );
}

export function ReligiousList({ items }) {
  return (
    <ul className="religious-list">
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ReligiousAction({ action, onServiceSelect, secondary = false, accent = false }) {
  return (
    <div className="religious-section-action">
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

export function ReligiousLink({ link }) {
  return (
    <a className="religious-inline-link" href={link.href}>
      <span>{link.label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function ReligiousDisclosure({ title, children, open = false }) {
  return (
    <details className="religious-disclosure" open={open}>
      <summary>
        <span>{title}</span>
        <span className="religious-disclosure__icon" aria-hidden="true" />
      </summary>
      <div className="religious-disclosure__content">{children}</div>
    </details>
  );
}
