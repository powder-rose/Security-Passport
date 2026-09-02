import Container from '../ui/Container/Container';
import { SITE } from '../../config/site';
import { CITY } from '../../config/city';
import './Footer.css';

const navLinks = [
  ['#about-passport', 'О паспорте'],
  ['#objects', 'Кому нужен паспорт'],
  ['#process', 'Как проходит работа'],
  ['#prices', 'Стоимость'],
  ['#documents', 'Исходные данные'],
  ['#expert', 'Эксперт'],
  ['#faq', 'FAQ'],
];

const legalLinks = [
  [SITE.offerUrl, 'Публичная оферта'],
  [SITE.personalDataUrl, 'Согласие на обработку ПД'],
  [SITE.privacyUrl, 'Политика конфиденциальности'],
];

export default function Footer() {
  return (
    <footer className="site-footer" aria-label="Подвал сайта">
      <Container>
        <div className="site-footer__top">
          <div className="site-footer__brand-block">
            <a className="site-footer__brand" href="#top" aria-label={`${SITE.brand}: вернуться к началу страницы`}>
              {SITE.brand}
            </a>
            <p>
              Разработка документов по комплексной безопасности объектов и сопровождение
              согласования по России.
            </p>
          </div>

          <nav className="site-footer__nav" aria-label="Навигация в подвале">
            <p>Разделы</p>
            <ul>
              {navLinks.map(([href, label]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__contacts">
            <p>Связаться</p>
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>

            {CITY.address ? (
              <div className="site-footer__address">
                <span>Наш адрес</span>
                <strong>{CITY.address}</strong>
              </div>
            ) : null}
            <a className="site-footer__contact-action" href="#contact">Обсудить объект ↗</a>
          </div>
        </div>

        <div className="site-footer__legal-links" aria-label="Юридическая информация">
          {legalLinks.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </div>

        <div className="site-footer__bottom">
          <div>
            <span>{SITE.legalName}</span>
            <span>ИНН {SITE.taxId}</span>
            <span>© {new Date().getFullYear()} {SITE.brand}</span>
          </div>

          <p>
            Информация на сайте носит справочный характер и не является публичной офертой.
            Перечень документов, стоимость, сроки и применимые требования определяются с учётом
            конкретного объекта и согласовываются до начала работ.
          </p>
        </div>
      </Container>
    </footer>
  );
}
