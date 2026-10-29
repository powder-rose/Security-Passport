import Container from '../../../components/ui/Container/Container';
import ServiceAction from '../../../components/commercial/ServiceAction';

export function WaterSection({ section, tone = 'base', children }) {
  return (
    <section
      className={`water-section water-section--${tone}`}
      id={section.id}
      aria-labelledby={`water-${section.id}-title`}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function WaterHeading({ section }) {
  return (
    <div className="water-heading">
      <p className="water-kicker">{section.kicker}</p>
      <h2 id={`water-${section.id}-title`}>{section.title}</h2>
    </div>
  );
}

export function WaterParagraphs({ items }) {
  if (!items?.length) return null;
  return (
    <div className="water-copy">
      {items.map(text => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
}

export function WaterNote({ text }) {
  if (!text) return null;
  return (
    <aside className="water-note">
      <p>
        <strong>Важно:</strong> {text}
      </p>
    </aside>
  );
}

export function WaterIndex({ number }) {
  return <span className="water-index" data-number={number} aria-hidden="true" />;
}

export function WaterLink({ link }) {
  return (
    <a className="water-link" href={link.href}>
      <span>{link.label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function WaterAction({ action, onServiceSelect, accent = false, secondary = false }) {
  return (
    <ServiceAction
      service={action.service}
      onSelect={onServiceSelect}
      accent={accent}
      secondary={secondary}
    >
      {action.label}
    </ServiceAction>
  );
}

export function WaterList({ items, ordered = false }) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={`water-list${ordered ? ' water-list--numbered' : ''}`}>
      {items.map((text, index) => (
        <li key={text}>
          {ordered ? <WaterIndex number={String(index + 1).padStart(2, '0')} /> : null}
          <span>{text}</span>
        </li>
      ))}
    </Tag>
  );
}

export function WaterDisclosure({ title, number, children, name, open = false }) {
  return (
    <details className="water-disclosure" name={name} open={open}>
      <summary>
        <WaterIndex number={number} />
        <span className="water-disclosure__title">{title}</span>
        <span className="water-disclosure__icon" aria-hidden="true" />
      </summary>
      <div className="water-disclosure__body">{children}</div>
    </details>
  );
}

export function WaterTable({ section, numbered = false, layout = 'standard' }) {
  const facts = layout === 'facts';
  const numerals = ['I', 'II', 'III', 'IV'];

  return (
    <div
      className={facts ? 'water-facts-table' : 'water-table-scroll'}
      role="region"
      aria-label={section.title}
      tabIndex={facts ? undefined : 0}
    >
      <table className={facts ? 'water-facts' : 'water-table'} role={facts ? 'table' : undefined}>
        <caption className="water-visually-hidden">{section.documentName || section.title}</caption>
        <thead
          className={facts ? 'water-visually-hidden' : undefined}
          role={facts ? 'rowgroup' : undefined}
        >
          <tr role={facts ? 'row' : undefined}>
            {section.table.headers.map(text => (
              <th key={text} scope="col" role={facts ? 'columnheader' : undefined}>
                {text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role={facts ? 'rowgroup' : undefined}>
          {section.table.rows.map(([heading, ...cells], index) => (
            <tr
              key={heading}
              role={facts ? 'row' : undefined}
              data-scroll-reveal={facts ? '' : undefined}
            >
              <th scope="row" role={facts ? 'rowheader' : undefined}>
                {numbered ? <WaterIndex number={numerals[index]} /> : null}
                <span>{heading}</span>
              </th>
              {cells.map(text => (
                <td key={text} role={facts ? 'cell' : undefined}>
                  {text}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
