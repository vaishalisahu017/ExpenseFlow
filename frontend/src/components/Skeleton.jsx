function Skeleton({ rows = 4 }) {
  return (
    <div className="skeleton-list" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

export default Skeleton;
