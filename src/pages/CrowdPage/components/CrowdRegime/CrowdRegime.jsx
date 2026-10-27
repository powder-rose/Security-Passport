import Container from '../../../../components/ui/Container/Container';
import { rosgvardiaObjectType } from '../../../../data/rosgvardiaObjectType.js';

export default function CrowdRegime() {
  return (
    <>
      <section className="crowd-regime">
        <Container>
          <div className="crowd-regime__layout">
            <div className="crowd-regime__identity">
              <p className="crowd-kicker">Ключевое различие</p>

              <span className="crowd-regime__mark">≠</span>
            </div>

            <div className="crowd-regime__content">
              <h2>«Место, где много людей» и ММПЛ по ПП РФ №272 — не всегда одно и то же</h2>

              <p className="crowd-regime__lead">
                По фактическому назначению место может напоминать торговый центр, гостиницу,
                площадь, парк, общественное пространство или культурную площадку.
              </p>

              <div className="crowd-regime__principle">
                <span>Принцип проверки</span>

                <p>
                  Если для конкретного объекта действуют специальные отраслевые требования, ПП РФ
                  №272 нельзя механически применять вместо них.
                </p>
              </div>

              <p className="crowd-regime__lead">
                Для объектов обязательной охраны Росгвардии ПП РФ № 272 предусматривает отдельные
                требования к категорированию, форме паспорта и порядку его оформления.
              </p>

              <p className="crowd-regime__lead">
                <a className="button button--primary" href={rosgvardiaObjectType.path}>
                  {rosgvardiaObjectType.seoName}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
