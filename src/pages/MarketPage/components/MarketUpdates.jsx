import getMarketSection from '../getMarketSection';
import {
  MarketHeading,
  MarketLink,
  MarketNote,
  MarketParagraphs,
  MarketSection,
} from './MarketContent';
import './MarketUpdates.css';

const actualization = getMarketSection('actualization');
const comparison = getMarketSection('comparison');
const current = getMarketSection('current-requirements');

export default function MarketUpdates() {
  return (
    <>
      <MarketSection section={actualization}>
        <div className="market-updates-heading">
          <MarketHeading section={actualization} />
          <div className="market-stack">
            <MarketParagraphs items={actualization.paragraphs} />
            <ul className="market-change-reasons">
              {actualization.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="market-deadlines">
          {actualization.timing.paragraphs.map((text, index) => (
            <article className="market-deadline" key={text} data-scroll-reveal>
              <span className="market-deadline__number" aria-hidden="true">
                {index === 0 ? '10' : '3'}
              </span>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="market-stack">
          <MarketNote text={actualization.note} items={actualization.notes} />
          <MarketLink link={actualization.link} />
        </div>
      </MarketSection>

      <MarketSection section={comparison} tone="paper">
        <div className="market-comparison-heading">
          <div className="market-comparison-mark" aria-hidden="true">
            <span>255</span>
            <span>≠</span>
            <span>1273</span>
          </div>
          <MarketHeading section={comparison} />
        </div>
        <MarketParagraphs items={comparison.paragraphs} />
        <div
          className="market-table-scroll"
          role="region"
          aria-label={comparison.title}
          tabIndex="0"
        >
          <table className="market-comparison-table">
            <thead>
              <tr>
                {comparison.table.headers.map(header => (
                  <th key={header} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.table.rows.map(([criterion, market, trade]) => (
                <tr key={criterion}>
                  <th scope="row">{criterion}</th>
                  <td>{market}</td>
                  <td>{trade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="market-stack">
          <MarketNote text={comparison.note} items={comparison.notes} />
          <MarketLink link={comparison.link} />
        </div>
      </MarketSection>

      <MarketSection section={current}>
        <div className="market-current-panel">
          <div className="market-current-title">
            <span className="market-current-year" aria-hidden="true">
              2026
            </span>
            <MarketHeading section={current} />
          </div>
          <MarketParagraphs items={current.paragraphs} />
        </div>
      </MarketSection>
    </>
  );
}
