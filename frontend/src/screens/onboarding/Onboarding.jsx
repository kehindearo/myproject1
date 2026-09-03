import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../components/ui/Button";
import { IconCar, IconShield, IconWallet } from "../../components/ui/icons";

const SLIDES = [
  {
    Icon: IconCar,
    title: "Find rides instantly",
    subtitle: "Book intercity trips with ease",
    gradient: "linear-gradient(135deg, #0A1F44 0%, #1a3a6e 100%)",
  },
  {
    Icon: IconShield,
    title: "Travel with verified drivers",
    subtitle: "Every driver is background-checked and rated by the community",
    gradient: "linear-gradient(135deg, #FF6B00 0%, #FF8C3A 100%)",
  },
  {
    Icon: IconWallet,
    title: "Pay securely, arrive safely",
    subtitle: "Wallet, card, bank transfer or USSD — your choice, always protected",
    gradient: "linear-gradient(135deg, #0A1F44 0%, #1a3a6e 100%)",
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const isLast = index === SLIDES.length - 1;

  const finish = () => {
    localStorage.setItem("collabo-onboarded", "1");
    navigate("/auth/signup");
  };

  const slide = SLIDES[index];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
      }}
    >
      <div className="row-between" style={{ padding: "calc(env(safe-area-inset-top) + 20px) 24px 0" }}>
        <div />
        <button className="btn btn-ghost" onClick={finish} style={{ height: "auto" }}>
          Skip
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            style={{ textAlign: "center", width: "100%" }}
          >
            <div
              style={{
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: slide.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 40px",
                boxShadow: "var(--shadow-elevated)",
              }}
            >
              <slide.Icon width={72} height={72} stroke="#fff" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 12px" }}>
              {slide.title}
            </h2>
            <p className="body-text" style={{ fontSize: 15, maxWidth: 320, margin: "0 auto" }}>
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="row" style={{ justifyContent: "center", gap: 8, marginBottom: 32 }}>
        {SLIDES.map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === index ? 24 : 8 }}
            style={{
              height: 8,
              borderRadius: 8,
              background: i === index ? "var(--accent)" : "var(--border)",
            }}
          />
        ))}
      </div>

      <div style={{ padding: "0 24px calc(env(safe-area-inset-bottom) + 24px)" }}>
        <Button block onClick={() => (isLast ? finish() : setIndex((i) => i + 1))}>
          {isLast ? "Get Started" : "Next"}
        </Button>
        <button
          className="btn btn-ghost btn-block"
          onClick={() => navigate("/auth/login")}
          style={{ marginTop: 12, width: "100%" }}
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}
