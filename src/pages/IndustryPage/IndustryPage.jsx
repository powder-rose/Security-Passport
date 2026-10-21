import { useState } from 'react';
import ObjectTypeHero from '../ObjectTypePage/components/ObjectTypeHero/ObjectTypeHero';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import IndustryAction from './components/IndustryAction';
import IndustrySection from './components/IndustrySection';
import { industryHeroFacts, industrySections } from './industryPageData';
import './IndustryPage.css';

export default function IndustryPage({ objectType }) {
  const [selectedService, setSelectedService] = useState(objectType.seoName);

  return (
    <main id="main-content" className="industry-page">
      <ObjectTypeHero
        objectType={objectType}
        breadcrumbLabel="Разработка паспорта безопасности объекта"
        showCoverage={false}
        facts={industryHeroFacts}
        actions={
          <>
            <IndustryAction service={objectType.seoName} onSelect={setSelectedService}>
              Заказать паспорт
            </IndustryAction>
            <IndustryAction
              service="Проверить требования для объекта"
              onSelect={setSelectedService}
              secondary
            >
              Проверить требования для объекта
            </IndustryAction>
          </>
        }
        aside={
          <>
            <p className="object-service-hero__card-label">Нормативное основание</p>
            <div className="industry-regulation-number">
              <span>ПП РФ</span>
              <strong>№ 258</strong>
            </div>
            <p className="industry-regulation-date">от 01.03.2024</p>
            <p>{objectType.regulationFocus}</p>
          </>
        }
      />

      {industrySections.map(section => (
        <IndustrySection key={section.id} section={section} onServiceSelect={setSelectedService} />
      ))}

      <FinalCTA
        service={selectedService}
        objectType={objectType.title}
        allowEmailOnly
        objectPlaceholder="Расскажите об объекте и необходимых документах"
      />
    </main>
  );
}
