export default function IndustryTable({ headers, rows, label }) {
  return (
    <div className="industry-table-scroll" role="region" aria-label={label} tabIndex={0}>
      <table className="industry-table">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row[0]}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={headers[index]} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={headers[index]}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
