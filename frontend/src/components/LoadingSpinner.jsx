function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="loading-spinner" role="status" aria-label={label}>
      <span />
      <p>{label}</p>
    </div>
  );
}

export default LoadingSpinner;
