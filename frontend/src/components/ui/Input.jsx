import { useId, useState } from "react";

/**
 * Floating-label text input matching the Collabo Travel input spec:
 * grey placeholder centered → orange top-left label on focus/filled.
 */
export default function Input({
  label,
  icon,
  error,
  success,
  helperText,
  type = "text",
  value,
  onChange,
  rightSlot,
  className = "",
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const isActive = focused || (value !== undefined && value !== "" && value !== null);

  return (
    <div className={`field ${icon ? "has-icon" : ""} ${isActive ? "is-active" : ""} ${
      focused ? "is-focused" : ""
    } ${error ? "is-error" : ""} ${success ? "is-success" : ""} ${className}`}
    >
      {icon && (
        <span className="field-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        aria-invalid={!!error}
        aria-describedby={helperText ? `${id}-helper` : undefined}
        {...rest}
      />
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      {success && !rightSlot && (
        <span className="field-success-icon" aria-hidden="true">
          <CheckIcon />
        </span>
      )}
      {rightSlot}
      {helperText && (
        <p id={`${id}-helper`} className={`field-helper ${error ? "is-error" : ""}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
