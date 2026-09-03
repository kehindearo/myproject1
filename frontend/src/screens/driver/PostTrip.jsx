import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../../components/layout/ScreenHeader";
import ProgressBar from "../../components/ui/ProgressBar";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";
import { NIGERIAN_STATES } from "../../data/mockData";
import { IconPlus, IconMinus, IconArrowRight } from "../../components/ui/icons";

const TIERS = [
  { name: "Lite", mult: 1 },
  { name: "Comfort", mult: 1.3 },
  { name: "XL", mult: 1.6 },
];

export default function PostTrip() {
  const navigate = useNavigate();
  const { show } = useToast();
  const [origin, setOrigin] = useState({ state: "", city: "", point: "", date: "", time: "" });
  const [destination, setDestination] = useState({ state: "", city: "", point: "" });
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState(4);
  const [tier, setTier] = useState("Comfort");
  const [recurring, setRecurring] = useState("One-time");
  const [notes, setNotes] = useState("");
  const [priceError, setPriceError] = useState("");
  const [posting, setPosting] = useState(false);

  const handlePrice = (v) => {
    const n = v.replace(/\D/g, "");
    setPrice(n);
    setPriceError(Number(n) > 50000 ? "Maximum price per seat is ₦50,000" : "");
  };

  const step = origin.state && destination.state && price && !priceError ? 100 : 60;

  const post = () => {
    if (!origin.state || !destination.state || !price) return show("Please complete all required fields", "error");
    if (priceError) return show(priceError, "error");
    setPosting(true);
    setTimeout(() => {
      setPosting(false);
      show("Trip posted successfully!", "success");
      navigate("/driver/trips");
    }, 1200);
  };

  return (
    <div className="screen" style={{ paddingBottom: 120 }}>
      <ScreenHeader title="Post a Trip" dark={true} />
      <ProgressBar percent={step} color="var(--accent)" />

      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="section-heading" style={{ marginBottom: 12 }}>Origin</h3>
        <div className="stack gap-card">
          <StateSelect value={origin.state} onChange={(v) => setOrigin((o) => ({ ...o, state: v }))} placeholder="Origin state" />
          <TextField value={origin.city} onChange={(v) => setOrigin((o) => ({ ...o, city: v }))} placeholder="City" />
          <TextField value={origin.point} onChange={(v) => setOrigin((o) => ({ ...o, point: v }))} placeholder="Pickup point" />
          <div className="row" style={{ gap: 12 }}>
            <input type="date" value={origin.date} onChange={(e) => setOrigin((o) => ({ ...o, date: e.target.value }))} style={inputStyle} />
            <input type="time" value={origin.time} onChange={(e) => setOrigin((o) => ({ ...o, time: e.target.value }))} style={inputStyle} />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 className="section-heading" style={{ marginBottom: 12 }}>Destination</h3>
        <div className="stack gap-card">
          <StateSelect value={destination.state} onChange={(v) => setDestination((d) => ({ ...d, state: v }))} placeholder="Destination state" />
          <TextField value={destination.city} onChange={(v) => setDestination((d) => ({ ...d, city: v }))} placeholder="City" />
          <TextField value={destination.point} onChange={(v) => setDestination((d) => ({ ...d, point: v }))} placeholder="Drop-off point" />
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 className="section-heading" style={{ marginBottom: 12 }}>Price & Seats</h3>
        <div className="field" style={{ marginBottom: 4 }}>
          <input placeholder="e.g. ₦5,000" value={price} onChange={(e) => handlePrice(e.target.value)} inputMode="numeric" />
        </div>
        {priceError ? <p className="field-helper is-error">{priceError}</p> : <p className="field-helper">Price per seat, max ₦50,000</p>}

        <div className="row-between" style={{ marginTop: 16 }}>
          <span className="body-text">Seats available</span>
          <div className="row" style={{ gap: 12 }}>
            <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={() => setSeats((s) => Math.max(1, s - 1))}><IconMinus width={14} height={14} /></button>
            <span style={{ fontWeight: 700 }}>{seats}</span>
            <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={() => setSeats((s) => Math.min(8, s + 1))}><IconPlus width={14} height={14} /></button>
          </div>
        </div>

        <p className="small-label" style={{ marginTop: 16, marginBottom: 8 }}>Vehicle Tier</p>
        <div className="row" style={{ gap: 10 }}>
          {TIERS.map((t) => (
            <button key={t.name} onClick={() => setTier(t.name)} className="btn" style={{ flex: 1, height: 44, background: tier === t.name ? "var(--accent)" : "var(--input-bg)", color: tier === t.name ? "#fff" : "var(--text-primary)", boxShadow: "none", flexDirection: "column", gap: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</span>
              <span style={{ fontSize: 10, opacity: 0.8 }}>×{t.mult}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card row-between" style={{ marginTop: 16 }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>Recurring Trip</p>
          <p className="body-text" style={{ fontSize: 12 }}>{recurring}</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          {["One-time", "Daily", "Weekly"].map((r) => (
            <button key={r} onClick={() => setRecurring(r)} style={{ fontSize: 11, fontWeight: 600, padding: "6px 10px", borderRadius: 20, border: "none", background: recurring === r ? "var(--accent)" : "var(--input-bg)", color: recurring === r ? "#fff" : "var(--text-secondary)" }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 className="section-heading" style={{ marginBottom: 12 }}>Trip Notes</h3>
        <div className="field">
          <textarea placeholder="e.g. AC available, No smoking" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ marginTop: 16, background: "var(--input-bg)", boxShadow: "none" }}>
        <p className="small-label" style={{ marginBottom: 8 }}>Route Preview</p>
        <div className="row-between" style={{ fontSize: 14, fontWeight: 600 }}>
          <span>{origin.state || "Origin"}</span>
          <IconArrowRight width={16} height={16} stroke="var(--accent)" />
          <span>{destination.state || "Destination"}</span>
        </div>
      </div>

      <div
        className="glass"
        style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, padding: "16px 24px calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        <Button block loading={posting} onClick={post}>Post Trip ✓</Button>
      </div>
    </div>
  );
}

function StateSelect({ value, onChange, placeholder }) {
  return (
    <div className="field">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}

function TextField({ value, onChange, placeholder }) {
  return (
    <div className="field">
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

const inputStyle = { flex: 1, height: 56, borderRadius: 14, border: "none", background: "var(--input-bg)", padding: "0 12px", color: "var(--text-primary)" };
