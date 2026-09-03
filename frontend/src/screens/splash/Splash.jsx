import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconCar } from "../../components/ui/icons";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      const seenOnboarding = localStorage.getItem("collabo-onboarded");
      navigate(seenOnboarding ? "/auth/login" : "/onboarding", { replace: true });
    }, 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {[120, 260, 400, 540, 680].map((y, i) => (
          <motion.path
            key={y}
            d={`M-50 ${y} C 100 ${y - 40}, 300 ${y + 40}, 450 ${y}`}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </svg>

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconCar width={40} height={40} stroke="#fff" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          color: "#fff",
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: -0.5,
          marginTop: 16,
        }}
      >
        Collabo Travel
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 8 }}
      >
        Your Ride, Your Community
      </motion.p>

      <div
        style={{
          position: "absolute",
          bottom: "calc(env(safe-area-inset-bottom) + 48px)",
          width: 160,
          height: 3,
          background: "rgba(255,255,255,0.15)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ height: "100%", background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}
