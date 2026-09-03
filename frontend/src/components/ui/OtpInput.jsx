import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function OtpInput({ length = 6, onComplete, error }) {
  const [digits, setDigits] = useState(Array(length).fill(""));
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (error) {
      setDigits(Array(length).fill(""));
      refs.current[0]?.focus();
    }
  }, [error, length]);

  const handleChange = (i, val) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < length - 1) refs.current[i + 1]?.focus();
    if (next.every((d) => d !== "") && next.join("").length === length) {
      onComplete?.(next.join(""));
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    const next = text.split("");
    while (next.length < length) next.push("");
    setDigits(next);
    if (text.length === length) onComplete?.(text);
    else refs.current[text.length]?.focus();
  };

  return (
    <motion.div
      className="row"
      style={{ gap: 10, justifyContent: "center" }}
      animate={error ? { x: [0, -8, 8, -6, 6, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1} of ${length}`}
          style={{
            width: 52,
            height: 64,
            textAlign: "center",
            fontSize: 24,
            fontWeight: 700,
            color: "var(--primary)",
            background: "var(--input-bg)",
            borderRadius: 12,
            border: `1.5px solid ${
              error ? "var(--error)" : d ? "var(--accent)" : "transparent"
            }`,
            boxShadow: !error && document.activeElement === refs.current[i] ? "0 0 0 3px rgba(255,107,0,0.15)" : "none",
            outline: "none",
            transition: "border-color 200ms ease, box-shadow 200ms ease",
          }}
        />
      ))}
    </motion.div>
  );
}
