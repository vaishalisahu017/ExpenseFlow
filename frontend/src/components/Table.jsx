function Table({ columns, children, className = "" }) {
  return (
    <div className="table-wrap">
      <table className={`data-table ${className}`.trim()}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default Table;
