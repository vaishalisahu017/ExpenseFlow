function InsightCard({ label, value, helper }) {
  return (
    <article className="insight-card">
      <p>{label}</p>
      <strong>{value}</strong>
      {helper && <span>{helper}</span>}
    </article>
  );
}

export default InsightCard;
