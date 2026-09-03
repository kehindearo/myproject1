const COUNTRIES = [
  { code: "NG", dial: "+234", flag: "🇳🇬" },
  { code: "GH", dial: "+233", flag: "🇬🇭" },
  { code: "KE", dial: "+254", flag: "🇰🇪" },
  { code: "ZA", dial: "+27", flag: "🇿🇦" },
  { code: "US", dial: "+1", flag: "🇺🇸" },
  { code: "GB", dial: "+44", flag: "🇬🇧" },
];

export default function PhoneInput({ country, onCountryChange, value, onChange, error }) {
  const selected = COUNTRIES.find((c) => c.code === country) || COUNTRIES[0];

  return (
    <div className={`field has-icon ${error ? "is-error" : ""}`} style={{ padding: 0 }}>
      <div
        className="row"
        style={{
          height: 56,
          background: "var(--input-bg)",
          borderRadius: "var(--radius-md)",
          border: `1.5px solid ${error ? "var(--error)" : "transparent"}`,
          overflow: "hidden",
        }}
      >
        <select
          aria-label="Country code"
          value={selected.code}
          onChange={(e) => onCountryChange?.(e.target.value)}
          style={{
            height: "100%",
            border: "none",
            background: "transparent",
            padding: "0 4px 0 16px",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text-primary)",
            outline: "none",
          }}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.dial}
            </option>
          ))}
        </select>
        <div style={{ width: 1, height: 24, background: "var(--border)" }} />
        <input
          type="tel"
          inputMode="numeric"
          placeholder="801 234 5678"
          value={value}
          onChange={(e) => onChange?.(e.target.value.replace(/\D/g, ""))}
          style={{
            flex: 1,
            height: "100%",
            border: "none",
            background: "transparent",
            padding: "0 16px",
            fontSize: 15,
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}

export { COUNTRIES };
