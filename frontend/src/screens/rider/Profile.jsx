import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";
import Toggle from "../../components/ui/Toggle";
import BottomSheet from "../../components/ui/BottomSheet";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../components/ui/Toast";
import { useI18n } from "../../i18n/index.jsx";
import { IconChevronRight, IconShield, IconProfile } from "../../components/ui/icons";

export default function Profile({ variant = "rider" }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { show } = useToast();
  const { lang, setLang, languages } = useI18n();
  const navigate = useNavigate();
  const [showLangPicker, setShowLangPicker] = useState(false);

  const rows = [
    { label: "Emergency Contact", desc: "Set your trusted contact for SOS alerts" },
    { label: "Trusted Contacts", desc: "Auto-notified on every trip start/end" },
    { label: "Language", desc: languages[lang]?.label || "English", action: () => setShowLangPicker(true) },
    { label: "Privacy & Data", desc: "GDPR-ready data controls" },
    { label: "Help & Support", desc: "" },
  ];

  return (
    <div className="screen">
      <div style={{ paddingTop: "calc(env(safe-area-inset-top) + 20px)" }}>
        <h1 className="screen-title">Profile</h1>
      </div>

      <div className="card row" style={{ gap: 16, marginTop: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--input-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
          <IconProfile width={30} height={30} />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>{user?.fullName || "Guest"}</p>
          <p className="body-text" style={{ fontSize: 13 }}>{user?.email}</p>
          <span className="pill pill-neutral" style={{ marginTop: 6, textTransform: "capitalize" }}>{variant}</span>
        </div>
      </div>

      <div className="card row-between" style={{ marginTop: 20 }}>
        <span className="row" style={{ gap: 10 }}>
          <IconShield width={20} height={20} stroke="var(--primary)" />
          Dark Mode
        </span>
        <Toggle checked={theme === "dark"} onChange={(v) => setTheme(v ? "dark" : "light")} label="Toggle dark mode" />
      </div>

      <div className="stack gap-card" style={{ marginTop: 20 }}>
        {rows.map((r) => (
          <button
            key={r.label}
            className="card row-between card-interactive"
            style={{ border: "none", width: "100%", textAlign: "left" }}
            onClick={r.action || (() => show(`${r.label} settings coming soon`, "info"))}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{r.label}</p>
              {r.desc && <p className="body-text" style={{ fontSize: 12 }}>{r.desc}</p>}
            </div>
            <IconChevronRight width={18} height={18} stroke="var(--text-secondary)" />
          </button>
        ))}
      </div>

      <button
        className="btn btn-destructive btn-block"
        style={{ marginTop: 32 }}
        onClick={() => {
          logout();
          navigate("/auth/login");
        }}
      >
        Log Out
      </button>

      <BottomSheet open={showLangPicker} onClose={() => setShowLangPicker(false)} title="Choose Language">
        <div className="stack gap-card">
          {Object.entries(languages).map(([code, { label }]) => (
            <button
              key={code}
              onClick={() => { setLang(code); setShowLangPicker(false); show(`Language set to ${label}`, "success"); }}
              className="row-between"
              style={{ height: 48, borderRadius: 12, border: `1.5px solid ${lang === code ? "var(--accent)" : "var(--border)"}`, background: lang === code ? "rgba(255,107,0,0.06)" : "transparent", padding: "0 16px" }}
            >
              {label}
              {lang === code && <span style={{ color: "var(--accent)" }}>✓</span>}
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomNav variant={variant} />
    </div>
  );
}
