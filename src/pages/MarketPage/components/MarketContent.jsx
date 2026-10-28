import Container from '../../../components/ui/Container/Container';
import ServiceAction from '../../../components/commercial/ServiceAction';

export function MarketSection({ section, tone = 'base', children }) {
  return (
    <section
      id={section.id}
      className={`market-section market-section--${tone} market-${section.id}`}
      aria-labelledby={`market-${section.id}-title`}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function MarketHeading({ section }) {
  return (
    <div className="market-heading">
      <p className="market-kicker">{section.kicker}</p>
      <h2 id={`market-${section.id}-title`}>{section.title}</h2>
    </div>
  );
}

export function MarketParagraphs({ items = [] }) {
  return (
    <div className="market-copy">
      {items.map(text => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
}

export function MarketNote({ text, items = [] }) {
  return (
    <aside className="market-note">
      <span className="market-note__mark" aria-hidden="true" />
      <div>
        {text ? <p>{text}</p> : null}
        {items.map(item => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </aside>
  );
}

export function MarketLink({ link }) {
  return (
    <a className="market-inline-link" href={link.href}>
      {link.label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function MarketAction({ action, onServiceSelect }) {
  return (
    <div className="market-section-action">
      <ServiceAction service={action.service} onSelect={onServiceSelect} secondary>
        {action.label}
      </ServiceAction>
    </div>
  );
}

export function MarketList({ items, ordered = false }) {
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <Tag className="market-list">
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </Tag>
  );
}

export function MarketDisclosure({ title, open = false, number, name, children }) {
  return (
    <details
      className={`market-disclosure${number ? ' market-disclosure--numbered' : ''}`}
      open={open}
      name={name}
    >
      <summary>
        {number ? <span className="market-index" data-number={number} aria-hidden="true" /> : null}
        <h3 className="market-disclosure__title">{title}</h3>
        <span className="market-disclosure__icon" aria-hidden="true" />
      </summary>
      <div className="market-disclosure__body">{children}</div>
    </details>
  );
}
