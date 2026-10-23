import './ReligiousTable.css';

export default function ReligiousTable({ table, label }) {
  return (
    <div className="religious-table" data-scroll-reveal>
      <table aria-label={label}>
        <thead>
          <tr>
            {table.headers.map(header => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map(row => (
            <tr key={row[0]}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={table.headers[index]} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={table.headers[index]}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
