import getWaterSection from '../getWaterSection';
import { waterTransition } from '../waterPageData';
import {
  WaterAction,
  WaterHeading,
  WaterIndex,
  WaterList,
  WaterNote,
  WaterParagraphs,
  WaterSection,
} from './WaterContent';
import './WaterRegulation.css';

const regulations = getWaterSection('regulations');
const changes = getWaterSection('changes');
const registry = getWaterSection('registry');

function TransitionDate({ date }) {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(new Date(`${date}T00:00:00Z`));
  const part = type => parts.find(item => item.type === type)?.value;
  return (
    <time className="water-transition__date" dateTime={date} aria-hidden="true">
      <span>{part('day')}</span>
      <span>
        {part('month')} {part('year')}
      </span>
    </time>
  );
}

export default function WaterRegulation({ onServiceSelect }) {
  return (
    <>
      <WaterSection section={regulations}>
        <div className="water-regulations">
          <aside className="water-regulations__identity water-sticky" aria-hidden="true">
            <span className="water-kicker">ПП РФ №</span>
            <span className="water-regulations__number">1467</span>
            <p>23 декабря 2016 года</p>
            <span className="water-regulations__edition">Изменения № 1340</span>
          </aside>
          <div>
            <WaterHeading section={regulations} />
            <WaterParagraphs items={regulations.paragraphs} />
            <p className="water-label">{regulations.listLabel}</p>
            <div className="water-regulations__subjects">
              <WaterList items={regulations.items} ordered />
            </div>
            <WaterParagraphs items={regulations.notes} />
          </div>
        </div>
      </WaterSection>
      <WaterSection section={changes} tone="paper">
        <div className="water-intro-grid">
          <WaterHeading section={changes} />
          <WaterParagraphs items={changes.paragraphs} />
        </div>
        <ol className="water-changes">
          {changes.items.map(item => (
            <li className="water-change" key={item.number} data-scroll-reveal>
              <WaterIndex number={item.number} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </WaterSection>
      {waterTransition.enabled ? (
        <WaterSection section={waterTransition} tone="dark">
          <div className="water-transition">
            <div>
              <WaterHeading section={waterTransition} />
              <WaterParagraphs items={waterTransition.paragraphs} />
              <WaterNote text={waterTransition.note} />
              <WaterAction
                action={waterTransition.action}
                onServiceSelect={onServiceSelect}
                accent
              />
            </div>
            <TransitionDate date={waterTransition.deadline} />
          </div>
        </WaterSection>
      ) : null}
      <WaterSection section={registry}>
        <div className="water-intro-grid">
          <WaterHeading section={registry} />
          <WaterParagraphs items={registry.paragraphs.slice(0, 1)} />
        </div>
        <ol className="water-registry">
          {registry.paragraphs.slice(1).map((text, index) => (
            <li key={text} data-scroll-reveal>
              <WaterIndex number={String(index + 1).padStart(2, '0')} />
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </WaterSection>
    </>
  );
}
