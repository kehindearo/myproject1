import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "../ui/icons";

export default function ScreenHeader({ title, subtitle, onBack, dark = true, right }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: dark
          ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)"
          : "transparent",
        margin: dark ? "0 -24px" : 0,
        padding: dark ? "calc(env(safe-area-inset-top) + 20px) 24px 24px" : "calc(env(safe-area-inset-top) + 20px) 0 0",
        borderRadius: dark ? "0 0 20px 20px" : 0,
        marginBottom: 20,
      }}
    >
      <div className="row-between">
        <button
          className="btn-icon"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          aria-label="Go back"
          style={{
            background: dark ? "rgba(255,255,255,0.12)" : "var(--input-bg)",
            color: dark ? "#fff" : "var(--primary)",
          }}
        >
          <IconArrowLeft />
        </button>
        {right}
      </div>
      <h1
        className="screen-title"
        style={{ color: dark ? "#fff" : "var(--text-primary)", marginTop: 16 }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="small-label"
          style={{ color: dark ? "rgba(255,255,255,0.7)" : "var(--text-secondary)", marginTop: 4, textTransform: "none", letterSpacing: 0 }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
