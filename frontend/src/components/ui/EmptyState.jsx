import Button from "./Button";

export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div
      className="stack"
      style={{
        alignItems: "center",
        textAlign: "center",
        padding: "48px 24px",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "var(--input-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent)",
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="stack" style={{ gap: 4 }}>
        <p className="section-heading">{title}</p>
        {subtitle && <p className="body-text">{subtitle}</p>}
      </div>
      {actionLabel && (
        <Button variant="primary" onClick={onAction} style={{ marginTop: 8 }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
