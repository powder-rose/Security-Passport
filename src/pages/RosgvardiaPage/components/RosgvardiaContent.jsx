import ServiceAction from '../../../components/commercial/ServiceAction';

export function RosgvardiaHeading({ section }) {
  return (
    <header className="rosgvardia-heading">
      <p className="rosgvardia-kicker">{section.kicker}</p>
      <h2 id={`rosgvardia-${section.id}-title`}>{section.title}</h2>
    </header>
  );
}

export function RosgvardiaParagraphs({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="rosgvardia-copy">
      {items.map(text => (
        <p className="rosgvardia-paragraph" key={text}>
          {text}
        </p>
      ))}
    </div>
  );
}

export function RosgvardiaNote({ children }) {
  return (
    <aside className="rosgvardia-note" data-scroll-reveal>
      <p>{children}</p>
    </aside>
  );
}

export function RosgvardiaList({ items }) {
  return (
    <ul className="rosgvardia-list">
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function RosgvardiaAction({ action, onServiceSelect }) {
  return (
    <div className="rosgvardia-action">
      <ServiceAction service={action.service} onSelect={onServiceSelect}>
        {action.label}
      </ServiceAction>
    </div>
  );
}

export function RosgvardiaLink({ link }) {
  return (
    <a className="rosgvardia-link" href={link.href}>
      <span>{link.label}</span>
      <span aria-hidden="true">→</span>
    </a>
  );
}

export function RosgvardiaDisclosure({ title, children }) {
  return (
    <details className="rosgvardia-disclosure">
      <summary>
        <span>{title}</span>
        <span className="rosgvardia-disclosure__icon" aria-hidden="true" />
      </summary>
      <div className="rosgvardia-disclosure__body">{children}</div>
    </details>
  );
}
