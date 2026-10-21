import { getIndustryContent } from './getIndustryContent';
import './IndustryScope.css';
import {
  IndustryDisclosure,
  IndustryHeading,
  IndustryList,
  IndustryParagraph,
  IndustryParagraphs,
  IndustrySectionAction,
  IndustrySubheading,
} from './IndustryContent';

export function IndustryApplicability({ section, onServiceSelect }) {
  const [objects, applicability, sites] = getIndustryContent(section);

  return (
    <>
      <div className="industry-section-lead">
        <IndustryHeading section={section} />
        <div className="industry-copy">
          <IndustrySubheading>{objects.title}</IndustrySubheading>
          <IndustryParagraph text={objects.paragraphs[0]} />
          <div className="industry-note">
            <IndustryParagraph text={objects.paragraphs[1]} />
          </div>
        </div>
      </div>
      <div className="industry-copy">
        <IndustryParagraph text={objects.paragraphs[2]} />
        <IndustryList items={objects.list.items} variant="objects" />
      </div>
      <div className="industry-applicability">
        <div className="industry-copy">
          <IndustrySubheading>{applicability.title}</IndustrySubheading>
          <IndustryParagraph text={applicability.paragraphs[0]} />
          <IndustrySectionAction
            action={applicability.action}
            onServiceSelect={onServiceSelect}
            accent
          />
        </div>
        <IndustryParagraphs items={applicability.paragraphs.slice(1)} />
      </div>
      <div className="industry-detail-row">
        <IndustryDisclosure group={sites} />
        <IndustrySectionAction action={sites.action} onServiceSelect={onServiceSelect} secondary />
      </div>
    </>
  );
}

export function IndustryRegulation({ section }) {
  const [regulation] = getIndustryContent(section);

  return (
    <div className="industry-regulation-layout">
      <aside className="industry-regulation-identity">
        <span className="industry-regulation-caption">ПП РФ</span>
        <span className="industry-regulation-mark">№ 258</span>
        <span className="industry-regulation-date">от 01.03.2024</span>
      </aside>
      <div className="industry-copy">
        <IndustryHeading section={section} />
        <IndustrySubheading>{regulation.title}</IndustrySubheading>
        <IndustryParagraphs items={regulation.paragraphs.slice(0, 3)} />
        <IndustryList items={regulation.list.items} variant="compact" />
        <div className="industry-note">
          <IndustryParagraphs items={regulation.paragraphs.slice(3)} />
        </div>
      </div>
    </div>
  );
}
