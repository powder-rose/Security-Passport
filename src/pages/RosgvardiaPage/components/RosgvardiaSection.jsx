import Container from '../../../components/ui/Container/Container';
import { RosgvardiaObjects, RosgvardiaRegulations, RosgvardiaCategories } from './RosgvardiaScope';
import {
  RosgvardiaCommission,
  RosgvardiaProcess,
  RosgvardiaApproval,
  RosgvardiaCopies,
} from './RosgvardiaWorkflow';
import {
  RosgvardiaAct,
  RosgvardiaConfidentiality,
  RosgvardiaForm,
  RosgvardiaActualization,
} from './RosgvardiaPassport';
import {
  RosgvardiaServiceScope,
  RosgvardiaPricing,
  RosgvardiaDocuments,
} from './RosgvardiaServices';
import {
  RosgvardiaComparison,
  RosgvardiaInspections,
  RosgvardiaStandard,
  RosgvardiaAdvantages,
  RosgvardiaFaq,
} from './RosgvardiaClosing';

const sectionComponents = {
  objects: RosgvardiaObjects,
  regulations: RosgvardiaRegulations,
  categorization: RosgvardiaCategories,
  commission: RosgvardiaCommission,
  act: RosgvardiaAct,
  process: RosgvardiaProcess,
  approval: RosgvardiaApproval,
  copies: RosgvardiaCopies,
  confidentiality: RosgvardiaConfidentiality,
  form: RosgvardiaForm,
  service: RosgvardiaServiceScope,
  prices: RosgvardiaPricing,
  documents: RosgvardiaDocuments,
  actualization: RosgvardiaActualization,
  comparison: RosgvardiaComparison,
  inspections: RosgvardiaInspections,
  standard: RosgvardiaStandard,
  advantages: RosgvardiaAdvantages,
  faq: RosgvardiaFaq,
};

export default function RosgvardiaSection({ section, onServiceSelect }) {
  const Content = sectionComponents[section.id];

  return (
    <section
      className={`rosgvardia-section rosgvardia-section--${section.id}`}
      id={section.id}
      aria-labelledby={`rosgvardia-${section.id}-title`}
    >
      <Container>
        <Content section={section} onServiceSelect={onServiceSelect} />
      </Container>
    </section>
  );
}
