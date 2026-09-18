import Container from '../../components/ui/Container/Container';
import './Advantages.css';


const proofs = [
  {
    id: 'experience',
    eyebrow: 'Практический опыт',
    value: '15+',
    unit: 'лет',
    title: 'Личная практика руководителя',
    text:
      'Николай Бойков более 15 лет работает с организациями по обязательным направлениям безопасности, включая антитеррористическую защищённость объектов.',
    variant: 'dark',
  },

  {
    id: 'company',
    eyebrow: 'Юридическое лицо',
    value: 'СПЕЦКОНС',
    title: 'Работа ведётся от имени действующей организации',
    text:
      'ООО «СПЕЦКОНС» · ИНН 5027310150 · ОГРН 1225000108618.',
    href:
      'https://boykovgroup.ru/rekvizity',
    linkLabel:
      'Проверить реквизиты',
    variant: 'light',
  },

  {
    id: 'licenses',
    eyebrow: 'Документы компании',
    value: '2',
    unit: 'лицензии',
    title: 'Публично указанные лицензии',
    text:
      'Лицензия МЧС Л014-00101-50/00624678 и образовательная лицензия Л035-01255-50-06059814.',
    href:
      'https://boykovgroup.ru/rekvizity',
    linkLabel:
      'Посмотреть реквизиты',
    variant: 'accent',
  },
];


export default function Advantages() {
  return (
    <section
      className="proofs"
      id="advantages"
      aria-labelledby="proofs-title"
    >
      <Container>
        <div className="proofs__heading">
          <div>
            <p className="proofs__kicker">
              Почему нам доверяют
            </p>

            <h2 id="proofs-title">
              Не обещания,
              <em> а проверяемые факты</em>
            </h2>
          </div>

          <p className="proofs__lead">
            Показываем то, что можно проверить:
            опыт руководителя, юридическое лицо
            и публичные реквизиты компании.
          </p>
        </div>


        <div className="proofs__grid">
          {proofs.map(
            (proof, index) => (
              <article
                className={
                  `proof-card ` +
                  `proof-card--${proof.variant}`
                }
                key={proof.id}
              >
                <div className="proof-card__top">
                  <span className="proof-card__number">
                    {String(
                      index + 1,
                    ).padStart(2, '0')}
                  </span>

                  <span className="proof-card__eyebrow">
                    {proof.eyebrow}
                  </span>
                </div>


                <div className="proof-card__value">
                  <strong>
                    {proof.value}
                  </strong>

                  {proof.unit ? (
                    <span>
                      {proof.unit}
                    </span>
                  ) : null}
                </div>


                <div className="proof-card__content">
                  <h3>
                    {proof.title}
                  </h3>

                  <p>
                    {proof.text}
                  </p>

                  {proof.href ? (
                    <a
                      className="proof-card__link"
                      href={proof.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {proof.linkLabel}

                      <span aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ) : null}
                </div>
              </article>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}
