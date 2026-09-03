import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { IconCar, IconCompass, IconArrowRight } from "../../components/ui/icons";

export default function RoleSelection() {
  const { user, setRole } = useAuth();
  const navigate = useNavigate();

  const choose = (role) => {
    setRole(role);
    navigate(role === "driver" ? "/driver/onboarding" : "/rider/home");
  };

  return (
    <div className="screen--no-nav" style={{ paddingTop: "calc(env(safe-area-inset-top) + 40px)" }}>
      <p className="section-heading" style={{ fontSize: 22, fontWeight: 600 }}>
        Hello, {user?.fullName?.split(" ")[0] || "there"}! 👋
      </p>
      <h1 className="display-heading" style={{ fontSize: 28, marginTop: 8 }}>
        How will you use Collabo Travel?
      </h1>
      <p className="body-text" style={{ marginTop: 4, marginBottom: 32 }}>
        Pick your role to get started
      </p>

      <div className="stack gap-card">
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={() => choose("driver")}
          className="card-interactive"
          style={{
            background: "linear-gradient(135deg, #0A1F44 0%, #1a3a6e 100%)",
            borderRadius: 20,
            padding: 24,
            border: "none",
            textAlign: "left",
            boxShadow: "0 8px 32px rgba(10,31,68,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconCar width={28} height={28} stroke="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Driver</p>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: "2px 0 0" }}>Share your ride & earn</p>
          </div>
          <IconArrowRight stroke="var(--accent-light)" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          onClick={() => choose("rider")}
          className="card-interactive"
          style={{
            background: "linear-gradient(135deg, #FF6B00 0%, #FF8C3A 100%)",
            borderRadius: 20,
            padding: 24,
            border: "none",
            textAlign: "left",
            boxShadow: "0 8px 32px rgba(255,107,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconCompass width={28} height={28} stroke="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Rider</p>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: "2px 0 0" }}>Book rides across your city and beyond</p>
          </div>
          <IconArrowRight stroke="#fff" />
        </motion.button>
      </div>
    </div>
  );
}
