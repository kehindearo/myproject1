import { forwardRef } from "react";

const VARIANT_CLASS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  destructive: "btn-destructive",
};

const Button = forwardRef(function Button(
  { variant = "primary", block = false, loading = false, disabled, children, className = "", ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`btn ${VARIANT_CLASS[variant]} ${block ? "btn-block" : ""} ${
        loading ? "btn-loading" : ""
      } ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span
          className={`spinner ${variant === "secondary" || variant === "ghost" ? "spinner-accent" : ""}`}
          style={{ position: "absolute" }}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
});

export default Button;
