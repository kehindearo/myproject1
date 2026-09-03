import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNav from "../../components/layout/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { IconBell, IconSearch, IconArrowRight } from "../../components/ui/icons";
import { MOCK_TRIPS, RECENT_ROUTES } from "../../data/mockData";

export default function RiderHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(" ")[0] || "Rider";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="screen">
      <div
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
          margin: "0 -24px",
          padding: "calc(env(safe-area-inset-top) + 20px) 24px 28px",
          borderRadius: "0 0 20px 20px",
        }}
      >
        <div className="row-between">
          <div>
            <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
              {greeting}, {firstName} 👋
            </p>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: "4px 0 0" }}>
              Where are you headed today?
            </p>
          </div>
          <button
            className="btn-icon"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", position: "relative" }}
            aria-label="Notifications"
          >
            <IconBell width={20} height={20} />
            <span style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
          </button>
        </div>

        <button
          onClick={() => navigate("/rider/find")}
          className="row"
          style={{
            background: "#fff",
            height: 56,
            borderRadius: 50,
            boxShadow: "var(--shadow-elevated)",
            marginTop: 20,
            padding: "0 20px",
            border: "none",
            width: "100%",
            gap: 12,
          }}
        >
          <IconSearch stroke="var(--accent)" />
          <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>Where are you going?</span>
        </button>
      </div>

      <section style={{ marginTop: 28 }}>
        <h2 className="section-heading">Recent Routes</h2>
        <div className="row" style={{ gap: 10, overflowX: "auto", marginTop: 12, paddingBottom: 4 }}>
          {RECENT_ROUTES.map((r, i) => (
            <button
              key={i}
              onClick={() => navigate("/rider/find")}
              className="row"
              style={{
                flexShrink: 0,
                background: "var(--surface)",
                boxShadow: "var(--shadow-card)",
                borderRadius: 12,
                border: "none",
                padding: "10px 14px",
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {r.from} <IconArrowRight width={14} height={14} stroke="var(--accent)" /> {r.to}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <div className="row-between">
          <h2 className="section-heading">Available Today</h2>
          <button className="btn btn-ghost" style={{ height: "auto", padding: 0 }} onClick={() => navigate("/rider/find")}>
            See all
          </button>
        </div>
        <div className="row" style={{ gap: 12, overflowX: "auto", marginTop: 12, paddingBottom: 4 }}>
          {MOCK_TRIPS.map((trip, i) => (
            <motion.button
              key={trip.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate(`/rider/trip/${trip.id}`)}
              className="card card-interactive"
              style={{ flexShrink: 0, width: 200, textAlign: "left", border: "none" }}
            >
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                {trip.from} <IconArrowRight width={12} height={12} stroke="var(--accent)" style={{ display: "inline", verticalAlign: "middle" }} /> {trip.to}
              </p>
              <p className="small-label" style={{ marginTop: 6, textTransform: "none", letterSpacing: 0, color: "var(--text-secondary)" }}>
                {trip.date} · {trip.time}
              </p>
              <div className="row-between" style={{ marginTop: 14 }}>
                <span className="pill pill-success">{trip.seatsLeft} seats left</span>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)", marginTop: 10 }}>
                ₦{trip.price.toLocaleString()}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      <section
        className="card-accent"
        style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div>
          <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>Refer & Earn ₦1,000</p>
          <p style={{ fontSize: 13, opacity: 0.9, margin: "4px 0 0" }}>Share your code, earn together</p>
        </div>
        <button
          className="btn"
          style={{ background: "rgba(255,255,255,0.2)", color: "#fff", height: 40, padding: "0 16px" }}
          onClick={() => navigate("/rider/wallet")}
        >
          Share
        </button>
      </section>

      <BottomNav variant="rider" />
    </div>
  );
}
