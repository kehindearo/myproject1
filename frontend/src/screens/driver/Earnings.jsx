import { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "../../components/layout/BottomNav";
import BottomSheet from "../../components/ui/BottomSheet";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";

const WEEK = [
  { day: "Mon", amt: 8200 },
  { day: "Tue", amt: 12500 },
  { day: "Wed", amt: 6100 },
  { day: "Thu", amt: 15800 },
  { day: "Fri", amt: 21000 },
  { day: "Sat", amt: 24300 },
  { day: "Sun", amt: 9700 },
];

const PER_TRIP = [
  { date: "Sep 2", route: "Lagos → Abuja", seats: 3, earned: 40500 },
  { date: "Sep 1", route: "Lagos → Ibadan", seats: 2, earned: 9000 },
  { date: "Aug 31", route: "Lagos → PH", seats: 4, earned: 74000 },
];

const max = Math.max(...WEEK.map((w) => w.amt));

export default function Earnings() {
  const { show } = useToast();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const withdraw = () => {
    if (!amount) return show("Enter an amount", "error");
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowWithdraw(false);
      show("Withdrawal initiated via Monnify", "success");
    }, 1400);
  };

  return (
    <div className="screen">
      <div style={{ paddingTop: "calc(env(safe-area-inset-top) + 20px)" }}>
        <h1 className="screen-title">Earnings</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
        <StatCard label="Today" value="₦12,500" />
        <StatCard label="This Week" value="₦97,600" />
        <StatCard label="This Month" value="₦412,300" />
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="section-heading" style={{ marginBottom: 16 }}>Last 7 Days</h3>
        <div className="row" style={{ alignItems: "flex-end", gap: 8, height: 120 }}>
          {WEEK.map((w, i) => (
            <div key={w.day} className="stack" style={{ flex: 1, alignItems: "center", gap: 6 }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(w.amt / max) * 90}px` }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                style={{ width: "100%", background: "linear-gradient(180deg, var(--accent-light), var(--accent))", borderRadius: 6 }}
              />
              <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{w.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16, background: "var(--success-light)", boxShadow: "none" }}>
        <p className="body-text" style={{ color: "#15803d" }}>
          <b>Commission: 10%</b> — you keep 90% of every fare. (Uber takes 25%, Bolt takes 20%)
        </p>
      </div>

      <h2 className="section-heading" style={{ marginTop: 24, marginBottom: 12 }}>Trip Breakdown</h2>
      <div className="stack gap-card">
        {PER_TRIP.map((t, i) => (
          <div key={i} className="card row-between">
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{t.route}</p>
              <p className="body-text" style={{ fontSize: 12 }}>{t.date} · {t.seats} seats</p>
            </div>
            <span style={{ fontWeight: 700, color: "var(--success)" }}>₦{t.earned.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <Button block style={{ marginTop: 24 }} onClick={() => setShowWithdraw(true)}>Withdraw Earnings</Button>

      <BottomSheet open={showWithdraw} onClose={() => setShowWithdraw(false)} title="Withdraw to Bank">
        <div className="field" style={{ marginBottom: 16 }}>
          <input placeholder="Amount (₦)" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} inputMode="numeric" />
        </div>
        <p className="body-text" style={{ marginBottom: 16 }}>Funds arrive instantly via Monnify to your registered bank account.</p>
        <Button block loading={processing} onClick={withdraw}>Confirm Withdrawal</Button>
      </BottomSheet>

      <BottomNav variant="driver" />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ textAlign: "center", padding: 14 }}>
      <p className="small-label" style={{ marginBottom: 6 }}>{label}</p>
      <p style={{ fontWeight: 800, fontSize: 16, color: "var(--primary)", margin: 0 }}>{value}</p>
    </div>
  );
}
