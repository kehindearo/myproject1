export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange?.(!checked)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 20,
        border: "none",
        background: checked ? "var(--success)" : "var(--border)",
        position: "relative",
        transition: "background 250ms cubic-bezier(0.34,1.56,0.64,1)",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          transition: "left 250ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    </button>
  );
}
