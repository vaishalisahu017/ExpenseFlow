function StatCard({ label, value, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

export default StatCard;
