import ProcessSteps from '../../../sections/Process/ProcessSteps';
import { EnergyAction, EnergyHeading, EnergyParagraphs, EnergySubheading } from './EnergyContent';
import './EnergyWorkflow.css';

export function EnergyProcess({ section, onServiceSelect }) {
  return (
    <>
      <div className="energy-process-layout">
        <div className="energy-section-intro">
          <EnergyHeading section={section} />
          <EnergySubheading>{section.subheading}</EnergySubheading>
          <EnergyParagraphs items={section.paragraphs} />
        </div>
        <ProcessSteps steps={section.steps} />
      </div>
      <div className="energy-process-footer">
        <p className="energy-paragraph">{section.footnote}</p>
        <EnergyAction action={section.action} onServiceSelect={onServiceSelect} />
      </div>
    </>
  );
}

export function EnergyApproval({ section, onServiceSelect }) {
  return (
    <div className="energy-split-layout">
      <div className="energy-section-intro">
        <EnergyHeading section={section} />
        <EnergySubheading>{section.subheading}</EnergySubheading>
        <p className="energy-paragraph">{section.paragraphs[0]}</p>
        <EnergyAction action={section.action} onServiceSelect={onServiceSelect} accent />
      </div>
      <div className="energy-copy">
        <ol className="energy-approval-flow">
          {section.paragraphs.slice(1, 3).map((text, index) => (
            <li key={text} data-scroll-reveal>
              <span
                className="energy-approval-flow__number"
                data-number={String(index + 1).padStart(2, '0')}
                aria-hidden="true"
              />
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="energy-approval-support">
          <EnergyParagraphs items={section.paragraphs.slice(3)} />
        </div>
      </div>
    </div>
  );
}
