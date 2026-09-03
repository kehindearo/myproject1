import { useState } from "react";
import { motion } from "framer-motion";
import { IconStar } from "./icons";

export default function StarRating({ value = 0, onChange, size = 40, readOnly = false }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="row" style={{ gap: 6 }} role={readOnly ? "img" : "radiogroup"} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => onChange?.(n)}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: n * 0.05, type: "spring", stiffness: 300, damping: 15 }}
          style={{
            background: "none",
            border: "none",
            padding: 4,
            cursor: readOnly ? "default" : "pointer",
            display: "flex",
          }}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <IconStar width={size} height={size} filled={n <= active} />
        </motion.button>
      ))}
    </div>
  );
}
