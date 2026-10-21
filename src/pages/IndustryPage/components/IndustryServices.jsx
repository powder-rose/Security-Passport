import { getIndustryContent } from './getIndustryContent';
import {
  IndustryHeading,
  IndustryParagraph,
  IndustryParagraphs,
  IndustrySectionAction,
  IndustrySubheading,
} from './IndustryContent';
import { IndustryDocumentRegister } from './IndustryRegisters';
import IndustryPriceCard from './IndustryPriceCard';
import IndustryTable from './IndustryTable';
import './IndustryServices.css';

export function IndustryServiceScope({ section, onServiceSelect }) {
  const [service] = getIndustryContent(section);

  return (
    <>
      <div className="industry-section-lead">
        <IndustryHeading section={section} />
        <div className="industry-copy">
          <IndustrySubheading>{service.title}</IndustrySubheading>
          <IndustryParagraph text={service.paragraphs[0]} />
        </div>
      </div>
      <IndustryTable {...service.table} label={section.title} variant="services" />
      <div className="industry-service-footer">
        <IndustryParagraphs items={service.paragraphs.slice(1)} />
        <IndustrySectionAction action={service.action} onServiceSelect={onServiceSelect} />
      </div>
    </>
  );
}

export function IndustryPricing({ section, onServiceSelect }) {
  const [pricing, conditions] = getIndustryContent(section);

  return (
    <>
      <div className="industry-section-lead">
        <IndustryHeading section={section} />
        <IndustryParagraph text={conditions.paragraphs[0]} />
      </div>
      <div className="industry-price-cards">
        {pricing.prices.items.map(item => (
          <IndustryPriceCard key={item.id} item={item} onServiceSelect={onServiceSelect} />
        ))}
      </div>
      <div className="industry-price-conditions">
        <IndustrySubheading>{conditions.title}</IndustrySubheading>
        <div className="industry-price-conditions__cases">
          {conditions.paragraphs.slice(1, 3).map(text => (
            <IndustryParagraph key={text} text={text} />
          ))}
        </div>
        <IndustryParagraphs items={conditions.paragraphs.slice(3)} />
        <IndustrySectionAction
          action={conditions.action}
          onServiceSelect={onServiceSelect}
          secondary
        />
      </div>
    </>
  );
}

export function IndustryRequiredDocuments({ section, onServiceSelect }) {
  const [documents] = getIndustryContent(section);

  return (
    <>
      <div className="industry-split-layout">
        <div className="industry-section-intro">
          <IndustryHeading section={section} />
          <IndustrySubheading>{documents.title}</IndustrySubheading>
          <IndustryParagraph text={documents.paragraphs[0]} />
          <IndustrySectionAction action={documents.action} onServiceSelect={onServiceSelect} />
        </div>
        <IndustryDocumentRegister table={documents.table} />
      </div>
      <div className="industry-documents-note">
        <IndustryParagraph text={documents.paragraphs[1]} />
        <IndustryParagraph
          text={documents.paragraphs[2]}
          className="industry-documents-note__privacy"
        />
      </div>
    </>
  );
}
