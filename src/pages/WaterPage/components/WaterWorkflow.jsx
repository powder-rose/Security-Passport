import ProcessSteps from '../../../sections/Process/ProcessSteps';
import getWaterSection from '../getWaterSection';
import { WaterHeading, WaterIndex, WaterNote, WaterParagraphs, WaterSection } from './WaterContent';
import './WaterWorkflow.css';

const after = getWaterSection('after-categorization');
const process = getWaterSection('process');
const approval = getWaterSection('approval');
const copies = getWaterSection('copies');

export default function WaterWorkflow() {
  return (
    <>
      <WaterSection section={after}>
        <div className="water-intro-grid">
          <WaterHeading section={after} />
          <WaterParagraphs items={after.paragraphs} />
        </div>
        <div className="water-after__notice">
          <p>{after.timing}</p>
          <p>{after.exclusion}</p>
        </div>
        <p className="water-label">{after.listLabel}</p>
        <ol className="water-after__documents">
          {after.items.map((item, index) => (
            <li key={item} data-scroll-reveal>
              <WaterIndex number={String(index + 1).padStart(2, '0')} />
              <p>{item}</p>
            </li>
          ))}
        </ol>
        <div className="water-after__implementation">
          <WaterParagraphs items={after.implementation} />
        </div>
      </WaterSection>
      <WaterSection section={process} tone="paper">
        <div className="water-process">
          <div className="water-sticky">
            <WaterHeading section={process} />
            <p className="water-process__timing">{process.timing}</p>
          </div>
          <ProcessSteps steps={process.steps} />
        </div>
      </WaterSection>
      <WaterSection section={approval}>
        <div className="water-intro-grid">
          <WaterHeading section={approval} />
          <WaterParagraphs items={approval.paragraphs} />
        </div>
        <ul className="water-approval">
          {approval.authorities.map(item => (
            <li key={item.title} data-scroll-reveal>
              <span className="water-approval__mark" aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
        <div className="water-approval__result">
          <p>{approval.approvalLabel}</p>
          <p>{approval.approval}</p>
        </div>
        <WaterNote text={approval.note} />
      </WaterSection>
      <WaterSection section={copies} tone="paper">
        <WaterHeading section={copies} />
        <div className="water-copies">
          <div className="water-copies__original" data-scroll-reveal>
            <span aria-hidden="true">1</span>
            <p>{copies.paragraphs[0]}</p>
          </div>
          <div className="water-copies__distribution">
            <p className="water-copies__storage">{copies.paragraphs[1]}</p>
            <p className="water-label">{copies.listLabel}</p>
            <ul>
              {copies.recipients.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </WaterSection>
    </>
  );
}
