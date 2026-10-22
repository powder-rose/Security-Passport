import Container from '../../../components/ui/Container/Container';
import { AgricultureApplicability, AgricultureRegulations } from './AgricultureScope';
import {
  AgricultureCategorization,
  AgricultureCategorizationAct,
} from './AgricultureCategorization';
import { AgricultureProcess, AgricultureApproval, AgricultureCopies } from './AgricultureWorkflow';
import {
  AgricultureServiceScope,
  AgriculturePricing,
  AgricultureRequiredDocuments,
} from './AgricultureServices';
import {
  AgriculturePassportForm,
  AgricultureRestrictedDocuments,
  AgricultureActualization,
  AgricultureRegulationChanges,
} from './AgriculturePassport';
import { AgricultureAdvantages, AgricultureFaq } from './AgricultureClosing';

const sectionComponents = {
  objects: AgricultureApplicability,
  regulations: AgricultureRegulations,
  categorization: AgricultureCategorization,
  'categorization-act': AgricultureCategorizationAct,
  process: AgricultureProcess,
  approval: AgricultureApproval,
  copies: AgricultureCopies,
  service: AgricultureServiceScope,
  prices: AgriculturePricing,
  documents: AgricultureRequiredDocuments,
  'passport-form': AgriculturePassportForm,
  'restricted-documents': AgricultureRestrictedDocuments,
  actualization: AgricultureActualization,
  'regulation-changes': AgricultureRegulationChanges,
  advantages: AgricultureAdvantages,
  faq: AgricultureFaq,
};

export default function AgricultureSection({ section, onServiceSelect }) {
  const Content = sectionComponents[section.id];

  return (
    <section
      className={`agriculture-section agriculture-section--${section.id}`}
      id={section.id}
      aria-labelledby={`agriculture-${section.id}-title`}
    >
      <Container>
        <Content section={section} onServiceSelect={onServiceSelect} />
      </Container>
    </section>
  );
}
