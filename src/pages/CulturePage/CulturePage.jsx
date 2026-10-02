import './CulturePage.css';

import {
  cultureWhyItems,
  cultureFaqItems,
} from './culturePageData';

import CultureHeroAndObjects
from './components/CultureHeroAndObjects';

import CultureRegulationAndCategories
from './components/CultureRegulationAndCategories';

import CultureCategorization
from './components/CultureCategorization';

import CultureActAndPassport
from './components/CultureActAndPassport';

import CultureApprovalAndRestrictions
from './components/CultureApprovalAndRestrictions';


import CultureServiceScope
from './components/CultureServiceScope';

import CulturePricing
from './components/CulturePricing';

import CultureRequiredDocuments
from './components/CultureRequiredDocuments';


import CulturePassportForm
from './components/CulturePassportForm';

import CulturePassportActualization
from './components/CulturePassportActualization';

import CultureCurrentRequirements
from './components/CultureCurrentRequirements';
import Container from '../../components/ui/Container/Container';
import FinalCTA from '../../sections/FinalCTA/FinalCTA';
import { useCity } from '../../context/GeoContext';


// CULTURE_REGIONAL_WORK_TEXT_V1:start

function getNeutralCultureRegionPrepositional(
  name,
) {
  const value =
    String(name || '').trim();

  if (!value) {
    return '';
  }

  const parts =
    value.split(' — ');

  let head =
    parts[0];

  const tail =
    parts.length > 1
      ? ` — ${parts.slice(1).join(' — ')}`
      : '';

  if (
    head.startsWith(
      'Республика ',
    )
  ) {
    return (
      `Республике ${head.slice(
        'Республика '.length,
      )}${tail}`
    );
  }

  if (
    head.endsWith(
      ' Республика',
    )
  ) {
    head = head
      .replace(
        /ская Республика$/,
        'ской Республике',
      )
      .replace(
        /цкая Республика$/,
        'цкой Республике',
      );

    return `${head}${tail}`;
  }

  if (
    head.endsWith(
      ' область',
    )
  ) {
    head = head
      .replace(
        /ская /g,
        'ской ',
      )
      .replace(
        /цкая /g,
        'цкой ',
      )
      .replace(
        /ная /g,
        'ной ',
      )
      .replace(
        /яя /g,
        'ей ',
      )
      .replace(
        / область$/,
        ' области',
      );

    return `${head}${tail}`;
  }

  if (
    head.endsWith(
      ' край',
    )
  ) {
    head = head
      .replace(
        /ский край$/,
        'ском крае',
      )
      .replace(
        /цкий край$/,
        'цком крае',
      );

    return `${head}${tail}`;
  }

  if (
    head.endsWith(
      ' автономный округ',
    )
  ) {
    head = head
      .replace(
        /ский автономный округ$/,
        'ском автономном округе',
      )
      .replace(
        /цкий автономный округ$/,
        'цком автономном округе',
      );

    return `${head}${tail}`;
  }

  return '';
}


function getCultureRegionalWorkText(
  currentCity,
) {
  if (
    !currentCity ||
    currentCity.isDefault
  ) {
    return '';
  }

  if (
    currentCity.prepositional
  ) {
    return (
      `Работаем в ` +
      `${currentCity.prepositional}.`
    );
  }

  if (
    currentCity.type === 'region'
  ) {
    const regionName =
      getNeutralCultureRegionPrepositional(
        currentCity.name,
      );

    if (regionName) {
      return (
        `Работаем в ${regionName}.`
      );
    }

    return (
      `Работаем в регионе ` +
      `«${currentCity.name}».`
    );
  }

  if (
    currentCity.type === 'city'
  ) {
    return (
      `Работаем в городе ` +
      `«${currentCity.name}».`
    );
  }

  return (
    `Работаем в населённом пункте ` +
    `«${currentCity.name}».`
  );
}

// CULTURE_REGIONAL_WORK_TEXT_V1:end


export default function CulturePage({
  objectType,
}) {
  const city =
    useCity();

  const regionalWorkText =
    getCultureRegionalWorkText(
      city,
    );

  return (
    <main
      id="main-content"
      className="culture-page"
    >
      <CultureHeroAndObjects
        objectType={objectType}
        regionalWorkText={regionalWorkText}
      />


      <CultureRegulationAndCategories />


      <CultureCategorization />


      <CultureActAndPassport />


      <CultureApprovalAndRestrictions />


      <CultureServiceScope />

      <CulturePricing />

      <CultureRequiredDocuments />


      <CulturePassportForm />

      <CulturePassportActualization />

      <CultureCurrentRequirements />


      <section
        className="culture-why"
        id="culture-why"
      >
        <Container>
          <div className="culture-why__header">
            <div>
              <p className="culture-kicker">
                Подход к работе
              </p>

              <h2>
                Почему БОЙКОВГРУПП
              </h2>
            </div>

            <p>
              Для объекта культуры важно
              правильно определить нормативный
              режим и последовательно пройти
              категорирование, оформление акта,
              разработку паспорта
              и предусмотренное согласование.
            </p>
          </div>

          <div className="culture-why__grid">
            {cultureWhyItems.map(
              (item) => (
                <article
                  className="culture-why__item"
                  key={item.number}
                >
                  <span>
                    {item.number}
                  </span>

                  <div>
                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.text}
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>

          <nav
            className="culture-why__links"
            aria-label="Связанные услуги"
          >
            <a href="/">
              Паспорт безопасности объекта
              <span aria-hidden="true">
                ↗
              </span>
            </a>

            <a href="/akt-obsledovaniya-i-kategorirovaniya-obekta/">
              Акт обследования и категорирования
              <span aria-hidden="true">
                ↗
              </span>
            </a>

            <a href="/aktualizaciya-pasporta-bezopasnosti-obekta/">
              Актуализация паспорта безопасности
              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </nav>
        </Container>
      </section>


      <section
        className="culture-faq"
        id="culture-faq"
      >
        <Container>
          <div className="culture-faq__layout">
            <div className="culture-faq__heading">
              <div>
                <p className="culture-kicker">
                  Вопросы и ответы
                </p>

                <h2>
                  Частые вопросы
                  о паспорте безопасности
                  объекта культуры
                </h2>
              </div>

              <p>
                Ответы по ПП РФ №176,
                категорированию, актуализации,
                форме паспорта, ДСП
                и согласованию.
              </p>
            </div>

            <div className="culture-faq__list">
              {cultureFaqItems.map(
                (item, index) => (
                  <details
                    className="culture-faq__item"
                    key={item.question}
                  >
                    <summary>
                      <span className="culture-faq__number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span className="culture-faq__question">
                        {item.question}
                      </span>

                      <span
                        className="culture-faq__toggle"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>

                    <div className="culture-faq__answer">
                      <p>
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>


      <FinalCTA />

</main>
  );
}
