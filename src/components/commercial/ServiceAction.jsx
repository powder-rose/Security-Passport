import './ServiceAction.css';

export default function ServiceAction({
  children,
  service,
  onSelect,
  secondary = false,
  accent = false,
  ariaLabel,
}) {
  return (
    <a
      className={
        secondary
          ? 'service-action service-action--secondary'
          : `button service-action ${accent ? 'service-action--accent' : 'button--primary'}`
      }
      href="#lead-form"
      aria-label={ariaLabel}
      onClick={() => onSelect(service)}
    >
      {children}
      {secondary ? <span aria-hidden="true">→</span> : null}
    </a>
  );
}
