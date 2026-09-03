import { motion } from "framer-motion";

export default function ProgressBar({ percent, height = 6, color = "var(--accent)", track = "var(--border)" }) {
  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: height,
        background: track,
        overflow: "hidden",
      }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ height: "100%", background: color, borderRadius: height }}
      />
    </div>
  );
}
