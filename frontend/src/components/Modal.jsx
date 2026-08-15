function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-panel" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close modal">
            x
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export default Modal;
