export default function IndustryAction({ children, service, onSelect, secondary = false }) {
  return (
    <a
      className={secondary ? 'object-service-hero__back' : 'button button--primary'}
      href="#lead-form"
      onClick={() => onSelect(service)}
    >
      {children}
      {secondary ? <span aria-hidden="true">→</span> : null}
    </a>
  );
}
