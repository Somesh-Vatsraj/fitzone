export default function AdminTable({ columns, rows, actions, empty = 'No records found.' }) {
  const totalCols = columns.length + (actions ? 1 : 0);
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => <th key={c.key}>{c.header}</th>)}
            {actions ? <th className="table__th-actions">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={totalCols} className="table__empty">{empty}</td></tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={row.id ?? idx}>
                {columns.map((c) => (
                  <td key={c.key} data-label={c.header}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {actions ? <td className="table__actions">{actions(row)}</td> : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
