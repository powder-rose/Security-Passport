export default function EducationRegulationDetails({ title, children }) {
  return (
    <div className="education-regulation-details">
      <h3>{title}</h3>

      <div className="education-regulation-details__content">{children}</div>
    </div>
  );
}
