export default function Chip({ active, onClick, children, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 40,
        padding: "0 16px",
        borderRadius: 50,
        border: "none",
        background: active ? "var(--accent)" : "var(--input-bg)",
        color: active ? "#fff" : "var(--text-primary)",
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: "nowrap",
        transition: "background 200ms ease, color 200ms ease, transform 150ms ease",
        flexShrink: 0,
      }}
      onPointerDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
      onPointerUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onPointerLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {icon}
      {children}
    </button>
  );
}
