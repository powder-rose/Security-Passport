import './IndustryTable.css';

export default function IndustryTable({ headers, rows, label, variant }) {
  return (
    <div
      className="industry-table-scroll"
      role="region"
      aria-label={label}
      tabIndex={0}
      data-scroll-reveal
    >
      <table className={`industry-table industry-table--${variant}`}>
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
          {rows.map((row, rowIndex) => (
            <tr key={row[0]}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={headers[index]} scope="row">
                    <div className="industry-table__label">
                      <span
                        className="industry-table__index"
                        data-number={
                          variant === 'categories'
                            ? cell.match(/«(.+)»/)?.[1]
                            : String(rowIndex + 1).padStart(2, '0')
                        }
                        aria-hidden="true"
                      />
                      <span>{cell}</span>
                    </div>
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
