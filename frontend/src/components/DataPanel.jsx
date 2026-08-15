function DataPanel({ title, children }) {
  return (
    <section className="data-panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default DataPanel;
