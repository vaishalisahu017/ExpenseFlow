function Button({ children, className = "", variant = "primary", ...props }) {
  const variantClass = variant === "secondary" ? "secondary-button" : "primary-button";

  return (
    <button className={`${variantClass} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  );
}

export default Button;
