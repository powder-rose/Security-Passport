import './RosgvardiaTable.css';

export default function RosgvardiaTable({ table, label, comparison = false }) {
  return (
    <div className="rosgvardia-table-scroll" role="region" aria-label={label} tabIndex={0}>
      <table
        className={`rosgvardia-table${comparison ? ' rosgvardia-table--comparison' : ''}`}
        aria-label={label}
      >
        <thead>
          <tr>
            {table.headers.map(header => (
              <th scope="col" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map(row => (
            <tr key={row[0]}>
              <th scope="row">{row[0]}</th>
              {row.slice(1).map((cell, index) => (
                <td key={table.headers[index + 1]}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
