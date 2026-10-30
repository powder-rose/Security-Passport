import getWaterSection from '../getWaterSection';
import {
  WaterAction,
  WaterDisclosure,
  WaterHeading,
  WaterIndex,
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
              <div className="water-information__heading">
                <span className="water-information__symbol" aria-hidden="true">
                  {index === 0 ? '+' : '−'}
                </span>
                <h3>{group.title}</h3>
              </div>
              <WaterList items={group.items} />
            </div>
          ))}
        </div>
      </WaterSection>
      <WaterSection section={form}>
        <div className="water-form-header">
          <WaterHeading section={form} />
          <WaterParagraphs items={form.paragraphs} />
        </div>
        <div className="water-form-layout">
          <div className="water-form-document">
            <p className="water-form-document__intro">{form.listLabel}</p>
            <div className="water-form-outline" data-scroll-reveal>
              {form.items.map((item, index) => (
                <WaterDisclosure
                  key={item.number}
                  number={item.number}
                  title={item.title}
                  name="water-passport-sections"
                  open={index === 0}
                >
                  <p>{item.text}</p>
                </WaterDisclosure>
              ))}
            </div>
          </div>
          <aside className="water-form-attachments" data-scroll-reveal>
            <h3>{form.attachments.title}</h3>
            <ol className="water-form-attachments__list">
              {form.attachments.items.map(text => (
                <li key={text}>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
            <WaterAction action={form.action} onServiceSelect={onServiceSelect} accent />
          </aside>
        </div>
      </WaterSection>

      <WaterSection section={protection} tone="paper">
        <div className="water-intro-grid">
          <WaterHeading section={protection} />
          <WaterParagraphs items={protection.paragraphs} />
        </div>
        <p className="water-label">{protection.listLabel}</p>
        <ol className="water-protection-measures">
          {protection.items.map((text, index) => (
            <li key={text} data-scroll-reveal>
              <WaterIndex number={String(index + 1).padStart(2, '0')} />
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <aside className="water-protection-notes">
          {protection.notes.map(text => (
            <p key={text}>{text}</p>
          ))}
        </aside>
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
