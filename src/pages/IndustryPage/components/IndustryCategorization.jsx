import { getIndustryContent } from './getIndustryContent';
import {
  IndustryDisclosure,
  IndustryHeading,
  IndustryList,
  IndustryParagraph,
  IndustryParagraphs,
  IndustrySectionAction,
  IndustrySubheading,
} from './IndustryContent';
import IndustryTable from './IndustryTable';
import './IndustryCategorization.css';

export function IndustryCategories({ section, onServiceSelect }) {
  const [categories, registry] = getIndustryContent(section);

  return (
    <>
      <div className="industry-section-lead">
        <IndustryHeading section={section} />
        <div className="industry-copy">
          <IndustrySubheading>{categories.title}</IndustrySubheading>
          <IndustryParagraphs items={categories.paragraphs.slice(0, 2)} />
        </div>
      </div>
      <IndustryTable {...categories.table} label={categories.title} variant="categories" />
      <div className="industry-category-notes">
        <div className="industry-note">
          <IndustryParagraphs items={categories.paragraphs.slice(2, 5)} />
        </div>
        <div className="industry-copy">
          <IndustryParagraphs items={categories.paragraphs.slice(5)} />
          <IndustrySectionAction action={categories.action} onServiceSelect={onServiceSelect} />
        </div>
      </div>
      <div className="industry-detail-row">
        <IndustryDisclosure group={registry} />
        <IndustrySectionAction
          action={registry.action}
          onServiceSelect={onServiceSelect}
          secondary
        />
      </div>
    </>
  );
}

export function IndustryCategorizationAct({ section, onServiceSelect }) {
  const [commission, document, service] = getIndustryContent(section);

  return (
    <>
      <IndustryHeading section={section} />
      <div className="industry-act-layout">
        <div className="industry-copy">
          <IndustrySubheading>{commission.title}</IndustrySubheading>
          <IndustryParagraphs items={commission.paragraphs.slice(0, 4)} />
          <IndustryParagraph
            text={commission.paragraphs[4]}
            emphasis="не более 30 рабочих дней"
            className="industry-statement"
          />
        </div>
        <div className="industry-act-document" data-industry-reveal>
          <IndustrySubheading>{document.title}</IndustrySubheading>
          <IndustryParagraph text={document.paragraphs[0]} />
          <IndustryParagraph text={document.paragraphs[1]} className="industry-document-name" />
          <IndustryParagraphs items={document.paragraphs.slice(2)} />
        </div>
      </div>
      <div className="industry-act-service">
        <div className="industry-copy">
          <IndustrySubheading>{service.title}</IndustrySubheading>
          <IndustryParagraph text={service.paragraphs[0]} />
          <IndustryParagraph
            text={service.paragraphs[2]}
            emphasis="9 500 ₽"
            className="industry-statement"
          />
          <IndustrySectionAction action={service.action} onServiceSelect={onServiceSelect} accent />
        </div>
        <div className="industry-copy">
          <IndustryParagraph text={service.paragraphs[1]} />
          <IndustryList items={service.list.items} />
        </div>
      </div>
    </>
  );
}
