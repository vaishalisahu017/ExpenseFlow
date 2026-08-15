function Input({ label, id, multiline = false, children, ...props }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children || (multiline ? <textarea id={id} {...props} /> : <input id={id} {...props} />)}
    </div>
  );
}

export default Input;
