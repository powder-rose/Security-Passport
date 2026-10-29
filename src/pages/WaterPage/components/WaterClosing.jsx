import getWaterSection from '../getWaterSection';
import {
  WaterDisclosure,
  WaterHeading,
  WaterIndex,
  WaterNote,
  WaterParagraphs,
  WaterSection,
} from './WaterContent';
import './WaterClosing.css';

const standard = getWaterSection('standard');
const advantages = getWaterSection('advantages');
const faq = getWaterSection('faq');

export default function WaterClosing() {
  return (
    <>
      <WaterSection section={standard}>
        <div className="water-standard">
          <WaterHeading section={standard} />
          <div>
            <WaterParagraphs items={standard.paragraphs} />
            <WaterNote text={standard.note} />
          </div>
        </div>
      </WaterSection>
      <WaterSection section={advantages} tone="dark">
        <WaterHeading section={advantages} />
        <ol className="water-advantages">
          {advantages.items.map(item => (
            <li key={item.number} data-scroll-reveal>
              <WaterIndex number={item.number} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </WaterSection>
      <WaterSection section={faq}>
        <div className="water-faq-layout">
          <div className="water-sticky">
            <WaterHeading section={faq} />
          </div>
          <div className="water-faq-list">
            {faq.items.map((item, index) => (
              <WaterDisclosure
                key={item.id}
                title={item.question}
                number={String(index + 1).padStart(2, '0')}
                name="water-faq"
                open={index === 0}
              >
                <p>{item.answer}</p>
              </WaterDisclosure>
            ))}
          </div>
        </div>
      </WaterSection>
    </>
  );
}
