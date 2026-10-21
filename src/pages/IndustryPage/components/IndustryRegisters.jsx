import './IndustryRegisters.css';

function DeadlineText({ text }) {
  const match = text.match(/\d+/);

  if (!match) return text;

  return (
    <>
      {text.slice(0, match.index)}
      <strong className="industry-approval-timeline__metric">{match[0]}</strong>
      {text.slice(match.index + match[0].length)}
    </>
  );
}

export function IndustryApprovalTimeline({ table }) {
  return (
    <div className="industry-approval-timeline">
      <div className="industry-approval-timeline__legend">
        <span>{table.headers[0]}</span>
        <span className="industry-approval-timeline__legend-arrow" aria-hidden="true">
          →
        </span>
        <span>{table.headers[1]}</span>
      </div>

      <ol className="industry-approval-timeline__list">
        {table.rows.map(([procedure, deadline], index) => (
          <li className="industry-approval-timeline__item" key={procedure} data-scroll-reveal>
            <span
              className="industry-approval-timeline__marker"
              data-number={String(index + 1).padStart(2, '0')}
              aria-hidden="true"
            />
            <dl className="industry-approval-timeline__definition">
              <dt>{procedure}</dt>
              <dd>
                <DeadlineText text={deadline} />
              </dd>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function IndustryCopyRegister({ table }) {
  return (
    <div className="industry-copy-register">
      <div className="industry-copy-register__head">
        {table.headers.map(header => (
          <span key={header}>{header}</span>
        ))}
      </div>

      <dl className="industry-copy-register__list">
        {table.rows.map(([copy, recipient], index) => (
          <div className="industry-copy-register__row" key={copy} data-scroll-reveal>
            <dt>
              <span
                className="industry-copy-register__number"
                data-number={String(index + 1).padStart(2, '0')}
                aria-hidden="true"
              />
              {copy}
            </dt>
            <dd>{recipient}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function IndustryDocumentRegister({ table }) {
  return (
    <div className="industry-document-register">
      <div className="industry-document-register__legend">
        <span>{table.headers[0]}</span>
        <span className="industry-document-register__legend-arrow" aria-hidden="true">
          →
        </span>
        <span>{table.headers[1]}</span>
      </div>

      <dl className="industry-document-register__grid">
        {table.rows.map(([group, examples]) => (
          <div className="industry-document-register__item" key={group} data-scroll-reveal>
            <dt>{group}</dt>
            <dd>{examples}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
