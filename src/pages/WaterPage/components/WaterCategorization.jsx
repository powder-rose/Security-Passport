import getWaterSection from '../getWaterSection';
import {
  WaterAction,
  WaterHeading,
  WaterLink,
  WaterList,
  WaterNote,
  WaterParagraphs,
  WaterSection,
  WaterTable,
} from './WaterContent';
import './WaterCategorization.css';

const categorization = getWaterSection('categorization');
const categories = getWaterSection('categories');
const separate = getWaterSection('separate-objects');
const commission = getWaterSection('commission');
const act = getWaterSection('act');

export default function WaterCategorization({ onServiceSelect }) {
  return (
    <>
      <WaterSection section={categorization} tone="paper">
        <WaterHeading section={categorization} />
        <WaterParagraphs items={categorization.paragraphs} />
        <div className="water-criteria">
          <WaterList items={categorization.items} ordered />
        </div>
        <p className="water-criteria__conclusion">{categorization.conclusion}</p>
        <WaterNote text={categorization.note} />
      </WaterSection>
      <WaterSection section={categories}>
        <WaterHeading section={categories} />
        <WaterParagraphs items={categories.paragraphs} />
        <div className="water-categories-layout">
          <WaterTable section={categories} numbered />
          <aside className="water-categories-notes">
            <WaterParagraphs items={categories.notes} />
            <WaterNote text={categories.note} />
          </aside>
        </div>
      </WaterSection>
      <WaterSection section={separate} tone="paper">
        <div className="water-intro-grid water-intro-grid--separate">
          <WaterHeading section={separate} />
          <WaterParagraphs items={separate.paragraphs.slice(0, 1)} />
        </div>
        <div className="water-territories">
          <div className="water-territories__distance" data-scroll-reveal>
            <div className="water-territories__diagram" aria-hidden="true">
              <span />
              <strong>
                более
                <br />
                <b>500</b> м
              </strong>
              <span />
            </div>
            <p>{separate.paragraphs[1]}</p>
          </div>
          <div className="water-territories__operators" data-scroll-reveal>
            <div className="water-territories__marks" aria-hidden="true">
              <span>01</span>
              <span>02</span>
            </div>
            <p>{separate.paragraphs[2]}</p>
          </div>
        </div>
        <p className="water-territories__conclusion">{separate.conclusion}</p>
      </WaterSection>
      <WaterSection section={commission}>
        <div className="water-commission">
          <div>
            <WaterHeading section={commission} />
            <WaterParagraphs items={commission.paragraphs} />
            <WaterNote text={commission.note} />
          </div>
          <div>
            <div className="water-commission__timing" data-scroll-reveal>
              <span aria-hidden="true">
                2 <small>месяца</small>
              </span>
              <p>{commission.timing}</p>
            </div>
            <div className="water-commission__people">
              <p>{commission.chair}</p>
              <WaterParagraphs items={commission.members} />
            </div>
            <p className="water-commission__support">{commission.support}</p>
          </div>
        </div>
      </WaterSection>

      <WaterSection section={act} tone="paper">
        <WaterHeading section={act} />
        <div className="water-act__intro">
          <WaterParagraphs items={act.paragraphs} />
          <WaterAction action={act.action} onServiceSelect={onServiceSelect} />
        </div>
        <WaterTable section={act} layout="facts" />
        <div className="water-act__footer">
          <WaterNote text={act.note} />
          <WaterLink link={act.link} />
        </div>
      </WaterSection>
    </>
  );
}
