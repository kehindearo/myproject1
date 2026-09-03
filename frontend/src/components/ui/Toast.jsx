import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconCheck } from "./icons";

const ToastContext = createContext(null);

const ICONS = {
  success: <IconCheck width={18} height={18} />,
  error: <span aria-hidden="true">✕</span>,
  info: <span aria-hidden="true">ℹ</span>,
  warning: <span aria-hidden="true">⚠</span>,
};

const BORDER_COLOR = {
  success: "var(--success)",
  error: "var(--error)",
  info: "var(--info)",
  warning: "var(--warning)",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message, type = "info", opts = {}) => {
      const id = ++idRef.current;
      setToasts((t) => [...t, { id, message, type }]);
      if (type !== "error" && !opts.persist) {
        setTimeout(() => dismiss(id), opts.duration || 3000);
      }
      if (navigator.vibrate) {
        try {
          navigator.vibrate(type === "error" ? [40, 60, 40] : 20);
        } catch {
          /* haptics unsupported */
        }
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top) + 16px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 32px)",
          maxWidth: "448px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => dismiss(t.id)}
              style={{
                pointerEvents: "auto",
                background: "var(--surface)",
                borderLeft: `4px solid ${BORDER_COLOR[t.type]}`,
                borderRadius: 16,
                boxShadow: "var(--shadow-elevated)",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              <span style={{ color: BORDER_COLOR[t.type], display: "flex" }}>{ICONS[t.type]}</span>
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
