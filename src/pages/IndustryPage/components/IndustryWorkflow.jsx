import ProcessSteps from '../../../sections/Process/ProcessSteps';
import { getIndustryContent } from './getIndustryContent';
import {
  IndustryHeading,
  IndustryList,
  IndustryParagraph,
  IndustryParagraphs,
  IndustrySectionAction,
  IndustrySubheading,
} from './IndustryContent';
import { IndustryApprovalTimeline, IndustryCopyRegister } from './IndustryRegisters';
import './IndustryWorkflow.css';

export function IndustryProcess({ section, onServiceSelect }) {
  const [process] = getIndustryContent(section);

  return (
    <>
      <div className="industry-process-layout">
        <div className="industry-section-intro">
          <IndustryHeading section={section} />
          <IndustrySubheading>{process.title}</IndustrySubheading>
          <IndustryParagraphs items={process.paragraphs.slice(0, 2)} />
          <IndustrySectionAction action={process.action} onServiceSelect={onServiceSelect} />
        </div>
        <ProcessSteps steps={process.steps.items} />
      </div>
      <div className="industry-process-footer">
        <div className="industry-note">
          <IndustryParagraphs items={process.paragraphs.slice(2, 4)} />
        </div>
        <div className="industry-copy">
          <IndustryParagraph text={process.paragraphs[4]} />
        </div>
      </div>
    </>
  );
}

export function IndustryApproval({ section, onServiceSelect }) {
  const [authorities, deadlines] = getIndustryContent(section);

  return (
    <>
      <div className="industry-split-layout">
        <div className="industry-section-intro">
          <IndustryHeading section={section} />
          <IndustrySubheading>{authorities.title}</IndustrySubheading>
          <IndustryParagraphs items={authorities.paragraphs.slice(0, 2)} />
        </div>
        <div className="industry-copy">
          <IndustryList items={authorities.list.items} variant="authorities" />
          <IndustryParagraph text={authorities.paragraphs[2]} />
        </div>
      </div>
      <div className="industry-approval-deadlines">
        <div className="industry-copy">
          <IndustrySubheading>{deadlines.title}</IndustrySubheading>
          <IndustryParagraph text={deadlines.paragraphs[0]} />
        </div>
        <IndustryApprovalTimeline table={deadlines.table} />
      </div>
      <div className="industry-approval-footer">
        <IndustryParagraph text={deadlines.paragraphs[1]} />
        <IndustryParagraph
          text={deadlines.paragraphs[2]}
          emphasis="от 9 500 ₽"
          className="industry-statement"
        />
        <IndustrySectionAction action={deadlines.action} onServiceSelect={onServiceSelect} accent />
      </div>
    </>
  );
}

export function IndustryCopies({ section }) {
  const [copies] = getIndustryContent(section);

  return (
    <>
      <div className="industry-split-layout">
        <div className="industry-section-intro">
          <IndustryHeading section={section} />
          <div className="industry-copies-count" aria-hidden="true">
            5
          </div>
          <IndustrySubheading>{copies.title}</IndustrySubheading>
          <IndustryParagraphs items={copies.paragraphs.slice(0, 2)} />
        </div>
        <IndustryCopyRegister table={copies.table} />
      </div>
      <div className="industry-copies-footer">
        <IndustryParagraph text={copies.paragraphs[2]} emphasis="в течение 10 рабочих дней" />
        <IndustryParagraph text={copies.paragraphs[3]} />
      </div>
    </>
  );
}
