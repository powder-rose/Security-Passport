import Container from '../../../components/ui/Container/Container';
import { IndustryApplicability, IndustryRegulation } from './IndustryScope';
import { IndustryCategories, IndustryCategorizationAct } from './IndustryCategorization';
import { IndustryProcess, IndustryApproval, IndustryCopies } from './IndustryWorkflow';
import {
  IndustryServiceScope,
  IndustryPricing,
  IndustryRequiredDocuments,
} from './IndustryServices';
import {
  IndustryPassportForm,
  IndustryRestrictedDocuments,
  IndustryActualization,
  IndustryStandard,
} from './IndustryPassport';
import { IndustryAdvantages, IndustryFaq } from './IndustryClosing';

const sectionComponents = {
  objects: IndustryApplicability,
  'about-passport': IndustryRegulation,
  categorization: IndustryCategories,
  'categorization-act': IndustryCategorizationAct,
  process: IndustryProcess,
  approval: IndustryApproval,
  copies: IndustryCopies,
  service: IndustryServiceScope,
  prices: IndustryPricing,
  documents: IndustryRequiredDocuments,
  'passport-form': IndustryPassportForm,
  'restricted-documents': IndustryRestrictedDocuments,
  actualization: IndustryActualization,
  standard: IndustryStandard,
  advantages: IndustryAdvantages,
  faq: IndustryFaq,
};

export default function IndustrySection({ section, onServiceSelect }) {
  const Content = sectionComponents[section.id];

  return (
    <section
      className={`industry-section industry-section--${section.id}`}
      id={section.id}
      aria-labelledby={`industry-${section.id}-title`}
    >
      <Container>
        <Content section={section} onServiceSelect={onServiceSelect} />
      </Container>
    </section>
  );
}
