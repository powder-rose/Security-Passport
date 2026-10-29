import getWaterSection from '../getWaterSection';
import {
  WaterAction,
  WaterHeading,
  WaterIndex,
  WaterLink,
  WaterList,
  WaterNote,
  WaterParagraphs,
  WaterSection,
} from './WaterContent';
import './WaterScope.css';

const applicability = getWaterSection('applicability');
const objects = getWaterSection('objects');
const exclusions = getWaterSection('exclusions');

export default function WaterScope({ onServiceSelect }) {
  return (
    <>
      <WaterSection section={applicability} tone="paper">
        <div className="water-intro-grid">
          <WaterHeading section={applicability} />
          <WaterParagraphs items={applicability.paragraphs} />
        </div>
        <ol className="water-conditions">
          {applicability.items.map(item => (
            <li key={item.number} data-scroll-reveal>
              <WaterIndex number={item.number} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
        <div className="water-section-end">
          <WaterNote text={applicability.note} />
          <WaterAction action={applicability.action} onServiceSelect={onServiceSelect} />
        </div>
      </WaterSection>
      <WaterSection section={objects}>
        <WaterHeading section={objects} />
        <ol className="water-objects">
          {objects.items.map(item => (
            <li className="water-object" key={item.number} data-scroll-reveal>
              <WaterIndex number={item.number} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
        <WaterNote text={objects.note} />
      </WaterSection>
      <WaterSection section={exclusions} tone="paper">
        <div className="water-exclusions">
          <div>
            <WaterHeading section={exclusions} />
            <WaterParagraphs items={exclusions.paragraphs} />
          </div>
          <div>
            <p className="water-label">{exclusions.listLabel}</p>
            <WaterList items={exclusions.items} ordered />
            <WaterNote text={exclusions.note} />
            <WaterLink link={exclusions.link} />
          </div>
        </div>
      </WaterSection>
    </>
  );
}
