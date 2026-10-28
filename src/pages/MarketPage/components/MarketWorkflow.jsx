import ProcessSteps from '../../../sections/Process/ProcessSteps';
import getMarketSection from '../getMarketSection';
import { MarketHeading, MarketNote, MarketParagraphs, MarketSection } from './MarketContent';
import './MarketWorkflow.css';

const process = getMarketSection('process');
const approval = getMarketSection('approval');
const copies = getMarketSection('copies');

export default function MarketWorkflow() {
  return (
    <>
      <MarketSection section={process} tone="paper">
        <div className="market-split">
          <div className="market-stack market-sticky">
            <MarketHeading section={process} />
            <MarketNote text={process.note} />
          </div>
          <ProcessSteps steps={process.steps} />
        </div>
      </MarketSection>

      <MarketSection section={approval}>
        <div className="market-split">
          <MarketHeading section={approval} />
          <div className="market-stack">
            <MarketParagraphs items={approval.paragraphs} />
            <ol className="market-approval-authorities">
              {approval.authorities.map((authority, index) => (
                <li key={authority} data-scroll-reveal>
                  <span className="market-index" data-number={`0${index + 1}`} aria-hidden="true" />
                  <p>{authority}</p>
                </li>
              ))}
            </ol>
            <p className="market-approval-result">{approval.approval}</p>
            <MarketParagraphs items={approval.notes} />
            <MarketNote items={approval.timing.paragraphs} />
          </div>
        </div>
      </MarketSection>

      <MarketSection section={copies} tone="dark">
        <MarketHeading section={copies} />
        <div className="market-copies-layout">
          <div className="market-copies-stat">
            <span aria-hidden="true">4</span>
            <MarketParagraphs items={copies.paragraphs} />
          </div>
          <table className="market-copies-table">
            <thead>
              <tr>
                {copies.table.headers.map(header => (
                  <th key={header} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copies.table.rows.map(([recipient, count]) => (
                <tr key={recipient}>
                  <th scope="row">{recipient}</th>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="market-copies-extra">
          <span aria-hidden="true">+</span>
          <p>{copies.copy}</p>
        </div>
        <MarketNote text={copies.note} />
      </MarketSection>
    </>
  );
}
