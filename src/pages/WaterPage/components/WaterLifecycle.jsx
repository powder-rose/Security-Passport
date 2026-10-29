import getWaterSection from '../getWaterSection';
import {
  WaterDisclosure,
  WaterHeading,
  WaterLink,
  WaterList,
  WaterParagraphs,
  WaterSection,
} from './WaterContent';
import './WaterLifecycle.css';

const validity = getWaterSection('validity');
const amendments = getWaterSection('amendments');

export default function WaterLifecycle() {
  return (
    <>
      <WaterSection section={validity}>
        <WaterHeading section={validity} />
        <div className="water-validity">
          <div className="water-validity__term">
            <span aria-hidden="true">
              5 <small>лет</small>
            </span>
            <WaterParagraphs items={validity.paragraphs} />
          </div>
          <div className="water-validity__replacement">
            <WaterDisclosure number="↗" title={validity.replacement.label} open>
              <WaterList items={validity.replacement.items} />
            </WaterDisclosure>
            <p className="water-validity__deadline">{validity.replacement.timing}</p>
          </div>
        </div>
      </WaterSection>
      <WaterSection section={amendments} tone="paper">
        <div className="water-amendments">
          <span className="water-amendments__number" aria-hidden="true">
            72
          </span>
          <div>
            <WaterHeading section={amendments} />
            <WaterParagraphs items={amendments.paragraphs} />
            <WaterLink link={amendments.link} />
          </div>
        </div>
      </WaterSection>
    </>
  );
}
