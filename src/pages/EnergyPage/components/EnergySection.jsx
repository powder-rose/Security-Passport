import Container from '../../../components/ui/Container/Container';
import EnergyOffers from './EnergyOffers';
import { EnergyApplicability, EnergyRegulations } from './EnergyScope';
import { EnergyCategorization, EnergyCategorizationAct } from './EnergyCategorization';
import { EnergyProcess, EnergyApproval } from './EnergyWorkflow';
import { EnergyServiceScope, EnergyPricing, EnergyRequiredDocuments } from './EnergyServices';
import {
  EnergyPassportForm,
  EnergyActualization,
  EnergyRestrictedDocuments,
} from './EnergyPassport';
import { EnergyAdvantages, EnergyFaq } from './EnergyClosing';

const sectionComponents = {
  services: EnergyOffers,
  objects: EnergyApplicability,
  regulations: EnergyRegulations,
  categorization: EnergyCategorization,
  'categorization-act': EnergyCategorizationAct,
  process: EnergyProcess,
  approval: EnergyApproval,
  'passport-form': EnergyPassportForm,
  service: EnergyServiceScope,
  prices: EnergyPricing,
  documents: EnergyRequiredDocuments,
  actualization: EnergyActualization,
  'restricted-documents': EnergyRestrictedDocuments,
  advantages: EnergyAdvantages,
  faq: EnergyFaq,
};

export default function EnergySection({ section, onServiceSelect }) {
  const Content = sectionComponents[section.id];

  return (
    <section
      className={`energy-section energy-section--${section.id}`}
      id={section.id}
      aria-labelledby={`energy-${section.id}-title`}
    >
      <Container>
        <Content section={section} onServiceSelect={onServiceSelect} />
      </Container>
    </section>
  );
}
