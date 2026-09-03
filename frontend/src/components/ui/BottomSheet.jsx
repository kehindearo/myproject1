import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function BottomSheet({ open, onClose, children, title }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(10,31,68,0.45)",
              zIndex: 1100,
            }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="glass"
            style={{
              position: "fixed",
              left: "50%",
              bottom: 0,
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: "480px",
              borderRadius: "24px 24px 0 0",
              zIndex: 1101,
              padding: "12px 24px calc(24px + env(safe-area-inset-bottom))",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 4,
                background: "var(--border)",
                margin: "0 auto 16px",
              }}
            />
            {title && <h2 className="screen-title" style={{ marginBottom: 16 }}>{title}</h2>}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
