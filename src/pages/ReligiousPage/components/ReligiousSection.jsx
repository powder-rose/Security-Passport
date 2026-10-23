import Container from '../../../components/ui/Container/Container';
import { ReligiousObjects, ReligiousRegulations, ReligiousCategorization } from './ReligiousScope';
import {
  ReligiousCommission,
  ReligiousProcess,
  ReligiousApproval,
  ReligiousCopies,
} from './ReligiousWorkflow';
import {
  ReligiousExaminationAct,
  ReligiousServiceScope,
  ReligiousPricing,
  ReligiousRequiredDocuments,
} from './ReligiousServices';
import {
  ReligiousPassportForm,
  ReligiousRestrictedDocuments,
  ReligiousActualization,
  ReligiousMeasures,
} from './ReligiousPassport';
import {
  ReligiousVariants,
  ReligiousHeritage,
  ReligiousAdvantages,
  ReligiousFaq,
} from './ReligiousClosing';

const sectionComponents = {
  objects: ReligiousObjects,
  regulations: ReligiousRegulations,
  categorization: ReligiousCategorization,
  commission: ReligiousCommission,
  'examination-act': ReligiousExaminationAct,
  process: ReligiousProcess,
  approval: ReligiousApproval,
  copies: ReligiousCopies,
  service: ReligiousServiceScope,
  prices: ReligiousPricing,
  documents: ReligiousRequiredDocuments,
  'passport-form': ReligiousPassportForm,
  'restricted-documents': ReligiousRestrictedDocuments,
  actualization: ReligiousActualization,
  measures: ReligiousMeasures,
  'religious-objects': ReligiousVariants,
  heritage: ReligiousHeritage,
  advantages: ReligiousAdvantages,
  faq: ReligiousFaq,
};

export default function ReligiousSection({ section, onServiceSelect }) {
  const Content = sectionComponents[section.id];

  return (
    <section
      className={`religious-section religious-section--${section.id}`}
      id={section.id}
      aria-labelledby={`religious-${section.id}-title`}
    >
      <Container>
        <Content section={section} onServiceSelect={onServiceSelect} />
      </Container>
    </section>
  );
}
