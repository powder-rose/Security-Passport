import './AgricultureTable.css';

export default function AgricultureTable({ headers, rows, label }) {
  return (
    <div className="agriculture-table-scroll" role="region" aria-label={label} tabIndex={0}>
      <table className="agriculture-table">
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
              <th scope="row">{row[0]}</th>
              {row.slice(1).map(cell => (
                <td key={cell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
