import Container from '../../../../components/ui/Container/Container';
import { rosgvardiaObjectType } from '../../../../data/rosgvardiaObjectType.js';

export default function CrowdRosgvardia() {
  return (
    <section
      className="crowd-rosgvardia"
      id="rosgvardia-difference"
      aria-labelledby="crowd-rosgvardia-title"
    >
      <Container className="crowd-rosgvardia__layout">
        <h2 id="crowd-rosgvardia-title">
          ММПЛ и объекты обязательной охраны Росгвардии — в чём разница
        </h2>

        <div className="crowd-rosgvardia__copy">
          <p>
            Постановление Правительства РФ № 272 устанавливает отдельные требования к местам
            массового пребывания людей и объектам (территориям), подлежащим обязательной охране
            войсками национальной гвардии Российской Федерации.
          </p>

          <p>
            Места массового пребывания людей включаются в соответствующие перечни, формируемые
            уполномоченными региональными или муниципальными органами власти. Объекты обязательной
            охраны Росгвардии определяются по отдельному перечню, утверждаемому распоряжением
            Правительства Российской Федерации.
          </p>

          <p>
            Для этих направлений предусмотрены разные критерии категорирования, процедуры
            обследования, формы паспортов безопасности и порядок их утверждения.
          </p>

          <p className="crowd-rosgvardia__notice">
            <strong>Важно:</strong> объекты обязательной охраны Росгвардии не являются просто более
            крупными местами массового пребывания людей. Они относятся к самостоятельной категории
            объектов с отдельными нормативными требованиями.
          </p>

          <p>
            <a className="crowd-rosgvardia__link" href={rosgvardiaObjectType.path}>
              Паспорт безопасности объекта, подлежащего обязательной охране Росгвардией
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
