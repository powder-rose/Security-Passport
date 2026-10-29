import getWaterSection from '../getWaterSection';
import {
  WaterAction,
  WaterDisclosure,
  WaterHeading,
  WaterList,
  WaterNote,
  WaterParagraphs,
  WaterSection,
  WaterTable,
} from './WaterContent';
import './WaterProtection.css';

const restricted = getWaterSection('restricted');
const form = getWaterSection('form');
const protection = getWaterSection('protection');
const inspections = getWaterSection('inspections');

export default function WaterProtection({ onServiceSelect }) {
  return (
    <>
      <WaterSection section={restricted} tone="dark">
        <div className="water-intro-grid">
          <WaterHeading section={restricted} />
          <WaterParagraphs items={restricted.paragraphs} />
        </div>
        <div className="water-information">
          {[restricted.allowed, restricted.restricted].map((group, index) => (
            <div
              className={`water-information__panel water-information__panel--${index === 0 ? 'allowed' : 'restricted'}`}
              key={group.title}
            >
              <span className="water-information__symbol" aria-hidden="true">
                {index === 0 ? '+' : '−'}
              </span>
              <h3>{group.title}</h3>
              <WaterList items={group.items} />
            </div>
          ))}
        </div>
      </WaterSection>
      <WaterSection section={form}>
        <div className="water-intro-grid">
          <WaterHeading section={form} />
          <WaterParagraphs items={form.paragraphs} />
        </div>
        <div className="water-form-layout">
          <div className="water-form-document">
            <p className="water-label">{form.listLabel}</p>
            {form.items.map((item, index) => (
              <WaterDisclosure
                key={item.number}
                number={item.number}
                title={item.title}
                open={index === 0}
              >
                <p>{item.text}</p>
              </WaterDisclosure>
            ))}
          </div>
          <aside className="water-form-attachments">
            <h3>{form.attachments.title}</h3>
            <WaterList items={form.attachments.items} ordered />
            <WaterAction action={form.action} onServiceSelect={onServiceSelect} />
          </aside>
        </div>
      </WaterSection>
      <WaterSection section={protection} tone="paper">
        <div className="water-intro-grid">
          <WaterHeading section={protection} />
          <WaterParagraphs items={protection.paragraphs} />
        </div>
        <div className="water-protection-layout">
          <div>
            <p className="water-label">{protection.listLabel}</p>
            <WaterList items={protection.items} ordered />
          </div>
          <aside className="water-protection-notes water-sticky">
            <WaterParagraphs items={protection.notes} />
          </aside>
        </div>
      </WaterSection>
      <WaterSection section={inspections}>
        <WaterHeading section={inspections} />
        <WaterParagraphs items={inspections.paragraphs} />
        <div className="water-inspections">
          <div>
            <p className="water-label">{inspections.tableLabel}</p>
            <WaterTable section={inspections} numbered />
          </div>
          <div className="water-inspections__durations">
            <article>
              <span aria-hidden="true">15</span>
              <p>{inspections.scheduled}</p>
            </article>
            <article>
              <span aria-hidden="true">5</span>
              <p>{inspections.unscheduled}</p>
            </article>
          </div>
        </div>
        <p className="water-inspections__result">{inspections.result}</p>
        <WaterNote text={inspections.note} />
      </WaterSection>
    </>
  );
}
