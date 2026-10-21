export default function IndustryAction({
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
          ? 'industry-action industry-action--secondary'
          : `button industry-action ${accent ? 'industry-action--accent' : 'button--primary'}`
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
