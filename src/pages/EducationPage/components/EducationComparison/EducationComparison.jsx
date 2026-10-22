export default function EducationComparison({ headers, rows }) {
  return (
    <table className="education-comparison">
      <thead>
        <tr>
          {headers.map(header => (
            <th scope="col" key={header}>
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <th scope="row">{label}</th>

            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
