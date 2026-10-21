import { getIndustryContent } from './getIndustryContent';
import './IndustryPassport.css';
import {
  IndustryDisclosure,
  IndustryHeading,
  IndustryList,
  IndustryParagraph,
  IndustryParagraphs,
  IndustrySectionAction,
  IndustrySubheading,
} from './IndustryContent';

export function IndustryPassportForm({ section, onServiceSelect }) {
  const [form, sample] = getIndustryContent(section);

  return (
    <>
      <div className="industry-split-layout">
        <div className="industry-section-intro">
          <IndustryHeading section={section} />
          <IndustrySubheading>{form.title}</IndustrySubheading>
          <IndustryParagraphs items={form.paragraphs.slice(0, 2)} />
        </div>
        <div className="industry-form-document" data-scroll-reveal>
          <IndustryParagraph text={form.paragraphs[2]} className="industry-form-document__label" />
          <IndustryList items={form.list.items} variant="contents" />
          <div className="industry-form-document__attachments">
            <IndustryParagraphs items={form.paragraphs.slice(3)} />
          </div>
        </div>
      </div>
      <div className="industry-detail-row">
        <IndustryDisclosure group={sample} />
        <IndustrySectionAction action={sample.action} onServiceSelect={onServiceSelect} />
      </div>
    </>
  );
}

export function IndustryRestrictedDocuments({ section }) {
  const [documents] = getIndustryContent(section);

  return (
    <div className="industry-restricted-layout">
      <div className="industry-restricted-mark" aria-hidden="true">
        ДСП
      </div>
      <div className="industry-copy">
        <IndustryHeading section={section} />
        <IndustrySubheading>{documents.title}</IndustrySubheading>
        <IndustryParagraphs items={documents.paragraphs.slice(0, 2)} />
        <div className="industry-restricted-rule">
          <IndustryParagraph text={documents.paragraphs[2]} />
        </div>
        <IndustryParagraphs items={documents.paragraphs.slice(3)} />
      </div>
    </div>
  );
}

export function IndustryActualization({ section, onServiceSelect }) {
  const [period, existingPassport] = getIndustryContent(section);

  return (
    <>
      <div className="industry-split-layout">
        <div className="industry-section-intro">
          <IndustryHeading section={section} />
          <IndustrySubheading>{period.title}</IndustrySubheading>
          <IndustryParagraph
            text={period.paragraphs[0]}
            emphasis="не реже одного раза в три года"
            className="industry-statement"
          />
        </div>
        <div className="industry-copy">
          <IndustryParagraph text={period.paragraphs[1]} />
          <IndustryList items={period.list.items} variant="reasons" />
          <IndustryParagraph text={period.paragraphs[2]} />
        </div>
      </div>
      <div className="industry-actualization-footer">
        <IndustryDisclosure group={existingPassport}>
          <IndustryParagraphs items={existingPassport.paragraphs.slice(0, 2)} />
        </IndustryDisclosure>
        <div className="industry-actualization-actions">
          <IndustryParagraph text={existingPassport.paragraphs[2]} />
          <IndustrySectionAction
            action={existingPassport.action}
            onServiceSelect={onServiceSelect}
          />
          <a className="industry-inline-link" href={existingPassport.link.href}>
            {existingPassport.link.label}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </>
  );
}

export function IndustryStandard({ section }) {
  const [standard] = getIndustryContent(section);

  return (
    <div className="industry-standard-panel">
      <div className="industry-section-intro">
        <IndustryHeading section={section} />
        <IndustrySubheading>{standard.title}</IndustrySubheading>
        <span className="industry-standard-year" data-year="2026" aria-hidden="true" />
      </div>
      <div className="industry-copy">
        <IndustryParagraphs items={standard.paragraphs.slice(0, 3)} />
        <IndustryParagraph text={standard.paragraphs[3]} className="industry-standard-priority" />
        <IndustryParagraph text={standard.paragraphs[4]} />
      </div>
    </div>
  );
}
