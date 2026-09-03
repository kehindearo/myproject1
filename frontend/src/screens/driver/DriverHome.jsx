import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../../components/layout/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { MOCK_DRIVERS } from "../../data/mockData";
import { IconBell, IconCar, IconList, IconWallet, IconProfile } from "../../components/ui/icons";

export default function DriverHome() {
  const { user } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [online, setOnline] = useState(false);
  const [incoming, setIncoming] = useState(null);
  const [countdown, setCountdown] = useState(20);
  const [earnings, setEarnings] = useState(0);
  const [trips, setTrips] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setEarnings(12500);
      setTrips(4);
    }, 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!online) return;
    const timer = setTimeout(() => {
      setIncoming({
        rider: { name: "Chidinma Okeke", avatar: MOCK_DRIVERS[1].avatar },
        seats: 2,
        pickup: "Ikeja, Lagos",
        earning: 7200,
      });
      setCountdown(20);
    }, 3000);
    return () => clearTimeout(timer);
  }, [online]);

  useEffect(() => {
    if (!incoming) return;
    if (countdown <= 0) {
      setIncoming(null);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [incoming, countdown]);

  return (
    <div className="screen">
      <div className="row-between" style={{ paddingTop: "calc(env(safe-area-inset-top) + 20px)" }}>
        <div>
          <p className="body-text" style={{ fontSize: 14 }}>Welcome back,</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            {user?.fullName?.split(" ")[0] || "Driver"}
          </p>
        </div>
        <button className="btn-icon" style={{ position: "relative" }} aria-label="Notifications">
          <IconBell width={20} height={20} />
          <span style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
        </button>
      </div>

      <div className="card-hero" style={{ marginTop: 20 }}>
        <IconCar width={120} height={120} stroke="rgba(255,255,255,0.05)" style={{ position: "absolute", right: -10, top: -10 }} />
        <div className="row-between" style={{ position: "relative" }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", opacity: 0.75, margin: 0 }}>Today's Earnings</p>
            <motion.p key={earnings} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} style={{ fontSize: 34, fontWeight: 800, margin: "4px 0 0" }}>
              ₦{earnings.toLocaleString()}
            </motion.p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", opacity: 0.75, margin: 0 }}>Trips</p>
            <p style={{ fontSize: 34, fontWeight: 800, margin: "4px 0 0" }}>{trips}</p>
          </div>
        </div>
      </div>

      <motion.button
        onClick={() => setOnline((o) => !o)}
        animate={{ backgroundColor: online ? "#0A1F44" : "#E5E7EB" }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        style={{
          width: "100%",
          height: 56,
          borderRadius: 50,
          border: "none",
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontWeight: 700,
          color: online ? "#fff" : "var(--text-secondary)",
        }}
      >
        <motion.span
          animate={online ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ repeat: online ? Infinity : 0, duration: 1.5 }}
          style={{ width: 10, height: 10, borderRadius: "50%", background: online ? "var(--success)" : "var(--text-disabled)" }}
        />
        {online ? "ONLINE" : "OFFLINE"}
      </motion.button>
      {online && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="body-text" style={{ textAlign: "center", color: "var(--success)", fontSize: 12, marginTop: 8 }}>
          You are visible to nearby riders 🟢
        </motion.p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 28 }}>
        <QuickAction icon={<IconCar width={22} height={22} />} label="Post Trip" color="#FF6B00" onClick={() => navigate("/driver/post-trip")} />
        <QuickAction icon={<IconList width={22} height={22} />} label="My Trips" color="#3B82F6" onClick={() => navigate("/driver/trips")} />
        <QuickAction icon={<IconWallet width={22} height={22} />} label="Earnings" color="#22C55E" onClick={() => navigate("/driver/earnings")} />
        <QuickAction icon={<IconProfile width={22} height={22} />} label="Profile" color="#8B5CF6" onClick={() => navigate("/driver/profile")} />
      </div>

      <AnimatePresence>
        {incoming && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="card"
            style={{ marginTop: 24, border: "1.5px solid var(--accent)" }}
          >
            <div className="row-between">
              <div className="row" style={{ gap: 10 }}>
                <img src={incoming.rider.avatar} alt="" width={44} height={44} style={{ borderRadius: "50%" }} />
                <div>
                  <p style={{ fontWeight: 700, margin: 0 }}>{incoming.rider.name}</p>
                  <p className="body-text" style={{ fontSize: 12 }}>{incoming.seats} seats · {incoming.pickup}</p>
                </div>
              </div>
              <CountdownRing seconds={countdown} total={20} />
            </div>
            <p style={{ color: "var(--accent)", fontWeight: 700, marginTop: 10 }}>Est. earning ₦{incoming.earning.toLocaleString()}</p>
            <div className="row" style={{ gap: 12, marginTop: 12 }}>
              <button className="btn btn-destructive" style={{ flex: 1, height: 44 }} onClick={() => setIncoming(null)}>Decline</button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, height: 44, background: "var(--success)", boxShadow: "0 4px 16px rgba(34,197,94,0.35)" }}
                onClick={() => { setIncoming(null); show("Booking accepted!", "success"); }}
              >
                Accept
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav variant="driver" />
    </div>
  );
}

function QuickAction({ icon, label, color, onClick }) {
  return (
    <button onClick={onClick} className="card card-interactive" style={{ border: "none", textAlign: "left" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}1A`, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        {icon}
      </div>
      <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{label}</p>
    </button>
  );
}

function CountdownRing({ seconds, total }) {
  const pct = (seconds / total) * 100;
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={r} stroke="var(--border)" strokeWidth="4" fill="none" />
      <circle
        cx="22" cy="22" r={r}
        stroke="var(--accent)" strokeWidth="4" fill="none"
        strokeDasharray={c}
        strokeDashoffset={c - (c * pct) / 100}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="26" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text-primary)">{seconds}</text>
    </svg>
  );
}
