import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "../../components/ui/Toast";
import { MOCK_TRIPS } from "../../data/mockData";
import { IconChat, IconShare } from "../../components/ui/icons";
import SosButton from "../../components/features/SosButton";

const STEPS = ["Driver assigned", "En route to you", "You're in the car", "Arrived"];

export default function ActiveTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const trip = useMemo(() => MOCK_TRIPS.find((t) => t.id === id) || MOCK_TRIPS[0], [id]);

  const [step, setStep] = useState(1);
  const [eta, setEta] = useState(8);
  const [fare] = useState(trip.price);
  const [carPos, setCarPos] = useState(20);

  useEffect(() => {
    const t = setInterval(() => {
      setEta((e) => (e > 1 ? e - 1 : e));
      setCarPos((p) => (p < 80 ? p + 6 : 80));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (step >= STEPS.length - 1) {
      const t = setTimeout(() => navigate(`/rider/rate/${trip.id}`), 4000);
      return () => clearTimeout(t);
    }
  }, [step, navigate, trip.id]);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden", background: "var(--primary)" }}>
      {/* Stylized map placeholder — wired for Google Maps JS API (pickup/drop pins, live driver marker, route polyline) */}
      <svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        <rect width="400" height="800" fill="#0e2350" />
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={i * 30} y1="0" x2={i * 30} y2="800" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {Array.from({ length: 27 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 30} x2="400" y2={i * 30} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        <path d="M60 700 C 150 500, 100 300, 320 100" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="60" cy="700" r="8" fill="var(--primary)" stroke="#fff" strokeWidth="2" />
        <circle cx="320" cy="100" r="8" fill="var(--error)" stroke="#fff" strokeWidth="2" />
        <motion.circle
          cx={60 + (320 - 60) * (carPos / 100)}
          cy={700 - (700 - 100) * (carPos / 100)}
          r="10"
          fill="#fff"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        />
        <circle cx="60" cy="700" r="16" fill="rgba(59,130,246,0.35)">
          <animate attributeName="r" values="12;22;12" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{
          position: "absolute",
          top: "calc(env(safe-area-inset-top) + 16px)",
          left: 24,
          right: 24,
          borderRadius: 50,
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="row" style={{ gap: 8, fontSize: 13, fontWeight: 600 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", animation: "pulseDot 1.5s infinite" }} />
          Trip in Progress
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>ETA {eta} min</span>
      </motion.div>

      <SosButton trip={trip} />

      <button
        className="btn-icon"
        style={{ position: "absolute", bottom: 260, left: 24, background: "rgba(255,255,255,0.95)" }}
        aria-label="Share trip"
        onClick={() => show("Live trip link copied — share via WhatsApp", "success")}
      >
        <IconShare width={20} height={20} stroke="var(--primary)" />
      </button>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="btn-primary"
        style={{
          position: "absolute",
          bottom: 260,
          left: "50%",
          transform: "translateX(-50%)",
          width: 56,
          height: 56,
          borderRadius: "50%",
          padding: 0,
        }}
        aria-label="Chat with driver"
        onClick={() => show("Chat opens once Socket.io signaling is connected", "info")}
      >
        <IconChat width={22} height={22} stroke="#fff" />
      </motion.button>

      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        className="glass"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: "24px 24px 0 0",
          padding: "20px 24px calc(env(safe-area-inset-bottom) + 20px)",
        }}
      >
        <div className="row" style={{ gap: 6, marginBottom: 16 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: 4,
                  borderRadius: 4,
                  background: i <= step ? (i === step ? "var(--accent)" : "var(--success)") : "var(--border)",
                  marginBottom: 6,
                }}
              />
              <span style={{ fontSize: 9, color: i <= step ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: 600 }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <div className="row" style={{ gap: 12 }}>
          <img src={trip.driver.avatar} alt="" width={48} height={48} style={{ borderRadius: "50%" }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, margin: 0 }}>{trip.driver.name}</p>
            <p className="body-text" style={{ fontSize: 12 }}>{STEPS[step]} · {trip.driver.car}</p>
          </div>
          <span className="pill pill-warning">ETA {eta}m</span>
        </div>

        <div className="row-between" style={{ marginTop: 16, padding: "12px 0", borderTop: "1px solid var(--border)" }}>
          <span className="body-text">Live Fare</span>
          <motion.span key={fare} initial={{ scale: 1.1 }} animate={{ scale: 1 }} style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)" }}>
            ₦{fare.toLocaleString()}
          </motion.span>
        </div>

        {step < STEPS.length - 1 && (
          <button className="btn btn-secondary btn-block" style={{ marginTop: 4 }} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
            Simulate: {STEPS[Math.min(step + 1, STEPS.length - 1)]}
          </button>
        )}
      </motion.div>
    </div>
  );
}
