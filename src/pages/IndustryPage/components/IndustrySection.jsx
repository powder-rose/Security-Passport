import Container from '../../../components/ui/Container/Container';
import ProcessSteps from '../../../sections/Process/ProcessSteps';
import PriceRow from '../../../sections/Prices/PriceRow';
import FAQList from '../../../sections/FAQ/FAQList';
import IndustryAction from './IndustryAction';
import IndustryTable from './IndustryTable';

function IndustryBlock({ block, sectionTitle, onServiceSelect }) {
  switch (block.type) {
    case 'heading':
      return <h3 className="industry-subheading">{block.text}</h3>;
    case 'paragraph':
      return <p className="industry-paragraph">{block.text}</p>;
    case 'list':
      return (
        <ul className="industry-list">
          {block.items.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'table':
      return <IndustryTable headers={block.headers} rows={block.rows} label={sectionTitle} />;
    case 'action':
      return (
        <div className="industry-section__action">
          <IndustryAction service={block.service} onSelect={onServiceSelect}>
            {block.label}
          </IndustryAction>
        </div>
      );
    case 'link':
      return (
        <p className="industry-paragraph">
          <a className="industry-inline-link" href={block.href}>
            {block.label}
          </a>
        </p>
      );
    case 'steps':
      return <ProcessSteps steps={block.items} />;
    case 'prices':
      return (
        <div className="prices-section__list">
          {block.items.map(item => (
            <PriceRow key={item.id} item={item} onServiceSelect={onServiceSelect} />
          ))}
        </div>
      );
    case 'advantages':
      return (
        <div className="industry-advantages">
          {block.items.map((item, index) => (
            <article className="industry-advantage" key={item.title}>
              <span className="industry-advantage__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      );
    case 'faq':
      return <FAQList items={block.items} />;
    default:
      return null;
  }
}

function getBlockKey(block) {
  return (
    block.text ||
    block.label ||
    block.headers?.join('|') ||
    block.items?.[0]?.id ||
    block.items?.[0]?.title ||
    block.items?.[0] ||
    block.type
  );
}

export default function IndustrySection({ section, onServiceSelect }) {
  const headingId = `industry-${section.id}-title`;

  return (
    <section className="industry-section" id={section.id} aria-labelledby={headingId}>
      <Container>
        <h2 className="industry-section__title" id={headingId}>
          {section.title}
        </h2>
        <div className="industry-section__body">
          {section.blocks.map(block => (
            <IndustryBlock
              key={getBlockKey(block)}
              block={block}
              sectionTitle={section.title}
              onServiceSelect={onServiceSelect}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
