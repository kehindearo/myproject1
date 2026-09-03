import { useState } from "react";
import { motion } from "framer-motion";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { useToast } from "../ui/Toast";

export default function SosButton({ trip }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const { show } = useToast();

  const trigger = () => {
    setSent(true);
    // In production: POST /api/v1/safety/sos with GPS + tripId + driver details,
    // fanning out to Termii SMS for each trusted contact and flagging the admin queue.
    show("SOS alert sent to your trusted contacts", "error", { persist: true });
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        style={{
          position: "absolute",
          bottom: 260,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #EF4444, #B91C1C)",
          color: "#fff",
          fontWeight: 800,
          fontSize: 13,
          boxShadow: "0 4px 20px rgba(239,68,68,0.5)",
        }}
        animate={{ boxShadow: ["0 0 0 0 rgba(239,68,68,0.5)", "0 0 0 16px rgba(239,68,68,0)"] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-label="Emergency SOS"
      >
        SOS
      </motion.button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={sent ? "Help is on the way" : "Emergency SOS"}>
        {!sent ? (
          <div className="stack gap-card">
            <p className="body-text">
              This sends your live GPS location, driver name, plate number ({trip?.driver?.plate}) and trip ID
              instantly via SMS to your trusted contacts, and flags your trip to Collabo Travel's safety team.
            </p>
            <Button variant="destructive" block onClick={trigger}>Send SOS Alert</Button>
            <button className="btn btn-ghost btn-block" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        ) : (
          <div className="stack" style={{ alignItems: "center", gap: 12, padding: "8px 0 16px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--success-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
              ✓
            </div>
            <p className="body-text" style={{ textAlign: "center" }}>
              Your trusted contacts and our safety team have been notified with your live location.
            </p>
            <Button block onClick={() => setOpen(false)}>Close</Button>
          </div>
        )}
      </BottomSheet>
    </>
  );
}
