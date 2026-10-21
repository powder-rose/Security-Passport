import './EnergyTable.css';

export default function EnergyTable({ headers, rows, label, variant = 'services' }) {
  return (
    <div className="energy-table-scroll" role="region" aria-label={label} tabIndex={0}>
      <table className={`energy-table energy-table--${variant}`}>
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
          {rows.map((row, index) => (
            <tr key={row[0]}>
              <th scope="row">
                <span
                  className="energy-table__marker"
                  data-number={String(index + 1).padStart(2, '0')}
                  aria-hidden="true"
                />
                <span>{row[0]}</span>
              </th>
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
